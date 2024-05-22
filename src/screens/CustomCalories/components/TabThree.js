import React, { useEffect } from "react"
import { View, StyleSheet, Dimensions, TouchableOpacity } from "react-native"
import * as Progress from "react-native-progress"
import { Text } from "../../../components"
import { Layout, Gutters, Colors } from "../../../theme"

const TabThree = ({
  setShowModalHistory,
  navigation,
  profileData,
  consumeCalories,
  onMealUpdate
}) => {
  useEffect(() => {
    calculateCalories(consumeCalories)
    calculateProtein(consumeCalories)
    calculateCarbs(consumeCalories)
    calculateFat(consumeCalories)
  }, [])
  const {
    row,
    fill,
    center,
    positionR,
    positionA,
    alignItemsStart,
    alignItemsCenter,
    justifyContentStart,
    justifyContentBetween
  } = Layout
  const {
    small2xHMargin,
    regularHPadding,
    regularVPadding,
    regularBMargin,
    smallVPadding,
    regularHMargin,
    regularVMargin,
    mediumBMargin,
    mediumTMargin
  } = Gutters
  const fontSize15TextCenter = {
    fontSize: 15,
    textAlign: "center",
    color: "#626262"
  }

  const calculateCalories = conCal => {
    const value = conCal[0]?.calories
    const value2 = conCal[0]?.goals_values?.calories
    const data = value / value2
    return data
  }
  const calculateProtein = conCal => {
    const value = conCal[0]?.protein
    const value2 = conCal[0]?.goals_values?.protein
    const data = value / value2
    return data
  }
  const calculateCarbs = conCal => {
    const value = conCal[0]?.carbs
    const value2 = conCal[0]?.goals_values?.carbs
    const data = value / value2
    return data
  }
  const calculateFat = conCal => {
    const value = conCal[0]?.fat
    const value2 = conCal[0]?.goals_values?.fat
    const data = value / value2
    return data
  }

  const protein = consumeCalories[0]?.goals_values?.protein
    ? ((consumeCalories[0]?.goals_values?.protein / 20.45 / 100) * 100).toFixed(
      0
    )
    : 0
  const carbs = consumeCalories[0]?.goals_values?.carbs
    ? ((consumeCalories[0]?.goals_values?.carbs / 20.45 / 100) * 100).toFixed(0)
    : 0
  const fats = consumeCalories[0]?.goals_values?.fat
    ? ((consumeCalories[0]?.goals_values?.fat / 20.45 / 100) * 100).toFixed(0)
    : 0

  return (
    <>
      <View
        style={[
          row,
          justifyContentBetween,
          alignItemsCenter,
          small2xHMargin,
          smallVPadding
        ]}
      >
        <Text style={styles.commingSoonWork} text="Nutrition" bold />
        <TouchableOpacity onPress={() => setShowModalHistory(true)}>
          <Text style={styles.commingSoonMore} text="Meal History" />
        </TouchableOpacity>
      </View>
      <View style={[center, regularHMargin, regularVMargin]}>
        <View style={positionR}>
          <Progress.Circle
            progress={calculateCalories(consumeCalories) || 0}
            size={200}
            color={"#ea3465"}
            unfilledColor={"#fae0e0"}
            borderWidth={0}
            strokeCap={"round"}
            thickness={18}
          />
        </View>
        <View style={positionA}>
          <Text text="Calories" style={fontSize15TextCenter} />
          <Text
            text={consumeCalories[0]?.calories || "0"}
            style={{
              fontSize: 35,
              color: "black",
              fontWeight: "bold",
              textAlign: "center"
            }}
            bold
          />
          <Text
            text={`Goal ${consumeCalories[0]?.goals_values?.calories || 0}`}
            style={fontSize15TextCenter}
          />
        </View>
      </View>
      <View
        style={[
          row,
          regularBMargin,
          regularHMargin,
          justifyContentBetween,
          alignItemsCenter
        ]}
      >
        <View style={alignItemsStart}>
          <Text text="Protein" style={fontSize15TextCenter} />
          <View style={[row, center, smallVPadding]}>
            <Text
              text={`${consumeCalories[0]?.protein || 0} /`}
              style={fontSize15TextCenter}
              bold
            />
            <Text
              text={` ${Math.round(consumeCalories[0]?.goals_values?.protein) || 0
                }g`}
              style={fontSize15TextCenter}
            />
          </View>
        </View>
        <View style={styles.prteinCarbsFat}>
          <Progress.Bar
            progress={calculateProtein(consumeCalories) || 0}
            width={Dimensions.get("window").width - 200}
            height={22}
            color={"#45a1f8"}
            unfilledColor={"#d6d5d5"}
            borderWidth={2}
            borderRadius={20}
            style={{ borderColor: "white" }}
          />
        </View>
      </View>
      <View
        style={[
          row,
          regularHMargin,
          regularBMargin,
          justifyContentBetween,
          alignItemsCenter
        ]}
      >
        <View style={alignItemsStart}>
          <Text text="Carbohydrates" style={fontSize15TextCenter} />
          <View style={[row, center, smallVPadding]}>
            <Text
              text={`${consumeCalories[0]?.carbs || 0} /`}
              style={fontSize15TextCenter}
              bold
            />
            <Text
              text={` ${Math.round(consumeCalories[0]?.goals_values?.carbs) || 0
                }g`}
              style={fontSize15TextCenter}
            />
          </View>
        </View>
        <View style={styles.prteinCarbsFat}>
          <Progress.Bar
            progress={calculateCarbs(consumeCalories) || 0}
            width={Dimensions.get("window").width - 200}
            height={22}
            color={"#f0bc40"}
            unfilledColor={"#d6d5d5"}
            borderWidth={2}
            borderRadius={20}
            style={{ borderColor: "white" }}
          />
        </View>
      </View>
      <View
        style={[
          row,
          regularHMargin,
          regularBMargin,
          justifyContentBetween,
          alignItemsCenter
        ]}
      >
        <View style={alignItemsStart}>
          <Text text="Fats" style={fontSize15TextCenter} />
          <View style={[row, center, smallVPadding]}>
            <Text
              text={`${consumeCalories[0]?.fat || 0} /`}
              style={fontSize15TextCenter}
              bold
            />
            <Text
              text={` ${Math.round(consumeCalories[0]?.goals_values?.fat) || 0
                }g`}
              style={fontSize15TextCenter}
            />
          </View>
        </View>
        <View style={styles.prteinCarbsFat}>
          <Progress.Bar
            progress={calculateFat(consumeCalories) || 0}
            width={Dimensions.get("window").width - 200}
            height={22}
            unfilledColor={"#d6d5d5"}
            color={"#ed6d57"}
            borderWidth={2}
            borderRadius={20}
            style={{ borderColor: "white" }}
          />
        </View>
      </View>
      <View style={[fill, regularHPadding, styles.cardStyle]}>
        <View>
          <Text
            text="Diet Type"
            style={[{ fontSize: 20, opacity: 0.5, color: "black" }]}
            bold
          />
          <View style={styles.changeBtn}>
            <Text
              // text={`Standard ${protein + "/" + carbs + "/" + fats}`}
              text={`Standard 40/40/20`}
              color="nonary"
              style={smallVPadding}
            />
            <Text
              text="Change"
              color="nonary"
              onPress={() => navigation.navigate("EditCustomCal")}
            />
          </View>
        </View>
        <View
          style={[
            fill,
            row,
            justifyContentBetween,
            alignItemsCenter,
            regularVMargin
          ]}
        >
          <Text
            text="Meals per Day"
            style={{
              fontSize: 20,
              opacity: 0.7,
              textAlign: "center",
              color: "black"
            }}
            bold
          />
          <Text text="Edit" color="nonary" onPress={onMealUpdate} />
        </View>
        <Text text={`${profileData.number_of_meal} meals`} color="nonary" />
      </View>
    </>
  )
}
const styles = StyleSheet.create({
  commingSoonWork: {
    fontSize: 30,
    color: "black"
  },
  commingSoonMore: {
    fontSize: 16,
    color: Colors.azureradiance
  },
  prteinCarbsFat: {
    // width: 200,
    height: 22,
    backgroundColor: "#d6d5d5",
    borderRadius: 20,
    justifyContent: "center"
  },
  cardStyle: {
    backgroundColor: "white",
    marginHorizontal: 15,
    paddingVertical: 15,
    marginBottom: 20,
    borderRadius: 20,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowOpacity: 0.34,
    shadowRadius: 0.27,

    elevation: 15
  },

  changeBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  }
})

export default TabThree
