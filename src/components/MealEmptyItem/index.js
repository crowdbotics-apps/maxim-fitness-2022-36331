import React, { useEffect, useState } from "react"
import {
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Image
} from "react-native"
import moment from "moment"
// components
import Text from "../Text"
import { Gutters, Layout, Global, Colors, Images } from "../../theme"

const MealEmptyItem = ({
  item,
  index,
  navigation,
  selectedMealsRequest,
  getMealFoodRequest
}) => {
  const clock = item.date_time
  const mealItems = item.food_items
  const id = item.id

  const getCarbs = item => {
    let carbs = 0
    let currentD = moment(new Date()).format("YYYY-MM-DD")
    item?.map(item => {
      if (moment(item.created).format("YYYY-MM-DD") === currentD) {
        carbs += Math.round(item.food.carbohydrate)
      }
    })
    return carbs
  }
  const getProtien = item => {
    let protien = 0
    let currentD = moment(new Date()).format("YYYY-MM-DD")
    item?.map(item => {
      if (moment(item.created).format("YYYY-MM-DD") === currentD) {
        protien += Math.round(item.food.proteins)
      }
    })
    return protien
  }
  const getFat = item => {
    let fat = 0
    let currentD = moment(new Date()).format("YYYY-MM-DD")
    item?.map(item => {
      if (moment(item.created).format("YYYY-MM-DD") === currentD) {
        fat += Math.round(item.food.fat)
      }
    })
    return fat
  }

  const {
    smallBMargin,
    smallVPadding,
    regularHMargin,
    smallRMargin,
    smallHMargin,
    regularLPadding,
    regularHPadding,
    regularVPadding
  } = Gutters
  const {
    row,
    fill,
    column,
    alignItemsEnd,
    alignItemsCenter,
    justifyContentEnd,
    justifyContentCenter,
    justifyContentBetween
  } = Layout
  const { secondaryBg, border } = Global
  const dateTime = moment(new Date()).format("YYYY-MM-DD")

  return (
    <TouchableOpacity
      key={index}
      onPress={() => {
        selectedMealsRequest(item)
        getMealFoodRequest(dateTime, id)
        let currentD = moment(new Date()).format("YYYY-MM-DD")
        if (mealItems?.length && currentD) {
          navigation.navigate("LogFoods")
        } else {
          navigation.navigate("MealRegulator")
        }
      }}
    >
      <View style={smallVPadding}>
        <Text style={styles.mealText} text={`Meal ${index + 1}`} />
      </View>
      <View
        style={[
          border,
          secondaryBg,
          smallBMargin,
          smallHMargin,
          regularVPadding,
          styles.itemContainer
        ]}
      >
        <View style={[fill, column, justifyContentCenter, regularLPadding]}>
          <Text
            style={styles.clockContainer}
            text={moment(clock).format("h:mm a")}
          />
        </View>
        <View style={[row, alignItemsCenter]}>
          <View style={[regularHMargin, smallVPadding]}>
            <View style={row}>
              <Text
                style={[styles.textWrapper, { color: "#00a1ff" }]}
                text={`${getProtien(mealItems)}g`}
                numberOfLines={1}
              />
              <Text
                style={[styles.textWrapper, { color: "#fbe232" }]}
                text={`${getCarbs(mealItems)}g`}
                numberOfLines={1}
              />
              <Text
                style={[styles.textWrapper, { color: "#ee230d" }]}
                text={`${getFat(mealItems)}g`}
                numberOfLines={1}
              />
            </View>
            <View style={row}>
              <Text style={styles.textWrapper} text="Protein" />
              <Text style={styles.textWrapper} text="Carb" />
              <Text style={styles.textWrapper} text="Fat" />
            </View>
          </View>
          <View
            style={[fill, justifyContentCenter, alignItemsEnd, regularHPadding]}
          >
            <TouchableOpacity
              onPress={() => {
                getMealFoodRequest(dateTime, id)
                selectedMealsRequest(item)
                navigation.navigate("MealRegulator")
              }}
            >
              <Image style={styles.imageAddIcon} source={Images.addMealIcon} />
            </TouchableOpacity>
          </View>
        </View>

        {mealItems?.length > 0
          ? mealItems?.map((item, i) => {
              return (
                <View key={i}>
                  <View
                    style={[
                      row,
                      regularHPadding,
                      smallVPadding,
                      alignItemsCenter,
                      styles.innerContainer
                    ]}
                  >
                    <Image
                      style={[smallRMargin, styles.imageWrapper]}
                      source={{ uri: item && item.food.thumb }}
                    />
                    <View style={[row, fill, justifyContentBetween]}>
                      <View style={fill}>
                        <Text
                          text={item.food.name ? item.food.name : "name"}
                          bold
                          numberOfLines={1}
                          style={{ color: "#626262" }}
                        />
                      </View>
                      <View style={[fill, row, justifyContentEnd]}>
                        <Text
                          text={item.unit && item.unit.name}
                          bold
                          numberOfLines={1}
                          style={{ color: "#626262" }}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              )
            })
          : null}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  imageAddIcon: {
    width: 35,
    height: 35
  },
  mealText: {
    fontSize: 22,
    paddingLeft: 10,
    color: Colors.black,
    fontWeight: "bold"
  },
  itemContainer: {
    borderRadius: 10,
    borderColor: "rgb(214,213,213);",
    shadowOffset: {
      width: 0,
      height: 1
    },
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.2
      },
      android: {
        shadowRadius: 1,
        shadowOpacity: 1,
        elevation: 3
      }
    })
  },
  innerContainer: {
    borderTopColor: "rgb(214,213,213);",
    borderTopWidth: 1
  },
  clockContainer: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black"
  },
  textWrapper: {
    width: 70,
    color: "#525252"
  },
  imageWrapper: {
    width: 45,
    height: 45,
    resizeMode: "contain"
  }
})

export default MealEmptyItem
