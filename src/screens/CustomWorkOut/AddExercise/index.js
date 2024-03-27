import React, { useState, useEffect, useRef } from "react"
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
  Linking
} from "react-native"
import { Text, BottomSheet, Button, InputField } from "../../../components"
import VideoPlayer from "../../../components/VideoPlayer"
import Video from "react-native-video"
import Modal from "react-native-modal"

import { Global, Gutters, Layout, Colors, Images, Fonts } from "../../../theme"

import { connect } from "react-redux"

import { TextInput } from "react-native-gesture-handler"
import {
  addCustomExercise,
  getExerciseRequest,
  getExerciseTypeRequest
} from "../../../ScreenRedux/addExerciseRedux"
import Loader from "../../../components/Loader"
import { useIsFocused } from "@react-navigation/native"

const data = [
  { id: 1, value: 1, item: "Super Set" },
  { id: 2, value: 4, item: "Giant Set" },
  { id: 3, value: 2, item: "Drop Set" },
  { id: 4, value: 3, item: "Triple Set" }
]
const AddExercies = props => {
  const { navigation, getExerciseState, requesting, getExerciseType, customExercisesList } = props
  let refDescription = useRef("")
  const [activeSet, setActiveSet] = useState(false)
  const [selectedItem, setSelectedItem] = useState([])

  const [desription, setDesription] = useState(false)
  const [selectMuscle, setSelectMuscle] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [selectItem, setSelectItem] = useState("")

  useEffect(() => {
    // isFocused && props.getExerciseRequest()
    props.getExerciseRequest()

  }, [])
  const isFocused = useIsFocused()
  useEffect(() => {
    setSelectedItem([])
    setActiveSet(false)
    setSelectMuscle(0)
  }, [isFocused])

  useEffect(() => {
    getExerciseState &&
      props.getExerciseTypeRequest(
        getExerciseState && getExerciseState[0]?.id,
        ""
      )
    // !activeSet && setActiveSet(data[0])
  }, [getExerciseState])

  const onSelectItem = i => {
    let array = [...selectedItem]
    if (array.includes(i)) {
      array = array.filter(index => index !== i)
      setSelectedItem(array)
    } else {
      if (activeSet?.id === 1) {
        if (selectedItem.length < 2) {
          array.push(i)
          setSelectedItem(array)
        }
      } else if (activeSet?.value === 4) {
        if (selectedItem.length < 3) {
          array.push(i)
          setSelectedItem(array)
        }
      } else {
        setSelectedItem([i])
      }
    }
  }

  const makeDataParams = () => {
    refDescription.current.close()
    const updatedFeeds = [...getExerciseType]
    const exercises = []
    updatedFeeds.findIndex((item, ind) => {
      selectedItem.map((dd, i) => {
        if (ind === dd) {
          exercises.push(item)
        }
      })
    })
    const data = activeSet?.item
      ? activeSet
      : { id: 0, value: 0, item: "Single Set" }

    navigation.navigate("CustomExercise", { exercises, activeSet: data })
    let newObj = {}
    newObj[`type`] = exercises
    const newData = [
      ...customExercisesList,
      { exercises: newObj, activeSet: data }
    ]
    props.addCustomExercise(newData)
  }

  const { row, fill, center, alignItemsCenter, justifyContentBetween } = Layout
  const { foodImage, iconI, circleClose } = Images

  const onChange = value => {
    props.getExerciseTypeRequest(
      selectItem ? selectItem : getExerciseState[0]?.id,
      value
    )
  }

  const onHandlePress = (i, item) => {
    setSelectedItem([])
    setSelectMuscle(i)
    setSelectItem(item.id)
    setSearch("")
    props.getExerciseTypeRequest(item.id, "")
  }

  return (
    <SafeAreaView style={[fill, { backgroundColor: "white" }]}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={{ marginHorizontal: 20 }}>
          <View style={[row, alignItemsCenter, Gutters.regularTMargin]}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={[fill, row, alignItemsCenter]}
            >
              <Image
                source={Images.back2}
                style={{ width: 30, height: 25, resizeMode: "contain" }}
              />
            </TouchableOpacity>
            <View
              style={[
                fill,
                Layout.row,
                Global.borderB,
                Global.borderAlto,
                Layout.alignItemsCenter
              ]}
            >
              <InputField
                inputStyle={[Global.height40, Fonts.textMedium, { padding: 0 }]}
                placeholder="search"
                placeholderTextColor={"#626262"}
                autoCapitalize="none"
                value={search}
                onChangeText={val => {
                  onChange(val)
                  setSearch(val)
                }}
              />
            </View>
            <View style={fill} />
          </View>
          <ScrollView
            horizontal={true}
            contentContainerStyle={{ marginTop: 20, paddingBottom: 10 }}
            keyboardShouldPersistTaps="handled"
          >
            {data?.map((set, i) => {
              return (
                <TouchableOpacity
                  key={i}
                  onPress={() => {
                    setSelectedItem([])
                    if (activeSet?.id === set?.id) {
                      setActiveSet("")
                    } else {
                      setActiveSet(set)
                    }
                  }}
                  style={[
                    styles.pillStyle,
                    center,
                    {
                      backgroundColor:
                        activeSet.id === set.id ? "#74ccff" : "#fff"
                    }
                  ]}
                >
                  <Text
                    text={set.item}
                    style={[
                      styles.pillText,
                      { color: activeSet.id !== set.id ? "#000" : "#fff" }
                    ]}
                  />
                </TouchableOpacity>
              )
            })}
          </ScrollView>
          <View style={[{ marginTop: 20 }]}>
            <Text
              text="Muscle Group"
              style={[styles.heading, { color: "#626262" }]}
            />
            <ScrollView
              horizontal={true}
              contentContainerStyle={{ paddingBottom: 10 }}
              keyboardShouldPersistTaps="handled"
            >
              {requesting && getExerciseState === false ? (
                <Loader />
              ) : (
                getExerciseState &&
                getExerciseState?.map((item, i) => {
                  return (
                    <TouchableOpacity
                      onPress={() => onHandlePress(i, item)}
                      key={i}
                      style={[
                        center,
                        {
                          width: 70,
                          height: 90,
                          borderRadius: 5,
                          backgroundColor:
                            selectMuscle === i ? "#74ccff" : "white"
                        }
                      ]}
                    >
                      <Image
                        source={
                          item.image === null
                            ? Images.workout1
                            : { uri: item.image }
                        }
                        style={{
                          width: 60,
                          height: 60,
                          resizeMode: "contain",

                          borderRadius: 5
                        }}
                      />

                      <Text text={item.name} style={styles.exerciseText} />
                    </TouchableOpacity>
                  )
                })
              )}
            </ScrollView>
          </View>
          <View style={{ marginTop: 25 }}>
            <Text
              text="Popular Exercises"
              style={[styles.heading, { color: "#626262" }]}
            />
          </View>
        </View>
        <View style={{ marginBottom: 20 }}>
          {getExerciseType === false && !requesting && props.request ? (
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
                  style={[row, justifyContentBetween, { position: "relative" }]}
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
                  <TouchableOpacity
                    style={[center, {}]}
                    onPress={() => {
                      refDescription.current.open()
                      setDesription(item)
                    }}
                  >
                    <Image
                      source={iconI}
                      style={{ width: 20, height: 20, marginRight: 5 }}
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.notFound}>
              <Text bold>No exercise found</Text>
            </View>
          )}
        </View>
      </ScrollView>
      <View style={{ alignSelf: "center" }}>
        <Button
          text={"Add Exercise"}
          textStyle={[{ color: "white" }]}
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
      <View
        style={[row, { alignSelf: "center", marginTop: 20, marginBottom: 10 }]}
      >
        <TouchableOpacity
          onPress={() => {
            Linking.openURL("http://orumtraining.com/create-custom-workout")
            // setShowModal(true)
          }}
        >
          <Text
            text="Watch This"
            style={[
              styles.heading1,
              {
                color: Colors.brightturquoise,
                borderBottomWidth: 1,
                borderBottomColor: Colors.brightturquoise
              }
            ]}
          />
        </TouchableOpacity>
        <Text text=" to create your workout" style={[styles.heading1]} />
      </View>

      {/* bottom */}
      <BottomSheet
        reff={refDescription}
        isDrage={true}
        h={700}
        Iconbg={Colors.athensgray}
        bg={Colors.athensgray}
        customStyles={{
          draggableIcon: {
            backgroundColor: "red"
          }
        }}
      >
        <TouchableOpacity
          style={{ alignSelf: "flex-end", marginRight: 10, top: 15 }}
          onPress={() => {
            refDescription.current.close()
            setDesription(false)
          }}
        >
          <Image source={circleClose} style={{ width: 23, height: 23 }} />
        </TouchableOpacity>
        <View style={{ alignSelf: "center" }}>
          <Text
            text={desription?.name}
            style={[
              {
                fontSize: 20,
                lineHeight: 25,
                color: "black",
                fontWeight: "bold",
                marginTop: 10
              }
            ]}
          />
        </View>
        <View style={[styles.dualView]}>
          {desription?.video ? (
            <VideoPlayer
              video={{
                uri: desription?.video
              }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="stretch"
              thumbnail={{ uri: desription?.video_thumbnail }}
              disableFullscreen={false}
            />
          ) : (
            <View
              style={{
                justifyContent: "center",
                flex: 1,
                alignItems: "center"
              }}
            >
              <Text bold style={{ fontSize: 20 }}>
                {"No video found"}
              </Text>
            </View>
          )}
        </View>
        <ScrollView
          style={{ marginTop: 40 }}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          {desription &&
            desription?.description?.split("/n").map((item, i) => {
              return (
                <View style={styles.dualList}>
                  <View>
                    <View style={styles.dualCard}>
                      <Text text={i + 1} style={styles.textStyle} />
                    </View>
                  </View>
                  <View
                    style={{
                      justifyContent: "center",
                      marginLeft: 30,
                      marginHorizontal: 40,
                      paddingVertical: 10,
                      flex: 1
                    }}
                  >
                    <Text
                      text={item}
                      style={[
                        {
                          fontSize: 14,
                          lineHeight: 25,
                          color: "black",
                          fontWeight: "bold"
                        }
                      ]}
                    />
                  </View>
                </View>
              )
            })}
        </ScrollView>
        <View style={{ position: "absolute", bottom: 0, alignSelf: "center" }}>
          {/* <Button
            text={"Add Exercies"}
            textStyle={[{ color: "white" }]}
            style={styles.addBtnStyle}
            disabled={
              activeSet?.id === 1
                ? selectedItem?.length < 2
                : activeSet?.value === 4
                ? selectedItem?.length < 3
                : selectedItem?.length < 1
            }
            onPress={makeDataParams}
          /> */}
        </View>
      </BottomSheet>
      <Modal
        isVisible={showModal}
        onBackdropPress={() => setShowModal(false)}
        style={{ flex: 1, margin: 0 }}
      >
        <View
          style={{
            backgroundColor: "black",
            paddingHorizontal: 5,
            flex: 1,
            paddingTop: 20
          }}
        >
          <TouchableOpacity
            onPress={() => setShowModal(false)}
            style={{ alignItems: "flex-end" }}
          >
            <Image
              source={Images.circleClose}
              style={{
                height: 40,
                width: 40,
                borderWidth: 1
              }}
            />
          </TouchableOpacity>
          <View style={{ flex: 1, justifyContent: "center" }}>
            {loading && <ActivityIndicator size="large" color="white" />}
            <Video
              source={{
                uri: "https://assets.mixkit.co/videos/preview/mixkit-man-exercising-with-a-kettlebell-4506-large.mp4"
              }}
              style={{ height: 300, width: "100%" }}
              muted={false}
              repeat={true}
              // onEnd={() => setStart(false)}
              resizeMode="cover"
              rate={1}
              posterResizeMode="cover"
              playInBackground={true}
              playWhenInactive={true}
              ignoreSilentSwitch="ignore"
              disableFocus={true}
              mixWithOthers={"mix"}
              controls={true}
              onLoadStart={() => setLoading(true)}
              onLoad={() => setLoading(false)}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  exerciseText: {
    fontSize: 14,
    fontWeight: "bold",
    lineHeight: 16,
    marginTop: 5,
    color: "#626262",
    opacity: 0.7
  },
  btn: {
    backgroundColor: Colors.brightturquoise,
    borderRadius: 40,
    paddingHorizontal: 30,
    height: 45,
    marginTop: 10
  },
  heading: {
    fontSize: 30,
    fontWeight: "bold",
    lineHeight: 40,
    marginTop: 10
  },
  pillStyle: {
    borderWidth: 1,
    height: 25,
    width: 85,
    borderRadius: 20,
    borderColor: "#74ccff",
    marginRight: 10
  },
  pillText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700"
  },
  circle: {
    position: "absolute",
    alignSelf: "center",
    left: "46%",
    backgroundColor: "#e5e5e5",
    width: 50,
    height: 50,
    borderRadius: 50
  },
  circleText: {
    fontSize: 25,
    fontWeight: "bold",
    lineHeight: 40,
    color: "white"
  },
  heading: { fontSize: 16, lineHeight: 20, fontWeight: "700", opacity: 0.5 },
  heading1: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "700",
    color: "#626262"
  },
  smallText: { fontSize: 15, lineHeight: 18 },
  IconStyle: { color: Colors.primary, fontSize: 15, marginLeft: 3 },
  CalenderText: { fontSize: 15, lineHeight: 18, color: "gray" },
  headind2: {
    fontSize: 25,
    lineHeight: 30,
    color: "black",
    marginTop: 25,
    fontWeight: "bold",
    opacity: 0.6
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
  dualView: {
    backgroundColor: "white",
    marginTop: 20,
    height: 200,
    padding: 10,
    borderRadius: 10,
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
  dualList: {
    backgroundColor: "white",
    // height: 70,

    marginHorizontal: 8,
    borderRadius: 15,
    paddingLeft: 30,
    flexDirection: "row",
    marginBottom: 20,
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
  dualCard: {
    backgroundColor: Colors.athensgray,
    width: 30,
    height: 30,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8
  },
  addBtnStyle: {
    backgroundColor: Colors.brightturquoisesecond,
    borderRadius: 10,
    paddingHorizontal: 20,
    height: 45,
    marginBottom: 10,
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
  textStyle: {
    fontSize: 20,
    lineHeight: 25,
    color: "black",
    fontWeight: "bold"
  },
  notFound: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    color: "#626262"
  }
})
const mapStateToProps = state => ({
  requesting: state.addExerciseReducer.requesting,
  request: state.addExerciseReducer.request,
  getExerciseState: state.addExerciseReducer.getExerciseState,
  getExerciseType: state.addExerciseReducer.getExerciseType,
  customExercisesList: state.addExerciseReducer.customExercisesList
})

const mapDispatchToProps = dispatch => ({
  getExerciseRequest: () => dispatch(getExerciseRequest()),
  getExerciseTypeRequest: (data, search) =>
    dispatch(getExerciseTypeRequest(data, search)),
  addCustomExercise: data => dispatch(addCustomExercise(data))
})
export default connect(mapStateToProps, mapDispatchToProps)(AddExercies)
