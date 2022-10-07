import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import * as Progress from 'react-native-progress';
import { Text } from '../../../components';
import { Layout, Gutters, Colors } from '../../../theme';

const TabThree = ({ setShowModalHistory, navigation }) => {
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
      <View style={[row, regularBMargin, regularHMargin, justifyContentBetween, alignItemsCenter]}>
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
      <View style={[row, regularHMargin, regularBMargin, justifyContentBetween, alignItemsCenter]}>
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
      <View style={[row, regularHMargin, regularBMargin, justifyContentBetween, alignItemsCenter]}>
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
      <View style={[fill, regularHPadding, styles.cardStyle]}>
        <View>
          <Text text="Diet Type" style={[{ fontSize: 20, opacity: 0.7 }]} bold />
          <Text text="Standard 40:40:20" color="nonary" style={smallVPadding} />
        </View>
        <View style={[fill, row, justifyContentBetween, alignItemsCenter, regularVMargin]}>
          <Text
            text="Meal per Day"
            style={{ fontSize: 20, opacity: 0.7, textAlign: 'center', color: 'black' }}
            bold
          />
          <Text text="Edit" color="nonary" onPress={() => navigation.navigate('EditCustomCal')} />
        </View>
        <Text text={`${6} meals`} color="nonary" />
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
  cardStyle: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    paddingVertical: 15,
    marginBottom: 20,
    borderRadius: 20,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.34,
    shadowRadius: 0.27,

    elevation: 15,
  }
});

export default TabThree;
