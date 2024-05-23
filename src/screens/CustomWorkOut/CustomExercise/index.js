import React, { useState, useEffect, useRef } from "react"
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
  Pressable,
  ActivityIndicator,
  FlatList,
  Alert
} from "react-native"
import { connect } from "react-redux"
import { showMessage } from "react-native-flash-message"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"

//Components
import { Text, InputField, BottomSheet, Button } from "../../../components"

//Libraries
import Modal from "react-native-modal"
import RBSheet from "react-native-raw-bottom-sheet"

//Themes
import { Global, Gutters, Layout, Colors, Images, Fonts } from "../../../theme"
import {
  postCustomExRequest,
  addCustomExercise,
  getExerciseTypeRequest
} from "../../../ScreenRedux/addExerciseRedux"
import { getRepsRangeRequest, setCustom, setExerciseTitle } from "../../../ScreenRedux/programServices"
import { transformData } from "../../../utils/utils"
import { useIsFocused, useNavigation, useRoute } from "@react-navigation/native"

const CustomExercise = props => {
  const {
    redBin,
    circleClose,
    radioBlue,
    radioDoneBlue,
    greyNext,
    duplicateIcon
  } = Images
  const {
    cRequesting,
    requesting,
    getCustomExState,
    todaySessions,
    profile,
    getExerciseType,
    pickedDate,
    setCustom,
    postCustomExRequest,
    exerciseTitle,
    setExerciseTitle,
    customExercisesList,
    repsRangeState,
    getRepsRangeRequest
  } = props
  const navigation = useNavigation()
  const route = useRoute()
  const { width, height } = Dimensions.get("window")
  const { exercises, activeSet } = route?.params
  const [reps, setReps] = useState("")
  const [title, setTitle] = useState('')
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [deleteModal, setDeleteModal] = useState(false)
  //BottomSheetRefs
  const refRBSheet = useRef()
  const refRBSheetDual = useRef()
  let replaceExercise = useRef("")
  const [sets, setSets] = useState([])
  const [dualSets, setDualSets] = useState([])
  const [dualSetState, setDualSetState] = useState(1)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [dualReps, setDualReps] = useState({})
  const [droupSet, setDroupSets] = useState({})
  const [checkedReps, setCheckedReps] = useState(false)
  const [checkedRest, setCheckedRest] = useState(false)

  const [temporaryReps, setTemporaryReps] = useState(false)
  const [selectIndex, setSelectIndex] = useState(0)
  const [exerciseIndex, setExerciseIndex] = useState(0)
  const [selectedDeleteIndex, setSelectedDeleteIndex] = useState(false)
  const [selectedItem, setSelectedItem] = useState([])
  const [activeCard, setActiveCard] = useState({ item: {}, index: 0 })
  const [timeData, setTimeData] = useState({
    mints: {},
    seconds: {}
  })
  const [repsData, setRepsData] = useState([])
  const {
    alignItemsEnd,
    row,
    fill,
    center,
    alignItemsCenter,
    justifyContentCenter,
    justifyContentBetween,
    fillGrow,
    justifyContentAround
  } = Layout
  const { foodImage, iconI } = Images

  // const numberOfExercise = route?.params?.exercises?.length
  // const activeSet = route?.params?.activeSet

  useEffect(() => {
    if (todaySessions?.id && todaySessions?.name !== "Rest") {
      setTitle("")
    }
  }, [])
  const onFocus = useIsFocused()
  useEffect(() => {
    exerciseTitle && setTitle(exerciseTitle)

  }, [onFocus])

  const findingData = () => {
    const checkData = customExercisesList[exerciseIndex]
    return {
      activeSet: checkData?.activeSet,
      exercises: checkData?.exercises?.type,
      currentData: checkData
    }
  }
  useEffect(() => {
    const myIndex = customExercisesList?.findIndex((item, index) => customExercisesList?.[index]?.exercises?.type.length > 2)
    setExerciseIndex(myIndex)
  }, [customExercisesList, onFocus])

  const updateReducer = (type, updatedData) => {
    const data = [...customExercisesList]
    const updatedObject = { ...data[exerciseIndex] }

    // Perform the deep update
    if (updatedObject.hasOwnProperty(type)) {
      updatedObject[type] = [...updatedObject[type], updatedData]
    } else {
      updatedObject[type] = [updatedData]
    }
    data[exerciseIndex] = updatedObject

    // Update the state or props
    props?.addCustomExercise(data)
    setCurrentIndex(0)
  }

  const setType = ["Super Set", "Giant Set"]

  const duplicateSet = item => {
    const newData = [...customExercisesList]
    newData.push(item)
    props?.addCustomExercise(newData)
    setCurrentIndex(0)
  }

  const deleteSet = () => {
    const data = [...customExercisesList]
    data.splice(selectedDeleteIndex, 1)
    props?.addCustomExercise(data)
    setSets(data)
    setDeleteModal(false)
    setCurrentIndex(false)
    setSelectedDeleteIndex(false)
  }

  const resetValues = () => {
    setReps("")
    setMinutes("")
    setSeconds("")
    setTemporaryReps("")
    setDualSetState(1)
    setSelectIndex(0)
    setDroupSets({})
    setDualReps({})
    setTimeData({
      mints: {},
      seconds: {}
    })
  }

  useEffect(() => {
    if (reps !== "") {
      if (checkedReps) { remaingSameDualKeep() } else { clearNextPadValues() }

    }
    if (temporaryReps !== "") {
      if (checkedReps) { remaingSameDualKeep() } else { clearNextPadValues() }
    }

  }, [checkedReps, dualSetState])
  useEffect(() => {

    if (seconds !== "" || minutes !== "") {
      if (checkedRest) { remaingRestSameDualKeep() } else { clearNextIndexRestValue() }
    }
  }, [checkedRest, dualSetState])

  const updateDualReps = val => {
    const tempObj = { ...dualReps }
    const key = `state${dualSetState}`
    tempObj[key] = val
    setDualReps(tempObj)
  }
  const clearNextPadValues = () => {
    const data = [...customExercisesList];
    const checkData = data?.[exerciseIndex];

    if (!setType?.includes(checkData?.activeSet?.item)) {
      if (findingData()?.activeSet?.item === "Drop Set") {
        if (selectIndex + 1 === 1) {
          setDroupSets({
            ...droupSet,
            state2: null
          });
        }
      } else {
        if (selectIndex + 1 === 1) {
          setDroupSets({
            ...droupSet,
            state2: null,
            state3: null
          });
        } else if (selectIndex + 1 === 2) {
          setDroupSets({
            ...droupSet,
            state3: null
          });
        }
      }
    } else {
      if (findingData()?.activeSet?.value === 4) {
        if (dualSetState === 1) {
          setDualReps({
            ...dualReps,
            state2: null,
            state3: null
          });
        } else if (dualSetState === 2) {
          setDualReps({
            ...dualReps,
            state3: null
          });
        }
      } else {
        if (dualSetState === 1) {
          setDualReps({
            ...dualReps,
            state2: null
          });
        }
      }
    }
  };


  const remaingSameDualKeep = () => {
    const data = [...customExercisesList]
    const checkData = data?.[exerciseIndex]

    if (!setType?.includes(checkData?.activeSet?.item)) {
      if (findingData()?.activeSet?.item === "Drop Set") {
        if (selectIndex + 1 === 1) {
          setDroupSets({
            ...droupSet,
            state1: reps,
            state2: reps
          })
        } else {
          setDroupSets({
            ...droupSet,
            state2: reps
          })
        }
      } else {
        if (selectIndex + 1 === 1) {
          setDroupSets({
            ...droupSet,
            state1: reps,
            state2: reps,
            state3: reps
          })
        } else if (selectIndex + 1 === 2) {
          setDroupSets({
            ...droupSet,
            state2: reps,
            state3: reps
          })
        } else {
          setDroupSets({
            ...droupSet,
            state3: reps
          })
        }
      }
    } else {
      if (findingData()?.activeSet?.value === 4) {
        if (dualSetState === 1) {
          setDualReps({
            ...dualReps,
            state1: temporaryReps,
            state2: temporaryReps,
            state3: temporaryReps
          })
        } else if (dualSetState === 2) {
          setDualReps({
            ...dualReps,
            state2: temporaryReps,
            state3: temporaryReps
          })
        } else {
          setDualReps({
            ...dualReps,
            state3: temporaryReps
          })
        }
      } else {
        if (dualSetState === 1) {
          setDualReps({
            ...dualReps,
            state1: temporaryReps,
            state2: temporaryReps
          })
        } else {
          setDualReps({
            ...dualReps,
            state2: temporaryReps
          })
        }
      }
    }
  }

  const remaingRestSameDualKeep = () => {
    const data = [...customExercisesList]
    const checkData = data?.[exerciseIndex]

    if (!setType?.includes(checkData?.activeSet?.item)) {
      if (findingData()?.activeSet?.item === "Drop Set") {
        if (selectIndex + 1 === 1) {
          setTimeData(prevState => ({
            ...prevState,
            seconds: {
              sec1: seconds,
              sec2: seconds
            },
            mints: {
              mint1: minutes,
              mint2: minutes
            }
          }))
        }
      } else {
        if (selectIndex + 1 === 1) {
          setTimeData(prevState => ({
            ...prevState,
            seconds: {
              sec1: seconds,
              sec2: seconds,
              sec3: seconds
            },
            mints: {
              mint1: minutes,
              mint2: minutes,
              mint3: minutes
            }
          }))
        }
        if (selectIndex + 1 === 2) {
          setTimeData(prevState => ({
            ...prevState,
            seconds: {
              sec2: seconds,
              sec3: seconds
            },
            mints: {
              mint2: minutes,
              mint3: minutes
            }
          }))
        }
      }
    } else {
      if (findingData()?.activeSet?.value === 4) {
        if (dualSetState === 1) {
          setTimeData(prevState => ({
            ...prevState,
            seconds: {
              sec1: seconds,
              sec2: seconds,
              sec3: seconds
            },
            mints: {
              mint1: minutes,
              mint2: minutes,
              mint3: minutes
            }
          }))
        }
        if (dualSetState === 2) {
          setTimeData(prevState => ({
            ...prevState,
            seconds: {
              sec1: prevState.seconds.sec1,
              sec2: seconds,
              sec3: seconds
            },
            mints: {
              mint1: prevState.mints.mint1,
              mint2: minutes,
              mint3: minutes
            }
          }))
        }
      } else {
        if (dualSetState === 1) {
          setTimeData(prevState => ({
            ...prevState,
            seconds: {
              sec1: seconds,
              sec2: seconds
            },
            mints: {
              mint1: minutes,
              mint2: minutes
            }
          }))
        }
      }
    }
  }

  const clearNextIndexRestValue = () => {
    const data = [...customExercisesList];
    const checkData = data?.[exerciseIndex];

    if (!setType?.includes(checkData?.activeSet?.item)) {
      if (findingData()?.activeSet?.item === "Drop Set") {
        setTimeData(prevState => ({
          ...prevState,
          seconds: {
            ...prevState.seconds,
            sec2: null
          },
          mints: {
            ...prevState.mints,
            mint2: null
          }
        }));
      } else {
        setTimeData(prevState => ({
          ...prevState,
          seconds: {
            ...prevState.seconds,
            sec2: null,
            sec3: null
          },
          mints: {
            ...prevState.mints,
            mint2: null,
            mint3: null
          }
        }));
      }
    } else {
      if (findingData()?.activeSet?.value === 4) {
        setTimeData(prevState => ({
          ...prevState,
          seconds: {
            ...prevState.seconds,
            sec2: null,
            sec3: null
          },
          mints: {
            ...prevState.mints,
            mint2: null,
            mint3: null
          }
        }));
      }
    }
  };


  const renderInputValue = key => {
    const data = [...customExercisesList]
    const checkData = data?.[exerciseIndex]

    if (!setType?.includes(checkData?.activeSet?.item)) {
      const val = droupSet[`state${key + 1}`]
      val ? setReps(val) : setReps("")
    } else {
      const val = dualReps[`state${key}`]
      val ? setTemporaryReps(val) : setTemporaryReps("")
    }
  }

  const renderRestInputValue = key => {
    const mints = timeData.mints[`mint${key}`]
    const second = timeData.seconds[`sec${key}`]
    mints ? setMinutes(mints) : setMinutes("")
    second ? setSeconds(second) : setSeconds("")
  }

  const updateDroupSets = value => {
    const tempObj = { ...droupSet }
    const key = `state${selectIndex + 1}`
    tempObj[key] = value
    setDroupSets(tempObj)
  }

  const updateMintsSets = value => {
    setTimeData(prevState => ({
      ...prevState,
      mints: {
        ...prevState.mints,
        ["mint" + dualSetState]: value
      }
    }))
  }

  const updateSecondsSets = value => {
    setTimeData(prevState => ({
      ...prevState,
      seconds: {
        ...prevState.seconds,
        ["sec" + dualSetState]: value
      }
    }))
  }

  const resultArray = () => {
    const arrayList = dualSets.map(item => {
      return Object.values(item).map(exercise => ({ ...exercise }))
    })
    const flattenedArray = arrayList.flat()
    return flattenedArray
  }
  const startCutomWorkout = async () => {
    if (title === "Rest" || title === "rest") {
      showMessage({ message: "Title should not be Rest", type: "danger" })
    } else {
      const payload = {
        name: title ? title : "title",
        user: profile?.id,
        created_date: pickedDate,
        custom_exercises: transformData(customExercisesList)
        // adding_exercise_in_workout: true
      }
      setCustom(true)
      navigation.pop(2)
      await postCustomExRequest(payload, true)

    }
  }
  // Flatten the array
  // const addDataCustomEx = () => {
  //   if (title === "Rest" || title === "rest") {
  //     showMessage({ message: "Title should not be Rest", type: "danger" })
  //   } else {
  //     const payload = {
  //       name: title ? title : "title",
  //       user: profile?.id,
  //       created_date: route?.params?.date,
  //       custom_exercises: transformData(props.customExercise)
  //       // adding_exercise_in_workout: true
  //     }

  //     props.postCustomExRequest(payload, false)
  //   }
  // }

  const list = ["a", "b", "c", "d", "e", "f", "g", "h"]
  const checkSets = () => {
    const jsonData = transformData(customExercisesList)

    for (const entry of jsonData) {
      if (entry.custom_sets.length === 0) {
        return false
      }
      for (const set of entry.custom_sets) {
        if (!set.reps) {
          return false
        }
      }
    }

    return true
  }

  const onSelectItem = i => {
    let array = [...selectedItem]
    if (array.includes(i)) {
      array = array.filter(index => index !== i)
    } else {
      if (activeCard?.item?.activeSet?.id === 1) {
        if (selectedItem.length < 2) {
          array.push(i)
        }
      } else if (activeCard?.item?.activeSet?.value === 4) {
        if (selectedItem.length < 3) {
          array.push(i)
        }
      } else {
        array = [i]
      }
    }
    setSelectedItem(array)
  }
  const updateDataParams = () => {
    const exercises = []
    getExerciseType &&
      getExerciseType.forEach((item, ind) => {
        if (selectedItem.includes(ind)) {
          exercises.push(item)
        }
      })

    const newObj = { type: exercises }

    const newData = customExercisesList.map((existingData, idx) => {
      if (idx === activeCard.index) {
        return { ...existingData, exercises: newObj }
      } else {
        return existingData
      }
    })

    props?.addCustomExercise(newData)
    replaceExercise.current.close()
    setActiveCard({ item: {}, index: 0 })
    setSelectedItem([])
  }
  const renderSets = item => {
    return (
      <>
        <View style={Gutters.smallTMargin}>
          {item?.exercises?.type?.length === 1 &&
            item?.single?.map((items, i) => {
              return (
                <View
                  // onPress={() => {
                  // setExerciseIndex(index)
                  // const data = {
                  //   index: i,
                  //   exerciseIndex: index
                  // }
                  // setCurrentIndex(data)
                  // }}
                  style={[
                    row,
                    Global.height35,
                    Gutters.tinyTMargin,
                    Gutters.largeHMargin,
                    alignItemsCenter,
                    justifyContentAround,
                    {
                      borderRadius: 6,
                      backgroundColor:
                        currentIndex?.index === i &&
                          currentIndex?.exerciseIndex === index
                          ? "#9cdaff"
                          : "#f3f1f4"
                    }
                  ]}
                >
                  <Text style={styles.setTextStyle} text={i + 1} />
                  <Text
                    style={[styles.setTextStyle, Gutters.mediumHMargin]}
                    text={items.reps}
                  />
                  <Text
                    style={styles.setTextStyle}
                    text={!items.rest ? "-" : items.rest}
                  />
                </View>
              )
            })}

          {item?.exercises?.type?.length > 1 &&
            item?.dualSets?.map((items, i) => {

              return (
                <View
                  style={[
                    Global.borderR10,
                    Gutters.largeHMargin,
                    Gutters.smallBMargin,
                    Gutters.regularBPadding,
                    {
                      backgroundColor:
                        currentIndex?.index === i &&
                          currentIndex?.exerciseIndex === index
                          ? "#74ccff"
                          : "#f1f1f1"
                    }
                  ]}
                // onPress={() => {
                // setExerciseIndex(index)
                // const data = {
                //   index: i,
                //   exerciseIndex: index
                // }
                // setCurrentIndex(data)
                // }}
                >
                  <Text style={styles.dualSetsStyle} text={i + 1} />
                  <View style={styles.dualSetsSecondView}>
                    <Text
                      style={styles.dualSetsName}
                      text={"a. " + item?.exercises?.type?.[0]?.name}
                    />
                    <Text
                      style={styles.dualSetRepsStyle}
                      text={items?.exerciseA?.reps}
                    />
                    <Text
                      style={styles.dualSetRestStyle}
                      text={
                        items?.exerciseA?.rest === 0
                          ? "-"
                          : items?.exerciseA?.rest
                      }
                    />
                  </View>
                  <View
                    style={[
                      styles.dualSetsSecondView1,
                      findingData()?.activeSet?.value === 4 &&
                      styles.borderStyle
                    ]}
                  >
                    <Text
                      style={styles.dualSecondEx}
                      text={"b. " + item?.exercises?.type?.[1]?.name}
                    />
                    <Text
                      style={styles.dualSecondReps}
                      text={items.exerciseB.reps}
                    />
                    <Text
                      style={styles.dualSecondRest}
                      text={
                        items?.exerciseB?.rest === 0
                          ? "-"
                          : items?.exerciseB?.rest
                      }
                    />
                  </View>
                  {
                    items.exerciseC &&
                    findingData()?.activeSet?.value === 4 && (
                      <View style={styles.dualSetsSecondView1}>
                        <Text
                          style={styles.dualSecondEx}
                          text={"c. " + item?.exercises?.type?.[2]?.name}
                        />
                        <Text
                          style={styles.dualSecondReps}
                          text={items.exerciseC?.reps}
                        />
                        <Text
                          style={styles.dualSecondRest}
                          text={
                            items?.exerciseC?.rest === 0
                              ? "-"
                              : items?.exerciseC?.rest
                          }
                        />
                      </View>
                    )}
                </View>
              )
            })}
        </View>
      </>
    )
  }
  const renderCard = ({ item, index }) => {
    return (
      <>

        <View
          style={[
            styles.tableView,
            Gutters.regularHMargin,
            Gutters.regularVMargin,
            Gutters.regularBPadding
          ]}
        >
          {
            //numberOfExercise === 1 ? (
            //<View style={[row, Gutters.smallHMargin, Gutters.smallVMargin]}>
            //<Image source={Images.profileBackGround} style={styles.exerciseImage} />
            //<Text text="Barbell bench press" style={styles.exerciseName} />
            //</View>
            // ) :

            item?.exercises?.type?.map((exe, i) => {
              return (
                <View style={[Gutters.smallHMargin, Gutters.smallVMargin]}>
                  <TouchableOpacity
                    onPress={() => {
                      getExerciseTypeRequest(exe?.exercise_type?.id, "")
                      setActiveCard({ item: item, index: index })
                      replaceExercise.current.open()
                    }}
                    style={row}
                  >
                    <Image
                      source={
                        exe?.video_thumbnail
                          ? { uri: exe?.video_thumbnail }
                          : Images.profileBackGround
                      }
                      style={styles.exerciseImage1}
                    />
                    <Text
                      style={styles.exerciseName1}
                      text={
                        item?.exercises?.type?.length === 1
                          ? `${exe.name}`
                          : `${list[i]}. ${exe.name}`
                      }
                    />
                  </TouchableOpacity>

                  {/* <View style={[row, Gutters.smallTMargin]}>
                <Image source={Images.profileBackGround} style={styles.exerciseImage1} />
                <Text style={styles.exerciseName1} text={`a. ${ex2}`} />
              </View> */}
                </View>
              )
            })
          }

          <View
            style={[
              row,
              Gutters.smallHMargin,
              Gutters.smallTMargin,
              justifyContentAround
            ]}
          >
            <Text style={styles.setStyle} text="Set" />
            <Text style={styles.setStyle} text="Reps" />
            <Text style={styles.setStyle} text="Rest" />
          </View>
          {renderSets(item)}

          <View style={Gutters.largeHMargin}>
            <TouchableOpacity
              onPress={() => {
                setCheckedReps(false)
                setCheckedRest(false)
                resetValues()
                setExerciseIndex(index)
                getRepsRange(item)
                if (item?.exercises?.type?.length === 1) {
                  refRBSheet.current.open()
                } else {
                  refRBSheetDual.current.open()
                }
              }}
              style={styles.addSetsButton}
            >
              <Text style={styles.addSetsText} text="Add Set" />
            </TouchableOpacity>
          </View>

          <View
            style={[
              row,
              Gutters.smallHMargin,
              Gutters.small2xTMargin,
              justifyContentBetween
            ]}
          >
            <TouchableOpacity
              style={row}
              onPress={() => {
                duplicateSet(item)
              }}
            // disabled={
            //   currentIndex?.exerciseIndex === index &&
            //   (currentIndex || currentIndex === 0)
            //     ? false
            //     : true
            // }
            >
              <Image
                source={duplicateIcon}
                style={{ height: 22, width: 20 }}
              />
              <Text
                style={{
                  fontWeight: "500",
                  color: "#7e7e7e",
                  marginLeft: 10
                }}
              >
                Duplicate
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setSelectedDeleteIndex(index)
                setDeleteModal(true)
              }}
            // disabled={
            //   currentIndex?.exerciseIndex === index &&
            //   (currentIndex || currentIndex === 0)
            //     ? false
            //     : true
            // }
            >
              <Image source={redBin} style={{ height: 22, width: 20 }} />
            </TouchableOpacity>
          </View>
        </View>

      </>
    )
  }
  const setObject = { "Super Set": "ss", "Giant Set": "gs", "Drop Set": "ds", "Triple Drop Set": "td", "Circuit Training": "ct", "Single Set": "r" }
  const getRepsRange = async (data) => {
    const exerciseIds = data.exercises.type.map(exercise => exercise.exercise_id);
    const payload = {
      exercise_set: {
        set_type: setObject[data?.activeSet?.item],
        exercise_ids: exerciseIds
      }
    };
    await getRepsRangeRequest(payload, true);
  };


  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={fillGrow}
        keyboardShouldPersistTaps={"handled"}
      >
        <View
          style={[
            row,
            Gutters.regularVMargin,
            Gutters.regularHMargin,
            alignItemsCenter,
            justifyContentBetween
          ]}
        >
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            {/* <Image
              source={Images.back2}
              style={{ width: 30, height: 25, resizeMode: "contain" }}
            /> */}
            <Text style={styles.backButtonText}>Add More</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            disabled={cRequesting || title === "" || !checkSets()}
            onPress={addDataCustomEx}
            style={[
              styles.doneStyle,
              {
                opacity: title === "" || !checkSets() ? 0.5 : 1
              }
            ]}
          >
            {cRequesting ? (
              <ActivityIndicator color={"black"} size={"small"} />
            ) : (
              <Text text="Done" bold style={{ color: "#626262" }} />
            )}
          </TouchableOpacity> */}
        </View>

        <View
          style={[
            row,
            Global.borderB,
            Global.height60,
            Global.borderAlto,
            alignItemsCenter,
            Gutters.regularHMargin,
            justifyContentBetween
          ]}
        >
          <InputField
            inputStyle={[Fonts.titleRegular, fill]}
            value={title || exerciseTitle}
            onChangeText={val => {
              setTitle(val)
              setExerciseTitle(val)

            }}
            placeholder="Workout Title"
            autoCapitalize="none"
          />
        </View>
        <FlatList
          data={customExercisesList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={(item, index) => renderCard(item, index)}
          ListEmptyComponent={() => {
            return (<View
              style={{
                marginTop: 100,
                flex: 1,
                justifyContent: "center"
              }}
            >
              <Text style={styles.exerciseFound} text={"No exercise found"} />
            </View>)
          }
          }
          ListFooterComponent={() => {
            return (
              <>
                {customExercisesList?.length !== 0 ? (
                  <View style={{ marginHorizontal: 15 }}>
                    <Button
                      text={"Add Exercise"}
                      textStyle={[{ color: "white" }]}
                      style={[styles.btn]}
                      // disabled={cRequesting || title === "" || !checkSets()}
                      onPress={() => navigation.goBack()}

                    // disabled={
                    //   activeSet?.id === 1
                    //     ? selectedItem?.length < 2
                    //     : activeSet?.value === 4
                    //     ? selectedItem?.length < 3
                    //     : selectedItem?.length < 1
                    // }
                    // onPress={makeDataParams}
                    />
                  </View>
                ) : null}
                {customExercisesList?.length !== 0 && (
                  <View style={{ marginHorizontal: 15 }}>
                    <Button
                      text={"Start Workout"}
                      textStyle={[{ color: "white" }]}
                      style={[
                        styles.btn,
                        {
                          flex: 1,
                          backgroundColor: "green",
                          opacity: (title === "" || exerciseTitle === '') || !checkSets() ? 0.5 : 1
                        }
                      ]}
                      disabled={cRequesting || (title === "" || exerciseTitle === '') || !checkSets()}
                      onPress={startCutomWorkout}
                      loading={cRequesting}

                    // disabled={
                    //   activeSet?.id === 1
                    //     ? selectedItem?.length < 2
                    //     : activeSet?.value === 4
                    //     ? selectedItem?.length < 3
                    //     : selectedItem?.length < 1
                    // }
                    // onPress={makeDataParams}
                    />
                  </View>
                )}
              </>
            )
          }
          }
        />

      </KeyboardAwareScrollView>

      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={false}
        animationType="slide"
        customStyles={{
          container: {
            backgroundColor: "#f1f1f1",
            borderRadius: 40,
            height: 320,
            marginBottom: 10
          },
          draggableIcon: {
            backgroundColor: "#f1f1f1"
          }
        }}
      >
        <View style={styles.secondView}>
          <ScrollView keyboardShouldPersistTaps={"handled"}>
            <View
              style={[row, fill, Gutters.small2xHMargin, justifyContentBetween]}
            >
              <View style={fill} />
              <View style={[fill, center]}>
                <Text style={styles.setOneTextStyle} text="Set 1" />
              </View>
              <TouchableOpacity
                onPress={() => refRBSheet.current.close()}
                style={[fill, alignItemsEnd, justifyContentCenter]}
              >
                <Image source={circleClose} style={{ height: 25, width: 25 }} />
              </TouchableOpacity>
            </View>

            <View
              style={[
                row,
                Gutters.largeHMargin,
                Gutters.small2xTMargin,
                justifyContentBetween
              ]}
            >
              <View style={styles.secondaryBoxes}>
                <Text
                  style={{ color: "#00a1ff", fontWeight: "700" }}
                  text="Enter Reps"
                />
                <Text
                  style={{ fontSize: 12, color: "black" }}
                  text={"Round " + (selectIndex + 1)}
                />

                <TextInput
                  style={{
                    fontSize: 20,
                    fontWeight: "400",
                    color: "#5e5e5e",
                    borderBottomColor: "black",
                    borderBottomWidth: 1,
                    paddingBottom: -1,
                    maxWidth: 70,
                    minWidth: 40,
                    numberOfLines: 1,
                    marginTop:
                      findingData()?.activeSet &&
                        (findingData()?.activeSet?.item === "Drop Set" ||
                          findingData()?.activeSet?.item === "Triple Set")
                        ? 0
                        : 5
                  }}
                  maxLength={4}
                  onChangeText={val => {
                    updateDroupSets(val)
                    setReps(val)
                  }}
                  placeholder={repsRangeState?.[0] || '0-100'}
                  placeholderTextColor={'gray'}
                  keyboardType="number-pad"
                  value={`${reps}`}
                />
                {(findingData()?.activeSet?.item === "Drop Set" ||
                  findingData()?.activeSet?.item === "Triple Set") && (
                    <View
                      style={{
                        flexDirection: "row",
                        position: "absolute",
                        bottom: 8
                      }}
                    >
                      {Array(findingData()?.activeSet?.value)
                        .fill()
                        .map((item, index) => (
                          <Pressable
                            // onPress={() => {
                            //   droupSet?.state2 && setReps(droupSet?.state2)
                            // }}
                            style={{
                              height: 5,
                              width: 5,
                              borderRadius: 50,
                              backgroundColor: "black",
                              marginRight: 5,
                              opacity: index === selectIndex ? 1 : 0.5
                            }}
                          />
                        ))}
                    </View>
                  )}
              </View>

              <View
                style={[
                  styles.secondaryBoxes,
                  {
                    width: 120,
                    opacity:
                      findingData()?.activeSet?.item === "Drop Set" ||
                        findingData()?.activeSet?.item === "Triple Set"
                        ? findingData()?.activeSet?.value !== selectIndex + 1
                          ? 0.8
                          : 1
                        : 1
                  }
                ]}
              >
                <Text
                  style={{ color: "#00a1ff", fontWeight: "700" }}
                  text="Enter Rest"
                />
                <View style={[row, alignItemsCenter]}>
                  <View>
                    <TextInput
                      style={{
                        width: 30,
                        height: 30,
                        marginTop: 14,
                        paddingBottom: -10,
                        borderBottomWidth: 1,
                        borderBottomColor: "#bababa",
                        color: "#626262"
                      }}
                      keyboardType="number-pad"
                      placeholder="00"
                      onChangeText={val => setMinutes(val)}
                      editable={
                        findingData()?.activeSet?.item === "Single Set"
                          ? true
                          : (findingData()?.activeSet?.item === "Drop Set" ||
                            findingData()?.activeSet?.item ===
                            "Triple Set") &&
                          (findingData()?.activeSet?.value === selectIndex + 1
                            ? true
                            : false)
                      }
                      maxLength={2}
                      value={`${minutes}`}
                    />
                    <Text
                      style={{ color: "#646464", fontSize: 12 }}
                      text="Min"
                    />
                  </View>

                  <Text
                    style={{
                      color: "#646464",
                      fontSize: 30,
                      fontWeight: "700",
                      marginHorizontal: 10
                    }}
                    text=":"
                  />
                  <View>
                    <TextInput
                      style={{
                        borderBottomColor: "#bababa",
                        width: 30,
                        height: 30,
                        borderBottomWidth: 1,
                        paddingBottom: -10,
                        marginTop: 14,
                        color: "#626262"
                      }}
                      keyboardType="number-pad"
                      maxLength={3}
                      placeholder="00"
                      onChangeText={val => setSeconds(val)}
                      editable={
                        findingData()?.activeSet?.item === "Single Set"
                          ? true
                          : (findingData()?.activeSet?.item === "Drop Set" ||
                            findingData()?.activeSet?.item ===
                            "Triple Set") &&
                          (findingData()?.activeSet?.value === selectIndex + 1
                            ? true
                            : false)
                      }
                      value={`${seconds}`}
                    />

                    <Text
                      style={{ color: "#646464", fontSize: 12 }}
                      text="Sec"
                    />
                  </View>
                </View>
              </View>
            </View>
            <View
              style={[
                row,
                Gutters.largeHMargin,
                Gutters.small2xTMargin,
                justifyContentBetween
              ]}
            >
              <View style={[row, Gutters.smallTMargin, alignItemsCenter]}>
                <TouchableOpacity
                  onPress={() => {
                    setCheckedReps(!checkedReps)
                    // if (reps !== "") {
                    //   remaingSameDualKeep()
                    // }
                  }}
                >
                  <Image
                    source={checkedReps ? radioDoneBlue : radioBlue}
                    style={{ width: 20, height: 20 }}
                  />
                </TouchableOpacity>

                <Text
                  style={{
                    fontSize: 12,
                    color: "#646464",
                    textAlign: "center"
                  }}
                >
                  Keep reps the{"\n"} same for {"\n"} remaining sets
                </Text>
              </View>
              <View style={[row, Gutters.smallTMargin, alignItemsCenter]}>
                <TouchableOpacity
                  onPress={() => {
                    setCheckedRest(!checkedRest)
                  }}
                >
                  <Image
                    source={checkedRest ? radioDoneBlue : radioBlue}
                    style={{ width: 20, height: 20 }}
                  />
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#646464",
                    textAlign: "center"
                  }}
                >
                  Keep rest the{"\n"} same for {"\n"} remaining sets
                </Text>
              </View>
            </View>

            <View
              style={[center, Gutters.smallVMargin, Gutters.regularBPadding]}
            >
              <TouchableOpacity
                style={{
                  paddingVertical: 15,
                  backgroundColor: "#00a1ff",
                  borderRadius: 50,
                  alignItems: "center",
                  width: 120,
                  opacity: reps === "" ? 0.5 : 1
                }}
                onPress={() => {
                  if (
                    findingData()?.activeSet?.item === "Drop Set" ||
                    findingData()?.activeSet?.item === "Triple Set"
                  ) {
                    setSelectIndex(selectIndex + 1)
                    if (
                      findingData()?.activeSet?.item === "Drop Set"
                        ? selectIndex + 1 === 2
                        : selectIndex + 1 === 3
                    ) {
                      setSelectIndex(0)
                      const myData = {
                        // ex_id: findingData()?.exercises?.[0]?.id,
                        set_no: 1,
                        reps:
                          droupSet &&
                          droupSet?.state1 +
                          "/" +
                          droupSet?.state2 +
                          (droupSet?.state3 ? "/" + droupSet?.state3 : ""),
                        weight: "",
                        set_type: selectIndex + 1 === 3 ? "tds" : "ds",
                        rest: minutes * 60 + parseFloat(seconds ? seconds : 0),
                        timer: minutes * 60 + parseFloat(seconds ? seconds : 0)
                      }

                      setSets(prevValues => [
                        ...prevValues,
                        {
                          // ex_id: findingData()?.exercises?.[0]?.id,
                          set_no: 1,
                          reps:
                            droupSet &&
                            droupSet?.state1 +
                            "/" +
                            droupSet?.state2 +
                            (droupSet?.state3 ? "/" + droupSet?.state3 : ""),
                          weight: "",
                          set_type: selectIndex + 1 === 3 ? "tds" : "ds",
                          rest:
                            minutes * 60 + parseFloat(seconds ? seconds : 0),
                          timer:
                            minutes * 60 + parseFloat(seconds ? seconds : 0)
                        }
                      ])
                      if (myData.rest != 0) {
                        updateReducer("single", myData)
                        refRBSheet.current.close()
                        resetValues()
                      }
                      else {
                        Alert.alert(
                          'Rest Time',
                          "Please enter rest time")
                      }
                    }
                    renderInputValue(selectIndex + 1)
                    renderRestInputValue(selectIndex + 1)
                  } else {
                    const myData = {
                      // ex_id: findingData()?.exercises?.[0]?.id,
                      set_no: 1,
                      reps: reps,
                      weight: "",
                      set_type: "r",
                      rest: minutes * 60 + parseFloat(seconds ? seconds : 0),
                      timer: minutes * 60 + parseFloat(seconds ? seconds : 0)
                    }
                    if (myData.rest != 0) {
                      updateReducer("single", myData)
                      refRBSheet.current.close()
                      resetValues()
                    }
                    else {
                      Alert.alert(
                        'Rest Time',
                        "Please enter rest time")

                    }
                  }
                }}
                disabled={reps !== "" ? false : true}
              >
                <Text style={{ color: "#ffff", fontWeight: "700" }}>
                  {findingData()?.activeSet &&
                    (findingData()?.activeSet?.item === "Drop Set" ||
                      findingData()?.activeSet?.item === "Triple Set") &&
                    selectIndex + 1 < findingData()?.activeSet?.value
                    ? "Round " + (selectIndex + 2)
                    : "Done"}
                </Text>
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
            backgroundColor: "#f1f1f1",
            borderRadius: 40,
            height: 330,
            marginBottom: 10
          },
          draggableIcon: {
            backgroundColor: "#f1f1f1"
          }
        }}
      >
        <View style={styles.secondView}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <View style={{ marginRight: 20 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <Text
                  style={{
                    color: "#636363",
                    fontSize: 20,
                    fontWeight: "700",
                    textAlign: "center",
                    flex: 1
                  }}
                >
                  {/* {dualSetState === 1 ? ex1 : ex2} */}
                  {findingData()?.exercises?.[dualSetState - 1]?.name}
                </Text>
                <TouchableOpacity
                  onPress={() => refRBSheetDual.current.close()}
                >
                  <Image
                    source={circleClose}
                    style={{ height: 20, width: 20 }}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.dualDotsStyle}>
                {Array(findingData()?.activeSet?.value === 4 ? 3 : 2)
                  .fill()
                  .map((item, index) => (
                    <TouchableOpacity
                      style={styles.dotHeight}
                      onPress={() => {
                        setDualSetState(index + 1)
                        renderInputValue(index + 1)
                        renderRestInputValue(index + 1)
                      }}
                    >
                      <View
                        style={[
                          styles.dotStyle,
                          {
                            opacity: dualSetState === index + 1 ? 1 : 0.3,
                            marginRight: 3
                          }
                        ]}
                      ></View>
                    </TouchableOpacity>
                  ))}

                {/* <TouchableOpacity
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
                </TouchableOpacity> */}
              </View>
            </View>

            <View
              style={{
                marginLeft: 45,
                marginRight: 25,
                justifyContent: "space-between",
                flexDirection: "row",
                marginTop: 20
              }}
            >
              <View>
                <View style={styles.secondaryBoxes}>
                  <Text style={{ color: "#00a1ff", fontWeight: "700" }}>
                    Enter Reps
                  </Text>
                  <TextInput
                    style={{
                      fontSize: 20,
                      fontWeight: "400",
                      color: "#626262",
                      marginTop: 5,
                      borderBottomWidth: 1,
                      maxWidth: 70,
                      minWidth: 40
                      // marginTop: 15
                    }}
                    maxLength={4}
                    placeholder={repsRangeState?.[dualSetState - 1] || '0-100'}
                    value={`${temporaryReps}`}
                    keyboardType="number-pad"
                    onChangeText={val => {
                      updateDualReps(val)
                      setTemporaryReps(val)
                    }}
                  />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 10,
                    alignItems: "center"
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setCheckedReps(!checkedReps)
                      // if (temporaryReps !== "") {
                      //   remaingSameDualKeep()
                      // }
                    }}
                  >
                    <Image
                      source={checkedReps ? radioDoneBlue : radioBlue}
                      style={{ width: 20, height: 20 }}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#646464",
                      textAlign: "center"
                    }}
                  >
                    Keep reps the{"\n"} same for {"\n"} remaining sets
                  </Text>
                </View>
              </View>

              <View>
                <View
                  style={[
                    styles.secondaryBoxes,
                    {
                      width: 120
                      //  opacity: dualSetState === 1 ? 0.7 : 1
                    }
                  ]}
                >
                  <Text
                    style={{
                      color: "#00a1ff",
                      fontWeight: "700"
                      // opacity: dualSetState === 1 ? 0.5 : 1,
                    }}
                  >
                    Enter Rest
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View>
                      <TextInput
                        style={{
                          borderBottomColor: "#bababa",
                          marginTop: 14,
                          height: 30,
                          width: 30,
                          borderBottomWidth: 1,
                          paddingBottom: -10,
                          color: "#626262"
                        }}
                        placeholder="00"
                        onChangeText={val => {
                          updateMintsSets(val)
                          setMinutes(val)
                        }}
                        // editable={dualSetState === 1 ? false : true}
                        maxLength={2}
                        // value={`${dualSetState === 1 ? '' : minutes}`}
                        value={minutes}
                        keyboardType="number-pad"
                      />
                      <Text style={{ color: "#646464", fontSize: 12 }}>
                        Min
                      </Text>
                    </View>

                    <Text
                      style={{
                        color: "#646464",
                        fontSize: 30,
                        fontWeight: "700",
                        marginHorizontal: 10
                      }}
                    >
                      :
                    </Text>
                    <View>
                      <TextInput
                        style={{
                          borderBottomColor: "#bababa",
                          width: 30,
                          height: 30,
                          borderBottomWidth: 1,
                          paddingBottom: -10,
                          marginTop: 14,
                          color: "#626262"
                        }}
                        placeholder="00"
                        maxLength={3}
                        value={seconds}
                        // editable={dualSetState === 1 ? false : true}
                        onChangeText={val => {
                          updateSecondsSets(val)
                          setSeconds(val)
                        }}
                        keyboardType="decimal-pad"
                      />

                      <Text style={{ color: "#646464", fontSize: 12 }}>
                        Sec
                      </Text>
                    </View>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 10,
                    alignItems: "center"
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setCheckedRest(!checkedRest)
                    }}
                  >
                    <Image
                      source={checkedRest ? radioDoneBlue : radioBlue}
                      style={{ width: 20, height: 20 }}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#646464",
                      textAlign: "center"
                    }}
                  >
                    Keep rest the{"\n"} same for {"\n"} remaining sets
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: 10,
                marginBottom: 10
              }}
            >
              <TouchableOpacity
                style={[
                  styles.cardStyle,
                  {
                    opacity: temporaryReps === "" ? 0.5 : 1
                  }
                ]}
                onPress={() => {

                  if (
                    dualSetState <
                    (findingData()?.activeSet?.value === 4 ? 3 : 2)
                  ) {
                    setDualSetState(dualSetState + 1)
                    renderInputValue(dualSetState + 1)
                    renderRestInputValue(dualSetState + 1)
                    // resetValues();
                    // setTemporaryReps();
                  } else {

                    setDualSetState(1)
                    setReps("")

                    if (findingData()?.activeSet?.value === 4) {
                      setDualSets(prevValues => [
                        ...prevValues,
                        {
                          exerciseA: {
                            reps: dualReps.state1,
                            rest:
                              (timeData?.mints?.mint1
                                ? timeData?.mints?.mint1
                                : 0) *
                              60 +
                              parseFloat(
                                timeData?.seconds?.sec1
                                  ? timeData?.seconds?.sec1
                                  : 0
                              ),
                            // ex_id: findingData()?.exercises?.[0]?.id,
                            set_no: dualSets?.length + 1,
                            weight: "",
                            set_type: "gs",
                            timer:
                              (timeData?.mints?.mint1
                                ? timeData?.mints?.mint1
                                : 0) *
                              60 +
                              parseFloat(
                                timeData?.seconds?.sec1
                                  ? timeData?.seconds?.sec1
                                  : 0
                              )
                          },
                          exerciseB: {
                            reps: dualReps.state2,
                            rest:
                              (timeData?.mints?.mint2
                                ? timeData?.mints?.mint2
                                : 0) *
                              60 +
                              parseFloat(
                                timeData?.seconds?.sec2
                                  ? timeData?.seconds?.sec2
                                  : 0
                              ),
                            // ex_id: findingData()?.exercises?.[1]?.id,
                            set_no: dualSets?.length + 1,
                            weight: "",
                            set_type: "gs",
                            timer:
                              (timeData?.mints?.mint2
                                ? timeData?.mints?.mint2
                                : 0) *
                              60 +
                              parseFloat(
                                timeData?.seconds?.sec2
                                  ? timeData?.seconds?.sec2
                                  : 0
                              )
                          },
                          exerciseC: {
                            reps: dualReps.state3,
                            rest:
                              (timeData?.mints?.mint3
                                ? timeData?.mints?.mint3
                                : 0) *
                              60 +
                              parseFloat(
                                timeData?.seconds?.sec3
                                  ? timeData?.seconds?.sec3
                                  : 0
                              ),
                            // ex_id: findingData()?.exercises?.[2]?.id,
                            set_no: dualSets?.length + 1,
                            weight: "",
                            set_type: "gs",
                            timer:
                              (timeData?.mints?.mint3
                                ? timeData?.mints?.mint3
                                : 0) *
                              60 +
                              parseFloat(
                                timeData?.seconds?.sec3
                                  ? timeData?.seconds?.sec3
                                  : 0
                              )
                          }
                        }
                      ])
                      const newData = {
                        exerciseA: {
                          reps: dualReps.state1,
                          rest:
                            (timeData?.mints?.mint1
                              ? timeData?.mints?.mint1
                              : 0) *
                            60 +
                            parseFloat(
                              timeData?.seconds?.sec1
                                ? timeData?.seconds?.sec1
                                : 0
                            ),
                          // ex_id: findingData()?.exercises?.[0]?.id,
                          set_no: dualSets?.length + 1,
                          weight: "",
                          set_type: "gs",
                          timer:
                            (timeData?.mints?.mint1
                              ? timeData?.mints?.mint1
                              : 0) *
                            60 +
                            parseFloat(
                              timeData?.seconds?.sec1
                                ? timeData?.seconds?.sec1
                                : 0
                            )
                        },
                        exerciseB: {
                          reps: dualReps.state2,
                          rest:
                            (timeData?.mints?.mint2
                              ? timeData?.mints?.mint2
                              : 0) *
                            60 +
                            parseFloat(
                              timeData?.seconds?.sec2
                                ? timeData?.seconds?.sec2
                                : 0
                            ),
                          // ex_id: findingData()?.exercises?.[1]?.id,
                          set_no: dualSets?.length + 1,
                          weight: "",
                          set_type: "gs",
                          timer:
                            (timeData?.mints?.mint2
                              ? timeData?.mints?.mint2
                              : 0) *
                            60 +
                            parseFloat(
                              timeData?.seconds?.sec2
                                ? timeData?.seconds?.sec2
                                : 0
                            )
                        },
                        exerciseC: {
                          reps: dualReps.state3,
                          rest:
                            (timeData?.mints?.mint3
                              ? timeData?.mints?.mint3
                              : 0) *
                            60 +
                            parseFloat(
                              timeData?.seconds?.sec3
                                ? timeData?.seconds?.sec3
                                : 0
                            ),
                          // ex_id: findingData()?.exercises?.[2]?.id,
                          set_no: dualSets?.length + 1,
                          weight: "",
                          set_type: "gs",
                          timer:
                            (timeData?.mints?.mint3
                              ? timeData?.mints?.mint3
                              : 0) *
                            60 +
                            parseFloat(
                              timeData?.seconds?.sec3
                                ? timeData?.seconds?.sec3
                                : 0
                            )
                        }
                      }
                      const anyRestIsZero = Object.values(newData).some(exercise => exercise.rest === 0);
                      anyRestIsZero
                        ? Alert.alert(
                          'Rest Time',
                          "Please enter rest time"
                        ) : (
                          updateReducer("dualSets", newData), refRBSheetDual.current.close()
                        )

                    } else {
                      setDualSets(prevValues => [
                        ...prevValues,
                        {
                          exerciseA: {
                            reps: dualReps.state1,
                            rest:
                              (timeData?.mints?.mint1
                                ? timeData?.mints?.mint1
                                : 0) *
                              60 +
                              parseFloat(
                                timeData?.seconds?.sec1
                                  ? timeData?.seconds?.sec1
                                  : 0
                              ),
                            // ex_id: findingData()?.exercises?.[0]?.id,
                            set_no: dualSets?.length + 1,
                            weight: "",
                            set_type: "ss",
                            timer:
                              (timeData?.mints?.mint1
                                ? timeData?.mints?.mint1
                                : 0) *
                              60 +
                              parseFloat(
                                timeData?.seconds?.sec1
                                  ? timeData?.seconds?.sec1
                                  : 0
                              )
                          },
                          exerciseB: {
                            reps: dualReps.state2,
                            rest:
                              (timeData?.mints?.mint2
                                ? timeData?.mints?.mint2
                                : 0) *
                              60 +
                              parseFloat(
                                timeData?.seconds?.sec2
                                  ? timeData?.seconds?.sec2
                                  : 0
                              ),
                            // ex_id: findingData()?.exercises?.[1].id,
                            set_no: dualSets?.length + 1,
                            weight: "",
                            set_type: "ss",
                            timer:
                              (timeData?.mints?.mint2
                                ? timeData?.mints?.mint2
                                : 0) *
                              60 +
                              parseFloat(
                                timeData?.seconds?.sec2
                                  ? timeData?.seconds?.sec2
                                  : 0
                              )
                          }
                        }
                      ])
                      const newData = {
                        exerciseA: {
                          reps: dualReps.state1,
                          rest:
                            (timeData?.mints?.mint1
                              ? timeData?.mints?.mint1
                              : 0) *
                            60 +
                            parseFloat(
                              timeData?.seconds?.sec1
                                ? timeData?.seconds?.sec1
                                : 0
                            ),
                          // ex_id: findingData()?.exercises?.[0]?.id,
                          set_no: dualSets?.length + 1,
                          weight: "",
                          set_type: "ss",
                          timer:
                            (timeData?.mints?.mint1
                              ? timeData?.mints?.mint1
                              : 0) *
                            60 +
                            parseFloat(
                              timeData?.seconds?.sec1
                                ? timeData?.seconds?.sec1
                                : 0
                            )
                        },
                        exerciseB: {
                          reps: dualReps.state2,
                          rest:
                            (timeData?.mints?.mint2
                              ? timeData?.mints?.mint2
                              : 0) *
                            60 +
                            parseFloat(
                              timeData?.seconds?.sec2
                                ? timeData?.seconds?.sec2
                                : 0
                            ),
                          // ex_id: findingData()?.exercises?.[1].id,
                          set_no: dualSets?.length + 1,
                          weight: "",
                          set_type: "ss",
                          timer:
                            (timeData?.mints?.mint2
                              ? timeData?.mints?.mint2
                              : 0) *
                            60 +
                            parseFloat(
                              timeData?.seconds?.sec2
                                ? timeData?.seconds?.sec2
                                : 0
                            )
                        }
                      }
                      const anyRestIsZero = Object.values(newData).some(exercise => exercise.rest === 0);
                      anyRestIsZero ? Alert.alert(
                        'Rest Time',
                        "Please enter rest time") : (
                        updateReducer("dualSets", newData),
                        refRBSheetDual.current.close()
                      )
                    }

                    resetValues()
                  }
                }}
                disabled={temporaryReps === "" ? true : false}
              >
                <Text style={{ color: "#ffff", fontWeight: "700" }}>
                  {findingData()?.activeSet &&
                    dualSetState < (findingData()?.activeSet?.value === 4 ? 3 : 2)
                    ? "Next"
                    : "Done"}
                </Text>

                {/* <Image
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
                /> */}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </RBSheet>
      <BottomSheet
        reff={replaceExercise}
        isDrage={true}
        h={700}
        Iconbg={Colors.athensgray}
        bg={Colors.athensgray}
        customStyles={{
          draggableIcon: {
            backgroundColor: "red"
          }
        }}
        onClose={() => { setActiveCard({ item: {}, index: 0 }), setSelectedItem([]) }}
      >
        <View
          style={[
            row,
            justifyContentBetween,
            { marginVertical: 20, marginHorizontal: 25 }
          ]}
        >
          <Text
            text="Popular Exercises"
            style={[styles.heading, { color: "#626262" }]}
          />
          <TouchableOpacity
            disabled={
              activeCard?.item?.activeSet?.id === 1
                ? selectedItem?.length < 2
                : activeCard?.item?.activeSet?.value === 4
                  ? selectedItem?.length < 3
                  : selectedItem?.length < 1
            }
            onPress={updateDataParams}
            style={[styles.doneButton, justifyContentCenter, alignItemsCenter, {
              backgroundColor: '#00a1ff',


            }]}
          >
            <Text style={[{

              fontSize: 19,
              fontWeight: "bold",
            }]}>Done</Text>
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View style={{ marginBottom: 20 }}>
            {getExerciseType === false && !requesting && requesting ? (
              <ActivityIndicator size={"large"} color="green" />
            ) : getExerciseType && getExerciseType?.length ? (
              getExerciseType.map((item, i) => (
                <TouchableOpacity
                  style={[
                    styles.cardView,
                    {
                      backgroundColor: selectedItem.includes(i)
                        ? "#74ccff"
                        : "#e5e5e5"
                    }
                  ]}
                  onPress={() => onSelectItem(i)}
                >
                  <View
                    style={[
                      row,
                      justifyContentBetween,
                      { position: "relative" }
                    ]}
                  >
                    <View style={[center, styles.cardImg]}>
                      <Image
                        source={
                          item?.pictures[0]?.image
                            ? { uri: item?.pictures[0]?.image }
                            : item?.video_thumbnail
                              ? { uri: item?.video_thumbnail }
                              : foodImage
                        }
                        style={{ width: 80, height: 45 }}
                      />
                    </View>
                    <View style={[center, { marginRight: 50, flex: 1 }]}>
                      <Text text={item.name} style={styles.heading1} />
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={[styles.notFound, justifyContentCenter]}>
                <Text bold>No exercise found</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </BottomSheet>

      <Modal
        isVisible={deleteModal}
        animationIn="zoomIn"
        animationOut={"zoomOut"}
        onBackdropPress={() => setDeleteModal(false)}
      >
        <View
          style={[
            Gutters.small2xHMargin,
            Global.secondaryBg,
            Global.borderR10,
            center,
            {
              height: 250
            }
          ]}
        >
          <Text
            style={styles.deleteText}
            text="Are you sure you want to delete this exercise?"
          />

          <View style={[row, Gutters.small2xTMargin]}>
            <TouchableOpacity
              style={[styles.delBtnStyles, { backgroundColor: "#74ccff" }]}
              onPress={() => deleteSet()}
            >
              <Text style={styles.yesNoButton} text="Yes" />
            </TouchableOpacity>
            <View style={Gutters.small2xHMargin} />
            <TouchableOpacity
              style={[styles.delBtnStyles, { backgroundColor: "#f3f1f4" }]}
              disabled={currentIndex?.index === false ? true : false}
              onPress={() => setDeleteModal(false)}
            >
              <Text style={styles.yesNoButton} text="No" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  doneStyle: {
    backgroundColor: "#e9e9e9",
    borderRadius: 20,
    height: 25,
    width: 70,
    justifyContent: "center",
    alignItems: "center"
  },
  exerciseName: {
    marginLeft: 10,
    color: "#636363",
    fontSize: 20,
    fontWeight: "700"
  },
  exerciseImage: { height: 90, width: 100, borderRadius: 10 },
  exerciseImage1: { height: 60, width: 90, borderRadius: 5 },
  exerciseName1: {
    marginLeft: 20,
    color: "#636363",
    fontSize: 20,
    fontWeight: "700",
    alignSelf: "center",
    flex: 1
  },
  exerciseFound: {
    marginLeft: 20,
    color: "#636363",
    fontSize: 20,
    fontWeight: "700",
    alignSelf: "center"
    // flex: 1
  },
  setStyle: { color: "#00a1ff", fontWeight: "700" },
  setTextStyle: { color: "#5e5e5e", fontWeight: "700" },
  dualSetsStyle: {
    marginLeft: 20,
    color: "#636363",
    fontSize: 17,
    fontWeight: "700",
    marginTop: 5
  },
  dualSetsName: {
    color: "#636363",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 5,
    width: 80,
    marginLeft: -10
  },
  dualSetRepsStyle: {
    color: "#636363",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 5,
    width: 50,
    marginHorizontal: 40,
    marginLeft: 10
  },
  dualSetRestStyle: {
    color: "#636363",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 5,
    width: 50,
    marginRight: -30
  },
  dualSecondEx: {
    color: "#636363",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 5,
    width: 80,
    marginLeft: -10
  },
  dualSecondReps: {
    color: "#636363",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 5,
    width: 50,
    marginHorizontal: 40,
    marginLeft: 10
  },
  dualSecondRest: {
    color: "#636363",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 5,
    width: 50,
    marginRight: -30
  },
  addSetsButton: {
    backgroundColor: "#e9e9e9",
    paddingHorizontal: 10,
    borderRadius: 6,
    marginTop: 7,
    height: 22,
    width: 80,
    alignItems: "center"
  },
  doneButton: {
    borderRadius: 6,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  addSetsText: {
    fontWeight: "500",
    color: "#7e7e7e",
    marginTop: 2
  },
  deleteText: { fontSize: 24, fontWeight: "700", textAlign: "center", color: 'black' },
  yesNoButton: { fontWeight: "700", color: "#000" },
  setOneTextStyle: { color: "#636363", fontSize: 20, fontWeight: "700" },

  container: {
    flexGrow: 1,
    backgroundColor: "white"
  },
  backgroundStyle: {
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 30,
    flexDirection: "row"
  },
  mainTextStyle: { fontSize: 20, fontWeight: "bold" },
  subTextStyle: { fontSize: 16, color: "gray" },
  tableView: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.22,
    borderRadius: 5,
    shadowRadius: 2.22,
    elevation: 3
  },
  secondView: {
    borderRadius: 35,
    backgroundColor: "#f1f1f1"
  },
  secondaryBoxes: {
    width: 110,
    height: 100,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.22,
    borderRadius: 5,
    shadowRadius: 2.22,
    elevation: 3,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 10
  },
  dualSetsSecondView: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#bababa",
    marginHorizontal: 20,
    paddingBottom: 10,
    justifyContent: "space-around"
  },
  borderStyle: {
    borderBottomWidth: 1,
    borderBottomColor: "#bababa",
    paddingBottom: 10
  },
  dualSetsSecondView1: {
    flexDirection: "row",
    marginTop: 10,
    marginHorizontal: 20,
    justifyContent: "space-around"
  },
  delBtnStyles: {
    width: 80,
    height: 50,
    backgroundColor: "red",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center"
  },
  dotStyle: {
    height: 8,
    width: 8,
    borderRadius: 50,
    alignContent: "center",
    alignItems: "center",
    backgroundColor: "#000"
    // opacity: 0.3,
  },
  dotHeight: {
    height: 15,
    width: 15
  },
  dualDotsStyle: {
    alignItems: "center",
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center"
  },
  cardStyle: {
    paddingVertical: 15,
    backgroundColor: "#00a1ff",
    borderRadius: 50,
    alignItems: "center",
    width: 140
  },
  btn: {
    backgroundColor: "#00a1ff",
    marginBottom: 10,
    textAlign: "center",
    height: 40
  },
  heading: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold"
  },
  cardView: {
    padding: 13,
    marginTop: 15,
    borderRadius: 10,
    backgroundColor: Colors.brightturquoise,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 5,
    marginHorizontal: 8
  },
  cardImg: {
    backgroundColor: "white",
    width: 90,
    height: 60,
    borderRadius: 10
  },
  backButton: {
    flexDirection: 'row', // Align items horizontally
    alignItems: 'center', // Center items vertically
    padding: 10, // Add some padding
    backgroundColor: '#f0f0f0', // Background color
    borderRadius: 5, // Rounded corners
  },
  backButtonText: {
    marginLeft: 5, // Add some space between text and icon
  },
})

const mapStateToProps = state => ({
  customExercisesList: state.addExerciseReducer.customExercisesList,
  cRequesting: state.addExerciseReducer.cRequesting,
  getCustomExState: state.addExerciseReducer.getCustomExState,
  todaySessions: state.programReducer.todaySessions,
  profile: state.login.userDetail,
  getExerciseType: state.addExerciseReducer.getExerciseType,
  requesting: state.addExerciseReducer.requesting,
  pickedDate: state.programReducer.pickedDate,
  exerciseTitle: state.programReducer.exerciseTitle,
  repsRangeState: state.programReducer.repsRangeState
})


const mapDispatchToProps = dispatch => ({
  postCustomExRequest: (data, start) =>
    dispatch(postCustomExRequest(data, start)),
  addCustomExercise: data => dispatch(addCustomExercise(data)),
  getExerciseTypeRequest: (data, search) =>
    dispatch(getExerciseTypeRequest(data, search)),
  setCustom: type => dispatch(setCustom(type)),
  setExerciseTitle: type => dispatch(setExerciseTitle(type)),
  getRepsRangeRequest: (data, request) => dispatch(getRepsRangeRequest(data, request))
})
export default connect(mapStateToProps, mapDispatchToProps)(CustomExercise)
