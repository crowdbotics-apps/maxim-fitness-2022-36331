import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  StyleSheet,
  Platform
} from "react-native"
import * as Progress from "react-native-progress"
import BackgroundTimer from 'react-native-background-timer';

const RestContainer = ({
  onPress,
  startRest,
  loading,
  isDisable,
  onFinish,
  resetTime
}) => {
  const widthProgress = Dimensions.get("screen").width
  const [increment, setIncrement] = useState(0)
  const [remainingTime, setRemainingTime] = useState(resetTime || 90)

  useEffect(() => {
    let intervalId
    if (Platform.OS === 'ios') BackgroundTimer.start();
    if (startRest) {
      setRemainingTime(resetTime || 90)
      intervalId = startCountdown(
        resetTime || 90,
        time => {
          setIncrement(prevIncrement => prevIncrement + 1 / (resetTime || 90))
          setRemainingTime(time)
        },
        onFinish
      )
    } else {
      setIncrement(0)
      clearInterval(intervalId)
    }

    return () => {
      clearInterval(intervalId)
      if (Platform.OS === 'ios') BackgroundTimer.stopBackgroundTimer()
    }
  }, [startRest, resetTime])

  const formatTime = time => {
    const minutes = Math.floor(time / 60)
    const seconds = time % 60
    return `${String(minutes).padStart(2, "0")}  :  ${String(seconds).padStart(
      2,
      "0"
    )}`
  }

  return (
    <View style={styles.mainContainer}>
      {startRest && (
        <View style={styles.showBarContainer}>
          <View style={styles.showBarText}>
            <Text style={styles.showBarTextStyle}>Rest:</Text>
            <Text style={styles.showBarTimerStyle}>
              {remainingTime && formatTime(remainingTime)}
            </Text>
          </View>
          <Progress.Bar
            progress={increment}
            height={25}
            width={widthProgress - 40}
            borderRadius={10}
            style={{ transform: [{ scaleX: -1 }] }}
            color={"#fff"}
            unfilledColor={"#3180BD"}
            borderColor={"#3180BD"}
          />
        </View>
      )}
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisable}
        style={[
          styles.buttonStyle,
          { backgroundColor: isDisable ? "#838383" : "#db3b26" }
        ]}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#000" style={{ height: 35 }} />
        ) : (
          <Text style={styles.buttonText}>Finish Workout</Text>
        )}
      </TouchableOpacity>
    </View>
  )
}


function startCountdown(seconds, onUpdate, onFinish) {
  let remainingTime = seconds;

  const updateInterval = BackgroundTimer.setInterval(() => {
    onUpdate(remainingTime);

    if (remainingTime <= 0) {
      BackgroundTimer.clearInterval(updateInterval);
      onFinish();
    } else {
      remainingTime--;
    }
  }, 1000);

  return updateInterval;
}


const styles = StyleSheet.create({
  mainContainer: { marginTop: 20, marginHorizontal: 20 },
  showBarContainer: {
    marginVertical: 20,
    justifyContent: "center",
    flexDirection: "row",
    flex: 1
  },
  showBarText: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 0,
    position: "absolute",
    left: 0,
    zIndex: 2,
    height: 20,
    marginTop: 2
  },
  showBarTextStyle: {
    fontWeight: "bold",
    color: "black",
    fontSize: 15,
    marginLeft: 10,
    marginRight: 10
  },
  showBarTimerStyle: {
    fontWeight: "bold",
    color: "black",
    fontSize: 15,
    marginLeft: 10,
    marginRight: 10,
    flex: 1
  },
  buttonStyle: {
    borderRadius: 10,
    height: 40,
    paddingHorizontal: 10,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  }
})

export default RestContainer
