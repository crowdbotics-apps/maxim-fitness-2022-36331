import React, { useState } from "react"
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator
} from "react-native"
import Icon from "react-native-vector-icons/FontAwesome5"

import LinearGradient from "react-native-linear-gradient"
import Modal from "react-native-modal"
import Text from "../Text"
import { Gutters, Layout, Global, Fonts, Images } from "../../theme"

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
]

const WorkoutComponent = ({
  isVisible,
  setIsVisible,
  startWorkout,
  item,
  onPress,
  workoutDone,
  data
}) => {
  const {
    regularHMargin,
    smallHMargin,
    small2xTPadding,
    mediumXBPadding,
    tinyHMargin,
    regularHPadding,
    largeXLMargin,
    regularVPadding,
    regularRMargin,
    largeHMargin,
    regularVMargin,
    small2xHMargin,
    small2xTMargin
  } = Gutters

  const [detailModal, setDetailModal] = useState(false)
  const {
    row,
    fill,
    fill3x,
    center,
    positionR,
    fullWidth,
    alignItemsCenter,
    alignItemsStart,
    justifyContentAround,
    justifyContentCenter,
    justifyContentBetween
  } = Layout
  const [imgLoading, setImgLoading] = useState(false)
  const { secondaryBg, turtiaryBg, border, borderR30, borderAlto, altoBg } =
    Global
  const { titleLarge } = Fonts
  const start = { x: 0, y: 0 }
  const end = { x: 1, y: 0 }

  const getDayOfWeek = () => {
    const dayOfWeek = new Date(item?.date_time).getDay()
    return isNaN(dayOfWeek) ? "" : days[dayOfWeek]
  }

  const calDate = () => {
    const createdDate = new Date(item?.date_time).getDay()
    const todayDate = new Date().getDay()
    if (createdDate === todayDate) {
      if (startWorkout) {
        return "Today's \n Workout"
      } else {
        return `${getDayOfWeek()}'s \n Workout`
      }
    } else {
      return `${getDayOfWeek()}'s \n Workout`
    }
  }

  return (
    <>
      <View style={turtiaryBg}>
        <View style={[alignItemsStart, regularHPadding]}>
          <Text
            style={[small2xTPadding, mediumXBPadding, titleLarge]}
            text={calDate()}
            bold
          />
        </View>
        <LinearGradient
          start={start}
          end={end}
          colors={["#1CB7EF", "#1954F8"]}
          style={[
            row,
            fill,
            positionR,
            borderR30,
            largeHMargin,
            justifyContentBetween,
            styles.gradiantWrapper
          ]}
        >
          <View style={styles.cardWrapper}>
            <Text
              text={item?.name}
              color="secondary"
              medium
              numberOfLines={2}
            />
            <Text
              text={`${item.workouts[0]?.timer} minutes`}
              color="secondary"
              medium
            />
          </View>
          {item.cardio === true && true && (
            <View style={styles.cardWrapper2}>
              <View style={[row, center]}>
                <Text text={"Cardio"} color="secondary" medium />
                <Icon
                  type={"FontAwesome5"}
                  name={"heart"}
                  style={{
                    color: "red",
                    opacity: 0.8,
                    marginLeft: 8,
                    fontSize: 25
                  }}
                />
              </View>
              <Text
                text={`${item.cardio_length && item.cardio_length} minutes`}
                color="secondary"
                medium
              />
            </View>
          )}
        </LinearGradient>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={[
            row,
            fill,
            smallHMargin,
            largeXLMargin,
            styles.cardWrapperInner
          ]}
        >
          {item?.workouts?.length > 0
            ? item.workouts.map((item, i) => {
                return (
                  <TouchableOpacity
                    key={i}
                    onPress={() => {
                      setIsVisible(true)
                    }}
                    style={[
                      fill,
                      border,
                      borderR30,
                      borderAlto,
                      regularRMargin,
                      secondaryBg,
                      styles.cardWrapperInnerStyle
                    ]}
                  >
                    <View style={{ flex: 1 }}>
                      <Text
                        text={item ? item.exercise.name : "Barbell Bench Press"}
                        style={{
                          marginTop: 10,
                          marginHorizontal: 20,
                          lineHeight: 20,
                          fontSize: 18,
                          textAlign: "center"
                        }}
                        bold
                      />
                    </View>
                    <View style={{ flex: 3 }}>
                      <Image
                        source={{ uri: item?.exercise?.pictures[0]?.image_url }}
                        style={{
                          width: 220,
                          height: 220,
                          resizeMode: "cover",
                          overflow: "hidden"
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                )
              })
            : null}
        </ScrollView>
        {startWorkout === false && <View style={{ marginTop: 30 }} />}
        {startWorkout && (
          <View style={[fill, center]}>
            <LinearGradient
              start={start}
              end={end}
              colors={["#5BF547", "#32FC7D"]}
              style={[
                row,
                fill,
                center,
                tinyHMargin,
                regularVPadding,
                regularHPadding,
                regularVPadding,
                styles.linearGradient,
                styles.cardGradiantWrapper
              ]}
            >
              <TouchableOpacity onPress={onPress} disabled={workoutDone}>
                <Text style={styles.startWorkoutWrapper} text="Start Workout" />
              </TouchableOpacity>
            </LinearGradient>
          </View>
        )}
      </View>
      <Modal
        transparent={true}
        animationType="slide"
        visible={isVisible}
        onBackButtonPress={() => setIsVisible(!isVisible)}
        style={[
          fill,
          {
            margin: 0,
            backgroundColor: "rgba(0,0,0,0.5)"
          }
        ]}
      >
        <TouchableOpacity
          style={fill}
          onPress={() => setIsVisible(!isVisible)}
        />
        <View
          style={[
            fill3x,
            justifyContentBetween,
            alignItemsCenter,
            secondaryBg,
            {
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20
            }
          ]}
        >
          <TouchableOpacity onPress={() => setIsVisible(!isVisible)}>
            <View
              style={[regularVMargin, { borderWidth: 1, width: 40, height: 1 }]}
            />
          </TouchableOpacity>
          <View style={row}>
            {data && <Text text={data.exercise.name} smallTitle bold />}
          </View>
          <View
            style={{
              flex: 1,
              overflow: "hidden",
              alignItems: "center",
              position: "relative",
              margin: 10
            }}
          >
            <Image
              source={{ uri: data?.exercise?.pictures[0]?.image_url }}
              style={{
                width: 180,
                height: 180,
                resizeMode: "contain",
                borderRadius: 20,
                overflow: "hidden"
              }}
              onLoadStart={() => setImgLoading(true)}
              onLoad={() => setImgLoading(false)}
            />
            {imgLoading && (
              <ActivityIndicator
                size="large"
                color="#000"
                style={{ position: "absolute", top: 20 }}
              />
            )}
          </View>
          <View
            style={[
              row,
              regularVPadding,
              fullWidth,
              justifyContentAround,
              alignItemsCenter,
              { marginTop: 70 }
            ]}
          >
            <TouchableOpacity
              // onPress={swipeFunc}
              style={[
                altoBg,
                regularHMargin,
                {
                  width: 120,
                  height: 120,
                  borderRadius: 10
                }
              ]}
            >
              <LinearGradient
                start={start}
                end={end}
                colors={["#FA201B", "#FE5907"]}
                style={[
                  center,
                  regularHPadding,
                  regularVPadding,
                  {
                    borderRadius: 10
                  }
                ]}
              >
                <Image
                  source={Images.iconSwap}
                  style={{ width: 50, height: 50, resizeMode: "contain" }}
                />
                <View
                  style={{
                    height: 40,
                    color: "black",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Text text="Swap Exercise" center />
                </View>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setDetailModal(!detailModal)}
              style={[
                center,
                altoBg,
                regularHPadding,
                regularVPadding,
                regularHMargin,
                alignItemsCenter,
                justifyContentCenter,
                {
                  width: 120,
                  height: 120,
                  borderRadius: 10
                }
              ]}
            >
              <Image
                source={Images.detailIcon}
                style={{ width: 50, height: 50, resizeMode: "contain" }}
              />
              <View
                style={{
                  height: 40,
                  color: "black",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Text text="Details" center />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        transparent={true}
        animationType="slide"
        visible={detailModal}
        onBackButtonPress={() => setDetailModal(!detailModal)}
        style={[
          fill,
          {
            margin: 0,
            backgroundColor: "rgba(0,0,0,0.5)"
          }
        ]}
      >
        <TouchableOpacity
          style={fill}
          onPress={() => setDetailModal(!detailModal)}
        />
        <View
          style={[
            fill3x,
            secondaryBg,
            {
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20
            }
          ]}
        >
          <View style={alignItemsCenter}>
            <TouchableOpacity onPress={() => setIsVisible(!isVisible)}>
              <View style={regularVMargin} />
            </TouchableOpacity>
            <View style={row}>
              {data && <Text text={data.exercise.name} smallTitle bold />}
            </View>
            <View
              style={{
                backgroundColor: "#D3D3D3",
                borderRadius: 20,
                marginTop: 10
              }}
            >
              <Image
                source={{ uri: data?.exercise?.pictures[0]?.image_url }}
                style={{
                  width: 200,
                  height: 200,
                  resizeMode: "cover",
                  borderRadius: 20,
                  overflow: "hidden"
                }}
                onLoadStart={() => setImgLoading(true)}
                onLoad={() => setImgLoading(false)}
              />
              {imgLoading && (
                <ActivityIndicator
                  size="large"
                  color="#FFFFFF"
                  style={{
                    position: "absolute",
                    top: "40%",
                    left: "24%"
                  }}
                />
              )}
            </View>
          </View>
          <View style={[small2xHMargin, small2xTMargin]}>
            <LinearGradient
              style={{
                borderRadius: 10,
                height: 40,
                justifyContent: "center",
                alignItems: "flex-start",
                paddingHorizontal: 15
              }}
              colors={["#1CB7EF", "#1954F8"]}
            >
              <Text style={{ color: "#FFFFFF", fontSize: 16, lineHeight: 20 }}>
                Exercise Type : {data?.exercise?.exercise_type?.name}
              </Text>
            </LinearGradient>
            <LinearGradient
              style={{
                borderRadius: 10,
                height: 40,
                justifyContent: "center",
                alignItems: "flex-start",
                paddingHorizontal: 15,
                marginTop: 10
              }}
              colors={["#1CB7EF", "#1954F8"]}
            >
              <Text style={{ color: "#FFFFFF", fontSize: 16, lineHeight: 20 }}>
                No of sets : {data?.sets?.length}
              </Text>
            </LinearGradient>
            <LinearGradient
              style={{
                borderRadius: 10,
                height: 40,
                justifyContent: "center",
                alignItems: "flex-start",
                paddingHorizontal: 15,
                marginTop: 10
              }}
              colors={["#1CB7EF", "#1954F8"]}
            >
              <Text style={{ color: "#FFFFFF", fontSize: 16, lineHeight: 20 }}>
                Timer : {data?.timer}
              </Text>
            </LinearGradient>
          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  linearGradient: {
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 6,
    width: 100
  },
  startWorkoutWrapper: {
    fontSize: 16,
    color: "black",
    textAlign: "center"
  },
  gradiantWrapper: {
    height: 280,
    paddingHorizontal: 15,
    paddingVertical: 15
  },
  cardWrapper: { width: "60%", height: 50, justifyContent: "space-between" },
  cardWrapper2: {
    width: "35%",
    height: 54,
    justifyContent: "space-between",
    marginLeft: 5,
    alignItems: "flex-end",
    top: -4
  },
  cardWrapperInner: { marginTop: -130 },
  cardWrapperInnerStyle: { width: 220, height: 220, overflow: "hidden" },
  cardWrapperImage: { width: 180, height: 180, resizeMode: "stretch" },
  cardGradiantWrapper: {
    marginHorizontal: 55,
    marginTop: 30,
    marginBottom: 20
  }
})

export default WorkoutComponent
