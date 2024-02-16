import React, { useState, useEffect } from "react"
import {
  View,
  Modal,
  Image,
  Alert,
  StyleSheet,
  ScrollView,
  Dimensions,
  SafeAreaView,
  TouchableOpacity
} from "react-native"
import { connect } from "react-redux"
import moment from "moment"

//Components
import { Text, Button } from "../../components"
import HeaderTitle from "./Components/HeaderTitle"

//Themes
import { Images, Global, Layout, Gutters, Fonts, Colors } from "../../theme"

//Actions
import { updateAnswer } from "./Redux"
import { editProfileMeal } from "../../ScreenRedux/profileRedux"

import DatePicker from "react-native-date-picker"
import LinearGradient from "react-native-linear-gradient"

const MealTime = props => {
  const {
    navigation: { navigate },
    route: { params },
    profileData,
    mealRequest
  } = props
  const deviceWidth = Dimensions.get("window").width
  const { numberOfMeals } = params
  const [meals, setMeals] = useState([])
  const [exerciseLevel, setExerciseLevel] = useState(false)
  const [timeModal, setTimeModal] = useState(false)
  const [time, setTime] = useState(new Date())
  const [selectedMeal, setSelectedMeal] = useState("")

  const totalMeals = () => {
    return Array(numberOfMeals)
      .fill()
      .map((item, index) => {
        return {
          meal: `Meal ${index + 1}`,
          time: "",
          mealTime: ""
        }
      })
  }

  useEffect(() => {
    totalMeals() && setMeals(totalMeals())
  }, [])

  useEffect(() => {
    if (props.answers && props.answers.mealTimes) {
      setMeals(props.answers.mealTimes)
    }
  }, [])

  const onSelectMeal = (index, time, mealTime) => {
    const data = [...meals]
    data[index].time = time
    data[index].mealTime = mealTime
    setMeals(data)
  }

  const onNext = () => {
    let newArray = []
    meals.map(item => newArray.push(item.time))
    let duplicateArray = newArray.filter(function (item, i, orig) {
      return orig.indexOf(item, i + 1) === -1
    })

    if (meals.length === duplicateArray.length) {
      if (params?.isHome) {
        const data = {
          date_time: meals,
          number_of_meal: meals?.length,
          request_type: "mealTime"
        }
        props.editProfileMeal(data, profileData?.id)
      } else {
        const tempData = props.answers
        tempData.mealTimes = meals
        props.updateAnswers(tempData)
        navigate("NutritionUnderstanding")
      }
    } else {
      Alert.alert("Please choose different time")
    }
  }

  const buttonDiabled = () => {
    return meals.map(item => {
      return item.time
    })
  }

  return (
    <SafeAreaView style={[Global.secondaryBg, Layout.fill]}>
      <HeaderTitle
        showBackButton={true}
        percentage={0.75}
        isHome={params?.isHome}
      />
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
            text={"What times do you want to eat?"}
          />
        </View>
        <View
          style={[
            Layout.justifyContentStart,
            Layout.fill,
            Gutters.mediumTMargin
          ]}
        >
          {meals &&
            meals.map((item, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  Layout.row,
                  Global.height65,
                  Gutters.smallHPadding,
                  Layout.alignItemsCenter,
                  Layout.justifyContentBetween,
                  exerciseLevel === item ? Global.border : Global.borderB,
                  exerciseLevel !== item ? Global.borderAlto : "#a5c2d0"
                ]}
                onPress={() => {
                  setSelectedMeal(i)
                  setTimeModal(true)
                  if (meals[i]?.time) {
                    setTime(
                      new Date(moment(String(meals[i]?.time), "hh:mm").format())
                    )
                  }
                }}
              >
                <Text
                  text={item.meal}
                  color="commonCol"
                  style={Fonts.titleRegular}
                />
                {item.time ? (
                  <Text
                    text={moment(item?.time, "HH:mm").format("hh:mm A")}
                    color="commonCol"
                    style={Fonts.titleRegular}
                  />
                ) : (
                  <Image source={Images.downIcon} style={styles.rightArrow} />
                )}
              </TouchableOpacity>
            ))}
        </View>
        <View style={Layout.justifyContentEnd}>
          <Button
            block
            text={params?.isHome ? "Add Meal" : "Next"}
            color="primary"
            onPress={onNext}
            loading={mealRequest}
            disabled={
              mealRequest || buttonDiabled().includes("") ? true : false
            }
            style={Gutters.regularBMargin}
          />
        </View>
      </ScrollView>

      <Modal
        visible={timeModal}
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
          <View style={[Layout.fill, Layout.center]}>
            <DatePicker
              date={time}
              mode="time"
              onDateChange={val => {
                setTime(val)
                const timee = moment(val, ["h:mm A"]).format("HH:mm")
                onSelectMeal(selectedMeal, timee, val)
              }}
              textColor="black"
              androidVariant="iosClone"
              style={Global.secondaryBg}
            />
            <TouchableOpacity
              style={[Gutters.small2xVMargin, { width: deviceWidth - 175 }]}
              onPress={() => {
                if (time) {
                  const timee = moment(time, ["h:mm A"]).format("HH:mm")
                  onSelectMeal(selectedMeal, timee, time)
                }

                setTimeModal(false)
              }}
            >
              <LinearGradient
                style={styles.gradientStyle}
                colors={["#048ECC", "#0460BB", "#0480C6"]}
              >
                <Text style={styles.loginText}>Select Time</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ width: deviceWidth - 175 }}
              onPress={() => setTimeModal(false)}
            >
              <LinearGradient
                style={styles.gradientStyle}
                colors={["#e52b39", "#ef3d49", "#fb5a60"]}
              >
                <Text style={styles.loginText}>Cancel</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  rightArrow: {
    height: 20,
    width: 20,
    resizeMode: "contain",
    tintColor: Colors.nobel
  },
  gradientStyle: {
    height: 53,
    borderRadius: 0,
    alignItems: "center",
    justifyContent: "center"
  },
  loginText: {
    fontSize: 20,
    color: "white",
    fontWeight: "700"
  }
})

const mapStateToProps = state => ({
  answers: state.questionReducer.answers,
  profileData: state.login.userDetail,
  mealRequest: state.profileReducer.mealRequest
})

const mapDispatchToProps = dispatch => ({
  updateAnswers: data => dispatch(updateAnswer(data)),
  editProfileMeal: (mealtime, id) => dispatch(editProfileMeal(mealtime, id))
})
export default connect(mapStateToProps, mapDispatchToProps)(MealTime)
