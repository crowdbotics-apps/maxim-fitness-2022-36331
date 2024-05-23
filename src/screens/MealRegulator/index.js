import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  Image,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  Linking,
  Alert
} from "react-native"
import LinearGradient from "react-native-linear-gradient"
import { connect } from "react-redux"
import Voice from "@react-native-voice/voice"
import { Images, Layout, Gutters, Global } from "../../theme"
import { getSpeechRequest } from "../../ScreenRedux/nutritionRedux"
import { checkAndRequestMicrophonePermission } from "../../utils/functions"

const MealRegulator = props => {
  const { navigation } = props
  const [partialResults, setPartialResults] = useState([])
  const [isRecording, setIsRecording] = useState(false)

  useEffect(() => {
    Voice.onSpeechEnd = onSpeechEnd
    Voice.onSpeechPartialResults = onSpeechPartialResults

    return () => {
      Voice.destroy().then(Voice.removeAllListeners)
    }
  }, [])

  const onSpeechEnd = async e => {
    setIsRecording(false)
    Voice.destroy().then(Voice.removeAllListeners)
    try {
      await Voice.stop()
    } catch (e) { }
  }

  const onSpeechPartialResults = e => {
    setPartialResults(e.value)
  }

  const startRecognizing = async () => {
    try {
      await Voice.start("en-US")
      setPartialResults([])
    } catch (e) { }
  }

  const onStart = async () => {
    const hasPermission = await checkAndRequestMicrophonePermission()
    if (hasPermission) {
      setIsRecording(true)
      // setTimeout(() => {   
      startRecognizing()
      // }, 400)
    } else {
      Alert.alert(
        "Permission Required",
        "Please grant microphone permissions in order to use this feature.",
        [
          {
            text: "Cancel",
            onPress: undefined,
            style: "cancel"
          },
          {
            text: "Confirm",
            onPress: () => {
              Linking.openSettings()
            }
          }
        ]
      )
    }
  }

  const onStop = async () => {
    setIsRecording(false)
    Voice.destroy().then(Voice.removeAllListeners)
    try {
      await Voice.stop()
    } catch (e) { }
  }

  const reviewFood = () => {
    onStop()
    // props.getSpeechRequest(partialResults.flatMap(item => item.split(' ')))
    // navigation.navigate("LogFoods",)
    navigation.navigate("SelectBrand", { items: partialResults || " " })

    setPartialResults([])
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "space-between",
        backgroundColor: "white"
      }}
    >
      <View
        style={[
          Layout.row,
          Layout.alignItemsCenter,
          Layout.justifyContentBetween,
          Global.height65,
          Gutters.regularHMargin
        ]}
      >
        <View
          style={[
            Layout.fill,
            Layout.justifyContentCenter,
            Layout.alignItemsStart
          ]}
        >
          <Image style={styles.leftArrowStyle} />
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("SelectBrand")}
          style={{
            flex: 4,
            alignItems: "flex-start",
            paddingHorizontal: 15,
            paddingVertical: 15,
            borderBottomWidth: 1,
            borderBottomColor: "gray"
          }}
        >
          <Text style={{ fontSize: 15, color: "gray" }}>
            Search Foods and Products
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            Layout.fill,
            Layout.justifyContentCenter,
            Layout.alignItemsEnd
          ]}
          onPress={() => navigation.navigate("BarCodeScreen")}
        >
          <Image style={styles.barCodeStyle} source={Images.barCode} />
        </TouchableOpacity>
      </View>
      <View style={styles.textWrapper}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} scrollEnabled>
          {partialResults.map((result, index) => {
            return (
              <Text key={`partial-result-${index}`} style={styles.textStyle}>
                {result}
              </Text>
            )
          })}
        </ScrollView>
      </View>
      <View>
        {isRecording && (
          <Image
            source={Images.high_amplitude}
            style={{ height: 265, width: "100%" }}
          />
        )}
        {!isRecording && (
          <Image
            source={Images.low_amplitude}
            style={{ height: 265, width: "100%" }}
          />
        )}
      </View>
      <View style={styles.container}>
        <TouchableOpacity
          onPressIn={onStart}
          onPressOut={onStop}
          style={[
            styles.recordButtonWrapper,
            { borderColor: isRecording ? "red" : "green" }
          ]}
        />
      </View>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          flex: 1
        }}
      >
        <Text style={{ fontSize: 15, color: "gray" }}>
          Press and hold to record your food.
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          marginHorizontal: 20,
          justifyContent: "space-between",
          alignItems: "center",
          marginVertical: 30
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.goBack()
            setPartialResults([])
          }}
        >
          <Image style={styles.leftArrowStyle} source={Images.backImage} />
        </TouchableOpacity>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={["#5daffe", "#5daffe"]}
          style={[
            styles.linearGradient,
            styles.shadowStyle,
            { opacity: partialResults.length ? 1 : 0.5 }
          ]}
        >
          <TouchableOpacity
            disabled={partialResults.length ? false : true}
            onPress={reviewFood}
          >
            <Text style={{ color: "#fff" }}>Review Foods</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1.2,
    alignItems: "center",
    backgroundColor: "white",
    justifyContent: "center"
    // paddingBottom: 30,
  },
  textWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    height: 100,
    marginHorizontal: 20
  },
  textStyle: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold"
  },
  linearGradient: {
    flexDirection: "row",
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginHorizontal: 5,
    borderRadius: 5
  },
  recordButtonWrapper: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderRadius: 30,
    width: 50,
    height: 50
  },
  leftArrowStyle: {
    width: 30,
    height: 30,
    resizeMode: "contain"
  },
  barCodeStyle: {
    height: 40,
    width: 40,
    resizeMode: "cover"
  },
  onSearchDiv: {
    width: "52%",
    height: 70,
    zIndex: 222,
    position: "absolute"
  }
})

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({
  getSpeechRequest: data => dispatch(getSpeechRequest(data))
})
export default connect(mapStateToProps, mapDispatchToProps)(MealRegulator)
