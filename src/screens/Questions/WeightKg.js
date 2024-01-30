import React, { useState } from "react"
import { View, StyleSheet, ScrollView, SafeAreaView } from "react-native"
import { connect } from "react-redux"

//Components
import { Text, Button, InputField } from "../../components"
import HeaderTitle from "./Components/HeaderTitle"
import { handleTextChange } from "../../utils/utils"

//Themes
import { Global, Layout, Gutters, Fonts, Colors } from "../../theme"

//Actions
import { updateAnswer } from "./Redux"

const WeightKg = props => {
  const {
    navigation: { navigate }
  } = props
  const [kilograms, setKilograms] = useState(false)

  const onNext = () => {
    const tempData = props.answers
    tempData.weight = kilograms
    props.updateAnswers(tempData)
    navigate("FitnessGoal")
  }

  return (
    <SafeAreaView style={styles.container}>
      <HeaderTitle percentage={0.52} showBackButton={true} />

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
            text={"What is your Weight?"}
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
                  height: 60
                }
              ]}
              value={kilograms}
              onChangeText={val => handleTextChange(val, setKilograms)}
              placeholder="Kilograms"
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
            disabled={!kilograms}
            style={Gutters.regularBMargin}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  centeredView: {
    justifyContent: "center",
    alignItems: "center"
  },
  logInButton: {
    height: 53,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center"
  },
  loginText: {
    fontSize: 16,
    color: "white",
    fontWeight: "700"
  }
})

const mapStateToProps = state => ({
  answers: state.questionReducer.answers
})

const mapDispatchToProps = dispatch => ({
  updateAnswers: data => dispatch(updateAnswer(data))
})
export default connect(mapStateToProps, mapDispatchToProps)(WeightKg)
