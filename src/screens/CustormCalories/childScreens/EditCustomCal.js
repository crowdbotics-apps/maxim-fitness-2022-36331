import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from '../../../components';
import { Layout, Gutters, Colors } from '../../../theme';
import Slider from "react-native-slider";


const EditCustomCal = (props) => {
  const [value, setValue] = useState(0.5)
  const [value1, setValue1] = useState(0.4)
  const [value2, setValue2] = useState(0.2)

  const {
    row,
    fill,
    center,
    alignItemsStart,
    alignItemsCenter,
    justifyContentStart,
    justifyContentBetween,
  } = Layout;
  const {
    regularHPadding,
    smallVPadding,
    regularHMargin,
    regularVMargin,
  } = Gutters;
  const fontSize15TextCenter = { fontSize: 14, textAlign: 'center', flexWrap: 'wrap' };

  return (
    <View style={styles.mainContainer}>
      <ScrollView contentContainerStyle={Layout.fillGrow}>
        <View style={[regularHPadding, alignItemsCenter, regularVMargin]}>
          <Text text="Done" style={{ alignSelf: 'flex-end', paddingHorizontal: 20, paddingVertical: 5, backgroundColor: Colors.alto, borderRadius: 10 }} />
          <Text text="Manually edit the amount of calories to consume" style={{ alignSelf: 'flex-start', fontSize: 16, marginVertical: 10 }} />
        </View>
        <View style={[regularHMargin, regularVMargin]}>
          <Text color="commonCol" text="Calories" bold smallTitle />
          <View style={[row, justifyContentStart, alignItemsStart, regularVMargin]}>
            <Text text={'2,045'} color='nonary' bold large underlined />
            <Text text={`Calories per day`} style={[fontSize15TextCenter, Gutters.regularHMargin]} />
          </View>
        </View>

        <View style={[row, regularHMargin, justifyContentBetween, smallVPadding]}>
          <View>
            <Text text="Protein" bold />
            <View style={[row, center, Gutters.tinyTMargin, { width: 50, height: 25, backgroundColor: Colors.alto }]}>
              <Text text={`40/%`} style={fontSize15TextCenter} bold />
            </View>
          </View>
          <View>
            <Slider
              style={{ width: 260, height: 30 }}
              value={value}
              onValueChange={val => setValue(val)}
              thumbStyle={{ width: 30, height: 30, borderRadius: 100, backgroundColor: Colors.secondary, borderWidth: 1, borderColor: Colors.azureradiance }}
              trackStyle={{ width: 260, height: 20, borderRadius: 10, backgroundColor: 'gray' }}
              minimumTrackTintColor={'#45a1f8'}
            />
            <View style={[row, regularHMargin, Gutters.smallTMargin]}>
              <View style={[row, fill, justifyContentStart, alignItemsStart]}>
                <Text text={(value * 100).toFixed(2)} color='nonary' bold medium />
                <Text text={`calories`} style={[fontSize15TextCenter, Gutters.tinyLMargin]} />
              </View>
              <View style={[row, fill, justifyContentStart, alignItemsStart, Gutters.regularLMargin]}>
                <Text text={((value / 7) * 100).toFixed(2)} color='nonary' bold medium />
                <Text text={`g per day`} style={[fontSize15TextCenter, Gutters.tinyLMargin]} />
              </View>
            </View>
          </View>
        </View>

        <View style={[row, regularHMargin, justifyContentBetween, smallVPadding]}>
          <View>
            <Text text="Carbs" bold />
            <View style={[row, center, Gutters.tinyTMargin, { width: 50, height: 25, backgroundColor: Colors.alto }]}>
              <Text text={`40/%`} style={fontSize15TextCenter} bold />
            </View>
          </View>
          <View>
            <Slider
              style={{ width: 250, height: 30 }}
              value={value1}
              onValueChange={val => setValue1(val)}
              thumbStyle={{ width: 30, height: 30, borderRadius: 100, backgroundColor: Colors.secondary, borderWidth: 1, borderColor: '#f0bc40' }}
              trackStyle={{ width: 250, height: 20, borderRadius: 10, backgroundColor: 'gray' }}
              minimumTrackTintColor={'#f0bc40'}
            />
            <View style={[row, regularHMargin, Gutters.smallTMargin]}>
              <View style={[row, justifyContentStart, alignItemsStart]}>
                <Text text={(value1 * 100).toFixed(2)} style={{ color: '#f0bc40' }} bold medium />
                <Text text={`calories`} style={[fontSize15TextCenter, Gutters.tinyLMargin]} />
              </View>
              <View style={[row, justifyContentStart, alignItemsStart, Gutters.regularLMargin]}>
                <Text text={((value1 / 7) * 100).toFixed(2)} style={{ color: '#f0bc40' }} bold medium />
                <Text text={`g per day`} style={[fontSize15TextCenter, Gutters.tinyLMargin]} />
              </View>
            </View>
          </View>
        </View>

        <View style={[row, regularHMargin, justifyContentBetween, smallVPadding]}>
          <View>
            <Text text="Fats" bold />
            <View style={[row, center, Gutters.smallTMargin, { width: 50, height: 25, backgroundColor: Colors.alto }]}>
              <Text text={`20/%`} style={fontSize15TextCenter} bold />
            </View>
          </View>
          <View>
            <Slider
              style={{ width: 250, height: 30 }}
              value={value2}
              onValueChange={val => setValue2(val)}
              thumbStyle={{ width: 30, height: 30, borderRadius: 100, backgroundColor: Colors.secondary, borderWidth: 1, borderColor: '#ed6d57' }}
              trackStyle={{ width: 250, height: 20, borderRadius: 10, backgroundColor: 'gray' }}
              minimumTrackTintColor={'#ed6d57'}
            />
            <View style={[row, regularHMargin, Gutters.smallTMargin]}>
              <View style={[row, justifyContentStart, alignItemsStart]}>
                <Text text={(value2 * 100).toFixed(2)} style={{ color: '#ed6d57' }} bold medium />
                <Text text={`calories`} style={[fontSize15TextCenter, Gutters.tinyLMargin]} />
              </View>
              <View style={[row, justifyContentStart, alignItemsStart, Gutters.regularLMargin]}>
                <Text text={((value2 / 7) * 100).toFixed(2)} style={{ color: '#ed6d57' }} bold medium />
                <Text text={`g per day`} style={[fontSize15TextCenter, Gutters.tinyLMargin]} />
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity onPress={() => props.navigation.navigate('EditCaloriesManually')} style={[fill, regularHPadding, justifyContentBetween, styles.cardStyle]}>
          <View style={row}>
            <Text text="Based on" style={{ fontSize: 18, opacity: 0.7, textAlign: 'center', color: 'black', marginTop: 10 }} bold />
            <Text text=" 6 " style={{ fontSize: 30, opacity: 0.7, textAlign: 'center', color: Colors.primary }} bold />
            <Text text={"meals per day, aim for the "} style={{ fontSize: 18, opacity: 0.7, textAlign: 'center', color: 'black', marginTop: 10 }} bold />
          </View>
          <Text text={"Following values in each meals"} style={{ fontSize: 18, opacity: 0.7, textAlign: 'center', color: 'black', textAlign: 'left' }} bold />
          <View style={Gutters.regularTMargin}>
            <View style={[row, alignItemsCenter, Gutters.tinyTMargin]}>
              <Text text="Protein: " style={{ fontSize: 18, opacity: 0.7, textAlign: 'center', color: 'black' }} />
              <Text text=" 34 " style={{ fontSize: 20, opacity: 0.7, textAlign: 'center', color: Colors.primary }} bold />
              <Text text={"grams per meal"} style={{ fontSize: 18, opacity: 0.7, textAlign: 'center', color: 'black' }} />
            </View>
            <View style={[row, alignItemsCenter]}>
              <Text text="Carbs: " style={{ fontSize: 18, opacity: 0.7, textAlign: 'center', color: 'black' }} />
              <Text text=" 34 " style={{ fontSize: 20, opacity: 0.7, textAlign: 'center', color: '#f0bc40' }} bold />
              <Text text={"grams per meal"} style={{ fontSize: 18, opacity: 0.7, textAlign: 'center', color: 'black' }} />
            </View>
            <View style={[row, alignItemsCenter, Gutters.tinyTMargin]}>
              <Text text="Fats: " style={{ fontSize: 18, opacity: 0.7, textAlign: 'center', color: 'black' }} />
              <Text text=" 34 " style={{ fontSize: 20, opacity: 0.7, textAlign: 'center', color: "#ed6d57" }} bold />
              <Text text={"grams per meal"} style={{ fontSize: 18, opacity: 0.7, textAlign: 'center', color: 'black' }} />
            </View>
          </View>
          <View style={[fill, row, Layout.alignItemsEnd]}>
            <Text
              style={{ color: 'gray' }}
              text="*for fat loss, keep carb rich meals structured before and directly following your workout"
            />
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  mainContainer: { flex: 1 },

  cardStyle: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 20,
    marginTop: 10,
    borderRadius: 8,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.34,
    shadowRadius: 0.27,

    elevation: 15,
  },

  thumb: { width: 30, height: 30, borderRadius: 100, backgroundColor: Colors.secondary, borderWidth: 1, borderColor: Colors.azureradiance },
  track: { width: 200, height: 20, borderRadius: 10, backgroundColor: Colors.alto }
});

export default EditCustomCal;
