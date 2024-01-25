import React, { useEffect, useState } from "react"
import { DefaultTheme, NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
// import { createDrawerNavigator } from "@react-navigation/drawer"
import { connect } from "react-redux"
import { navigationRef } from "./NavigationService"
import { DEEP_LINKING_API_URL } from "../config/app"
import messaging from "@react-native-firebase/messaging"

import AuthStackScreen from "./AuthScreens"
import MainNavigator from "./Main"
import QuestionStackScreen from "./QuestionScreens"
import { profileData } from "../ScreenRedux/profileRedux"
import { navigate } from "../navigation/NavigationService"
import { routeData } from "../ScreenRedux/profileRedux"

const authStack = createStackNavigator()
const mainStack = createStackNavigator()
const questionStack = createStackNavigator()
// const Drawer = createDrawerNavigator()

const Navigation = props => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    if (remoteMessage?.data?.post_id) {
      navigate("ViewPost", remoteMessage?.data?.post_id)
    } else {
      if (remoteMessage?.data?.sender_detail) {
        const newData = {
          follow: true,
          user: remoteMessage?.data?.sender_detail
        }.routeData(newData)
        navigate("ProfileScreen", {
          item: newData,
          backScreenName: "NotificationScreen"
        })
      }
    }
  })

  const { renderTab, profile, accessToken } = props

  const config = {
    screens: {
      MainStack: {
        screens: {
          ViewPost: {
            path: "post/:id"
          }
        }
      }
    }
  }

  const LinkingConfig = {
    prefixes: ["maximfitness://", DEEP_LINKING_API_URL],
    config: config
  }

  return (
    <NavigationContainer
      linking={LinkingConfig}
      ref={navigationRef}
      theme={{
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors
        }
      }}
    >
      <authStack.Navigator screenOptions={{ headerShown: false }}>
        {accessToken ? (
          profile?.is_survey ? (
            <mainStack.Screen name="MainStack" component={MainNavigator} />
          ) : (
            <questionStack.Screen
              name="QuestionStack"
              component={QuestionStackScreen}
            />
          )
        ) : (
          <authStack.Screen name="AuthStack" component={AuthStackScreen} />
          //<questionStack.Screen name="QuestionStack" component={QuestionStackScreen} />
        )}
      </authStack.Navigator>
    </NavigationContainer>
  )
}

const mapStateToProps = state => ({
  accessToken: state.login.accessToken,
  profile: state.login.userDetail,
  renderTab: state.questionReducer.renderTab
})

const mapDispatchToProps = dispatch => ({
  profileData: () => dispatch(profileData()),
  routeData: data => dispatch(routeData(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(Navigation)
