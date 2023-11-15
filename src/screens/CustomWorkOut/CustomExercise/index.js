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
import { Text, InputField, BottomSheet, Button } from '../../../components';

//Libraries
import Modal from 'react-native-modal';
import RBSheet from 'react-native-raw-bottom-sheet';
import ImagePicker from 'react-native-image-crop-picker';

//Themes
import { Global, Gutters, Layout, Colors, Images, Fonts } from '../../../theme';
import { postCustomExRequest } from '../../../ScreenRedux/addExerciseRedux';

const CustomExercise = props => {
  const { redBin, circleClose, radioBlue, doneImg, greyNext, duplicateIcon } = Images;
  const { navigation, route, cRequesting, getCustomExState, todaySessions } = props;
  const { width, height } = Dimensions.get('window');

  const [reps, setReps] = useState('');
  const [title, setTitle] = useState('');
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

  const numberOfExercise = route?.params?.exercises?.length;

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
    setCurrentIndex(false);
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
    setMinutes('');
    setSeconds('');
    setTemporaryReps('');
    setDualSetState(1);
    setDualReps({
      state1: 0,
      state2: 0,
    });
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

  console.log('dualReps', dualReps);
  const addDataCustomEx = () => {
    const payload = {
      title: title ? title : 'title',
      session_date: todaySessions?.date_time,
      exercise_ids: route?.params?.exercises?.map((ex, i) => ex.id),
      set: sets,
    };
    props.postCustomExRequest(payload);
  };

  const list = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={Layout.fillGrow}>
        <View
          style={[
            Layout.row,
            Gutters.regularVMargin,
            Gutters.regularHMargin,
            Layout.alignItemsCenter,
            Layout.justifyContentBetween,
          ]}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={Images.back2} style={{ width: 30, height: 25, resizeMode: 'contain' }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={addDataCustomEx} style={styles.doneStyle}>
            <Text text="Done" />
          </TouchableOpacity>
        </View>

        <View
          style={[
            Layout.row,
            Global.borderB,
            Global.height60,
            Global.borderAlto,
            Layout.alignItemsCenter,
            Gutters.regularHMargin,
            Layout.justifyContentBetween,
          ]}
        >
          <InputField
            inputStyle={[Fonts.titleRegular, Layout.fill]}
            value={title}
            onChangeText={val => setTitle(val)}
            placeholder="Workout Title"
            autoCapitalize="none"
          />
        </View>

        <View
          style={[
            styles.tableView,
            Gutters.regularHMargin,
            Gutters.regularVMargin,
            Gutters.regularBPadding,
          ]}
        >
          {
            //numberOfExercise === 1 ? (
            //<View style={[Layout.row, Gutters.smallHMargin, Gutters.smallVMargin]}>
            //<Image source={Images.profileBackGround} style={styles.exerciseImage} />
            //<Text text="Barbell bench press" style={styles.exerciseName} />
            //</View>
            // ) :
            route?.params?.exercises?.map((exe, i) => {
              return (
                <View style={[Gutters.smallHMargin, Gutters.smallVMargin]}>
                  <View style={Layout.row}>
                    <Image
                      source={exe?.video ? { uri: exe.video } : Images.profileBackGround}
                      style={styles.exerciseImage1}
                    />
                    <Text style={styles.exerciseName1} text={`${list[i]}. ${exe.name}`} />
                  </View>

                  {/* <View style={[Layout.row, Gutters.smallTMargin]}>
                    <Image source={Images.profileBackGround} style={styles.exerciseImage1} />
                    <Text style={styles.exerciseName1} text={`a. ${ex2}`} />
                  </View> */}
                </View>
              );
            })
          }

          <View
            style={[
              Layout.row,
              Gutters.smallHMargin,
              Gutters.smallTMargin,
              Layout.justifyContentAround,
            ]}
          >
            <Text style={styles.setStyle} text="Set" />
            <Text style={styles.setStyle} text="Reps" />
            <Text style={styles.setStyle} text="Rest" />
          </View>
          <View style={Gutters.smallTMargin}>
            {numberOfExercise === 1 &&
              sets.map((item, i) => (
                <TouchableOpacity
                  onPress={() => setCurrentIndex(i)}
                  style={[
                    Layout.row,
                    Global.height35,
                    Gutters.tinyTMargin,
                    Gutters.largeHMargin,
                    Layout.alignItemsCenter,
                    Layout.justifyContentAround,
                    {
                      borderRadius: 6,
                      backgroundColor: currentIndex === i ? '#9cdaff' : '#f3f1f4',
                    },
                  ]}
                >
                  <Text style={styles.setTextStyle} text={i + 1} />
                  <Text style={[styles.setTextStyle, Gutters.mediumHMargin]} text={item.reps} />
                  <Text style={styles.setTextStyle} text={!item.rest ? '-' : item.rest} />
                </TouchableOpacity>
              ))}
            {numberOfExercise === 2 &&
              dualSets.map((item, i) => (
                <TouchableOpacity
                  style={[
                    Global.borderR10,
                    Gutters.largeHMargin,
                    Gutters.smallBMargin,
                    Gutters.regularBPadding,
                    {
                      backgroundColor: i === currentIndex ? '#74ccff' : '#f1f1f1',
                    },
                  ]}
                  onPress={() => setCurrentIndex(i)}
                >
                  <Text style={styles.dualSetsStyle} text={i + 1} />
                  <View style={styles.dualSetsSecondView}>
                    <Text
                      style={styles.dualSetsName}
                      text={'a. ' + route?.params?.exercises[0]?.name}
                    />
                    <Text style={styles.dualSetRepsStyle} text={item.exerciseA.reps} />
                    <Text
                      style={styles.dualSetRestStyle}
                      text={item.exerciseA.rest === 0 ? '-' : item.exerciseB.rest}
                    />
                  </View>
                  <View style={styles.dualSetsSecondView1}>
                    <Text
                      style={styles.dualSecondEx}
                      text={'b. ' + route?.params?.exercises[1]?.name}
                    />
                    <Text style={styles.dualSecondReps} text={item.exerciseB.reps} />
                    <Text
                      style={styles.dualSecondRest}
                      text={item.exerciseB.rest === 0 ? '-' : item.exerciseB.rest}
                    />
                  </View>
                </TouchableOpacity>
              ))}
          </View>

          <View style={Gutters.largeHMargin}>
            <TouchableOpacity
              onPress={() => {
                resetValues();
                if (numberOfExercise === 1) {
                  refRBSheet.current.open();
                } else {
                  refRBSheetDual.current.open();
                }
              }}
              style={styles.addSetsButton}
            >
              <Text style={styles.addSetsText} text="Add Set" />
            </TouchableOpacity>
          </View>

          <View
            style={[
              Layout.row,
              Gutters.smallHMargin,
              Gutters.small2xTMargin,
              Layout.justifyContentBetween,
            ]}
          >
            <TouchableOpacity
              style={Layout.row}
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
          container: {
            backgroundColor: '#f1f1f1',
            borderRadius: 40,
            height: 320,
            marginBottom: 10,
          },
          draggableIcon: {
            backgroundColor: '#f1f1f1',
          },
        }}
      >
        <View style={styles.secondView}>
          <ScrollView keyboardShouldPersistTaps={'handled'}>
            <View
              style={[
                Layout.row,
                Layout.fill,
                Gutters.small2xHMargin,
                Layout.justifyContentBetween,
              ]}
            >
              <View style={Layout.fill} />
              <View style={[Layout.fill, Layout.center]}>
                <Text style={styles.setOneTextStyle} text="Set 1" />
              </View>
              <TouchableOpacity
                onPress={() => refRBSheet.current.close()}
                style={[Layout.fill, Layout.alignItemsEnd, Layout.justifyContentCenter]}
              >
                <Image source={circleClose} style={{ height: 25, width: 25 }} />
              </TouchableOpacity>
            </View>

            <View
              style={[
                Layout.row,
                Gutters.largeHMargin,
                Gutters.small2xTMargin,
                Layout.justifyContentBetween,
              ]}
            >
              <View style={styles.secondaryBoxes}>
                <Text style={{ color: '#00a1ff', fontWeight: '700' }} text="Enter Reps" />
                <TextInput
                  style={{
                    fontSize: 24,
                    fontWeight: '700',
                    color: '#5e5e5e',
                    marginTop: 5,
                  }}
                  onChangeText={val => setReps(val)}
                  keyboardType="number-pad"
                  value={`${reps}`}
                />
              </View>

              <View style={[styles.secondaryBoxes, { width: 120 }]}>
                <Text style={{ color: '#00a1ff', fontWeight: '700' }} text="Enter Rest" />
                <View style={[Layout.row, Layout.alignItemsCenter]}>
                  <View>
                    <TextInput
                      style={{
                        width: 30,
                        height: 30,
                        marginTop: 14,
                        paddingBottom: -10,
                        borderBottomWidth: 1,
                        borderBottomColor: '#bababa',
                      }}
                      keyboardType="number-pad"
                      onChangeText={val => setMinutes(val)}
                      maxLength={2}
                      value={`${minutes}`}
                    />
                    <Text style={{ color: '#646464', fontSize: 12 }} text="Min" />
                  </View>

                  <Text
                    style={{
                      color: '#646464',
                      fontSize: 30,
                      fontWeight: '700',
                      marginHorizontal: 10,
                    }}
                    text=":"
                  />
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
                      keyboardType="number-pad"
                      maxLength={3}
                      onChangeText={val => setSeconds(val)}
                      value={`${seconds}`}
                    />

                    <Text style={{ color: '#646464', fontSize: 12 }} text="Sec" />
                  </View>
                </View>
              </View>
            </View>
            <View
              style={[
                Layout.row,
                Gutters.largeHMargin,
                Gutters.small2xTMargin,
                Layout.justifyContentBetween,
              ]}
            >
              <View style={[Layout.row, Gutters.smallTMargin, Layout.alignItemsCenter]}>
                <TouchableOpacity
                  onPress={() => {
                    if (sets?.length) {
                      setReps(sets[sets?.length - 1]?.reps);
                    }
                  }}
                >
                  <Image source={radioBlue} style={{ width: 20, height: 20 }} />
                </TouchableOpacity>

                <Text style={{ fontSize: 12, color: '#646464', textAlign: 'center' }}>
                  Keep reps the{'\n'} same for {'\n'} remaining sets
                </Text>
              </View>
              <View style={[Layout.row, Gutters.smallTMargin, Layout.alignItemsCenter]}>
                <TouchableOpacity
                  onPress={() => {
                    if (sets[sets?.length - 1]?.rest) {
                      setMinutes(Math.floor(sets[sets?.length - 1]?.rest / 60));
                      setSeconds(sets[sets?.length - 1]?.rest % 60);
                    }
                  }}
                >
                  <Image source={radioBlue} style={{ width: 20, height: 20 }} />
                </TouchableOpacity>
                <Text style={{ fontSize: 12, color: '#646464', textAlign: 'center' }}>
                  Keep rest the{'\n'} same for {'\n'} remaining sets
                </Text>
              </View>
            </View>

            <View style={[Layout.center, Gutters.smallVMargin, Gutters.regularBPadding]}>
              <TouchableOpacity
                onPress={() => {
                  setSets(prevValues => [
                    ...prevValues,
                    {
                      ex_id: route?.params?.exercises?.map(e => e.id),
                      set_no: 1,
                      reps: reps,
                      weight: 10,
                      set_type: 'ct',
                      rest: minutes * 60 + parseFloat(seconds),
                      timer: minutes * 60 + parseFloat(seconds),
                    },
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
            height: 330,
            marginBottom: 10,
          },
          draggableIcon: {
            backgroundColor: '#f1f1f1',
          },
        }}
      >
        <View style={styles.secondView}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <View style={{ marginRight: 20 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text
                  style={{
                    color: '#636363',
                    fontSize: 20,
                    fontWeight: '700',
                    textAlign: 'center',
                    flex: 1,
                  }}
                >
                  {/* {dualSetState === 1 ? ex1 : ex2} */}
                  {dualSetState === 1
                    ? route?.params?.exercises[0]?.name
                    : route?.params?.exercises[1]?.name}
                </Text>
                <TouchableOpacity onPress={() => refRBSheetDual.current.close()}>
                  <Image source={circleClose} style={{ height: 20, width: 20 }} />
                </TouchableOpacity>
              </View>
              <View style={styles.dualDotsStyle}>
                <TouchableOpacity
                  style={styles.dotHeight}
                  onPress={() => {
                    setTemporaryReps(dualReps?.state1);
                    setDualSetState(1);
                  }}
                >
                  <View
                    style={[
                      styles.dotStyle,
                      { opacity: dualSetState === 1 ? 1 : 0.3, marginRight: 3 },
                    ]}
                  ></View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setTemporaryReps(dualReps?.state2);
                    setDualSetState(2);
                  }}
                  style={styles.dotHeight}
                >
                  <View
                    style={[
                      styles.dotStyle,
                      { opacity: dualSetState === 2 ? 1 : 0.3, marginRight: 3 },
                    ]}
                  ></View>
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
                    keyboardType="number-pad"
                    onChangeText={val => {
                      updateDualReps(val);
                      setTemporaryReps(val);
                    }}
                  />
                </View>
                <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                  <TouchableOpacity
                    onPress={() => {
                      if (dualSets?.length) {
                        setTemporaryReps(
                          dualSetState === 1
                            ? dualSets[dualSets?.length - 1]?.exerciseA?.reps
                            : dualSets[dualSets?.length - 1]?.exerciseB?.reps
                        );
                      }
                    }}
                  >
                    <Image source={radioBlue} style={{ width: 20, height: 20 }} />
                  </TouchableOpacity>
                  <Text style={{ fontSize: 12, color: '#646464', textAlign: 'center' }}>
                    Keep reps the{'\n'} same for {'\n'} remaining sets
                  </Text>
                </View>
              </View>

              <View>
                <View
                  style={[
                    styles.secondaryBoxes,
                    { width: 120, opacity: dualSetState === 1 ? 0.7 : 1 },
                  ]}
                >
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
                          borderBottomWidth: 1,
                          paddingBottom: -10,
                        }}
                        onChangeText={val => setMinutes(val)}
                        editable={dualSetState === 1 ? false : true}
                        maxLength={2}
                        value={`${dualSetState === 1 ? '' : minutes}`}
                        keyboardType="number-pad"
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
                        value={`${dualSetState === 1 ? '' : seconds}`}
                        editable={dualSetState === 1 ? false : true}
                        onChangeText={val => setSeconds(val)}
                        keyboardType="decimal-pad"
                      />

                      <Text style={{ color: '#646464', fontSize: 12 }}>Sec</Text>
                    </View>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                  <TouchableOpacity
                    onPress={() => {
                      if (dualSetState === 2 && dualSets[dualSets?.length - 1]?.exerciseB?.rest) {
                        setMinutes(
                          Math.floor(dualSets[dualSets?.length - 1]?.exerciseB?.rest / 60)
                        );
                        setSeconds(dualSets[dualSets?.length - 1]?.exerciseB?.rest % 60);
                      }
                    }}
                  >
                    <Image source={radioBlue} style={{ width: 20, height: 20 }} />
                  </TouchableOpacity>
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
                    // resetValues();
                    // setTemporaryReps();
                    setTemporaryReps(dualReps?.state2);
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
                          rest: minutes * 60 + parseFloat(seconds ? seconds : 0),
                          name: 'ExerciseB',
                        },
                      },
                    ]);
                    // resetValues();
                  }
                }}
                disabled={
                  dualSetState === 1
                    ? dualReps.state1 === ''
                      ? true
                      : false
                    : dualSetState === 2 && dualReps.state2 !== '' && !minutes
                    ? true
                    : false
                }
              >
                <Image
                  source={dualSetState === 1 ? greyNext : doneImg}
                  style={{
                    height: 45,
                    width: 150,
                    opacity:
                      (dualSetState === 1 && dualReps.state1 === '') ||
                      (dualSetState === 2 && dualReps.state2 !== '' && !minutes)
                        ? 0.5
                        : 1,
                  }}
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
          style={[
            Gutters.small2xHMargin,
            Global.secondaryBg,
            Global.borderR10,
            Layout.center,
            {
              height: 250,
            },
          ]}
        >
          <Text style={styles.deleteText} text="Are you sure you want to delete this set?" />

          <View style={[Layout.row, Gutters.small2xTMargin]}>
            <TouchableOpacity
              style={[styles.delBtnStyles, { backgroundColor: '#74ccff' }]}
              onPress={() => deleteSet()}
            >
              <Text style={styles.yesNoButton} text="Yes" />
            </TouchableOpacity>
            <View style={Gutters.small2xHMargin} />
            <TouchableOpacity
              style={[styles.delBtnStyles, { backgroundColor: '#f3f1f4' }]}
              disabled={currentIndex === false ? true : false}
              onPress={() => setDeleteModal(false)}
            >
              <Text style={styles.yesNoButton} text="No" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  doneStyle: {
    backgroundColor: '#e9e9e9',
    borderRadius: 20,
    height: 25,
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exerciseName: { marginLeft: 10, color: '#636363', fontSize: 20, fontWeight: '700' },
  exerciseImage: { height: 90, width: 100, borderRadius: 10 },
  exerciseImage1: { height: 60, width: 90, borderRadius: 5 },
  exerciseName1: {
    marginLeft: 20,
    color: '#636363',
    fontSize: 20,
    fontWeight: '700',
    alignSelf: 'center',
    flex: 1,
  },
  setStyle: { color: '#00a1ff', fontWeight: '700' },
  setTextStyle: { color: '#5e5e5e', fontWeight: '700' },
  dualSetsStyle: {
    marginLeft: 20,
    color: '#636363',
    fontSize: 17,
    fontWeight: '700',
    marginTop: 5,
  },
  dualSetsName: {
    color: '#636363',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 5,
    width: 80,
    marginLeft: -10,
  },
  dualSetRepsStyle: {
    color: '#636363',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 5,
    width: 50,
    marginHorizontal: 40,
    marginLeft: 10,
  },
  dualSetRestStyle: {
    color: '#636363',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 5,
    width: 50,
    marginRight: -30,
  },
  dualSecondEx: {
    color: '#636363',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 5,
    width: 80,
    marginLeft: -10,
  },
  dualSecondReps: {
    color: '#636363',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 5,
    width: 50,
    marginHorizontal: 40,
    marginLeft: 10,
  },
  dualSecondRest: {
    color: '#636363',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 5,
    width: 50,
    marginRight: -30,
  },
  addSetsButton: {
    backgroundColor: '#e9e9e9',
    paddingHorizontal: 10,
    borderRadius: 6,
    marginTop: 7,
    height: 22,
    width: 80,
  },
  addSetsText: { fontWeight: '500', color: '#7e7e7e' },
  deleteText: { fontSize: 24, fontWeight: '700', textAlign: 'center' },
  yesNoButton: { fontWeight: '700', color: '#000' },
  setOneTextStyle: { color: '#636363', fontSize: 20, fontWeight: '700' },

  container: {
    flexGrow: 1,
    backgroundColor: 'white',
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    borderRadius: 5,
    shadowRadius: 2.22,
    elevation: 3,
  },
  secondView: {
    borderRadius: 35,
    backgroundColor: '#f1f1f1',
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
  dualSetsSecondView: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#bababa',
    marginHorizontal: 20,
    paddingBottom: 10,
    justifyContent: 'space-around',
  },
  dualSetsSecondView1: {
    flexDirection: 'row',
    marginTop: 10,
    marginHorizontal: 20,
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
  dotStyle: {
    height: 8,
    width: 8,
    borderRadius: 50,
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    // opacity: 0.3,
  },
  dotHeight: {
    height: 15,
    width: 15,
  },
  dualDotsStyle: {
    alignItems: 'center',
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

const mapStateToProps = state => ({
  cRequesting: state.addExerciseReducer.cRequesting,
  getCustomExState: state.addExerciseReducer.getCustomExState,
  todaySessions: state.programReducer.todaySessions,
});

const mapDispatchToProps = dispatch => ({
  postCustomExRequest: data => dispatch(postCustomExRequest(data)),
});
export default connect(mapStateToProps, mapDispatchToProps)(CustomExercise);
