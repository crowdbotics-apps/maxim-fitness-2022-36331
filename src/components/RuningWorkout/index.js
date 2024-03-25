import React from "react"
import Text from "../Text"
import { View, StyleSheet, Image } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import { Gutters, Layout, Global } from "../../theme"

const RuningWorkout = ({ item, index, todayDayStr }) => {
  const {
    tinyVMargin,
    smallVPadding,
    regularHMargin,
    tinyBMargin,
    regularHPadding,
    smallLMargin,
    small2xTMargin
  } = Gutters
  const {
    row,
    fill,
    center,
    alignItemsCenter,
    alignItemsEnd,
    justifyContentBetween
  } = Layout
  const { secondaryBg, borderAlto } = Global

  const start = { x: 0, y: 0 }
  const end = { x: 1, y: 0 }

  // const calculateDay = () => {
  //   let day = 1
  //   day += index
  //   return day
  // }
  // const calculateWeek = () => {
  //   let dayNo = calculateDay()
  //   let week = 1

  //   if (dayNo >= 8) {
  //     week += Math.floor((dayNo - 1) / 7)
  //   }

  //   return week
  // }
  return (
    <LinearGradient
      start={start}
      end={end}
      colors={["#f3f1f4", "#f3f1f4"]}
      style={[
        row,
        regularHMargin,
        regularHPadding,
        alignItemsCenter,
        small2xTMargin,
        justifyContentBetween,
        styles.linearGradientWrapper
      ]}
    >
      <View
        style={[
          center,
          borderAlto,
          secondaryBg,
          smallVPadding,
          regularHPadding,
          styles.parentImage
        ]}
      >
        <Image
          source={{
            uri: item?.workouts?.[0]?.exercises?.[0]?.video_thumbnail
          }}
          style={styles.parentImage}
        />
      </View>

      <View style={[smallLMargin, justifyContentBetween, fill]}>
        <View style={[row, alignItemsEnd, tinyBMargin]}>
       { item?.day_number&&
          <Text text={`Day ${item?.day_number||''}`} color="quaternary" medium />}
         { item?.week_number&&
          <Text
            text={`Week ${item?.week_number||''}`}
            color="septenary"
            style={smallLMargin}
            regular
          />}
        </View>
        <View
          style={[row, justifyContentBetween, tinyVMargin, alignItemsCenter]}
        >
          <View style={{ flex: 1.5 }}>
            <Text
              text={item.name}
              color="nonary"
              style={{ fontSize: 14 }}
              bold
            />
          </View>
          <View
            style={[fill, { justifyContent: "flex-end", flexDirection: "row" }]}
          >
            <Text
              text={todayDayStr}
              color="septenary"
              style={{ fontSize: 14 }}
            />
          </View>
        </View>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  linearGradientWrapper: {
    height: 90,
    borderRadius: 20
  },
  parentImage: {
    borderRadius: 20,
    height: 65,
    width: 65
  },
  imageWrapper: {
    width: 50,
    height: 40
  }
})
export default RuningWorkout
