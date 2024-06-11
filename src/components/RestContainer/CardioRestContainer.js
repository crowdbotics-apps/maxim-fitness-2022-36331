import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Dimensions,
    StyleSheet,
    Platform
} from "react-native";
import * as Progress from "react-native-progress";
import BackgroundTimer from "react-native-background-timer";

const CardioRestContainer = ({
    startRest,
    onFinish,
    resetTime
}) => {
    const widthProgress = Dimensions.get("screen").width;
    const [increment, setIncrement] = useState(0);
    const [remainingTime, setRemainingTime] = useState(resetTime || 90);

    useEffect(() => {
        let intervalId;
        if (Platform.OS === "ios") BackgroundTimer.start();
        if (startRest) {
            setRemainingTime(resetTime || 90);
            intervalId = startCountdown(
                resetTime || 90,
                time => {
                    setIncrement(prevIncrement => prevIncrement + 1 / (resetTime || 90));
                    setRemainingTime(time);
                },
                onFinish
            );
        } else {
            setIncrement(0);
            clearInterval(intervalId);
        }

        return () => {
            clearInterval(intervalId);
            if (Platform.OS === "ios") BackgroundTimer.stopBackgroundTimer();
        };
    }, [startRest, resetTime]);


    const renderTimeComponent = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return (<View style={styles.textContainer}>
            <Text style={styles.circleTextStyle}>
                {`${String(minutes).padStart(2, "0")} : ${String(seconds).padStart(
                    2,
                    "0"
                )}`}
            </Text>
            <Text style={styles.remainingTimeText}>
                Remaining Time
            </Text>
        </View>

        )
    };


    return (
        <View style={styles.mainContainer}>
            {startRest && (
                <View style={styles.showCircleContainer}>
                    <Progress.Circle
                        progress={increment}
                        size={widthProgress / 2}
                        borderWidth={0}
                        thickness={8}
                        color={"#fff"}
                        unfilledColor={"#3180BD"}
                        showsText={true}
                        formatText={() => renderTimeComponent(remainingTime)}
                        textStyle={styles.circleTextStyle}

                    />
                </View>
            )}

        </View>
    );
};

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
    showCircleContainer: {
        marginVertical: 20,
        justifyContent: "center",
        alignItems: "center"
    },
    circleTextStyle: {
        color: "black",
        fontSize: 18,
        fontWeight: "bold"
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
    },
    circleTextStyle: {
        color: "black",
        fontSize: 18,
        fontWeight: "bold"
    },
    remainingTimeText: {
        color: "black",
        fontSize: 16,
        fontWeight: "normal",
        marginTop: 10
    },
    textContainer: {
        justifyContent: "center",
        alignItems: "center"
    }
});

export default CardioRestContainer;
