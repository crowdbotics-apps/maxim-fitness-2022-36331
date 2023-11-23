import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Image,
  Keyboard,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import { Text, BottomSheet, Button, InputField } from '../../../components';

import { Global, Gutters, Layout, Colors, Images, Fonts } from '../../../theme';

import { connect } from 'react-redux';

import { TextInput } from 'react-native-gesture-handler';
import { getExerciseRequest, getExerciseTypeRequest } from '../../../ScreenRedux/addExerciseRedux';
import Loader from '../../../components/Loader';
import { useIsFocused } from '@react-navigation/native';

const data = [
  { id: 1, value: 1, item: 'Super Set' },
  { id: 2, value: 4, item: 'Giant Set' },
  { id: 3, value: 2, item: 'Drop Set' },
  { id: 4, value: 3, item: 'Triple Set' },
];
const AddExercies = props => {
  const { navigation, getExerciseState, requesting, getExerciseType } = props;
  let refDescription = useRef('');
  let isFocused = useIsFocused();
  const [activeSet, setActiveSet] = useState(false);
  const [selectedItem, setSelectedItem] = useState([]);
  const [desription, setDesription] = useState(false);

  useEffect(() => {
    isFocused && props.getExerciseRequest();
  }, [isFocused]);

  useEffect(() => {
    getExerciseState && props.getExerciseTypeRequest(getExerciseState && getExerciseState[0]?.id);
    !activeSet && setActiveSet(data[0]);
  }, [getExerciseState]);

  const onSelectItem = i => {
    let array = [...selectedItem];
    if (array.includes(i)) {
      array = array.filter(index => index !== i);
      setSelectedItem(array);
    } else {
      if (activeSet?.id === 1) {
        if (selectedItem.length < 2) {
          array.push(i);
          setSelectedItem(array);
        }
      } else if (activeSet?.value === 4) {
        if (selectedItem.length < 3) {
          array.push(i);
          setSelectedItem(array);
        }
      } else {
        setSelectedItem([i]);
      }
    }
  };

  const makeDataParams = () => {
    const updatedFeeds = [...getExerciseType];
    const exercises = [];
    updatedFeeds.findIndex((item, ind) => {
      selectedItem.map((dd, i) => {
        if (ind === dd) {
          exercises.push(item);
        }
      });
    });
    navigation.navigate('CustomExercise', { exercises, activeSet });
  };

  const { row, fill, center, alignItemsCenter, justifyContentBetween } = Layout;
  const { foodImage, iconI, circleClose } = Images;
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
          <View style={[row, alignItemsCenter, Gutters.regularTMargin]}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={[fill, row, alignItemsCenter]}
            >
              <Image
                source={Images.back2}
                style={{ width: 30, height: 25, resizeMode: 'contain' }}
              />
            </TouchableOpacity>
            <View
              style={[fill, Layout.row, Global.borderB, Global.borderAlto, Layout.alignItemsCenter]}
            >
              <InputField
                inputStyle={[Global.height40, Fonts.textMedium, { padding: 0 }]}
                placeholder="search"
                autoCapitalize="none"
              />
            </View>
            <View style={fill} />
          </View>
          <ScrollView
            horizontal={true}
            contentContainerStyle={{ marginTop: 20, paddingBottom: 10 }}
          >
            {data?.map((set, i) => {
              return (
                <TouchableOpacity
                  key={i}
                  onPress={() => {
                    setSelectedItem([]);
                    setActiveSet(set);
                  }}
                  style={[
                    styles.pillStyle,
                    center,
                    { backgroundColor: activeSet.id === set.id ? '#74ccff' : '#fff' },
                  ]}
                >
                  <Text
                    text={set.item}
                    style={[styles.pillText, { color: activeSet.id !== set.id ? '#000' : '#fff' }]}
                  />
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <View style={[{ marginTop: 20 }]}>
            <Text text="Muscle Group" style={styles.heading} />
            <ScrollView horizontal={true} contentContainerStyle={{ paddingBottom: 10 }}>
              {requesting && getExerciseState === false ? (
                <Loader />
              ) : (
                getExerciseState &&
                getExerciseState?.map((item, i) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedItem([]);
                        props.getExerciseTypeRequest(item.id);
                      }}
                      key={i}
                      style={[center, { marginRight: 5 }]}
                    >
                      <Image
                        source={item.image === null ? Images.workout1 : { uri: item.image }}
                        style={{ width: 80, height: 80 }}
                      />
                      <Text text={item.name} style={styles.exerciseText} />
                    </TouchableOpacity>
                  );
                })
              )}
            </ScrollView>
          </View>
          <View style={{ marginTop: 25 }}>
            <Text text="Poupular Exercies" style={styles.heading} />
          </View>
        </View>
        <View style={{ marginBottom: 20 }}>
          {getExerciseType === false && !requesting && props.request ? (
            <ActivityIndicator size={'large'} color="green" />
          ) : (
            getExerciseType &&
            getExerciseType.map((item, i) => (
              <TouchableOpacity
                style={[
                  styles.cardView,
                  { backgroundColor: selectedItem.includes(i) ? '#74ccff' : '#e5e5e5' },
                ]}
                onPress={() => onSelectItem(i)}
              >
                <View style={[row, justifyContentBetween, { position: 'relative' }]}>
                  <View style={[center, styles.cardImg]}>
                    <Image
                      source={
                        item?.pictures[0]?.image
                          ? { uri: item?.pictures[0]?.image }
                          : item?.video
                          ? { uri: item?.video }
                          : foodImage
                      }
                      style={{ width: 80, height: 40 }}
                    />
                  </View>
                  <View style={[center, { marginRight: 50 }]}>
                    <Text text={item.name} style={styles.heading1} />
                  </View>
                  <TouchableOpacity
                    style={[center, {}]}
                    onPress={() => {
                      refDescription.current.open();
                      setDesription(item);
                    }}
                  >
                    <Image source={iconI} style={{ width: 20, height: 20, marginRight: 5 }} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
      <View style={{ alignSelf: 'center' }}>
        <Button
          text={'Add Exercies'}
          textStyle={[{ color: 'white' }]}
          style={styles.btn}
          disabled={
            activeSet?.id === 1
              ? selectedItem?.length < 2
              : activeSet?.value === 4
              ? selectedItem?.length < 3
              : selectedItem?.length < 1
          }
          onPress={makeDataParams}
        />
      </View>
      <View style={[row, { alignSelf: 'center', marginTop: 20, marginBottom: 10 }]}>
        <Text text="Watch This" style={[styles.heading1, { color: Colors.brightturquoise }]} />
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
          <TouchableOpacity
            style={{ alignSelf: 'flex-end', marginRight: 10 }}
            onPress={() => {
              refDescription.current.close();
              setDesription(false);
            }}
          >
            <Image source={circleClose} style={{ width: 23, height: 23 }} />
          </TouchableOpacity>
          <View style={{ alignSelf: 'center' }}>
            <Text
              text={desription?.name}
              style={[
                { fontSize: 20, lineHeight: 25, color: 'black', fontWeight: 'bold', marginTop: 10 },
              ]}
            />
          </View>
          <View style={[styles.dualView, center]}>
            <Image source={{ uri: desription?.video }} style={{ width: 200, height: 140 }} />
          </View>
          <ScrollView style={{ marginTop: 40 }}>
            {dammyData.map((item, i) => {
              return (
                <View style={styles.dualList}>
                  <View>
                    <View style={styles.dualCard}>
                      <Text text={i + 1} style={styles.textStyle} />
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
            style={styles.addBtnStyle}
          />
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  exerciseText: {
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 16,
    opacity: 0.7,
  },
  btn: {
    backgroundColor: Colors.brightturquoise,
    borderRadius: 40,
    paddingHorizontal: 30,
    height: 45,
    marginTop: 10,
  },
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
    borderColor: '#74ccff',
    marginRight: 10,
  },
  pillText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
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
  dualView: {
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
  dualList: {
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
  },
  dualCard: {
    backgroundColor: Colors.athensgray,
    width: 30,
    height: 30,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  addBtnStyle: {
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
  },
  textStyle: {
    fontSize: 20,
    lineHeight: 25,
    color: 'black',
    fontWeight: 'bold',
  },
});
const mapStateToProps = state => ({
  requesting: state.addExerciseReducer.requesting,
  request: state.addExerciseReducer.request,
  getExerciseState: state.addExerciseReducer.getExerciseState,
  getExerciseType: state.addExerciseReducer.getExerciseType,
});

const mapDispatchToProps = dispatch => ({
  getExerciseRequest: () => dispatch(getExerciseRequest()),
  getExerciseTypeRequest: data => dispatch(getExerciseTypeRequest(data)),
});
export default connect(mapStateToProps, mapDispatchToProps)(AddExercies);
