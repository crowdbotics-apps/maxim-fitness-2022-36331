import React from "react"

// components
import { View, StyleSheet, TouchableOpacity } from "react-native"
import { Text } from "../../../components"
import Button from "../../../components/Button"
import LinearGradient from "react-native-linear-gradient"

import { Gutters, Layout, Global } from "../../../theme"

const Card1 = ({ onPress, getPlans, subsucriptionId }) => {
  const {
    regularHMargin,
    regularVPadding,
    regularTMargin,
    mediumHMargin,
    mediumTMargin,
    regularHPadding
  } = Gutters
  const {
    row,
    fill,
    center,
    alignItemsEnd,
    alignItemsCenter,
    justifyContentCenter,
    justifyContentAround
  } = Layout
  const { border } = Global
  const start = { x: 0, y: 0 }
  const end = { x: 1, y: 1 }
  return (
    <>
      <LinearGradient
        start={start}
        end={end}
        colors={["#f2060c", "#8e2463", "#1b46c9"]}
        style={[
          fill,
          mediumHMargin,
          regularVPadding,
          regularTMargin,
          styles.gradientWrapper
        ]}
      >
        <View style={[fill, justifyContentAround, mediumHMargin]}>
          <View style={[row, alignItemsCenter]}>
            <Text text={"⚪"} style={{ fontSize: 10, marginRight: 5 }} />
            <Text
              text={"User will recieve a nutrition plan"}
              color="secondary"
              style={{ fontSize: 16 }}
            />
          </View>
          {/* <View style={[row, alignItemsCenter]}>
            <Text text={'⚪'} style={{ fontSize: 10, marginRight: 5 }} />
            <Text text={'Dynamic social feed'} color="secondary" style={{fontSize:16}} />
          </View>
          <View style={[row, alignItemsCenter]}>
            <Text text={'⚪'} style={{ fontSize: 10, marginRight: 5 }} />
            <Text text={'Data and analytics'} color="secondary" style={{fontSize:16}} />
          </View> */}
        </View>
        <View style={[row, center, fill, mediumTMargin]}>
          <Text
            text={`$ ${getPlans?.length > 0 ? getPlans?.[1]?.amount : ""}`}
            regularTitle
            color="secondary"
            bold
          />
          <Text text={" / month"} large color="secondary" />
        </View>
        {getPlans?.[1]?.id === subsucriptionId ? (
          <TouchableOpacity style={styles.cancelButton}>
            <Text style={styles.text}>Cancel</Text>
          </TouchableOpacity>
        ) : null}
        <View
          style={[
            row,
            fill,
            justifyContentCenter,
            regularHMargin,
            alignItemsEnd,
            regularVPadding
          ]}
        >
          <Text color="secondary" center style={{ fontSize: 14 }}>
            By subcribing to Orum Training, you agree to our {""}
            <Text
              text={"\nPrivacy Policy"}
              color="secondary"
              regular
              center
              underlined
            />
            {""} and {""}
            <Text
              text={"Terms of Services"}
              color="secondary"
              regular
              center
              underlined
            />
          </Text>
        </View>
      </LinearGradient>
      <View
        style={[
          center,
          row,
          { marginTop: -20, backgroundColor: "transparent" }
        ]}
      >
        <Button
          color="secondary"
          text={
            getPlans?.[1]?.id === subsucriptionId ? "Already Bought" : "Buy Now"
          }
          style={[
            border,
            center,
            regularHPadding,
            { height: 40, borderRadius: 30 }
          ]}
          onPress={getPlans?.[1]?.id !== subsucriptionId ? onPress : null}
        />
      </View>
    </>
  )
}
const styles = StyleSheet.create({
  gradientWrapper: {
    borderRadius: 40,
    height: 540
  },
  cancelButton: {
    height: 40,
    width: "50%",
    backgroundColor: "white",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "red",
    marginTop: 80
  },
  text: {
    fontSize: 15,
    fontWeight: "bold",
    color: "red"
  }
})

export default Card1
