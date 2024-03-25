import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import {
  View,
  Text,
  Image,
  FlatList,
  Platform,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions
} from "react-native"
import HeaderForDrawer from "../../components/HeaderForDrawer"
import { Images } from "../../theme"

import { CustomModal } from "../../components"

//actions
import { swapExercises, swapCustomExercises } from "../../ScreenRedux/programServices"

const windowHeight = Dimensions.get("window").height

const SwapExerciseContainer = props => {
  const { navigation, swapExercises, swapCustomExercises, isCustom, allExerciseSwapped, route, requesting } =
    props

  const [loading, setLoading] = useState([])
  const [loadingData, setLoadingData] = useState(false)
  const [selectItem, setSelectItem] = useState(false)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    setLoading([])
    setTimeout(() => {
      setLoadingData(true)
    }, 1000)
  }, [])

  const onPress = item => {
    setShowModal(true)
    setSelectItem(item.id)
  }
  const swapDone = () => {
    if (selectItem) {
      const swapData = {

        workout_id: route?.params?.ScreenData?.workout_id,
        exercise_id: route?.params?.ScreenData?.data?.id,
        rest_of_program: selectItem,
        custom_workouts_exercise_id: route?.params?.ScreenData?.custom_workouts_exercise_id
      }
      if (isCustom) {
        swapCustomExercises(swapData, route?.params?.ScreenData?.date_time)
      } else {
        swapExercises(swapData, route?.params?.ScreenData?.date_time)
      }
    }
  }

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={() => onPress(item)}
        style={[
          styles.mainContainer,
          { backgroundColor: item?.id === selectItem ? "#74ccff" : "#f0f0f0" }
        ]}
      >
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Image
            source={{
              uri: item?.video_thumbnail
            }}
            style={{ width: "100%", height: 80, resizeMode: "cover" }}
            onLoadStart={() => setLoading(loading => [...loading, index])}
            onLoad={() => setLoading(loading.filter(item => item !== index))}
          />

          {loading &&
            loading.filter(item => item === index).includes(index) && (
              <ActivityIndicator
                size="small"
                color="#000"
                style={{ position: "absolute", left: 20 }}
              />
            )}
        </View>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ textAlign: "center", color: "#626262" }}>
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <TouchableOpacity
        style={{
          ...Platform.select({
            ios: { top: 63, zIndex: 22, left: 15, position: "absolute" },
            android: { top: 20, zIndex: 22, left: 15, position: "absolute" }
          })
        }}
        onPress={() => {
          navigation.goBack()
        }}
      >
        <Image style={{ width: 30, height: 30 }} source={Images.leftArrow} />
      </TouchableOpacity>
      <HeaderForDrawer
        navigation={navigation}
        headerNavProp={{ paddingBottom: 50 }}
        onDrawerButtonPress={() => {
          toggleDrawer()
        }}
      />
      <View style={{ flex: 1 }}>
        {requesting ? (
          <View style={styles.loaderStyle}>
            <ActivityIndicator size="large" color="#000" />
          </View>
        ) : (
          <>
            {allExerciseSwapped?.length > 0 &&
              allExerciseSwapped !== "no exercise available" ? (
              <FlatList
                data={allExerciseSwapped || []}
                keyExtractor={index => index.toString()}
                renderItem={renderItem}
              />
            ) : allExerciseSwapped === "no exercise available" ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text style={{ color: "black", fontSize: 20 }}>
                  {loadingData ? "No exercises found!" : null}
                </Text>
              </View>
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text style={{ color: "black", fontSize: 20 }}>
                  {loadingData ? "No exercises found!" : null}
                </Text>
              </View>
            )}
          </>
        )}
      </View>
      <CustomModal
        showModal={showModal}
        setShowModal={setShowModal}
        text={"Are you sure you want to swap this exercise?"}
        action={swapDone}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginVertical: 7.5,
    marginHorizontal: 15,
    borderRadius: 20
  },
  loaderStyle: {
    height: windowHeight * 0.6,
    justifyContent: "center"
  }
})

const mapState = state => ({
  allExerciseSwapped:
    state.programReducer && state.programReducer.allExerciseSwapped,
  requesting: state.programReducer && state.programReducer.loading,
  isCustom: state.programReducer && state.programReducer.isCustom,

})

const mapDispatchToProps = dispatch => ({
  swapExercises: (data, date_time) => dispatch(swapExercises(data, date_time)),
  swapCustomExercises: (data, date_time) => dispatch(swapCustomExercises(data, date_time)),
})

export default connect(mapState, mapDispatchToProps)(SwapExerciseContainer)
