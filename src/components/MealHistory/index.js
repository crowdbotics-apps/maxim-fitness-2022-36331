import React, { useState } from "react"
import {
  View,
  StyleSheet,
  Platform,
  Image,
  TouchableOpacity
} from "react-native"
// import PropTypes from "prop-types"
import moment from "moment"
// components
import Text from "../Text"
import { Gutters, Layout, Global, Colors, Images } from "../../theme"
import { sortData } from "../../utils/utils"

import { ScrollView as Content } from "native-base"

const MealHistory = ({ mealsByDate, activeTab }) => {
  const getCarbs = data => {
    let carbs = 0
    data?.map(food => {
      food?.food_items?.map(f => {
        carbs += f.carbohydrate
      })
    })

    return carbs
  }

  const getPortien = data => {
    let portien = 0
    data?.map(food => {
      food?.food_items?.map(f => {
        portien += f.protein
      })
    })
    return portien
  }
  const getFat = data => {
    let fat = 0
    data?.map(food => {
      food?.food_items?.map(f => {
        fat += f.fat
      })
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
    center,
    alignItemsCenter,
    justifyContentCenter,
    justifyContentBetween
  } = Layout
  const { secondaryBg, border } = Global

  const [selectedDate, setSelectedDate] = useState(false)

  const selectData = item => {
    Object.keys(selectedDate)?.[0] === Object.keys(item)?.[0]
      ? setSelectedDate(false)
      : setSelectedDate(item)
  }

  return (
    <>
      {mealsByDate?.length > 0 ? (
        <View style={[fill, { backgroundColor: "white" }]}>
          <Content>
            <View style={Gutters.smallTMargin}>
              {mealsByDate?.length > 0 &&
                mealsByDate?.map((item, index) => {
                  return (
                    <>
                      <TouchableOpacity
                        key={index}
                        style={[
                          Layout.row,
                          Gutters.smallHPadding,
                          Gutters.regularHMargin,
                          Gutters.regularVPadding,
                          Layout.alignItemsCenter,
                          Layout.justifyContentBetween,
                          Object.keys(selectedDate)?.[0] ===
                          Object.keys(item)?.[0]
                            ? Global.border
                            : Global.borderB,
                          Object.keys(selectedDate)?.[0] !==
                          Object.keys(item)?.[0]
                            ? Global.borderAlto
                            : { borderColor: Colors.primary }
                        ]}
                        onPress={() => selectData(item)}
                      >
                        <View style={[Layout.justifyContentBetween]}>
                          <Text
                            text={Object.keys(item)}
                            style={{
                              fontSize: 20,
                              color: "#6f6f6f",
                              fontWeight: "600"
                            }}
                          />
                        </View>
                        <Image
                          source={Images.forwardIcon}
                          style={[
                            styles.rightArrow,
                            {
                              transform: [
                                {
                                  rotate:
                                    Object.keys(selectedDate)?.[0] ===
                                    Object.keys(item)?.[0]
                                      ? "90deg"
                                      : "00deg"
                                }
                              ]
                            }
                          ]}
                        />
                      </TouchableOpacity>
                      {Object.keys(selectedDate)?.[0] ===
                        Object.keys(item)?.[0] &&
                        sortData(item[Object.keys(item)?.[0]])?.map(
                          (items, i) => (
                            <View key={i} style={smallHMargin}>
                              <View
                                style={[
                                  smallVPadding,
                                  regularHMargin,
                                  styles.titleContainerStyle
                                ]}
                              >
                                <Text
                                  style={styles.mealText}
                                  text={`Meal ${i + 1}`}
                                />
                              </View>
                              <View
                                style={[
                                  border,
                                  secondaryBg,
                                  smallBMargin,
                                  // smallHMargin,
                                  regularHMargin,
                                  regularVPadding,
                                  styles.itemContainer
                                ]}
                              >
                                <View
                                  style={[
                                    fill,
                                    column,
                                    justifyContentCenter,
                                    regularLPadding
                                  ]}
                                >
                                  <Text
                                    style={styles.clockContainer}
                                    text={moment(
                                      items && items?.date_time
                                    ).format("h:mm a")}
                                  />
                                </View>
                                <View style={[row, alignItemsCenter]}>
                                  <View style={[regularHMargin, smallVPadding]}>
                                    <View style={row}>
                                      <Text
                                        style={[
                                          styles.textWrapper,
                                          { color: "#00a1ff" }
                                        ]}
                                        text={`${
                                          Math.ceil(getPortien([items])) || "0"
                                        } g`}
                                      />
                                      <Text
                                        style={[
                                          styles.textWrapper,
                                          { color: "#fbe232" }
                                        ]}
                                        text={`${
                                          Math.ceil(getCarbs([items])) || "0"
                                        } g`}
                                      />
                                      <Text
                                        style={[
                                          styles.textWrapper,
                                          { color: "#ee230d" }
                                        ]}
                                        text={`${
                                          Math.ceil(getFat([items])) || "0"
                                        } g`}
                                      />
                                    </View>
                                    <View style={row}>
                                      <Text
                                        style={styles.textWrapper}
                                        text="Protein"
                                      />
                                      <Text
                                        style={styles.textWrapper}
                                        text="Carb"
                                      />
                                      <Text
                                        style={styles.textWrapper}
                                        text="Fat"
                                      />
                                    </View>
                                  </View>
                                </View>
                                {items?.food_items
                                  ? items.food_items.map((c, i) => {
                                      return (
                                        <View
                                          key={i}
                                          style={[
                                            row,
                                            regularHPadding,
                                            smallVPadding,
                                            alignItemsCenter,
                                            styles.innerContainer
                                          ]}
                                        >
                                          <Image
                                            style={[
                                              smallRMargin,
                                              styles.imageWrapper
                                            ]}
                                            source={{ uri: c && c.food.thumb }}
                                          />
                                          <View
                                            style={[
                                              row,
                                              fill,
                                              justifyContentBetween,
                                              alignItemsCenter
                                            ]}
                                          >
                                            <Text
                                              text={c.food && c.food.name}
                                              style={[
                                                fill,
                                                { color: "#626262" }
                                              ]}
                                              bold
                                            />
                                            <Text
                                              style={[
                                                c.unit &&
                                                  c.unit.name.length > 20 &&
                                                  fill,
                                                { color: "#626262" }
                                              ]}
                                              text={c.unit && c.unit.name}
                                              bold
                                            />
                                          </View>
                                        </View>
                                      )
                                    })
                                  : null}
                              </View>
                            </View>
                          )
                        )}
                    </>
                  )
                })}
            </View>
          </Content>
        </View>
      ) : (
        <View style={[fill, center]}>
          <Text
            text={`Meals not found for ${moment(activeTab).format(
              "YYYY/MM/DD"
            )} day`}
            bold
            style={{ color: "black" }}
          />
        </View>
      )}
    </>
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
    color: "#626262"
  },
  imageWrapper: {
    width: 45,
    height: 45,
    resizeMode: "contain"
  },
  rightArrow: {
    height: 20,
    width: 20,
    resizeMode: "contain",
    tintColor: Colors.nobel
  }
})

// MealHistory.defaultProps = {
//   clock: "",
//   mealItems: [],
//   numberOfProtein: 0,
//   numberOfCarbs: 0,
//   numberOfFat: 0,
//   index: 0
// }

// MealHistory.propTypes = {
//   clock: PropTypes.string,
//   mealItems: PropTypes.arrayOf(PropTypes.shape({})),
//   numberOfProtein: PropTypes.number,
//   numberOfCarbs: PropTypes.number,
//   numberOfFat: PropTypes.number,
//   index: PropTypes.number
// }

export default MealHistory
