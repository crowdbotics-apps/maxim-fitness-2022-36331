import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import * as Progress from 'react-native-progress';
import { Text } from '../../../components';
import { Layout, Gutters, Colors } from '../../../theme';

const TabThree = ({ setMealModal, consumeCalories, setShowModalHistory, profileData }) => {
  // useEffect(() => {
  //   calculateCalories(consumeCalories);
  //   calculateProtein(consumeCalories);
  //   calculateCarbs(consumeCalories);
  //   calculateFat(consumeCalories);
  // }, []);
  const {
    row,
    fill,
    center,
    positionR,
    positionA,
    alignItemsStart,
    alignItemsCenter,
    justifyContentStart,
    justifyContentBetween,
  } = Layout;
  const {
    small2xHMargin,
    regularHPadding,
    regularVPadding,
    regularBMargin,
    smallVPadding,
    regularHMargin,
    regularVMargin,
    mediumBMargin,
    mediumTMargin,
  } = Gutters;
  const fontSize15TextCenter = { fontSize: 15, textAlign: 'center' };

  // const calculateCalories = conCal => {
  //   const value = conCal[0]?.calories;
  //   const value2 = conCal[0]?.goals_values?.calories;
  //   const data = value / value2;
  //   return data;
  // };
  // const calculateProtein = conCal => {
  //   const value = conCal[0]?.protein;
  //   const value2 = conCal[0]?.goals_values?.protein;
  //   const data = value / value2;
  //   return data;
  // };
  // const calculateCarbs = conCal => {
  //   const value = conCal[0]?.carbs;
  //   const value2 = conCal[0]?.goals_values?.carbs;
  //   const data = value / value2;
  //   return data;
  // };
  // const calculateFat = conCal => {
  //   const value = conCal[0]?.fat;
  //   const value2 = conCal[0]?.goals_values?.fat;
  //   const data = value / value2;
  //   return data;
  // };

  return (
    <>
      <View style={[row, justifyContentBetween, alignItemsCenter, small2xHMargin, smallVPadding]}>
        <Text style={styles.commingSoonWork} text="Nutrition" bold />
        <Text style={styles.commingSoonMore} text="Meal History" onPress={setShowModalHistory} />
      </View>
      <View style={[center, regularHMargin, regularVMargin]}>
        <View style={positionR}>
          <Progress.Circle
            progress={0.75}
            size={200}
            color={'#ea3465'}
            unfilledColor={'#fae0e0'}
            borderWidth={0}
            strokeCap={'round'}
            thickness={18}
          />
        </View>
        <View style={positionA}>
          <Text text="Calories" style={fontSize15TextCenter} />
          <Text
            text={'75'}
            style={{
              fontSize: 35,
              color: 'black',
              fontWeight: 'bold',
              textAlign: 'center',
            }}
            bold
          />
          <Text text={`Goal ${100}`} style={fontSize15TextCenter} />
        </View>
      </View>
      <View
        style={[
          row,
          regularBMargin,
          regularHMargin,
          regularHPadding,
          justifyContentBetween,
          alignItemsCenter,
        ]}
      >
        <View style={alignItemsStart}>
          <Text text="Protein" style={fontSize15TextCenter} />
          <View style={[row, center, smallVPadding]}>
            <Text text={`${10} /`} style={fontSize15TextCenter} bold />
            <Text text={`${30} g`} style={fontSize15TextCenter} />
          </View>
        </View>
        <View style={styles.prteinCarbsFat}>
          <Progress.Bar
            progress={0.25}
            width={Dimensions.get('window').width - 200}
            height={22}
            color={'#45a1f8'}
            unfilledColor={'#d6d5d5'}
            borderWidth={2}
            borderRadius={20}
            style={{ borderColor: 'white' }}
          />
        </View>
      </View>
      <View
        style={[
          row,
          regularHMargin,
          regularBMargin,
          regularHPadding,
          justifyContentBetween,
          alignItemsCenter,
        ]}
      >
        <View style={alignItemsStart}>
          <Text text="Carbohydrates" style={fontSize15TextCenter} />
          <View style={[row, center, smallVPadding]}>
            <Text text={`${15} /`} style={fontSize15TextCenter} bold />
            <Text text={`${30} g`} style={fontSize15TextCenter} />
          </View>
        </View>
        <View style={styles.prteinCarbsFat}>
          <Progress.Bar
            progress={0.5}
            width={Dimensions.get('window').width - 200}
            height={22}
            color={'#f0bc40'}
            unfilledColor={'#d6d5d5'}
            borderWidth={2}
            borderRadius={20}
            style={{ borderColor: 'white' }}
          />
        </View>
      </View>
      <View
        style={[
          row,
          regularHMargin,
          regularBMargin,
          regularHPadding,
          justifyContentBetween,
          alignItemsCenter,
        ]}
      >
        <View style={alignItemsStart}>
          <Text text="Fats" style={fontSize15TextCenter} />
          <View style={[row, center, smallVPadding]}>
            <Text text={`${20} /`} style={fontSize15TextCenter} bold />
            <Text text={`${30} g`} style={fontSize15TextCenter} />
          </View>
        </View>
        <View style={styles.prteinCarbsFat}>
          <Progress.Bar
            progress={0.6}
            width={Dimensions.get('window').width - 200}
            height={22}
            unfilledColor={'#d6d5d5'}
            color={'#ed6d57'}
            borderWidth={2}
            borderRadius={20}
            style={{ borderColor: 'white' }}
          />
        </View>
      </View>
      <View style={[fill, mediumTMargin, alignItemsStart, regularHMargin, justifyContentStart]}>
        <Text text="Diet Type" style={fontSize15TextCenter} bold />
        <Text
          text="Standard 40:40:20"
          color="nonary"
          style={[regularVPadding, fontSize15TextCenter]}
        />
        <Text text="Meal per Day" style={fontSize15TextCenter} bold />
      </View>
      <View
        style={[
          regularHMargin,
          mediumBMargin,
          { flex: 1, flexDirection: 'row', justifyContent: 'space-between' },
        ]}
      >
        <Text text={`${6} meals`} style={[regularVPadding, fontSize15TextCenter]} color="nonary" />
        <Text
          text="Add more"
          style={[regularVPadding, fontSize15TextCenter]}
          // onPress={() => navigation.navigate('SurveyScreenMeal', { mealValue })}
          onPress={setMealModal}
        />
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  commingSoonWork: {
    fontSize: 30,
    color: 'black',
  },
  commingSoonMore: {
    fontSize: 16,
    color: Colors.azureradiance,
  },
  prteinCarbsFat: {
    // width: 200,
    height: 22,
    backgroundColor: '#d6d5d5',
    borderRadius: 20,
    justifyContent: 'center',
  },
});

export default TabThree;
