import React, { useEffect } from "react"
import { View, Image, Text, StyleSheet, Platform } from "react-native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createStackNavigator } from "@react-navigation/stack"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen"
import { Images } from "src/theme"
import Feeds from "../screens/Feeds"
import ViewPost from "../screens/ViewPost"
import AddPost from "../screens/AddPost"
import Subscription from "../screens/Subscription"
import CreditCard from "../screens/CreditCard"
import PaymentScreen from "../screens/CreditCard/PaymentScreen"



import ProgramScreen from "../screens/ProgramScreen"
import ExerciseScreen from "../screens/ExerciseScreen"
import ProfileScreen from "../screens/ProfileScreen"
import EditProfile from "../screens/EditProfile"
import CustomCalories from "../screens/CustomCalories"
import EditCustomCal from "../screens/CustomCalories/childScreens/EditCustomCal"
import EditCaloriesManually from "../screens/CustomCalories/childScreens/EditCaloriesManually"
import SearchProfile from "../screens/SearchProfile"
import MessageScreen from "../screens/MessageScreen"
import ChatScreen from "../screens/chatScreen"
import NotificationScreen from "../screens/NotificationScreen"

// Custom exercise screens
import FatLoseProgram from "../screens/CustomWorkOut/FatLoseProgram"
import CustomExercise from "../screens/CustomWorkOut/CustomExercise"
import AddExercise from "../screens/CustomWorkOut/AddExercise"
import SettingScreen from "../screens/SettingScreen"
import HomeScreen from "../screens/HomeScreen"
import MealRegulator from "../screens/MealRegulator"
import SelectBrand from "../screens/SelectBrand"
import SurveyScreenMeal from "../screens/SurveyScreenMeal"
import Alexa from "../screens/Alexa"
import SwapExerciseScreen from "../screens/SwapExerciseScreen"
import WorkoutCard from "../screens/WorkoutCard"
import MealPreference from "../screens/Questions/MealPreference"
import MealTime from "../screens/Questions/MealTime"

import LogFoods from "../screens/LogFoods"
import BarCodeScreen from "../screens/BarCodeScreen"
import { modules } from "@modules"

import SubscriptionScreen from "../screens/Subscription"
import { connect } from "react-redux"
import { profileData } from "../ScreenRedux/profileRedux"
const { home,
  profileTab,
  feed,
  nutrition,
  exercise,
  mealsBlue,
  feedBlue,
  dashboardBlue,
  exerciseBlue,
  profileBlue,
  mealsGray,
  feedGray,
  dashboardGray,
  exerciseGray,
  profileGray
} = Images


// const Chat = modules[0].value.navigator;
const mainStack = createStackNavigator()
const Tab = createBottomTabNavigator()

// @refresh reset
export const BottomNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Feed"
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: "white",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 0
          },
          shadowOpacity: 0.34,
          shadowRadius: 6.27,

          elevation: 10,
          shadowColor: "black",
          backgroundColor: "white",
          height: Platform.OS === "ios" ? hp("12%") : hp("10%")
        },
        tabBarButton: ["Home", "Profile", "Feed", "Custom", "FatLose"].includes(
          route.name
        )
          ? undefined
          : () => {
            return null
          }
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: ({ focused }) => (
            <View style={styles.textContainer}>
              <Text style={[styles.text, { color: focused ? "#0460BB" : "gray" }]}>Meals</Text>
              <View
                style={[
                  styles.bottom,
                  { borderBottomColor: "white" }

                ]}
              />
            </View>
          ),
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabIcon}>
              <Image source={focused ? mealsBlue : mealsGray} style={styles.iconStyle1} />
            </View>
          ),
          header: () => null
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: ({ focused }) => (
            <View style={styles.textContainer}>
              <Text style={[styles.text, { color: focused ? "#0460BB" : "gray" }]}>Profile</Text>
              <View
                style={[
                  styles.bottom,
                  { borderBottomColor: "white" }
                ]}
              />
            </View>
          ),
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabIcon}>
              <Image source={focused ? profileBlue : profileGray} style={styles.image1} />
            </View>
          ),
          header: () => null
        }}
      />

      <Tab.Screen
        name="Feed"
        component={Feeds}
        options={{
          tabBarLabel: ({ focused }) => (
            <View style={styles.textContainer}>
              <Text style={[styles.text, { color: focused ? "#0460BB" : "gray" }]}>Feed</Text>
              <View
                style={[
                  styles.bottom,
                  { borderBottomColor: "white" }

                ]}
              />
            </View>
          ),
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabIcon}>
              <Image source={focused ? feedBlue : feedGray} style={styles.iconStyle1} />
            </View>
          ),
          header: () => null
        }}
      />

      <Tab.Screen
        name="Custom"
        component={CustomCalories}
        options={{
          tabBarLabel: ({ focused }) => (
            <View style={styles.textContainer}>
              <Text style={[styles.text, { color: focused ? "#0460BB" : "gray" }]}>Dashboard</Text>
              <View
                style={[
                  styles.bottom,
                  { borderBottomColor: "white" }

                ]}
              />
            </View>
          ),
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabIcon}>
              <Image source={focused ? dashboardBlue : dashboardGray} style={styles.image2} />
            </View>
          ),
          header: () => null
        }}
      />

      <Tab.Screen
        name="FatLose"
        component={FatLoseProgram}
        options={{
          tabBarLabel: ({ focused }) => (
            <View style={styles.textContainer}>
              <Text style={[styles.text, { color: focused ? "#0460BB" : "gray" }]}>Exercise</Text>
              <View
                style={[
                  styles.bottom,
                  { borderBottomColor: "white" }

                ]}
              />
            </View>
          ),
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabIcon}>
              <Image source={focused ? exerciseBlue : exerciseGray} style={styles.imageStyle} />
            </View>
          ),
          header: () => null
        }}
      />

      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ header: () => null }}
      />
      <Tab.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ header: () => null }}
      />
      <Tab.Screen
        name="Feeds"
        component={Feeds}
        options={{ header: () => null }}
      />
      <Tab.Screen
        name="CustomCalories"
        component={CustomCalories}
        options={{ header: () => null }}
      />
      <Tab.Screen
        name="ViewPost"
        component={ViewPost}
        options={{ header: () => null }}
      />
      <Tab.Screen
        name="FatLoseProgram"
        component={FatLoseProgram}
        options={{ header: () => null }}
      />
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  textContainer: { justifyContent: "center", alignItems: "center" },
  text: { fontSize: 12, color: "#0460BB" },
  bottom: { borderBottomWidth: 5, marginTop: 10, width: 33, borderRadius: 10 },
  tabIcon: { marginTop: Platform.OS === "ios" ? 5 : 18 },
  imageStyle: { width: 20, height: 20, resizeMode: "contain" },
  iconStyle1: { width: 20, height: 19, resizeMode: "contain" },
  image1: { width: 20, height: 21, resizeMode: "contain" },
  image2: { width: 18, height: 18, resizeMode: "contain" }
})

const MainNavigator = props => {
  const { profile, profileData } = props
  useEffect(() => {
    profileData()
  }, [])

  return (
    <mainStack.Navigator
      screenOptions={{ headerShown: false, animationEnabled: false }}
      initialRouteName={"BottomBar"}
    >
      <mainStack.Screen name="BottomBar" component={BottomNavigator} />
      <mainStack.Screen name="AddPost" component={AddPost} />
      <mainStack.Screen name="ViewPost" component={ViewPost} />
      <mainStack.Screen name="Subscription" component={Subscription} />
      <mainStack.Screen name="CreditCard" component={CreditCard} />
      <mainStack.Screen name="ProgramScreen" component={ProgramScreen} />
      <mainStack.Screen name="Feeds" component={Feeds} />
      <mainStack.Screen name="ExerciseScreen" component={ExerciseScreen} />
      <mainStack.Screen name="EditProfile" component={EditProfile} />
      {/* <mainStack.Screen name="ProfileScreen" component={ProfileScreen} /> */}
      {/* <mainStack.Screen name="CustomCalories" component={CustomCalories} /> */}
      <mainStack.Screen name="SearchProfile" component={SearchProfile} />
      <mainStack.Screen name="MessageScreen" component={MessageScreen} />
      <mainStack.Screen name="ChatScreen" component={ChatScreen} />
      <mainStack.Screen
        name="NotificationScreen"
        component={NotificationScreen}
      />

      {/* <mainStack.Screen name="FatLoseProgram" component={FatLoseProgram} /> */}
      <mainStack.Screen name="CustomExercise" component={CustomExercise} />
      <mainStack.Screen name="AddExercise" component={AddExercise} />
      <mainStack.Screen name="SettingScreen" component={SettingScreen} />
      <mainStack.Screen name="EditCustomCal" component={EditCustomCal} />
      <mainStack.Screen
        name="EditCaloriesManually"
        component={EditCaloriesManually}
      />
      <mainStack.Screen
        name="MealPreference"
        component={MealPreference}
        options={{ animationEnabled: false }}
      />
      <mainStack.Screen
        name="MealTime"
        component={MealTime}
        options={{ animationEnabled: false }}
      />

      <mainStack.Screen name="SurveyScreenMeal" component={SurveyScreenMeal} />
      <mainStack.Screen name="MealRegulator" component={MealRegulator} />
      <mainStack.Screen name="SelectBrand" component={SelectBrand} />
      <mainStack.Screen name="LogFoods" component={LogFoods} />
      <mainStack.Screen name="BarCodeScreen" component={BarCodeScreen} />
      <mainStack.Screen name="Alexa" component={Alexa} />
      <mainStack.Screen name="PaymentScreen" component={PaymentScreen} />

      <mainStack.Screen
        name="SwapExerciseScreen"
        component={SwapExerciseScreen}
      />
      <mainStack.Screen name="WorkoutCard" component={WorkoutCard} />

      <mainStack.Screen
        name="SubscriptionScreen"
        component={SubscriptionScreen}
      />
      {/* <mainStack.Screen name="Chat" component={Chat} /> */}
    </mainStack.Navigator>

  )
}

const mapStateToProps = state => ({
  profile: state.login.userDetail,
})

const mapDispatchToProps = dispatch => ({
  profileData: () => dispatch(profileData()),
})

export default connect(mapStateToProps, mapDispatchToProps)(MainNavigator)
