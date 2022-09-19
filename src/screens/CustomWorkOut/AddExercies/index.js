import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Image,
  Keyboard,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import {
  Text,
  BottomSheet,
 Button,
} from '../../../components';

import { Layout, Global, Gutters, Images, Colors } from '../../../theme';

import { connect } from 'react-redux';

import { TextInput } from 'react-native-gesture-handler';

const data = [
  { item: 'Super Set' },
  { item: 'Glant Set' },
  { item: 'Drop Set' },
  { item: 'Triple Set' },
];
const AddExercies = props => {
const {
  navigation: { goBack }
}  = props;

  const {
    row,
    fill,
    center,
    alignItemsCenter,
    justifyContentBetween,
  } = Layout;
  let refDescription = useRef('');
  const {
    workout1,
    workout2,
    workout3,
    foodImage,
    iconI,
    circleClose,
  } = Images;
  const Workout = [
    { Img: workout1 },
    { Img: workout2 },
    { Img: workout1 },
    { Img: workout3 },
    { Img: workout3 },
    { Img: workout3 },
  ];
  const dammyData = [
    {
      text: 'Add the approite weight for the given rep range',
    },
    {
      text: 'Add the approite weight for the given rep range',
    },
    {
      text: 'Add the approite weight for the given rep range',
    },
    {
      text: 'Add the approite weight for the given rep range',
    },
    {
      text: 'Add the approite weight for the given rep range',
    },
  ];
  return (
    <SafeAreaView style={[fill, { backgroundColor: 'white' }]}>
      <ScrollView>
        <View style={{ marginHorizontal: 20 }}>
          <View style={[row, alignItemsCenter, { marginTop: 20, width: '100%' }]}>
            <TouchableOpacity onPress={() => goBack()}>
              <Image source={Images.back2} style={{ width: 30, height: 25 }} />
            </TouchableOpacity>
            <View style={[center, fill, {}]}>
              <TextInput style={[center, { padding: 0 }]} placeholder="search,,," />
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: 'gray',
                  width: 180,
                  fontSize: 25,
                }}
              ></View>
            </View>
          </View>
          <View style={[{ marginTop: 20 }, row]}>
            <ScrollView horizontal={true}>
              {data.map(set => {
                return (
                  <View style={[styles.pillStyle, center]}>
                    <Text text={set.item} style={styles.pillText} />
                  </View>
                );
              })}
            </ScrollView>
          </View>
          <View style={[{ marginTop: 20 }]}>
            <Text text="Muscle Group" style={styles.heading} />
            <ScrollView horizontal={true}>
              <View style={[row, { marginTop: 10, marginLeft: -10 }]}>
                {Workout.map(item => {
                  return <Image source={item.Img} style={{ width: 80, height: 80 }} />;
                })}
              </View>
            </ScrollView>
          </View>
          <View style={{ marginTop: 25 }}>
            <Text text="Poupular Exercies" style={styles.heading} />
          </View>
        </View>
        <View style={styles.cardView}>
          <View style={[row, justifyContentBetween, { position: 'relative' }]}>
            <View style={[center, styles.cardImg]}>
              <Image source={foodImage} style={{ width: 80, height: 40 }} />
            </View>
            <View style={[center, { marginRight: 50 }]}>
              <Text text="Poupular Exercies" style={styles.heading1} />
            </View>
            <View style={[center, {}]}>
              <Image source={iconI} style={{ width: 20, height: 20, marginRight: 5 }} />
            </View>
            <View style={[styles.circle, center]}>
              <Text style={styles.circleText} text={'1'} />
            </View>
          </View>
        </View>
        <View style={[styles.cardView, { backgroundColor: '#e5e5e5' }]}>
          <View style={[row, justifyContentBetween, { position: 'relative' }]}>
            <View style={[center, styles.cardImg]}>
              <Image source={foodImage} style={{ width: 80, height: 40 }} />
            </View>
            <View style={[center, { marginRight: 50 }]}>
              <Text text="Poupular Exercies" style={styles.heading1} />
            </View>
            <View style={[center, {}]}>
              <Image source={iconI} style={{ width: 20, height: 20, marginRight: 5 }} />
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={{ alignSelf: 'center' }}>
        <Button
          text={'Add Exercies'}
          textStyle={[{ color: 'white' }]}
          style={styles.btn}
          onPress={() => refDescription.current.open()}
        />
      </View>
      <View style={[row, { alignSelf: 'center', marginTop: 20, marginBottom: 10 }]}>
        <Text text="Watch This" style={[styles.heading1, { color: Colors.brightturquoise }]}></Text>
        <Text text=" to create your workout" style={[styles.heading1]} />
      </View>

      {/* bottom */}
      <BottomSheet
        reff={refDescription}
        h={700}
        Iconbg={Colors.athensgray}
        bg={Colors.athensgray}
        customStyles={{
          draggableIcon: {
            backgroundColor: 'red',
          },
        }}
      >
        <KeyboardAvoidingView
          enabled
          behavior="padding"
          style={[{ width: '100%', backgroundColor: Colors.athensgray }]}
        >
          <View style={{ alignSelf: 'flex-end', marginRight: 10 }}>
            <Image source={circleClose} style={{ width: 23, height: 23 }} />
          </View>
          <View style={{ alignSelf: 'center' }}>
            <Text
              text="Barbell bench press"
              style={[
                { fontSize: 20, lineHeight: 25, color: 'black', fontWeight: 'bold', marginTop: 10 },
              ]}
            ></Text>
          </View>
          <View
            style={[
              {
                backgroundColor: 'white',
                marginTop: 20,
                height: 200,
                marginHorizontal: 10,
                borderRadius: 10,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 5,
                },
                shadowOpacity: 0.34,
                shadowRadius: 6.27,

                elevation: 5,
                marginHorizontal: 8,
              },
              center,
            ]}
          >
            <Image source={foodImage} style={{ width: 200, height: 140 }} />
          </View>
          <ScrollView style={{ marginTop: 40 }}>
            {dammyData.map((item, i) => {
              return (
                <View
                  style={{
                    backgroundColor: 'white',
                    height: 70,

                    marginHorizontal: 8,
                    borderRadius: 15,
                    paddingLeft: 30,
                    flexDirection: 'row',
                    marginBottom: 20,
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 5,
                    },
                    shadowOpacity: 0.34,
                    shadowRadius: 6.27,

                    elevation: 5,
                    marginHorizontal: 8,
                  }}
                >
                  <View>
                    <View
                      style={{
                        backgroundColor: Colors.athensgray,
                        width: 30,
                        height: 30,
                        borderRadius: 5,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: 8,
                      }}
                    >
                      <Text
                        text={i + 1}
                        style={[
                          {
                            fontSize: 20,
                            lineHeight: 25,
                            color: 'black',
                            fontWeight: 'bold',
                          },
                        ]}
                      ></Text>
                    </View>
                  </View>
                  <View style={{ justifyContent: 'center', marginLeft: 30, marginHorizontal: 40 }}>
                    <Text
                      text={item.text}
                      style={[{ fontSize: 14, lineHeight: 25, color: 'black', fontWeight: 'bold' }]}
                    />
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </KeyboardAvoidingView>
        <View style={{ position: 'absolute', bottom: 0, alignSelf: 'center' }}>
          <Button
            text={'Add Exercies'}
            textStyle={[{ color: 'white' }]}
            style={{
              backgroundColor: Colors.brightturquoisesecond,
              borderRadius: 10,
              paddingHorizontal: 20,
              height: 45,
              marginBottom: 10,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 5,
              },
              shadowOpacity: 0.34,
              shadowRadius: 6.27,

              elevation: 5,
              marginHorizontal: 8,
            }}
          />
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  btn:{ backgroundColor: Colors.brightturquoise,
    borderRadius: 40,
    paddingHorizontal: 30,
    height: 45,
    marginTop: 10,},
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    lineHeight: 40,
    marginTop: 10,
    opacity: 0.8,
  },
  pillStyle: {
    borderWidth: 1,
    height: 25,
    width: 85,
    borderRadius: 20,
    borderColor: Colors.primary,
    marginRight: 10,
  },
  pillText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    opacity: 0.7,
  },
  circle: {
    position: 'absolute',
    alignSelf: 'center',
    left: '46%',
    backgroundColor: '#e5e5e5',
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  circleText: { fontSize: 25, fontWeight: 'bold', lineHeight: 40, color: 'white' },
  heading: { fontSize: 16, lineHeight: 20, fontWeight: '700', opacity: 0.5 },
  heading1: { fontSize: 16, lineHeight: 20, fontWeight: '700' },
  smallText: { fontSize: 15, lineHeight: 18 },
  IconStyle: { color: Colors.primary, fontSize: 15, marginLeft: 3 },
  CalenderText: { fontSize: 15, lineHeight: 18, color: 'gray' },
  headind2: {
    fontSize: 25,
    lineHeight: 30,
    color: 'black',
    marginTop: 25,
    fontWeight: 'bold',
    opacity: 0.6,
  },
  cardView: {
    padding: 13,
    marginTop: 15,
    borderRadius: 10,
    backgroundColor: Colors.brightturquoise,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 5,
    marginHorizontal: 8,
  },
  cardImg: { backgroundColor: 'white', width: 90, height: 60, borderRadius: 10 },
 
  
  

});
export default AddExercies;
