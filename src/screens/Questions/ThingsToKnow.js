import React, { useState, useEffect } from "react"
import Slider from "react-native-slide-to-unlock"
import LinearGradient from "react-native-linear-gradient"
import Icon from "react-native-vector-icons/FontAwesome5"
import {
  View,
  Image,
  Modal,
  Animated,
  Easing,
  StyleSheet,
  Dimensions,
  ScrollView,
  SafeAreaView,
  TouchableOpacity
} from "react-native"
import { submitQuestionRequest, renderTabs } from "./Redux"
import { connect } from "react-redux"

//Components
import { Text } from "../../components"
import HeaderTitle from "./Components/HeaderTitle"

//Themes
import { Images, Global, Layout, Gutters, Fonts, Colors } from "../../theme"

const ThingsToKnow = props => {
  const { answers, profile } = props

  const deviceWidth = Dimensions.get("window").width
  const [welcomeModal, setWelcomeModal] = useState(false)
  const [isExcercise, setIsExcercise] = useState(false)
  const [isNutrition, setIsNutrition] = useState(false)

  const spinValue = new Animated.Value(0)

  const showProgress = () => {
    setTimeout(() => {
      setIsExcercise(true)

      setTimeout(() => {
        setIsNutrition(true)

        setTimeout(() => {
          // navigate('')
          setWelcomeModal(false)
        }, 2000)
      }, 2000)
    }, 2000)
  }

  const submitFormData = state => {
    const data = {
      gender: answers?.gender,
      dob: answers?.dob,
      weight: answers?.weight,
      height: answers?.height,
      unit: answers?.unit,
      exercise_level: answers?.exercise_level,
      activity_level: answers?.activity_level,
      understanding_level: answers?.understanding_level,
      number_of_meal: answers?.number_of_meal.value,
      number_of_training_days: answers?.number_of_training_days,
      fitness_goal: answers?.fitness_goal,
      date_time: answers?.mealTimes,
      consultations: state,
      request_type: "question"
    }
    setWelcomeModal(true)
    showProgress()
    props.submitQuestionRequest(profile, data, setWelcomeModal, showProgress)
    props.renderTabs()
    setTimeout(() => {
      showProgress(false)
    }, 6000)
  }

  const thingsArray = [
    {
      number: 1,
      heading: "Consult with your Doctor",
      description:
        "Before starting any type of physical activity, consult with your physician. Your physician may have different advice on the best exercises and activity for your specific needs."
    },
    {
      number: 2,
      heading: "Consult with a Dietician",
      description:
        "A registered dietitian is a professional who can inform you about eating healthily. Contact a registered dietitian before starting any diet or meal plan to ensure you are consuming the appropriate amount of nutrients."
    },
    {
      number: 3,
      heading: "Limitations of Liability",
      description:
        'Orum Training is science-based and follows the highest industry standards in exercise science and nutrition. However, it is important to consult a physician and/or registered dietitian before starting our services to identify your limitations. By clicking "slide to accept," you accept responsibility to consult with health professionals and do not hold Orum Training responsible for injuries from exercise or diet.'
    }
  ]

  Animated.timing(spinValue, {
    toValue: 10,
    duration: 20000,
    easing: Easing.linear,
    useNativeDriver: true
  }).start()

  // Second interpolate beginning and end values (in this case 0 and 1)
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"]
  })

  return (
    <SafeAreaView style={styles.container}>
      <HeaderTitle showBackButton={true} percentage={0.9} />
      <TouchableOpacity
        style={{
          justifyContent: "flex-end",
          flexDirection: "row",
          marginHorizontal: 20,
          marginVertical: 10
        }}
        onPress={() => submitFormData(false)}
      >
        <Text style={{ fontSize: 16, marginTop: 5, color: "#377eb5" }}>
          Cancel
        </Text>
      </TouchableOpacity>

      <View style={{ marginHorizontal: 20 }}>
        <Text
          style={{
            fontSize: 24,
            lineHeight: 24,
            fontWeight: "700",
            color: "#626262"
          }}
        >
          Three Things You Should Know
        </Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          marginTop: 10,
          paddingBottom: 30
        }}
      >
        <View>
          {thingsArray.map((item, i) => (
            <View
              key={i}
              style={{
                marginHorizontal: 20,
                backgroundColor: "#d3d3d3",
                borderRadius: 18,
                paddingBottom: 20,
                marginVertical: 10
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  marginHorizontal: 9,
                  marginTop: 9,
                  alignItems: "center"
                }}
              >
                <View
                  style={[
                    styles.centeredView,
                    {
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      backgroundColor: "#317fbd",
                      marginRight: 10
                    }
                  ]}
                >
                  <Text style={{ color: "#fff", fontWeight: "500" }}>
                    {item.number}
                  </Text>
                </View>
                <Text style={{ fontWeight: "700", color: "#626262" }}>
                  {item.heading}{" "}
                </Text>
              </View>

              <Text
                style={{ marginHorizontal: 10, marginTop: 8, color: "#626262" }}
              >
                {item.description}
              </Text>
            </View>
          ))}
        </View>
        <View
          style={{
            marginVertical: 10,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Slider
            onEndReached={() => submitFormData(true)}
            containerStyle={{
              margin: 8,
              width: deviceWidth - 40,
              borderRadius: 10,
              overflow: "hidden",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#d3d3d3"
            }}
            sliderElement={
              <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                colors={["#6EC2FA", "#3180BD"]}
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 10
                }}
              >
                <View
                  style={{ width: 50, height: 50, margin: 5, borderRadius: 10 }}
                >
                  <Icon
                    type="FontAwesome5"
                    name="arrow-right"
                    style={{
                      color: "white",
                      alignSelf: "center",
                      marginTop: 10,
                      fontSize: 25
                    }}
                  />
                </View>
              </LinearGradient>
            }
          >
            <Text style={{ fontWeight: "bold", color: "black" }}>
              {"Slide to Accept"}
            </Text>
          </Slider>
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
          <View style={[Layout.fill, Layout.center]}>
            <Text style={styles.title}>Thanks {profile?.username}!</Text>
            <Text style={[styles.subTitle, { marginBottom: 25 }]}>
              Our AI is customizing your exercise and nutrition program
            </Text>

            <Text style={styles.title}>Almost Done!</Text>

            {isExcercise && (
              <View style={styles.programItem}>
                <Text style={styles.subTitle}>Exercise program</Text>
                <Image
                  style={styles.icon}
                  source={Images.iconDoneProgram}
                  resizeMode="contain"
                />
              </View>
            )}

            {isNutrition && (
              <View style={styles.programItem}>
                <Text style={styles.subTitle}>Nutrition program</Text>
                <Image
                  style={styles.icon}
                  source={Images.iconDoneProgram}
                  resizeMode="contain"
                />
              </View>
            )}

            <Animated.Image
              style={{
                width: 50,
                height: 50,
                marginTop: 30,
                transform: [{ rotate: spin }]
              }}
              source={Images.animatedLoader}
              resizeMode="contain"
            />
          </View>
        </ScrollView>
      </Modal>
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
  },
  title: {
    fontSize: 23,
    // fontFamily: Fonts.HELVETICA_BOLD,
    textAlign: "center",
    marginBottom: 25,

    color: "#fff"
  },
  subTitle: {
    fontSize: 18,
    // fontFamily: Fonts.HELVETICA_MEDIUM,
    // textAlign: 'center',
    maxWidth: 280,
    color: "#fff",
    textAlign: "left"
  },
  icon: {
    width: 25,
    height: 25,
    marginLeft: 20
  },
  programItem: {
    flexDirection: "row",
    alignContent: "center",
    maxWidth: 195,
    width: "100%",
    marginBottom: 15
  }
})

const mapStateToProps = state => ({
  answers: state.questionReducer.answers,
  profile: state.login.userDetail
})

const mapDispatchToProps = dispatch => ({
  submitQuestionRequest: (profile, data, setWelcomeModal, showProgress) =>
    dispatch(
      submitQuestionRequest(profile, data, setWelcomeModal, showProgress)
    ),
  renderTabs: () => dispatch(renderTabs())
})
export default connect(mapStateToProps, mapDispatchToProps)(ThingsToKnow)
