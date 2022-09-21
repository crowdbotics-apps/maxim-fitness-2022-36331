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
import { connect } from 'react-redux';

//Components
import { Text, BottomSheet, Button } from '../../../components';

//Libraries
import Modal from 'react-native-modal';
import RBSheet from 'react-native-raw-bottom-sheet';
import ImagePicker from 'react-native-image-crop-picker';

//Themes
import { Images } from 'src/theme';

const CustomExercise = props => {
  const {
    backArrow,
    profileBackGround,
    redBin,
    circleClose,
    radioBlue,
    doneImg,
    greyNext,
    duplicateIcon,
  } = Images;
  const { navigation } = props;
  const { width, height } = Dimensions.get('window');

  const [secondView, setSecondView] = useState(false);
  const [reps, setReps] = useState('');
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const [deleteModal, setDeleteModal] = useState(false);

  //BottomSheetRefs
  const refRBSheet = useRef();
  const refRBSheetDual = useRef();

  const [sets, setSets] = useState([]);
  const [dualSets, setDualSets] = useState([]);
  const [dualSetState, setDualSetState] = useState(1);

  const [currentIndex, setCurrentIndex] = useState(false);
  const [dualReps, setDualReps] = useState({ state1: '', state2: '' });
  const [temporaryReps, setTemporaryReps] = useState(false);

  const numberOfExercise = 1;

  const ex1 = 'Exercise 1';
  const ex2 = 'Exercise 2';

  const duplicateSet = () => {
    if (numberOfExercise === 1) {
      const newArray = [...sets, sets[currentIndex]];
      setSets(newArray);
    } else {
      const newArray = [...dualSets, dualSets[currentIndex]];
      setDualSets(newArray);
    }
  };

  const deleteSet = () => {
    if (numberOfExercise === 1) {
      const newArray = [...sets];
      newArray.splice(currentIndex, 1);
      setSets(newArray);
      setDeleteModal(false);
    } else {
      const newArray = [...dualSets];
      newArray.splice(currentIndex, 1);
      setDualSets(newArray);
      setDeleteModal(false);
    }
  };

  const resetValues = () => {
    setReps('');
    setMinutes(0);
    setSeconds(0);
    setDualReps;
  };

  const updateDualReps = val => {
    if (dualSetState === 1) {
      const tempObj = { ...dualReps };
      tempObj.state1 = val;

      setDualReps(tempObj);
    } else {
      const tempObj = { ...dualReps };
      tempObj.state2 = val;
      setDualReps(tempObj);
    }
  };

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
          <TextInput
            placeholderTextColor={'#929292'}
            placeholder="Workout Title"
            style={{ fontSize: 20, fontWeight: '600' }}
          />
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
                <TouchableOpacity
                  onPress={() => setCurrentIndex(i)}
                  style={{
                    marginHorizontal: 38,
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    backgroundColor: currentIndex === i ? '#9cdaff' : '#f3f1f4',
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
                </TouchableOpacity>
              ))}
            {numberOfExercise === 2 &&
              dualSets.map((item, i) => (
                <TouchableOpacity
                  style={[
                    styles.dualSets,
                    {
                      backgroundColor: i === currentIndex ? '#74ccff' : '#f1f1f1',
                    },
                  ]}
                  onPress={() => setCurrentIndex(i)}
                >
                  <Text
                    style={{
                      marginLeft: 20,
                      color: '#636363',
                      fontSize: 17,
                      fontWeight: '700',
                      marginTop: 5,
                    }}
                  >
                    {i + 1}
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
                      {item.exerciseA.name}
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
                      {item.exerciseA.reps}
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
                      {item.exerciseA.rest === 0 ? '-' : item.exerciseB.rest}
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
                      {item.exerciseB.name}
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
                      {item.exerciseB.reps}
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
                      {item.exerciseB.rest === 0 ? '-' : item.exerciseB.rest}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
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

          <View
            style={{
              marginHorizontal: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 20,
            }}
          >
            <TouchableOpacity
              style={{ flexDirection: 'row' }}
              onPress={() => duplicateSet()}
              disabled={currentIndex || currentIndex === 0 ? false : true}
            >
              <Image source={duplicateIcon} style={{ height: 22, width: 20 }} />
              <Text style={{ fontWeight: '500', color: '#7e7e7e', marginLeft: 10 }}>Duplicate</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setDeleteModal(true)}
              disabled={currentIndex || currentIndex === 0 ? false : true}
            >
              <Image source={redBin} style={{ height: 22, width: 20 }} />
            </TouchableOpacity>
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
                  resetValues();
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
                    value={temporaryReps}
                    onChangeText={val => {
                      updateDualReps(val);
                      setTemporaryReps(val);
                    }}
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
                    resetValues();
                    setTemporaryReps('');
                  } else {
                    refRBSheetDual.current.close();
                    setDualSetState(1);
                    setReps('');
                    setDualSets(prevValues => [
                      ...prevValues,
                      {
                        exerciseA: { reps: dualReps.state1, rest: 0, name: 'ExerciseA' },
                        exerciseB: {
                          reps: dualReps.state2,
                          rest: minutes * 60 + parseFloat(seconds),
                          name: 'ExerciseB',
                        },
                      },
                    ]);
                    resetValues();
                  }
                }}
                disabled={
                  dualSetState === 1
                    ? dualReps.state1 !== ''
                      ? false
                      : true
                    : dualReps.state2 !== '' && minutes !== 0
                    ? false
                    : true
                }
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

      <Modal
        isVisible={deleteModal}
        animationIn="zoomIn"
        animationOut={'zoomOut'}
        onBackdropPress={() => setDeleteModal(false)}
      >
        <View
          style={{
            height: 250,
            marginHorizontal: 20,
            backgroundColor: '#fff',
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 24, fontWeight: '700', textAlign: 'center' }}>
            Are you sure you want to delete this set?
          </Text>

          <View style={{ flexDirection: 'row', marginTop: 20 }}>
            <TouchableOpacity
              style={[styles.delBtnStyles, { backgroundColor: '#74ccff' }]}
              onPress={() => deleteSet()}
            >
              <Text style={{ fontWeight: '700', color: '#000' }}>Yes</Text>
            </TouchableOpacity>
            <View style={{ marginHorizontal: 20 }}></View>
            <TouchableOpacity
              style={[styles.delBtnStyles, { backgroundColor: '#f3f1f4' }]}
              onPress={() => setDeleteModal(false)}
            >
              <Text style={{ fontWeight: '700', color: '#000' }}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    marginHorizontal: 38,
    borderRadius: 6,
    height: 140,
    marginBottom: 10,
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
  delBtnStyles: {
    width: 80,
    height: 50,
    backgroundColor: 'red',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({});
export default connect(mapStateToProps, mapDispatchToProps)(CustomExercise);
