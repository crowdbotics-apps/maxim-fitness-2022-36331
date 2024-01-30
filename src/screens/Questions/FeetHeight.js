import React, { useState } from "react"
import { View, ScrollView, SafeAreaView, Platform } from "react-native"
import { connect } from "react-redux"

//Components
import { Text, Button, InputField } from "../../components"
import HeaderTitle from "./Components/HeaderTitle"
import { handleTextChange } from "../../utils/utils"

//Themes
import { Global, Layout, Gutters, Fonts, Colors } from "../../theme"

//Actions
import { updateAnswer } from "./Redux"

const FeetHeight = props => {
  const {
    navigation: { navigate }
  } = props
  const [feet, setFeet] = useState("")
  const [inches, setInches] = useState("")

  const onNext = () => {
    const tempData = props.answers
    tempData.height = `${feet}.${inches}`
    props.updateAnswers(tempData)
    navigate("WeightPounds")
  }

  return (
    <SafeAreaView style={[Global.secondaryBg, Layout.fill]}>
      <HeaderTitle percentage={0.47} showBackButton />
      <ScrollView
        contentContainerStyle={[
          Layout.fillGrow,
          Gutters.small2xHPadding,
          Layout.justifyContentBetween
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={Gutters.mediumTMargin}>
          <Text
            color="commonCol"
            style={Fonts.titleRegular}
            text={"What is your height?"}
          />
        </View>
        <View
          style={[
            Layout.justifyContentStart,
            Layout.fill,
            Gutters.mediumTMargin
          ]}
        >
          <View
            style={[
              Layout.row,
              Global.height65,
              Layout.alignItemsCenter,
              Layout.justifyContentBetween,
              Global.borderB,
              Global.borderAlto
            ]}
          >
            <InputField
              inputStyle={[
                Fonts.titleRegular,
                Layout.fill,
                {
                  paddingHorizontal: 0,
                  height: 60,
                  color: Colors.black
                }
              ]}
              value={feet}
              onChangeText={val => setFeet(val.replace(/[^0-9]/g, ""))}
              placeholder="Feet"
              autoCapitalize="none"
              keyboardType="numeric"
            />
          </View>
          <View
            style={[
              Layout.row,
              Global.height65,
              Layout.alignItemsCenter,
              Layout.justifyContentBetween,
              Global.borderB,
              Global.borderAlto
            ]}
          >
            <InputField
              inputStyle={[
                Fonts.titleRegular,
                Layout.fill,
                {
                  paddingHorizontal: 0,
                  height: 60
                }
              ]}
              value={inches}
              onChangeText={val => setInches(val.replace(/[^0-9]/g, ""))}
              placeholder="Inches"
              autoCapitalize="none"
              keyboardType="numeric"
            />
          </View>
        </View>
        <View style={[Layout.justifyContentEnd, Gutters.mediumTMargin]}>
          <Button
            block
            text={"Next"}
            color="primary"
            onPress={onNext}
            disabled={!feet}
            style={Gutters.regularBMargin}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const mapStateToProps = state => ({
  answers: state.questionReducer.answers
})

const mapDispatchToProps = dispatch => ({
  updateAnswers: data => dispatch(updateAnswer(data))
})
export default connect(mapStateToProps, mapDispatchToProps)(FeetHeight)
