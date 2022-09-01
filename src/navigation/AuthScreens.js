import React from "react"
import { createStackNavigator } from "@react-navigation/stack"
// import BottomTabNavigator from '@/Navigators/Main'

// screens
import Comment from 'src/screens/comment'
import Home from "src/screens/Home"

const authStack = createStackNavigator()

const AuthStackScreen = () => (
  <authStack.Navigator
    screenOptions={{ headerShown: false }}
    initialRouteName="Home"
  >
    <authStack.Screen name="Home" component={Home} />
    {/* <authStack.Screen name="Register" component={Register} /> */}



  </authStack.Navigator>
)

export default AuthStackScreen
