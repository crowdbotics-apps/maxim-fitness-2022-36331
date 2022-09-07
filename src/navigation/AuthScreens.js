import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

// screens
import SignUp from 'src/screens/SignUp'
import SignIn from '../screens/SignIn';

const authStack = createStackNavigator()

const AuthStackScreen = () => (
  <authStack.Navigator screenOptions={{headerShown: false}} initialRouteName="SignIn">
    <authStack.Screen name="SignIn" component={SignIn} />
    <authStack.Screen name="SignUp" component={SignUp} />
  </authStack.Navigator>
)

export default AuthStackScreen
