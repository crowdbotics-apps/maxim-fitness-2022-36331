import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

//Screens
import Birthday from '../screens/Questions/Birthday';
import Gender from '../screens/Questions/Gender';
import ExerciseLevel from '../screens/Questions/ExerciseLevel';
import ActivityLevel from '../screens/Questions/ActivityLevel';
import MeasurementUnit from '../screens/Questions/MeasurementUnit';
import FeetHeight from '../screens/Questions/FeetHeight';
import WeightPounds from '../screens/Questions/WeightPounds';
import FitnessGoal from '../screens/Questions/FitnessGoal';
import HeightCentimeters from '../screens/Questions/HeightCentimeters';
import WeightKg from '../screens/Questions/WeightKg';
import TrainingDays from '../screens/Questions/TrainingDays';
import MealPreference from '../screens/Questions/MealPreference';
import MealTime from '../screens/Questions/MealTime';
import NutritionUnderstanding from '../screens/Questions/NutritionUnderstanding';
import ThingsToKnow from '../screens/Questions/ThingsToKnow';
const questionStack = createStackNavigator();
import SubscriptionScreen from "../screens/Subscription"
import CreditCard from '../screens/CreditCard';
import PaymentScreen from '../screens/CreditCard/PaymentScreen';
const QuestionStackScreen = () => (
  <questionStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="SubscriptionScreen">
    <questionStack.Screen
      name="SubscriptionScreen"
      component={SubscriptionScreen}
      options={{ animationEnabled: false }}
    />
    <questionStack.Screen name="PaymentScreen" component={PaymentScreen} />

    <questionStack.Screen
      name="CreditCard"
      component={CreditCard}
      options={{ animationEnabled: false }}
    />
    <questionStack.Screen
      name="Birthday"
      component={Birthday}
      options={{ animationEnabled: false }}
    />
    <questionStack.Screen name="Gender" component={Gender} options={{ animationEnabled: false }} />
    <questionStack.Screen
      name="ExerciseLevel"
      component={ExerciseLevel}
      options={{ animationEnabled: false }}
    />
    <questionStack.Screen
      name="ActivityLevel"
      component={ActivityLevel}
      options={{ animationEnabled: false }}
    />
    <questionStack.Screen
      name="MeasurementUnit"
      component={MeasurementUnit}
      options={{ animationEnabled: false }}
    />
    <questionStack.Screen
      name="FeetHeight"
      component={FeetHeight}
      options={{ animationEnabled: false }}
    />
    <questionStack.Screen
      name="WeightPounds"
      component={WeightPounds}
      options={{ animationEnabled: false }}
    />
    <questionStack.Screen
      name="FitnessGoal"
      component={FitnessGoal}
      options={{ animationEnabled: false }}
    />
    <questionStack.Screen
      name="HeightCentimeters"
      component={HeightCentimeters}
      options={{ animationEnabled: false }}
    />
    <questionStack.Screen
      name="WeightKg"
      component={WeightKg}
      options={{ animationEnabled: false }}
    />
    <questionStack.Screen
      name="TrainingDays"
      component={TrainingDays}
      options={{ animationEnabled: false }}
    />
    <questionStack.Screen
      name="MealPreference"
      component={MealPreference}
      options={{ animationEnabled: false }}
    />
    <questionStack.Screen
      name="MealTime"
      component={MealTime}
      options={{ animationEnabled: false }}
    />
    <questionStack.Screen
      name="NutritionUnderstanding"
      component={NutritionUnderstanding}
      options={{ animationEnabled: false }}
    />
    <questionStack.Screen
      name="ThingsToKnow"
      options={{ animationEnabled: false }}
      component={ThingsToKnow}
    />
  </questionStack.Navigator>
);

export default QuestionStackScreen;
