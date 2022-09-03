import React from "react"
import { createStackNavigator } from "@react-navigation/stack"
// import BottomTabNavigator from '@/Navigators/Main'

// screens
import Comment from 'src/screens/comment'
import Home from "src/screens/Home"
import SignUp from 'src/screens/SignUp'
import SignIn from "../screens/SignIn"

const authStack = createStackNavigator()

const AuthStackScreen = () => (
  <authStack.Navigator
    screenOptions={{ headerShown: false }}
    initialRouteName="SignIn"
  >
    <authStack.Screen name="SignIn" component={SignIn} />
    <authStack.Screen name="SignUp" component={SignUp} />

    {/* <authStack.Screen name="Register" component={Register} /> */}



  </authStack.Navigator>
)

export default AuthStackScreen
