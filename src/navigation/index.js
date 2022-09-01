import React from "react"
import {DefaultTheme, NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
// import { createDrawerNavigator } from "@react-navigation/drawer"
import { connect } from "react-redux"
import { navigationRef } from "./NavigationService"

import AuthStackScreen from "./AuthScreens"
import MainNavigator from "./Main"
import { acc } from "react-native-reanimated"

const authStack = createStackNavigator()
const mainStack = createStackNavigator()
// const Drawer = createDrawerNavigator()

const Navigation = props => {
  const accessToken = false
  return (
    <NavigationContainer ref={navigationRef} theme={{
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
      },
    }}>
      <authStack.Navigator screenOptions={{ headerShown: false }}>
        {
        // props.accessToken
       accessToken ? (
          <authStack.Screen name="MainStack" component={MainNavigator} />
        ) : (
          <mainStack.Screen name="AuthStack" component={AuthStackScreen} />
        )}
      </authStack.Navigator>
    </NavigationContainer>
  )
}

const mapStateToProps = state => ({
  // accessToken: state.login.accessToken
})

export default connect(mapStateToProps, null)(Navigation)
