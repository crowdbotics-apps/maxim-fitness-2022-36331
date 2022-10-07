import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// screens
import SignUp from 'src/screens/SignUp'
import SignIn from '../screens/SignIn';
import Subscription from '../screens/Subscription';
import CreditCard from '../screens/CreditCard';

const authStack = createStackNavigator()

const AuthStackScreen = () => (
  <authStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="SignIn">
    <authStack.Screen name="SignIn" component={SignIn} />
    <authStack.Screen name="SignUp" component={SignUp} />
    <authStack.Screen name="Subscription" component={Subscription} />
    <authStack.Screen name="CreditCard" component={CreditCard} />
  </authStack.Navigator>
)

export default AuthStackScreen
