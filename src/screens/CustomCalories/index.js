import React, { useState, useEffect, useRef } from "react"
import { connect } from "react-redux"
import {
  View,
  Image,
  Platform,
  Keyboard,
  TextInput,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Modal from "react-native-modal"
import Loader from "../../components/Loader"
import {
  Text,
  Button,
  RuningCard,
  RuningWorkout,
  ProfileComponent,
  BottomSheet,
  ModalInput,
  MealHistory
} from "../../components"
import { ScrollView as Content } from "native-base"
import Icon from "react-native-vector-icons/FontAwesome5"
import { Layout, Global, Gutters, Colors, Images, Fonts } from "../../theme"
import { calculatePostTime } from "../../utils/functions"
import { exerciseArray } from "../../utils/utils"
import { usePubNub } from "pubnub-react"

import { TabOne, TabThree } from "./components"
//Actions
import { updateAnswer } from "../Questions/Redux/index"
import {
  getCustomCalRequest,
  getMealsHistoryRequest
} from "../../ScreenRedux/customCalRedux"

import { submitQuestionRequest } from "../Questions/Redux"
import { getNumberOfDayByString } from "../../utils/common"
import moment from "moment"
import { useIsFocused } from "@react-navigation/native"
import { getNotificationCount } from "../../ScreenRedux/nutritionRedux"
import {
  getAllSessionRequest,
  getDaySessionRequest,
  swapCustomExercises
} from "../../ScreenRedux/programServices"
import {
  GoogleSignin,
  statusCodes
} from "@react-native-google-signin/google-signin"
import { setAccessToken } from "../../ScreenRedux/loginRedux"
import { resetQuestions } from "../Questions/Redux"
import { useStore } from "../../utils/chat"

const CustomCalories = props => {
  const {
    meals,
    profile,
    getCalories,
    unreadCount,
    todaySessions,
    getAllSessions,
    navigation,
    requesting,
    updateLoader,
    loader,
    getAllCustomSessions
  } = props

  let refWeight = useRef("")
  let refTrainingDay = useRef("")
  const pubnub = usePubNub()

  const { state, dispatch } = useStore()
  const [tab, setTab] = useState(2)
  const [value, setValue] = useState(false)
  const [currentTab, setCurrentTab] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [showModalHistory, setShowModalHistory] = useState(false)
  const [exerciseLevel, setExerciseLevel] = useState(false)
  const [typeData, setTypeData] = useState(false)
  const [channelCount, setChannelCount] = useState()

  useEffect(() => {
    const unsubscribe = props.navigation.addListener("focus", () => {
      // props.getCustomCalRequest()
      props.swapCustomExercises("", true)
      props.getMealsHistoryRequest()
    })
    return unsubscribe
  }, [props.navigation])

  const isFocused = useIsFocused()

  useEffect(() => {
    unreadMessage()
    // isFocused && calculateMeals() && props.getCustomCalRequest(calculateMeals())
    props.getNotificationCount()
  }, [meals, isFocused])

  useEffect(() => {
    isFocused && props.getCustomCalRequest()
  }, [meals, isFocused])

  const calculateMeals = () => {
    if (meals.length) {
      let percentTotalCal = 0
      let percentToGetProtein = 0
      let percentToGetCarbohydrate = 0
      let percentToGetFat = 0
      meals &&
        meals.forEach(item => {
          item.food_items.map(food => {
            const currentDate = moment(new Date()).format("YYYY-MM-DD")
            if (currentDate === moment(food.created).format("YYYY-MM-DD")) {
              let cal = Math.ceil(food.food.calories * food.unit.quantity)
              let carbs = Math.ceil(food.food.carbohydrate * food.unit.quantity)
              let protein = Math.ceil(food.food.proteins * food.unit.quantity)
              let fat = Math.ceil(food.food.fat * food.unit.quantity)
              percentTotalCal += cal
              percentToGetProtein += protein
              percentToGetCarbohydrate += carbs
              percentToGetFat += fat
            }
          })
        })
      const conCalData = {
        user: profile && profile.id,
        calories: Math.ceil(percentTotalCal),
        protein: Math.ceil(percentToGetProtein),
        carbs: Math.ceil(percentToGetCarbohydrate),
        fat: Math.ceil(percentToGetFat)
      }
      return conCalData
    }
  }

  const {
    row,
    fill,
    fillGrow,
    center,
    fullWidth,
    alignItemsStart,
    alignItemsCenter,
    justifyContentEnd,
    justifyContentCenter,
    justifyContentStart,
    justifyContentBetween
  } = Layout
  const { border, secondaryBg, borderAlto } = Global
  const {
    largeHMargin,
    smallHPadding,
    regularLMargin,
    small2xHMargin,
    smallTMargin,
    regularHPadding,
    regularVPadding,
    regularLPadding,
    smallVPadding,
    regularHMargin,
    regularVMargin,
    regularTMargin,
    smallBMargin,
    mediumVMargin,
    smallHMargin
  } = Gutters

  const data = ["Home", "Exercise", "Nutrition"]

  const myHealthData = [
    "Disease",
    "Heart",
    "Mobitlity",
    "Activity",
    "Body Measurements",
    "Mobility",
    "Respiratory",
    "Vitals"
  ]

  const dateTime = new Date()
  const todayDayStr = moment(dateTime).format("dddd")
  const { numberOfDayForBackend } = getNumberOfDayByString(todayDayStr)

  const tabSettings = i => {
    setTab(i)
    if (i === 1) {
      props.getAllSessionRequest("all")
      // props.getDaySessionRequest(numberOfDayForBackend);
    }
  }

  const onMealUpdate = () => {
    const tempData = props.answers
    const data = {
      name: `${profile?.number_of_meal} Meals`,
      value: profile?.number_of_meal
    }
    tempData.number_of_meal = data
    props.updateAnswers(tempData)
    navigation.navigate("MealPreference", { isHome: true })
  }

  //<==================custom Workouts list==============start==========>
  const sortedCustomData = () => {
    const data = getAllCustomSessions?.sort(
      (a, b) => new Date(b.created_date) - new Date(a.created_date)
    )
    return data || []
  }

  const checkCustomValue = () => {
    const data =
      getAllCustomSessions?.length &&
      getAllCustomSessions?.map((item, index) => {
        if (item?.workouts?.some(item => item?.done) || item.done) {
          return true
        } else {
          return false
        }
      })

    const isData = data && data?.find(item => item)

    return isData
  }

  //<==================custom Workouts list==============end==========>

  const sortedData = () => {
    const data = getAllSessions?.query?.sort(
      (a, b) => new Date(b.date_time) - new Date(a.date_time)
    )
    return data || []
  }
  const checkValue = () => {
    const data = getAllSessions?.query?.map((item, index) => {
      if (item?.workouts?.some(item => item?.done)) {
        return true
      } else {
        return false
      }
    })
    const isData = data && data?.find(item => item)
    return isData
  }
  const logOut = async () => {
    if (await GoogleSignin.isSignedIn()) {
      try {
        await GoogleSignin.signOut()
        await AsyncStorage.clear()
        props.resetQuestions()
        props.setAccessToken(false)
      } catch (e) {
        navigation.goBack()
      }
    } else {
      await AsyncStorage.clear()
      props.resetQuestions()
      props.setAccessToken(false)
    }
  }

  const exerciseDaysArray = [
    { value: 1, text: "3 Days", days: 3 },
    { value: 2, text: "4 Days", days: 4 },
    { value: 3, text: "5 Days", days: 5 }
  ]

  const updateData = type => {
    setTypeData(type)
    if (type === "weight") {
      refWeight?.current?.open()
      setValue(`${profile.weight}`)
    } else {
      refTrainingDay?.current?.open()
      setExerciseLevel(
        type === "goal" ? profile.fitness_goal : profile.number_of_training_days
      )
    }
  }

  const updateFitnessAndDays = () => {
    let data
    if (typeData === "days") {
      data = {
        number_of_training_days: exerciseLevel,
        request_type: "days"
      }
    } else {
      data = {
        fitness_goal: exerciseLevel,
        request_type: "goal"
      }
    }
    props.submitQuestionRequest(profile, data, "update")
    setExerciseLevel(false)
    refTrainingDay.current.close()
  }

  const unreadMessage = () => {
    pubnub.objects
      .getMemberships({
        include: {
          customFields: true
        }
      })
      .then(res => {
        let countData = []
        res?.data?.forEach(item => {
          if (item?.channel?.id && item?.custom?.lastReadTimetoken) {
            pubnub.fetchMessages(
              {
                channels: [item?.channel?.id],
                count: 1
              },
              (_, response) => {
                if (response?.channels) {
                  const lastMessage = response.channels[item.channel.id][0]

                  if (lastMessage?.message?.sender !== profile?.id) {
                    pubnub
                      .messageCounts({
                        channels: [item?.channel?.id],
                        channelTimetokens: [item?.custom?.lastReadTimetoken]
                      })
                      .then(resMsg => {
                        Object.entries(resMsg?.channels)
                          .map(([id, rest]) => ({
                            id,
                            rest
                          }))
                          .map(obj => {
                            countData.push({ id: obj?.id, count: obj?.rest })
                          })
                      })
                  }
                }
              }
            )
          }
        })
        setTimeout(() => {
          setChannelCount(countData)
        }, 1000)
      })
  }

  const countUnread = () => {
    if (channelCount) {
      var sum = channelCount?.reduce(function (total, obj) {
        return total + obj.count
      }, 0)
      return sum
    }
  }

  return (
    <SafeAreaView style={[fill, secondaryBg, fullWidth]}>
      {(updateLoader || loader) && <Loader />}

      <ProfileComponent
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onPressSocial={() => props.navigation.navigate("ProfileScreen")}
        onPressMsg={() => props.navigation.navigate("MessageScreen")}
        onPressNotify={() => props.navigation.navigate("NotificationScreen")}
        unreadCount={unreadCount ? unreadCount : false}
        profile={profile}
        countUnread={countUnread()}
      />
      <View
        style={[
          row,
          justifyContentBetween,
          regularHPadding,
          styles.currentTabStyleMap
        ]}
      >
        {data.map((item, i) => {
          return (
            <TouchableOpacity
              key={i}
              style={[fill, center]}
              onPress={() => tabSettings(i)}
            >
              <Text
                style={[
                  tab === i
                    ? { color: Colors.black, fontWeight: "bold" }
                    : { color: Colors.alto },
                  styles.currentTabText
                ]}
                text={item}
              />
              {tab !== i && <View style={styles.bottomStyle} />}
              {tab === i && <View style={styles.bottomStyle2} />}
            </TouchableOpacity>
          )
        })}
      </View>
      <Content
        showsVerticalScrollIndicator={false}
        contentContainerStyle={fillGrow}
      >
        {tab === 0 && (
          <TabOne
            setShowModal={updateData}
            profile={profile}
            signOut={logOut}
            connectAlexa={() => navigation.navigate("Alexa")}
          />
        )}
        {tab === 1 && (
          //   <View style={[fill, center]}>
          //   {session ? (
          //     allSessions &&
          //     allSessions.query &&
          //     allSessions.query.map((item, index) => {
          //       const todayDayString = moment(item.date_time).format('MM/DD/YYYY');
          //       if (item.workouts[item.workouts.length - 1]?.done === true) {
          //         return (
          //           <View key={index} style={{width: '100%'}}>
          //             <TouchableOpacity
          //               key={index}
          //               onPress={() =>
          //                 navigation.navigate('WorkoutCard', {
          //                   summary: item.workouts,
          //                   uppercard: item,
          //                 })
          //               }
          //             >
          //               <RuningWorkout
          //                 item={item}
          //                 index={index}
          //                 todayDayStr={todayDayString}
          //               />
          //             </TouchableOpacity>
          //           </View>
          //         );
          //       }
          //     })
          //   ) : (
          //     <View style={[fill, center]}>
          //       <Text
          //         text="No workout available."
          //         style={{color: 'black', fontSize: 22}}
          //       />
          //     </View>
          //   )}
          // </View>

          <Content contentContainerStyle={fillGrow}>
            {requesting ? (
              <View style={styles.loaderContainer}>
                <ActivityIndicator color="#000" size={"large"} />
              </View>
            ) : (checkValue() && sortedData()?.length) ||
              (checkCustomValue() && sortedCustomData()?.length) ? (
              <>
                {checkValue() && sortedData()?.length && (
                  <View
                    style={[
                      row,
                      justifyContentBetween,
                      alignItemsCenter,
                      small2xHMargin,
                      smallVPadding
                    ]}
                  >
                    <Text style={styles.comingSoonWork} text="Workouts" />
                  </View>
                )}
                {checkValue() && sortedData()?.length
                  ? sortedData()?.map((item, index) => {
                    const todayDayString = moment(item.date_time).format(
                      "MM/DD/YYYY"
                    )

                    if (item?.workouts?.some(item => item?.done)) {
                      return (
                        <TouchableOpacity
                          key={index}
                          onPress={() =>
                            navigation.navigate("WorkoutCard", {
                              summary: item.workouts,
                              uppercard: item
                            })
                          }
                        >
                          <RuningWorkout
                            item={item}
                            index={index}
                            todayDayStr={todayDayString}
                          />
                        </TouchableOpacity>
                      )
                    } else {
                      return null
                    }
                  })
                  : null}

                {checkCustomValue() && sortedCustomData()?.length ? (
                  <>
                    <View
                      style={[
                        row,
                        justifyContentBetween,
                        alignItemsCenter,
                        small2xHMargin,
                        smallVPadding
                      ]}
                    >
                      <Text
                        style={styles.comingSoonWork}
                        text="Custom Workouts"
                      />
                    </View>
                    {sortedCustomData()?.map((item, index) => {
                      const todayDayString = moment(item.created_date).format(
                        "MM/DD/YYYY"
                      )

                      if (item?.workouts?.some(item => item?.done)) {
                        return (
                          <>
                            <TouchableOpacity
                              key={index}
                              onPress={() =>
                                navigation.navigate("WorkoutCard", {
                                  summary: item?.workouts,
                                  uppercard: item
                                })
                              }
                            >
                              <RuningWorkout
                                item={item}
                                index={index}
                                todayDayStr={todayDayString}
                              />
                            </TouchableOpacity>
                          </>
                        )
                      } else {
                        return null
                      }
                    })}
                  </>
                ) : null}
              </>
            ) : (
              <View style={[fill, center]}>
                <Text
                  text="No workout available."
                  style={{ color: "black", fontSize: 22 }}
                />
              </View>
            )}
          </Content>
        )}
        {tab === 2 && (
          <TabThree
            navigation={props.navigation}
            profileData={profile}
            consumeCalories={getCalories}
            setShowModalHistory={setShowModalHistory}
            onMealUpdate={onMealUpdate}
          />
        )}
        {tab === 3 && (
          <>
            <View style={[row, alignItemsCenter, regularHMargin]}>
              <Text style={styles.comingSoonWork} text="My Health" />
              <Image
                source={Images.iconMyFav}
                style={[regularLMargin, styles.myFavImage]}
              />
            </View>
            <View
              style={[
                border,
                borderAlto,
                regularHMargin,
                regularVMargin,
                styles.myHealthParent
              ]}
            >
              <View
                style={[
                  row,
                  borderAlto,
                  regularVPadding,
                  regularLPadding,
                  { borderBottomWidth: 1 }
                ]}
              >
                <Text text={"Injuries"} bold />
                <Text
                  bold
                  text={" Past and Present"}
                  style={styles.pastPresentStyle}
                />
              </View>
              {myHealthData.map((item, i) => (
                <View
                  key={i}
                  style={[
                    borderAlto,
                    Platform.OS === "ios"
                      ? { borderBottomWidth: 0 }
                      : { borderBottomWidth: 1 },
                    myHealthData.length - 1 === i && { borderBottomWidth: 0 }
                  ]}
                >
                  <Text
                    bold
                    text={item}
                    style={[borderAlto, regularVPadding, regularHPadding]}
                  />
                </View>
              ))}
            </View>
          </>
        )}
      </Content>

      {/* Modals area starts */}

      <Modal
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={500}
        animationOutTiming={500}
        useNativeDriver={true}
        isVisible={isVisible}
        onRequestClose={() => {
          setIsVisible(false)
        }}
        style={{
          margin: 0,
          padding: 0
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: "transparent",
            margin: 0,
            padding: 0,
            height: "100%",
            width: "100%",
            position: "absolute",
            zIndex: -2
          }}
          onPress={() => setIsVisible(false)}
        />
        <View
          style={{ flex: 1, zIndex: -333, backgroundColor: "transparent" }}
        />
        <View
          style={[
            regularHPadding,
            {
              zIndex: 2,
              flex: 1.5,
              margin: 0,
              padding: 0,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              backgroundColor: "#fff"
            }
          ]}
        >
          <View
            style={[
              regularVMargin,
              { borderWidth: 1, width: 30, alignSelf: "center" }
            ]}
          />
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1
            }}
            showsVerticalScrollIndicator={false}
          >
            <View>
              {true
                ? [1, 2, 3].map((item, i) => {
                  return (
                    <TouchableOpacity
                      key={i}
                    // onPress={() => {
                    //   if (item.message === 'Comment Post' || 'Like Post') {
                    //     navigation.navigate('PostDetail', { item: item });
                    //     setIsVisible(!isVisible);
                    //     countNotification(item);
                    //   }
                    //   if (item.message === 'Started following you') {
                    //     navigation.navigate('ProfileView', item);
                    //   }
                    //   if (item.message === 'Message') {
                    //     navigation.navigate('ChatRoom');
                    //     setIsVisible(!isVisible);
                    //     countNotification(item);
                    //   }
                    // }}
                    >
                      <RuningCard
                        item={item}
                        Notification={item.message}
                        Time={calculatePostTime(item)}
                      />
                    </TouchableOpacity>
                  )
                })
                : null}
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/*===============================================*/}
      <BottomSheet reff={refWeight} h={200}>
        <View style={{ flex: 1, marginHorizontal: 20 }}>
          <View style={[fill, regularHMargin, regularVMargin]}>
            <ModalInput
              value={value}
              onChangeText={val => setValue(val)}
              placeholder="Enter weight..."
              keyboardType="numeric"
              text="Update weight"
            />
          </View>

          <View style={[row, regularVMargin]}>
            <Button
              color="primary"
              text="Update"
              style={[regularHMargin, fill, center]}
              onPress={() => {
                const data = {
                  weight: value,
                  request_type: "weightUpdate"
                }
                props.submitQuestionRequest(profile, data)
                setValue("")
                refWeight.current.close()
              }}
            />
          </View>
        </View>
      </BottomSheet>
      {/*===============================================*/}

      <BottomSheet reff={refTrainingDay} h={500}>
        <View style={{ flex: 1, marginHorizontal: 20 }}>
          {typeData === "goal" ? (
            <>
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
                {exerciseArray?.map((item, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[
                      Layout.row,
                      Gutters.smallHPadding,
                      Gutters.regularVPadding,
                      Layout.alignItemsCenter,
                      Layout.justifyContentBetween,
                      exerciseLevel === item.value
                        ? Global.border
                        : Global.borderB,
                      exerciseLevel !== item.value
                        ? Global.borderAlto
                        : { borderColor: Colors.primary }
                    ]}
                    onPress={() => setExerciseLevel(item.value)}
                  >
                    <View style={[Layout.justifyContentBetween]}>
                      <Text
                        text={item.heading}
                        style={{
                          fontSize: 20,
                          color: "#6f6f6f",
                          fontWeight: "600"
                        }}
                      />
                      <Text
                        style={{ color: "#7d7d7d", marginTop: 5 }}
                        text={item.description}
                      />
                    </View>
                    <Image
                      source={Images.forwardIcon}
                      style={styles.rightArrow}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </>
          ) : (
            <>
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
                {exerciseDaysArray?.map((item, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[
                      Layout.row,
                      Gutters.smallHPadding,
                      Gutters.regularVPadding,
                      Layout.alignItemsCenter,
                      Layout.justifyContentBetween,
                      exerciseLevel === item.days
                        ? Global.border
                        : Global.borderB,
                      exerciseLevel !== item.days
                        ? Global.borderAlto
                        : { borderColor: Colors.primary }
                    ]}
                    onPress={() => setExerciseLevel(item.days)}
                  >
                    <View style={[Layout.justifyContentBetween]}>
                      <Text
                        text={item.text}
                        style={{
                          fontSize: 20,
                          color: "#6f6f6f",
                          fontWeight: "600"
                        }}
                      />
                    </View>
                    <Image
                      source={Images.forwardIcon}
                      style={styles.rightArrow}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}
          <View style={[row, regularVMargin]}>
            <Button
              color="primary"
              text="Update"
              style={[regularHMargin, fill, center]}
              onPress={updateFitnessAndDays}
            />
          </View>
        </View>
      </BottomSheet>

      <Modal
        animationType="slide"
        visible={showModalHistory}
        onRequestClose={() => {
          setShowModalHistory(!showModalHistory)
        }}
        style={{
          flex: 1,
          backgroundColor: "#f9f9f9",
          padding: 0,
          margin: 0,
          marginTop: Platform.OS === "ios" ? 50 : 0
        }}
      >
        <View
          style={[
            row,
            alignItemsCenter,
            justifyContentEnd,
            regularHMargin,
            regularTMargin
          ]}
        >
          <TouchableOpacity
            onPress={() => setShowModalHistory(!showModalHistory)}
            style={smallBMargin}
          >
            <Icon type="FontAwesome5" name="times" color="#626262" size={25} />
          </TouchableOpacity>
        </View>
        <MealHistory mealsByDate={meals} />
      </Modal>

      {/* Modals area ends */}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // height: 400,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 10
  },
  cardText: {
    fontSize: 14,
    color: "black",
    textAlign: "center"
  },
  currentTabStyle: {
    width: 140,
    height: 30
  },
  currentTabStyleMap: {
    width: "100%",
    height: 60
  },
  currentTabText: {
    fontSize: 15,
    lineHeight: 15,
    paddingVertical: 5
  },
  bottomStyle: { width: 12, height: 10 },
  bottomStyle2: {
    width: 12,
    height: 10,
    backgroundColor: "#55bfff",
    borderRadius: 100
  },
  comingSoonWork: {
    fontSize: 30,
    color: "black",
    fontWeight: "bold"
  },
  comingSoonMore: {
    fontSize: 16,
    color: Colors.azureradiance
  },
  imageStyle: {
    width: 25,
    height: 25,
    resizeMode: "contain"
  },
  gradientWrapper: {
    width: 160,
    height: 160,
    borderRadius: 20,
    borderColor: Colors.azureradiance
  },
  gradientWrapperSocial: {
    width: "100%",
    height: 300,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderColor: Colors.azureradiance
  },
  myFavImage: {
    width: 40,
    height: 40
  },
  myHealthParent: {
    borderRadius: 20
  },
  pastPresentStyle: {
    fontSize: 12,
    color: Colors.nobel,
    marginTop: 6
  },
  avatarWrapper: {
    marginTop: -100
  },
  avatarImageStyle: {
    width: 150,
    height: 150,
    justifyContent: "flex-end",
    alignItems: "center",
    bottom: 0,
    borderWidth: 1,
    borderRadius: 100,
    borderColor: "#000",
    backgroundColor: "#fff"
  },
  challengeCard: {
    height: 250,
    borderRadius: 30,
    borderWidth: 2
  },
  bottomBorderStyle: {
    color: Colors.black,
    borderBottomWidth: 2,
    borderBottomColor: Colors.azureradiance,
    fontWeight: "bold"
  },
  bottomBorderStyleActive: {
    color: Colors.alto,
    borderBottomWidth: 2,
    borderBottomColor: Colors.white
  },
  textStyle: {
    fontSize: 15,
    color: "black",
    fontWeight: "bold"
  },
  textSmallStyle: {
    fontSize: 12,
    color: Colors.nobel,
    fontWeight: "bold"
  },
  messageStyle: {
    top: -10,
    width: 21,
    right: -10,
    height: 21,
    borderRadius: 100,
    position: "absolute",
    backgroundColor: "red"
  },
  messageStyleText: {
    fontSize: 12,
    marginTop: 2,
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  notificationStyle: {
    width: 21,
    height: 21,
    borderRadius: 100,
    backgroundColor: "red",
    position: "absolute",
    top: -10,
    right: -10
  },
  notificationStyleText: {
    textAlign: "center",
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
    marginTop: 2
  },
  profileImage: {
    borderRadius: 100,
    width: 50,
    height: 50,
    resizeMode: "cover",
    borderWidth: 1,
    borderColor: "gray"
  },
  rightArrow: {
    height: 20,
    width: 20,
    resizeMode: "contain",
    tintColor: Colors.nobel
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
})

const mapStateToProps = state => ({
  getCalories: state.customCalReducer.getCalories,
  meals: state.customCalReducer.mealsHistory,
  profile: state.login.userDetail,
  unreadCount: state.nutritionReducer.unreadCount,
  todaySessions: state.programReducer.todaySessions,
  getAllSessions: state.programReducer.getAllSessions,
  getAllCustomSessions: state.programReducer.getAllCustomSessions,
  requesting: state.programReducer.requesting,
  loader: state.profileReducer.request,
  updateLoader: state.questionReducer.requesting,
  answers: state.questionReducer.answers
})

const mapDispatchToProps = dispatch => ({
  swapCustomExercises: (data, all) => dispatch(swapCustomExercises(data, all)),
  getCustomCalRequest: data => dispatch(getCustomCalRequest(data)),
  getMealsHistoryRequest: () => dispatch(getMealsHistoryRequest()),
  getNotificationCount: () => dispatch(getNotificationCount()),
  submitQuestionRequest: (profile, data, isCheck) =>
    dispatch(submitQuestionRequest(profile, data, isCheck)),
  getAllSessionRequest: data => dispatch(getAllSessionRequest(data)),
  getDaySessionRequest: data => dispatch(getDaySessionRequest(data)),
  setAccessToken: data => dispatch(setAccessToken(data)),
  resetQuestions: () => dispatch(resetQuestions()),
  updateAnswers: data => dispatch(updateAnswer(data))
})
export default connect(mapStateToProps, mapDispatchToProps)(CustomCalories)
