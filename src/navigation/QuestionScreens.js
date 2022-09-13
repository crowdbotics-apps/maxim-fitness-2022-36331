import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

//Screens
import Birthday from '../screens/Questions/Birthday';
import Gender from '../screens/Questions/Gender';
import ExerciseLevel from '../screens/Questions/ExerciseLevel';
import ActivityLevel from '../screens/Questions/ActivityLevel';
import MeasurementUnit from '../screens/Questions/MeasurementUnit';
import FeetHeight from '../screens/Questions/FeetHeight';
import WeightPounds from '../screens/Questions/WeightPounds';
import FitnessGoal from '../screens/Questions/fitnessGoal';
import HeightCentimeters from '../screens/Questions/HeightCentimeters';
import WeightKg from '../screens/Questions/WeightKg';
import TrainingDays from '../screens/Questions/trainingDays';
const questionStack = createStackNavigator();

const QuestionStackScreen = () => (
  <questionStack.Navigator screenOptions={{headerShown: false}} initialRouteName="Birthday">
    <questionStack.Screen name="Birthday" component={Birthday} />
    <questionStack.Screen name="Gender" component={Gender} />
    <questionStack.Screen name="ExerciseLevel" component={ExerciseLevel} />
    <questionStack.Screen name="ActivityLevel" component={ActivityLevel} />
    <questionStack.Screen name="MeasurementUnit" component={MeasurementUnit} />
    <questionStack.Screen name="FeetHeight" component={FeetHeight} />
    <questionStack.Screen name="WeightPounds" component={WeightPounds} />
    <questionStack.Screen name="FitnessGoal" component={FitnessGoal} />
    <questionStack.Screen name="HeightCentimeters" component={HeightCentimeters} />
    <questionStack.Screen name="WeightKg" component={WeightKg} />
    <questionStack.Screen name="TrainingDays" component={TrainingDays} />

  </questionStack.Navigator>
);

export default QuestionStackScreen;
