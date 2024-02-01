import React, { useState } from "react"
import { View, Text, StyleSheet, Image, TextInput } from "react-native"
import Font from "../../../assets/images/fonts"
import SubDropDown from "./SubComponents/Dropdown"
import { Gutters, Layout, Global } from "../../../theme"

const SwipeSpeechItem = ({
  item,
  index,
  value,
  onChangeText,
  caloriesCalc,
  speechData,
  setSpeechData,
  updateNutritions,
  type
}) => {
  const [unitText, setUnitText] = useState(item.serving_unit)
  const [calories, setCalories] = useState(item.nf_calories)

  const onSelect = (value, product) => {
    setUnitText(product)
  }

  const calculateCalories = obj => {
    const data =
      (obj.serving_weight / item.serving_weight_grams) *
      item.full_nutrients.length
    setCalories(data)
  }

  const {
    smallBMargin,
    tinyTPadding,
    tinnyBPadding,
    smallVMargin,
    smallLPadding,
    smallRPadding
  } = Gutters
  const { row, center } = Layout
  const { border } = Global

  return (
    <View
      style={[smallVMargin, row, center, border, styles.containerSwipeItem]}
      key={index}
    >
      <View
        style={[
          smallLPadding,
          smallRPadding,
          tinyTPadding,
          tinnyBPadding,
          styles.mainSwipeContainer
        ]}
      >
        <View style={styles.mainUpperContainer}>
          <View style={styles.imageSwipeItem}>
            <Image
              style={styles.imageSwipe}
              source={{ uri: item?.photo.thumb }}
            />
          </View>
          <View style={styles.mainInputQtyWrapper}>
            <View style={styles.inputWrapperContainer}>
              <TextInput
                style={styles.quantityText}
                onChangeText={onChangeText}
                value={value}
              />
            </View>
            <View style={styles.qtyParentWrapper}>
              <SubDropDown
                item={item?.alt_measures}
                onSelect={onSelect}
                unitText={unitText}
                foodItem={item}
                updateNutritions={updateNutritions}
                type={type}
                index={index}
              />
            </View>
          </View>
        </View>
        <View style={[row, smallBMargin]}>
          <View style={styles.nameContainer}>
            <Text style={styles.nameText}>{item.food_name}</Text>
          </View>
          <View style={styles.caloriesContainer}>
            <Text style={styles.caloriesText}>
              {Math.round(caloriesCalc) || 0}
            </Text>
            <Text style={styles.caloriesTextStatic}>Cal</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  nameText: {
    fontFamily: Font.HELVETICA_NORMAL,
    fontSize: 15,
    color: "black"
  },
  caloriesTextStatic: {
    fontFamily: Font.HELVETICA_MEDIUM,
    color: "black",
    fontSize: 16
  },
  quantityText: {
    fontFamily: Font.HELVETICA_MEDIUM,
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
    height: 40,
    textAlign: "center"
  },
  caloriesText: {
    fontFamily: Font.HELVETICA_MEDIUM,
    color: "rgb(68, 161, 250)",
    fontSize: 14,
    marginHorizontal: 8
  },
  nameContainer: {
    flex: 1,
    flexDirection: "row",
    paddingLeft: 5
  },
  caloriesContainer: {
    flex: 2,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    flexDirection: "row"
  },
  inputWrapperContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    height: 50,
    width: 60,
    marginHorizontal: 10
  },
  mainUpperContainer: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  mainSwipeContainer: {
    flex: 7
  },
  containerSwipeItem: {
    height: 110,
    borderRadius: 20,
    borderColor: "#d6d5d5",
    backgroundColor: "#f3f1f4"
  },
  imageSwipeItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    height: 50,
    width: 120
  },
  imageSwipe: {
    width: 40,
    height: 40,
    resizeMode: "contain"
  },
  qtyParentWrapper: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    height: 50,
    flex: 1
  },
  mainInputQtyWrapper: {
    flex: 4,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 20
  }
})

export default SwipeSpeechItem
