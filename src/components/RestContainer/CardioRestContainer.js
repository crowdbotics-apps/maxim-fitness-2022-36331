import React, { useState, useEffect, useRef } from "react";
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
    const [remainingTime, setRemainingTime] = useState(resetTime);
    const [isRunning, setIsRunning] = useState(false);
    const intervalId = useRef(null);

    useEffect(() => {
        if (startRest && !isRunning) {
            setIsRunning(true);
            if (!intervalId.current) {
                startCountdown(remainingTime);
            }
        } else if (!startRest && isRunning) {
            pauseCountdown();
        }

        return () => {
            pauseCountdown();
            if (Platform.OS === "ios") BackgroundTimer.stopBackgroundTimer();
        };
    }, [startRest, resetTime]);

    const startCountdown = (time) => {
        if (Platform.OS === "ios") BackgroundTimer.start();
        intervalId.current = BackgroundTimer.setInterval(() => {
            setRemainingTime(prevTime => {
                if (prevTime <= 1) {
                    BackgroundTimer.clearInterval(intervalId.current);
                    intervalId.current = null;
                    setIsRunning(false);
                    onFinish();
                    return 0;
                } else {
                    return prevTime - 1;
                }
            });
            setIncrement(prevIncrement => prevIncrement + 1 / (resetTime || 90));
        }, 1000);
    };

    const pauseCountdown = () => {
        BackgroundTimer.clearInterval(intervalId.current);
        intervalId.current = null;
        setIsRunning(false);
    };

    const renderTimeComponent = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return (
            <View style={styles.textContainer}>
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
        );
    };

    return (
        <View style={styles.mainContainer}>
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
        </View>
    );
};

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
