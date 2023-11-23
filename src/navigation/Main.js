import React from 'react';
import { View, Image, Text, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Images } from 'src/theme';
import Feeds from '../screens/Feeds';
import ViewPost from '../screens/ViewPost';
import AddPost from '../screens/AddPost';
import Subscription from '../screens/Subscription';
import CreditCard from '../screens/CreditCard';
import ProgramScreen from '../screens/ProgramScreen';
import ExerciseScreen from '../screens/ExerciseScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfile from '../screens/EditProfile';
import CustomCalories from '../screens/CustomCalories';
import EditCustomCal from '../screens/CustomCalories/childScreens/EditCustomCal';
import EditCaloriesManually from '../screens/CustomCalories/childScreens/EditCaloriesManually';
import SearchProfile from '../screens/SearchProfile';
import MessageScreen from '../screens/MessageScreen';
import ChatScreen from '../screens/chatScreen';
import NotificationScreen from '../screens/NotificationScreen';

// Custom exercise screens
import FatLoseProgram from '../screens/CustomWorkOut/FatLoseProgram';
import CustomExercise from '../screens/CustomWorkOut/CustomExercise';
import AddExercise from '../screens/CustomWorkOut/AddExercise';
import SettingScreen from '../screens/SettingScreen';
import HomeScreen from '../screens/HomeScreen';
import MealRegulator from '../screens/MealRegulator';
import SelectBrand from '../screens/SelectBrand';
import SurveyScreenMeal from '../screens/SurveyScreenMeal';
import Alexa from '../screens/Alexa';

import LogFoods from '../screens/LogFoods';
import { modules } from '@modules';

import SubscriptionScreen from '../screens/Subscription';
const { home, profileTab, feed, nutrition, exercise } = Images;

// const Chat = modules[0].value.navigator;
const mainStack = createStackNavigator();
const Tab = createBottomTabNavigator();

// @refresh reset
const BottomNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Feed"
      screenOptions={({ route }) => ({
        tabBarStyle: {
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 0.34,
          shadowRadius: 6.27,

          elevation: 10,
          shadowColor: 'black',
          backgroundColor: 'white',
          height: Platform.OS === 'ios' ? hp('12%') : hp('10%'),
        },
        tabBarButton: ['Home', 'Profile', 'Feed', 'Custom', 'FatLose'].includes(route.name)
          ? undefined
          : () => {
              return null;
            },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: ({ focused }) => (
            <View style={styles.textContainer}>
              <Text style={styles.text}>Home</Text>
              <View style={[styles.bottom, { borderBottomColor: focused ? '#0460BB' : 'white' }]} />
            </View>
          ),
          tabBarIcon: () => (
            <View style={styles.tabIcon}>
              <Image source={home} style={styles.iconStyle1} />
            </View>
          ),
          header: () => null,
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: ({ focused }) => (
            <View style={styles.textContainer}>
              <Text style={styles.text}>Profile</Text>
              <View style={[styles.bottom, { borderBottomColor: focused ? '#0460BB' : 'white' }]} />
            </View>
          ),
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabIcon}>
              <Image source={profileTab} style={styles.image1} />
            </View>
          ),
          header: () => null,
        }}
      />

      <Tab.Screen
        name="Feed"
        component={Feeds}
        options={{
          tabBarLabel: ({ focused }) => (
            <View style={styles.textContainer}>
              <Text style={styles.text}>Feed</Text>
              <View style={[styles.bottom, { borderBottomColor: focused ? '#0460BB' : 'white' }]} />
            </View>
          ),
          tabBarIcon: () => (
            <View style={styles.tabIcon}>
              <Image source={feed} style={styles.iconStyle1} />
            </View>
          ),
          header: () => null,
        }}
      />

      <Tab.Screen
        name="Custom"
        component={CustomCalories}
        options={{
          tabBarLabel: ({ focused }) => (
            <View style={styles.textContainer}>
              <Text style={styles.text}>Nurition</Text>
              <View style={[styles.bottom, { borderBottomColor: focused ? '#0460BB' : 'white' }]} />
            </View>
          ),
          tabBarIcon: () => (
            <View style={styles.tabIcon}>
              <Image source={nutrition} style={styles.image2} />
            </View>
          ),
          header: () => null,
        }}
      />

      <Tab.Screen
        name="FatLose"
        component={FatLoseProgram}
        options={{
          tabBarLabel: ({ focused }) => (
            <View style={styles.textContainer}>
              <Text style={styles.text}>Exercise</Text>
              <View style={[styles.bottom, { borderBottomColor: focused ? '#0460BB' : 'white' }]} />
            </View>
          ),
          tabBarIcon: () => (
            <View style={styles.tabIcon}>
              <Image source={exercise} style={styles.imageStyle} />
            </View>
          ),
          header: () => null,
        }}
      />

      <Tab.Screen name="HomeScreen" component={HomeScreen} options={{ header: () => null }} />
      <Tab.Screen name="ProfileScreen" component={ProfileScreen} options={{ header: () => null }} />
      <Tab.Screen name="Feeds" component={Feeds} options={{ header: () => null }} />
      <Tab.Screen
        name="CustomCalories"
        component={CustomCalories}
        options={{ header: () => null }}
      />
      <Tab.Screen
        name="FatLoseProgram"
        component={FatLoseProgram}
        options={{ header: () => null }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  textContainer: { justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 12, color: '#0460BB' },
  bottom: { borderBottomWidth: 5, marginTop: 10, width: 33, borderRadius: 10 },
  tabIcon: { marginTop: Platform.OS === 'ios' ? 5 : 18 },
  imageStyle: { width: 26, height: 13, resizeMode: 'contain' },
  iconStyle1: { width: 20, height: 19, resizeMode: 'contain' },
  image1: { width: 20, height: 21, resizeMode: 'contain' },
  image2: { width: 20, height: 21, resizeMode: 'contain' },
});

const MainNavigator = () => (
  <mainStack.Navigator
    screenOptions={{ headerShown: false, animationEnabled: false }}
    initialRouteName="BottomBar"
  >
    <mainStack.Screen name="BottomBar" component={BottomNavigator} />
    <mainStack.Screen name="AddPost" component={AddPost} />
    <mainStack.Screen name="ViewPost" component={ViewPost} />
    <mainStack.Screen name="Subscription" component={Subscription} />
    <mainStack.Screen name="CreditCard" component={CreditCard} />
    <mainStack.Screen name="ProgramScreen" component={ProgramScreen} />
    {/* <mainStack.Screen name="Feeds" component={Feeds} /> */}
    <mainStack.Screen name="ExerciseScreen" component={ExerciseScreen} />
    <mainStack.Screen name="EditProfile" component={EditProfile} />
    {/* <mainStack.Screen name="ProfileScreen" component={ProfileScreen} /> */}
    {/* <mainStack.Screen name="CustomCalories" component={CustomCalories} /> */}
    <mainStack.Screen name="SearchProfile" component={SearchProfile} />
    <mainStack.Screen name="MessageScreen" component={MessageScreen} />
    <mainStack.Screen name="ChatScreen" component={ChatScreen} />
    <mainStack.Screen name="NotificationScreen" component={NotificationScreen} />

    {/* <mainStack.Screen name="FatLoseProgram" component={FatLoseProgram} /> */}
    <mainStack.Screen name="CustomExercise" component={CustomExercise} />
    <mainStack.Screen name="AddExercise" component={AddExercise} />
    <mainStack.Screen name="SettingScreen" component={SettingScreen} />
    <mainStack.Screen name="EditCustomCal" component={EditCustomCal} />
    <mainStack.Screen name="EditCaloriesManually" component={EditCaloriesManually} />
    <mainStack.Screen name="SurveyScreenMeal" component={SurveyScreenMeal} />
    <mainStack.Screen name="MealRegulator" component={MealRegulator} />
    <mainStack.Screen name="SelectBrand" component={SelectBrand} />
    <mainStack.Screen name="LogFoods" component={LogFoods} />
    <mainStack.Screen name="Alexa" component={Alexa} />
    <mainStack.Screen name="SubscriptionScreen" component={SubscriptionScreen} />
    {/* <mainStack.Screen name="Chat" component={Chat} /> */}
  </mainStack.Navigator>
);

export default MainNavigator;
