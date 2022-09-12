import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

//Screens
import Birthday from '../screens/Questions/Birthday';
import Gender from '../screens/Questions/Gender';
const questionStack = createStackNavigator();

const QuestionStackScreen = () => (
  <questionStack.Navigator screenOptions={{headerShown: false}} initialRouteName="Gender">
    <questionStack.Screen name="Birthday" component={Birthday} />
    <questionStack.Screen name="Gender" component={Gender} />
  </questionStack.Navigator>
);

export default QuestionStackScreen;
