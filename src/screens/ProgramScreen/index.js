import React, { useEffect, useState } from "react"
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  SafeAreaView
} from "react-native"
import Icon from "react-native-vector-icons/FontAwesome5"
import { Gutters, Layout, Global, Colors } from "../../theme"
import moment from "moment"
import { Card, WorkoutComponent, Text } from "../../components"
import {
  getAllSessionRequest,
  pickSession
} from "../../ScreenRedux/programServices"
import { connect } from "react-redux"

const ProgramScreen = props => {
  const { navigation, getWeekSessions, loadingAllSession } = props
  const [isVisible, setIsVisible] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeIndex, setActiveIndex] = useState(1)
  const [show, setShow] = useState(true)

  const { tinyLMargin, tinyRMargin } = Gutters
  const {
    row,
    center,
    fill,
    alignItemsCenter,
    justifyContentEnd,
    justifyContentBetween
  } = Layout
  const { secondaryBg, turtiaryBg } = Global

  useEffect(() => {
    if (getWeekSessions) {
      getWeekSessions?.query?.map(item => {
        let currentD = moment(new Date()).format("YYYY-MM-DD")
        let cardDate = moment(item.date_time).format("YYYY-MM-DD")

        const [itemWorkoutUndone, nextWorkout] = item.workouts.filter(
          workoutItem => !workoutItem.done
        )

        if (currentD === cardDate && item.workouts.length > 0) {
          props.pickSession(itemWorkoutUndone, item.workouts, nextWorkout)
        }
      })
    }
  }, [getWeekSessions])

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      const newDate = moment(new Date()).format("YYYY-MM-DD")
      props.getAllSessionRequest(newDate)
    })
    return unsubscribe
  }, [navigation])

  useEffect(() => {
    setTimeout(() => setLoading(false), 3000)
  }, [])

  const previousExercise = () => {
    if (activeIndex > 1) {
      setActiveIndex(prevState => prevState - 1)
      if (getWeekSessions?.query?.length) {
        const today = new Date(getWeekSessions.query[0].date_time)
        const lastDay = new Date(today.setDate(today.getDate() - 7))
        const hh = moment(lastDay).format("YYYY-MM-DD")
        props.getAllSessionRequest(hh)
      }
    }
  }

  const nextExercise = () => {
    if (getWeekSessions?.week > activeIndex) {
      setActiveIndex(prevState => prevState + 1)
      if (getWeekSessions?.query?.length) {
        const today = new Date(getWeekSessions.query[0].date_time)
        const lastDay = new Date(today.setDate(today.getDate() + 7))
        const hh = moment(lastDay).format("YYYY-MM-DD")
        props.getAllSessionRequest(hh)
      }
    }
  }

  return (
    <SafeAreaView style={[fill, secondaryBg]}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View
          style={[row, justifyContentBetween, alignItemsCenter, styles.preview]}
        >
          <TouchableOpacity
            style={[alignItemsCenter, fill, row, styles.buttonWrapper]}
            onPress={previousExercise}
            disabled={loading || loadingAllSession}
          >
            {getWeekSessions?.week > 0 && activeIndex > 1 && (
              <>
                <Icon type="FontAwesome5" name="caret-left" />
                <Text
                  color="primary"
                  text={`Week ${activeIndex + 1}`}
                  style={[tinyLMargin, { fontSize: 15, lineHeight: 18 }]}
                />
              </>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              justifyContentEnd,
              alignItemsCenter,
              fill,
              row,
              styles.buttonWrapper
            ]}
            onPress={nextExercise}
            disabled={loading || loadingAllSession}
          >
            {getWeekSessions?.week > activeIndex && (
              <>
                <Text
                  color="primary"
                  text={`Week ${activeIndex + 1}`}
                  style={[tinyRMargin, { fontSize: 15, lineHeight: 18 }]}
                />
                <Icon type="FontAwesome5" name="caret-right" />
              </>
            )}
          </TouchableOpacity>
        </View>
        {loading || loadingAllSession ? (
          <View style={[styles.container, styles.horizontal]}>
            <ActivityIndicator size="large" color="#000" />
          </View>
        ) : getWeekSessions?.query?.length < 1 ? (
          <View style={[fill, center, styles.noProgramWrapper]}>
            <Text
              text="No Program Assigned!"
              style={styles.noProgramWrapperText}
            />
          </View>
        ) : (
          getWeekSessions?.query?.map((item, index) => {
            let currentD = moment(new Date()).format("YYYY-MM-DD")
            let cardDate = moment(item.date_time).format("YYYY-MM-DD")

            const [itemWorkoutUndone, nextWorkout] = item.workouts.filter(
              workoutItem => !workoutItem.done
            )
            return (
              <View key={index} style={fill}>
                <View style={fill}>
                  {show && currentD === cardDate && (
                    <>
                      {item.workouts.length > 0 ? (
                        <View>
                          <WorkoutComponent
                            onPress={() => {
                              // if (itemWorkoutUndone) {
                              props.pickSession(
                                itemWorkoutUndone,
                                item.workouts,
                                nextWorkout
                              )
                              navigation.navigate("ExerciseScreen", {
                                workouts: item.workouts,
                                item: item
                              })
                              // }
                            }}
                            // workoutDone={!itemWorkoutUndone}
                            startWorkout={currentD === cardDate}
                            item={item}
                            navigation={navigation}
                            activeIndex={activeIndex}
                            setActiveIndex={setActiveIndex}
                            isVisible={isVisible}
                            setIsVisible={setIsVisible}
                          />
                        </View>
                      ) : (
                        <View style={[turtiaryBg, center, { height: 100 }]}>
                          <Text text="No Workout for Today" bold />
                        </View>
                      )}
                    </>
                  )}
                </View>
                <View>
                  <Card
                    style={
                      (show ? show === index + 1 : currentD === cardDate) && {
                        backgroundColor: Colors.alto
                      }
                    }
                    onPress={() =>
                      setShow(show === index + 1 ? undefined : index + 1)
                    }
                    text={item.workouts.length > 0 ? item.name : "No WorkOut"}
                    item={item}
                  />
                </View>
              </View>
            )
          })
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 400,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  mainInnerWrapper: {
    height: 60
  },
  tabButtonsContainer: {
    width: 110
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "500",
    color: "black",
    paddingVertical: 5,
    borderBottomWidth: 2
  },
  leftArrowStyle: {
    width: 30,
    height: 30
  },
  preview: {
    paddingHorizontal: 20,
    backgroundColor: "#f9f9f9",
    paddingVertical: 10
  },
  buttonWrapper: {
    height: 30
  },
  noProgramWrapper: {},
  noProgramWrapperText: { color: "black", fontSize: 30 }
})

const mapStateToProps = state => ({
  getWeekSessions: state.programReducer.getWeekSessions
  // exerciseSwapped: state.sessions && state.sessions.exerciseSwapped,
  // loadingAllSession: state.sessions && state.sessions.loadingAllSession,
  // saveSwipeState: state.sessions && state.sessions.saveSwipeState,
  // resetSwipeAction: state.sessions && state.sessions.resetSwipeAction,
})

const mapDispatchToProps = dispatch => ({
  getAllSessionRequest: data => dispatch(getAllSessionRequest(data)),
  pickSession: (exerciseObj, selectedSession, nextWorkout) =>
    dispatch(pickSession(exerciseObj, selectedSession, nextWorkout))
  // pickSessionAction: (data) => dispatch(pickSession(data)),
  // saveSwipeDateAction: () => dispatch(saveSwipeDateAction()),
  // resetSwipeDateAction: () => dispatch(resetSwipeDateAction()),
  // getAllSwapExercise: () => dispatch(allSwapExercise()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProgramScreen)
