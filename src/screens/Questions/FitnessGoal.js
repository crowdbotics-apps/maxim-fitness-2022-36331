import React, { useState, useEffect } from "react"
import {
  View,
  Modal,
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
import { exerciseArray } from "../../utils/utils"

//Themes
import { Images, Global, Layout, Gutters, Fonts, Colors } from "../../theme"

//Actions
import { updateAnswer } from "./Redux"

const FitnessGoal = props => {
  const {
    navigation: { navigate }
  } = props

  const [exerciseLevel, setExerciseLevel] = useState(false)

  const onNext = () => {
    const tempData = props.answers
    tempData.fitness_goal = exerciseLevel
    props.updateAnswers(tempData)
    navigate("TrainingDays")
  }
  useEffect(() => {
    if (props.answers && props.answers.fitness_goal) {
      setExerciseLevel(props.answers.fitness_goal)
    }
  }, [])

  return (
    <SafeAreaView style={[Global.secondaryBg, Layout.fill]}>
      <HeaderTitle percentage={0.57} showBackButton={true} />
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
            text={"What is your fitness goal?"}
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
                exerciseLevel === item.value ? Global.border : Global.borderB,
                exerciseLevel !== item.value
                  ? Global.borderAlto
                  : { borderColor: Colors.primary }
              ]}
              onPress={() => setExerciseLevel(item.value)}
            >
              <View style={[Layout.justifyContentBetween]}>
                <Text
                  text={item.heading}
                  style={{ fontSize: 20, color: "#6f6f6f", fontWeight: "600" }}
                />
                <Text
                  style={{ color: "#7d7d7d", marginTop: 5 }}
                  text={item.description}
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
export default connect(mapStateToProps, mapDispatchToProps)(FitnessGoal)
