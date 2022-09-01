import React from "react"
import { View, Image } from "react-native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"

const Tab = createBottomTabNavigator()

import Home from "screens/Home"
import { createStackNavigator } from "@react-navigation/stack"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen"

import { Images } from "src/theme"
const {
  // HomeOn,
  HomeOff,
  AccountOn,
  AccountOff,
  CollabOn,
  CollabOff,
  Camera,
  ExploreOn,
  ExploreOff,
  HomeOn
} = Images

const mainStack = createStackNavigator()

// @refresh reset
const BottomNavigator = props => {
  const {
    route: { state }
  } = props

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarStyle: {backgroundColor:'#242A38',height:hp("9%")}
      }}
    >
      

      <Tab.Screen
        name="EmptyScreen2"
        component={Home}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? ExploreOn : ExploreOff}
              style={{ width: 20, height: 20 }}
            />
          ),
          header: () => null
        }}
      />

      <Tab.Screen
        name="EmptyScreen3"
        component={Home}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? Camera : Camera}
              style={{ width: 44, height: 44 }}
            />
          ),
          header: () => null
        }}
      />

      <Tab.Screen
        name="profileScreens"
        component={Home}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? CollabOn : CollabOff}
              style={{ width: 18, height: 18 }}
            />
          ),
          header: () => null
        }}
      />

      <Tab.Screen
        name="profileScreen"
        component={Home}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) =>
            (
              <Image
              source={focused ? AccountOn : AccountOff}
              style={{ width: 17, height: 20 }}
            />
            ),
          
          // focused ? <HomeOnn /> : <HomeOnn />,
          header: () => null
        }}
      />
    </Tab.Navigator>
  )
}

const MainNavigator = () => (
  <mainStack.Navigator
    screenOptions={{ headerShown: false, animationEnabled: false }}
    initialRouteName="BottomBar"
  >
    <mainStack.Screen name="BottomBar" component={BottomNavigator} />
  </mainStack.Navigator>
)

export default MainNavigator
