import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
  Image,
  Dimensions,
  ScrollView,
  TextInput,
} from 'react-native';
import { Text, BottomSheet, Button } from '../../components';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Images } from 'src/theme';
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import { editProfile } from '../../ScreenRedux/profileRedux';

const CustomExercise = props => {
  const { backArrow, profileBackGround, redBin, circleClose, radioBlue, doneImg, greyNext } =
    Images;
  const { navigation } = props;
  const { width, height } = Dimensions.get('window');

  const [secondView, setSecondView] = useState(false);
  const [reps, setReps] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');

  //BottomSheetRefs
  const refRBSheet = useRef();
  const refRBSheetDual = useRef();

  const [sets, setSets] = useState([]);
  const [dualSets, setDualSets] = useState([]);
  const [dualSetState, setDualSetState] = useState(1);

  const numberOfExercise = 2;

  const ex1 = 'Exercise 1';
  const ex2 = 'Exercise 2';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View
          style={{
            marginHorizontal: 13,
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 17,
          }}
        >
          <Image source={backArrow} />
          <View
            style={{
              backgroundColor: '#e9e9e9',
              paddingHorizontal: 10,
              borderRadius: 27,
              height: 22,
            }}
          >
            <Text style={{ fontWeight: '500' }}>Done</Text>
          </View>
        </View>

        <View
          style={{
            marginTop: 10,
            marginHorizontal: 13,
            borderBottomWidth: 1,
            borderBottomColor: '#e9e9e9',
          }}
        >
          <Text style={{ color: '#929292', fontSize: 20, fontWeight: '600' }}>Workout Title</Text>
        </View>

        <View style={styles.tableView}>
          {numberOfExercise === 1 ? (
            <View
              style={{
                marginHorizontal: 10,
                // justifyContent: 'space-between',
                flexDirection: 'row',
                marginTop: 15,
              }}
            >
              <Image
                source={profileBackGround}
                style={{ height: 90, width: 100, borderRadius: 10 }}
              />

              <Text style={{ marginLeft: 20, color: '#636363', fontSize: 20, fontWeight: '700' }}>
                Barbell bench press
              </Text>
            </View>
          ) : (
            <>
              <View
                style={{
                  marginHorizontal: 10,
                  marginTop: 15,
                }}
              >
                <View style={{ flexDirection: 'row' }}>
                  <Image
                    source={profileBackGround}
                    style={{ height: 60, width: 90, borderRadius: 5 }}
                  />

                  <Text
                    style={{
                      marginLeft: 20,
                      color: '#636363',
                      fontSize: 20,
                      fontWeight: '700',
                      alignSelf: 'center',
                    }}
                  >
                    a. {ex1}
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                  <Image
                    source={profileBackGround}
                    style={{ height: 60, width: 90, borderRadius: 5 }}
                  />

                  <Text
                    style={{
                      marginLeft: 20,
                      color: '#636363',
                      fontSize: 20,
                      fontWeight: '700',
                      alignSelf: 'center',
                    }}
                  >
                    b. {ex2}
                  </Text>
                </View>
              </View>
            </>
          )}

          <View
            style={{
              marginHorizontal: 10,
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginTop: 15,
            }}
          >
            <Text style={{ color: '#00a1ff', fontWeight: '700' }}>Set</Text>
            <Text style={{ color: '#00a1ff', fontWeight: '700' }}>Reps</Text>
            <Text style={{ color: '#00a1ff', fontWeight: '700' }}>Rest</Text>
          </View>
          <View style={{ marginTop: 7 }}>
            {numberOfExercise === 1 &&
              sets.map((item, i) => (
                <View
                  style={{
                    marginHorizontal: 38,
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    backgroundColor: '#9cdaff',
                    marginTop: 5,
                    height: 35,
                    borderRadius: 6,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: '#5e5e5e', fontWeight: '700' }}>{i + 1}</Text>
                  <Text style={{ color: '#5e5e5e', fontWeight: '700', marginHorizontal: 33 }}>
                    {item.reps}
                  </Text>
                  <Text style={{ color: '#5e5e5e', fontWeight: '700' }}>
                    {!item.rest ? '-' : item.rest}
                  </Text>
                </View>
              ))}
            {numberOfExercise === 2 && (
              <View style={styles.dualSets}>
                <Text
                  style={{
                    marginLeft: 20,
                    color: '#636363',
                    fontSize: 17,
                    fontWeight: '700',
                    marginTop: 5,
                  }}
                >
                  1
                </Text>

                <View style={styles.dualSetsSecondView}>
                  <Text
                    style={{
                      color: '#636363',
                      fontSize: 13,
                      fontWeight: '700',
                      marginTop: 5,
                      width: 80,
                      marginLeft: -10,
                    }}
                  >
                    a. Barbell bench press
                  </Text>

                  <Text
                    style={{
                      color: '#636363',
                      fontSize: 13,
                      fontWeight: '700',
                      marginTop: 5,
                      width: 50,
                      marginHorizontal: 40,
                      marginLeft: 10,
                    }}
                  >
                    12
                  </Text>

                  <Text
                    style={{
                      color: '#636363',
                      fontSize: 13,
                      fontWeight: '700',
                      marginTop: 5,
                      width: 50,
                      marginRight: -30,
                    }}
                  >
                    60
                  </Text>
                </View>

                <View style={[styles.dualSetsSecondView1]}>
                  <Text
                    style={{
                      color: '#636363',
                      fontSize: 13,
                      fontWeight: '700',
                      marginTop: 5,
                      width: 80,
                      marginLeft: -10,
                    }}
                  >
                    a. Barbell bench press
                  </Text>

                  <Text
                    style={{
                      color: '#636363',
                      fontSize: 13,
                      fontWeight: '700',
                      marginTop: 5,
                      width: 50,
                      marginHorizontal: 40,
                      marginLeft: 10,
                    }}
                  >
                    12
                  </Text>

                  <Text
                    style={{
                      color: '#636363',
                      fontSize: 13,
                      fontWeight: '700',
                      marginTop: 5,
                      width: 50,
                      marginRight: -30,
                    }}
                  >
                    60
                  </Text>
                </View>
              </View>
            )}
          </View>

          <View style={{ marginHorizontal: 38 }}>
            <TouchableOpacity
              onPress={() => {
                numberOfExercise === 1 && refRBSheet.current.open();
                numberOfExercise === 2 && refRBSheetDual.current.open();
              }}
              style={{
                backgroundColor: '#e9e9e9',
                paddingHorizontal: 10,
                borderRadius: 6,
                marginTop: 7,
                height: 22,
                width: 80,
              }}
            >
              <Text style={{ fontWeight: '500', color: '#7e7e7e' }}>Add Set</Text>
            </TouchableOpacity>
          </View>

          <View style={{ marginHorizontal: 10, flexDirection: 'row', justifyContent: 'flex-end' }}>
            <Image source={redBin} style={{ height: 22, width: 20 }} />
          </View>
        </View>
      </ScrollView>

      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={false}
        animationType="slide"
        customStyles={{
          wrapper: {
            // backgroundColor: 'transparent',
          },
          container: {
            backgroundColor: '#f1f1f1',
            borderRadius: 40,
            height: 300,
            marginBottom: 10,
          },
          draggableIcon: {
            backgroundColor: '#f1f1f1',
          },
        }}
      >
        <View style={styles.secondView}>
          <ScrollView>
            <View style={{ alignItems: 'flex-end', marginRight: 20 }}>
              <View style={{ flexDirection: 'row', width: '55%', justifyContent: 'space-between' }}>
                <Text style={{ color: '#636363', fontSize: 20, fontWeight: '700' }}>Set 1</Text>
                <TouchableOpacity onPress={() => refRBSheet.current.close()}>
                  <Image source={circleClose} style={{ height: 20, width: 20 }} />
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={{
                marginLeft: 45,
                marginRight: 25,
                justifyContent: 'space-between',
                flexDirection: 'row',
                marginTop: 20,
              }}
            >
              <View>
                <View style={styles.secondaryBoxes}>
                  <Text style={{ color: '#00a1ff', fontWeight: '700' }}>Enter Reps</Text>
                  <TextInput
                    style={{ fontSize: 24, fontWeight: '700', color: '#5e5e5e', marginTop: 5 }}
                    onChangeText={val => setReps(val)}
                  />
                </View>

                <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                  <Image source={radioBlue} style={{ width: 20, height: 20 }} />
                  <Text style={{ fontSize: 12, color: '#646464', textAlign: 'center' }}>
                    Keep reps the{'\n'} same for {'\n'} remaining sets
                  </Text>
                </View>
              </View>

              <View>
                <View style={[styles.secondaryBoxes, { width: 120 }]}>
                  <Text style={{ color: '#00a1ff', fontWeight: '700' }}>Enter Rest</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View>
                      <TextInput
                        style={{
                          borderBottomColor: '#bababa',
                          marginTop: 14,
                          height: 30,
                          width: 30,
                          // padding: 10,
                          borderBottomWidth: 1,
                          paddingBottom: -10,
                        }}
                        onChangeText={val => setMinutes(val)}
                        maxLength={2}
                      />
                      <Text style={{ color: '#646464', fontSize: 12 }}>Min</Text>
                    </View>

                    <Text
                      style={{
                        color: '#646464',
                        fontSize: 30,
                        fontWeight: '700',
                        marginHorizontal: 10,
                      }}
                    >
                      :
                    </Text>
                    <View>
                      <TextInput
                        style={{
                          borderBottomColor: '#bababa',
                          width: 30,
                          height: 30,
                          borderBottomWidth: 1,
                          paddingBottom: -10,
                          marginTop: 14,
                        }}
                        maxLength={3}
                        onChangeText={val => setSeconds(val)}
                      />

                      <Text style={{ color: '#646464', fontSize: 12 }}>Sec</Text>
                    </View>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                  <Image source={radioBlue} style={{ width: 20, height: 20 }} />
                  <Text style={{ fontSize: 12, color: '#646464', textAlign: 'center' }}>
                    Keep rest the{'\n'} same for {'\n'} remaining sets
                  </Text>
                </View>
              </View>
            </View>

            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 10,
                marginBottom: 10,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setSets(prevValues => [
                    ...prevValues,
                    { reps: reps, rest: minutes * 60 + parseFloat(seconds) },
                  ]);
                  refRBSheet.current.close();
                }}
                disabled={reps !== '' ? false : true}
              >
                <Image source={doneImg} style={{ height: 45, width: 150 }} />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </RBSheet>

      <RBSheet
        ref={refRBSheetDual}
        closeOnDragDown={true}
        closeOnPressMask={false}
        animationType="slide"
        customStyles={{
          wrapper: {
            // backgroundColor: 'transparent',
          },
          container: {
            backgroundColor: '#f1f1f1',
            borderRadius: 40,
            height: 300,
            marginBottom: 10,
          },
          draggableIcon: {
            backgroundColor: '#f1f1f1',
          },
        }}
      >
        <View style={styles.secondView}>
          <ScrollView>
            <View style={{ alignItems: 'flex-end', marginRight: 20 }}>
              <View style={{ flexDirection: 'row', width: '60%', justifyContent: 'space-between' }}>
                <Text style={{ color: '#636363', fontSize: 20, fontWeight: '700' }}>
                  {dualSetState === 1 ? ex1 : ex2}
                </Text>
                <TouchableOpacity onPress={() => refRBSheet.current.close()}>
                  <Image source={circleClose} style={{ height: 20, width: 20 }} />
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={{
                marginLeft: 45,
                marginRight: 25,
                justifyContent: 'space-between',
                flexDirection: 'row',
                marginTop: 20,
              }}
            >
              <View>
                <View style={styles.secondaryBoxes}>
                  <Text style={{ color: '#00a1ff', fontWeight: '700' }}>Enter Reps</Text>
                  <TextInput
                    style={{ fontSize: 24, fontWeight: '700', color: '#5e5e5e', marginTop: 5 }}
                    onChangeText={val => setReps(val)}
                  />
                </View>

                <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                  <Image source={radioBlue} style={{ width: 20, height: 20 }} />
                  <Text style={{ fontSize: 12, color: '#646464', textAlign: 'center' }}>
                    Keep reps the{'\n'} same for {'\n'} remaining sets
                  </Text>
                </View>
              </View>

              <View>
                <View style={[styles.secondaryBoxes, { width: 120 }]}>
                  <Text
                    style={{
                      color: '#00a1ff',
                      fontWeight: '700',
                      opacity: dualSetState === 1 ? 0.5 : 1,
                    }}
                  >
                    Enter Rest
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View>
                      <TextInput
                        style={{
                          borderBottomColor: '#bababa',
                          marginTop: 14,
                          height: 30,
                          width: 30,
                          // padding: 10,
                          borderBottomWidth: 1,
                          paddingBottom: -10,
                        }}
                        onChangeText={val => setMinutes(val)}
                        editable={dualSetState === 1 ? false : true}
                        maxLength={2}
                      />
                      <Text style={{ color: '#646464', fontSize: 12 }}>Min</Text>
                    </View>

                    <Text
                      style={{
                        color: '#646464',
                        fontSize: 30,
                        fontWeight: '700',
                        marginHorizontal: 10,
                      }}
                    >
                      :
                    </Text>
                    <View>
                      <TextInput
                        style={{
                          borderBottomColor: '#bababa',
                          width: 30,
                          height: 30,
                          borderBottomWidth: 1,
                          paddingBottom: -10,
                          marginTop: 14,
                        }}
                        maxLength={3}
                        editable={dualSetState === 1 ? false : true}
                        onChangeText={val => setSeconds(val)}
                      />

                      <Text style={{ color: '#646464', fontSize: 12 }}>Sec</Text>
                    </View>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                  <Image source={radioBlue} style={{ width: 20, height: 20 }} />
                  <Text style={{ fontSize: 12, color: '#646464', textAlign: 'center' }}>
                    Keep rest the{'\n'} same for {'\n'} remaining sets
                  </Text>
                </View>
              </View>
            </View>

            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 10,
                marginBottom: 10,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  if (dualSetState === 1) {
                    setDualSetState(2);
                  } else {
                    refRBSheetDual.current.close();
                    setDualSetState(1);
                    setReps('');
                  }
                }}
                disabled={reps !== '' ? false : true}
              >
                <Image
                  source={dualSetState === 1 ? greyNext : doneImg}
                  style={{ height: 45, width: 150 }}
                />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </RBSheet>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'white',
    // paddingBottom: 20,
  },
  backgroundStyle: {
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 30,
    flexDirection: 'row',
  },
  mainTextStyle: { fontSize: 20, fontWeight: 'bold' },
  subTextStyle: { fontSize: 16, color: 'gray' },
  tableView: {
    backgroundColor: '#fff',
    marginHorizontal: 9,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    marginBottom: 10,
    shadowOpacity: 0.22,
    borderRadius: 5,
    shadowRadius: 2.22,
    elevation: 3,
    paddingBottom: 10,
    // height: 500,
  },
  secondView: {
    marginHorizontal: 7,
    borderRadius: 35,
    backgroundColor: '#f1f1f1',
    marginTop: 10,
    marginBottom: 15,
  },
  secondaryBoxes: {
    width: 110,
    height: 100,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    borderRadius: 5,
    shadowRadius: 2.22,
    elevation: 3,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 10,
  },
  dualSets: {
    backgroundColor: '#f1f1f1',
    marginHorizontal: 38,
    borderRadius: 6,
    height: 140,
  },
  dualSetsSecondView: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#bababa',
    marginHorizontal: 20,
    paddingBottom: 10,
    // borderWidth:1,
    justifyContent: 'space-around',
  },
  dualSetsSecondView1: {
    flexDirection: 'row',
    marginTop: 10,
    marginHorizontal: 20,
    // paddingBottom: 10,
    justifyContent: 'space-around',
  },
});

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({});
export default connect(mapStateToProps, mapDispatchToProps)(CustomExercise);