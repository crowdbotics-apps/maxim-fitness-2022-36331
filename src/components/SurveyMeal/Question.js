import React, { useState, useEffect } from "react"
import {
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  Dimensions,
  StyleSheet
} from "react-native"
import LinearGradient from "react-native-linear-gradient"
import DatePicker from "react-native-date-picker"
import SurveyQuestionText from "./SurveyQuestionText"
import SurveyRow from "./SurveyRow"
import { Button } from "../../components"

import { Images, Fonts, Layout, Global, Gutters } from "../../theme"
import moment from "moment"
import { useIsFocused } from "@react-navigation/native"

const Question = ({
  singleQuestion,
  selectAnswer,
  isDisabled,
  setIsDisabled,
  params,
  loading
}) => {
  const { id, question } = singleQuestion
  const isFocused = useIsFocused()
  const [isSelected, setIsSelected] = useState("")
  const [valueTime, setValueTime] = useState(new Date())
  const [eatTime, setEatTime] = useState("")
  const [eatTimeTwo, setEatTimeTwo] = useState("")
  const [meals, setMeals] = useState([])
  const [selectedMealTime, setSelectedMealTime] = useState(null)
  const deviceWidth = Dimensions.get("window").width

  useEffect(() => {
    setMeals(calculateMeal())
    setSelectedMealTime(null)
  }, [question, isFocused])

  const calculateMeal = () => {
    if (params) {
      return Array(Number(params.mealValue))
        .fill()
        .map((item, index) => {
          return {
            id: index,
            mealTime: "",
            myMeal: ""
          }
        })
    }
  }

  const handleAnswer = () => {
    selectAnswer(meals, id)
  }

  const setTimeFnc = val => {
    // const valTime = val.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'});
    const valTime = moment(val).format("HH:mm")
    const time = moment(val).format()
    setValueTime(val)
    setEatTime(time)
    setEatTimeTwo(valTime)
    setIsDisabled(false)
  }

  const addTimeFnc = index => {
    let clonedMeals = [...meals]
    const obj = clonedMeals[index]
    if (obj) {
      clonedMeals[index] = {
        ...clonedMeals[index],
        mealTime: eatTime ? eatTime : moment(new Date()).format(),
        myMeal: eatTimeTwo ? eatTimeTwo : moment(new Date()).format("HH:mm")
      }
      setMeals(clonedMeals)
    } else {
      const updatedData = [
        ...meals,
        { id: index, mealTime: eatTime, myMeal: eatTimeTwo }
      ]
      setMeals(updatedData)
    }
    setIsSelected(false)
    setIsDisabled(false)
  }

  return (
    <>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <SurveyQuestionText>{question}</SurveyQuestionText>
        <View>
          {meals?.map((item, index) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  if (meals[index]?.myMeal) {
                    setValueTime(
                      new Date(
                        moment(String(meals[index]?.myMeal), "hh:mm").format()
                      )
                    )
                  }

                  setIsSelected(index + 1)
                }}
              >
                <SurveyRow style={styles.main}>
                  <Text style={[Fonts.titleRegular]}>{`Meal ${
                    index + 1
                  }`}</Text>
                  <>
                    {meals[index].myMeal !== "" ? (
                      <Text style={[Fonts.titleRegular]}>
                        {moment(meals[index].myMeal, "HH:mm").format("hh:mm A")}
                      </Text>
                    ) : (
                      <Image
                        style={{
                          width: 20,
                          height: 20,
                          resizeMode: "contain"
                        }}
                        source={Images.downIcon}
                        resizeMode="contain"
                      />
                    )}
                  </>
                </SurveyRow>

                <Modal
                  visible={Boolean(isSelected)}
                  style={Layout.fill}
                  animationType="slide"
                  transparent={true}
                  // onRequestClose={() => setIsSelected(false)}
                >
                  <ScrollView
                    contentContainerStyle={[
                      Layout.fillGrow,
                      Global.opacityBg75,
                      Layout.justifyContentBetween
                    ]}
                  >
                    <View style={[Layout.fill, Layout.center]}>
                      <DatePicker
                        mode="time"
                        date={valueTime}
                        textColor="black"
                        minimumDate={selectedMealTime ? selectedMealTime : null}
                        onDateChange={setTimeFnc}
                        style={Global.secondaryBg}
                      />

                      <TouchableOpacity
                        style={[
                          Gutters.small2xVMargin,
                          { width: deviceWidth - 175 }
                        ]}
                        onPress={() => {
                          addTimeFnc(isSelected - 1),
                            setSelectedMealTime(valueTime)
                        }}
                      >
                        <LinearGradient
                          colors={["#048ECC", "#0460BB", "#0480C6"]}
                          style={styles.gradientStyle}
                        >
                          <Text style={styles.btnText}>Add Meal Time</Text>
                        </LinearGradient>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={{ width: deviceWidth - 175 }}
                        onPress={() => setIsSelected(false)}
                      >
                        <LinearGradient
                          style={styles.gradientStyle}
                          colors={["#e52b39", "#ef3d49", "#fb5a60"]}
                        >
                          <Text style={styles.btnText}>Cancel</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  </ScrollView>
                </Modal>
              </TouchableOpacity>
            )
          })}
        </View>
      </ScrollView>
      <Button
        block
        text={"Add Meal"}
        color="primary"
        onPress={handleAnswer}
        disabled={isDisabled || loading}
        loading={loading}
        style={Gutters.regularBMargin}
      />
    </>
  )
}

const styles = StyleSheet.create({
  main: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: "#d3d3d3"
  },
  gradientStyle: {
    height: 50,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  btnText: {
    fontSize: 16,
    color: "white",
    fontWeight: "700"
  }
})

export default Question
