import React from "react"
import { createStackNavigator } from "@react-navigation/stack"

// screens
import SignUp from "src/screens/SignUp"
import SignIn from "../screens/SignIn"
import Subscription from "../screens/Subscription"
import CreditCard from "../screens/CreditCard"
import SetForgetPassword from "../screens/SetForgetPassword"
import ForgetPassWordScreen from "../screens/ForgetPassWordScreen"
import ApplePay from "../screens/Subscription/ApplePay"


const authStack = createStackNavigator()

const AuthStackScreen = () => (
  <authStack.Navigator
    screenOptions={{ headerShown: false }}
    initialRouteName="SignIn"
  >
    <authStack.Screen name="SignIn" component={SignIn} />
    <authStack.Screen name="SignUp" component={SignUp} />
    <authStack.Screen name="Subscription" component={Subscription} />
    <authStack.Screen
      name="ForgetPassWordScreen"
      component={ForgetPassWordScreen}
    />
    <authStack.Screen name="SetForgetPassword" component={SetForgetPassword} />
    <authStack.Screen name="CreditCard" component={CreditCard} />
    <authStack.Screen name="ApplePay" component={ApplePay} />
    
  </authStack.Navigator>
)

export default AuthStackScreen
