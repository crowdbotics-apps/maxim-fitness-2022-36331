import React, { useEffect, useState } from "react"
import { DefaultTheme, NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
// import { createDrawerNavigator } from "@react-navigation/drawer"
import { connect } from "react-redux"
import { navigationRef } from "./NavigationService"
import { DEEP_LINKING_API_URL } from "../config/app"
import messaging from "@react-native-firebase/messaging"

import AuthStackScreen from "./AuthScreens"
import MainNavigator, { BottomNavigator } from "./Main"
import QuestionStackScreen from "./QuestionScreens"
import { profileData, routeData } from "../ScreenRedux/profileRedux"
import { navigate } from "../navigation/NavigationService"
import { PubNubProvider } from "pubnub-react"
import PubNub from "pubnub"
import { PUBNUB_PUBLISH_KEY, PUBNUB_SUBSCRIBE_KEY } from "@env"

const authStack = createStackNavigator()
const mainStack = createStackNavigator()
const questionStack = createStackNavigator()
// const Drawer = createDrawerNavigator()

const Navigation = props => {
  const { routeData, renderTab, profile, profileData, accessToken } = props
  useEffect(() => {
    profileData()
  }, [])

  messaging().onNotificationOpenedApp(remoteMessage => {
    if (remoteMessage?.data?.post_id) {
      navigate("ViewPost", remoteMessage?.data?.post_id)
    } else {
      if (remoteMessage?.data?.sender_detail) {
        const newData = {
          follow: true,
          user: JSON.parse(remoteMessage?.data?.sender_detail)
        }

        routeData(newData)
        navigate("ProfileScreen", {
          item: newData,
          backScreenName: "Feed"
        })
      }
    }
  })

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

  const pubnub = new PubNub({
    publishKey: PUBNUB_PUBLISH_KEY,
    subscribeKey: PUBNUB_SUBSCRIBE_KEY,
    uuid: `${profile?.id}`
  })

  return (
    <PubNubProvider client={pubnub}>
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
    </PubNubProvider>
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
