import React, { useState, useEffect } from "react"
import {
  View,
  Image,
  Modal,
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

const TrainingDays = props => {
  const {
    navigation: { navigate }
  } = props
  const exerciseArray = [
    { value: 1, text: "3 Days", days: 3 },
    { value: 2, text: "4 Days", days: 4 },
    { value: 3, text: "5 Days", days: 5 }
  ]

  const [exerciseLevel, setExerciseLevel] = useState(false)
  const [welcomeModal, setWelcomeModal] = useState(false)

  useEffect(() => {
    if (props.answers && props.answers.number_of_training_days) {
      setExerciseLevel(props.answers.number_of_training_days)
    }
  }, [])

  const onNext = () => {
    const tempData = props.answers
    tempData.number_of_training_days = exerciseLevel
    props.updateAnswers(tempData)
    // navigate("MealPreference")
    setWelcomeModal(true)
  }

  return (
    <SafeAreaView style={[Global.secondaryBg, Layout.fill]}>
      <HeaderTitle percentage={0.62} showBackButton={true} />
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
            text={"How many days a week do you want to train?"}
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
                exerciseLevel === item.days ? Global.border : Global.borderB,
                exerciseLevel !== item.days
                  ? Global.borderAlto
                  : { borderColor: Colors.primary }
              ]}
              onPress={() => setExerciseLevel(item.days)}
            >
              <View style={[Layout.justifyContentBetween]}>
                <Text
                  text={item.text}
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
      <Modal
        visible={welcomeModal}
        style={Layout.fill}
        animationType="slide"
        transparent={true}
      >
        <ScrollView
          contentContainerStyle={[
            Layout.fillGrow,
            Global.opacityBg75,
            Layout.justifyContentBetween
          ]}
        >
          <View style={[Layout.fill, Layout.justifyContentCenter]}>
            <View style={[Layout.center, { zIndex: 1 }]}>
              <Image source={Images.otLogo} style={styles.logoStyle} />
            </View>

            <View style={[Layout.center, Gutters.small2xTMargin]}>
              <Text
                text="Almost Done!"
                color="secondary"
                style={Fonts.titleMedium}
              />
              <Text
                color="secondary"
                style={[
                  Fonts.textLarge,
                  Fonts.textLeft,
                  Gutters.small2xTMargin,
                  Gutters.mediumHMargin
                ]}
                text="Let's talk about your food and nutrition preferences."
              />
            </View>
          </View>

          <View style={Layout.justifyContentEnd}>
            <Button
              block
              text={"Next"}
              color="primary"
              onPress={() => {
                setWelcomeModal(false)
                navigate("MealPreference")
              }}
              disabled={!exerciseLevel}
              style={[Gutters.small2xHMargin, Gutters.regularVMargin]}
            />
          </View>
        </ScrollView>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  logoStyle: { height: 140, width: 140, resizeMode: "contain" },
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
export default connect(mapStateToProps, mapDispatchToProps)(TrainingDays)
