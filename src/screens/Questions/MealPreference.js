import React, { useState, useEffect } from "react"
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity
} from "react-native"
import { connect } from "react-redux"

//Components
import { Text, Button } from "../../components"
import HeaderTitle from "./Components/HeaderTitle"

//Themes
import { Images, Global, Layout, Gutters, Fonts, Colors } from "../../theme"

//Actions
import { updateAnswer } from "./Redux"

const MealPreference = props => {
  const {
    navigation: { navigate },
    route: { params }
  } = props
  const [exerciseLevel, setExerciseLevel] = useState(false)

  useEffect(() => {
    if (props.answers && props.answers.number_of_meal) {
      setExerciseLevel(props.answers.number_of_meal)
    }
  }, [])

  const exerciseArray = [
    { name: "3 Meals", value: 3 },
    { name: "4 Meals", value: 4 },
    { name: "5 Meals", value: 5 },
    { name: "6 Meals", value: 6 },
    { name: "7 Meals", value: 7 }
  ]

  const onNext = () => {
    let tempData = { ...props.answers }
    if (params?.isHome) {
      tempData = {}
      tempData["number_of_meal"] = exerciseLevel
    } else {
      delete tempData?.number_of_meal
      delete tempData?.mealTimes
      tempData.number_of_meal = exerciseLevel
    }
    props.updateAnswers(tempData)

    navigate("MealTime", {
      numberOfMeals: exerciseLevel.value,
      isHome: params?.isHome ? params?.isHome : false
    })
  }

  return (
    <SafeAreaView style={[Global.secondaryBg, Layout.fill]}>
      <HeaderTitle percentage={0.68} showBackButton isHome={params?.isHome} />
      <ScrollView
        contentContainerStyle={[
          Layout.fillGrow,
          Gutters.small2xHPadding,
          Layout.justifyContentBetween
        ]}
      >
        <View style={Gutters.mediumTMargin}>
          <Text
            color="commonCol"
            style={Fonts.titleRegular}
            text={"How many meals do you prefer to eat in one day?"}
          />
        </View>
        <View
          style={[
            Layout.justifyContentStart,
            Layout.fill,
            Gutters.mediumTMargin
          ]}
        >
          {exerciseArray.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[
                Layout.row,
                Gutters.smallHPadding,
                Gutters.regularVPadding,
                Layout.alignItemsCenter,
                Layout.justifyContentBetween,
                exerciseLevel.value === item.value
                  ? Global.border
                  : Global.borderB,
                exerciseLevel.value !== item.value
                  ? Global.borderAlto
                  : { borderColor: Colors.primary }
              ]}
              onPress={() => setExerciseLevel(item)}
            >
              <View style={[Layout.justifyContentBetween]}>
                <Text
                  text={item.name}
                  style={{ fontSize: 20, color: "#6f6f6f", fontWeight: "600" }}
                />
              </View>
              <Image source={Images.forwardIcon} style={styles.rightArrow} />
            </TouchableOpacity>
          ))}
        </View>
        <View style={Layout.justifyContentEnd}>
          <Button
            block
            text={"Next"}
            color="primary"
            onPress={onNext}
            disabled={!exerciseLevel}
            style={Gutters.regularBMargin}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  rightArrow: {
    height: 20,
    width: 20,
    resizeMode: "contain",
    tintColor: Colors.nobel
  }
})
const mapStateToProps = state => ({
  answers: state.questionReducer.answers
})

const mapDispatchToProps = dispatch => ({
  updateAnswers: data => dispatch(updateAnswer(data))
})
export default connect(mapStateToProps, mapDispatchToProps)(MealPreference)
