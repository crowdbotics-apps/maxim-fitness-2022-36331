import React, { useEffect } from "react"
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  FlatList
} from "react-native"
import { connect } from "react-redux"
import LinearGradient from "react-native-linear-gradient"
import moment from "moment"
import Icon from "react-native-vector-icons/FontAwesome5"
import { sortData } from "../../utils/utils"
// components
import { HeaderForDrawer, MealEmptyItem, Text } from "../../components"
import { Gutters, Layout, Global } from "../../theme"
// Actions
import { getMealsRequest } from "../../ScreenRedux/customCalRedux"
import {
  getAllSessionRequest,
  getDaySessionRequest
} from "../../ScreenRedux/programServices"
import {
  selectedMealsRequest,
  getMealFoodRequest
} from "../../ScreenRedux/nutritionRedux"

const HomeScreen = props => {
  const {
    mealRequesting,
    meals = [],
    navigation,
    todaySessions,
    todayRequest
  } = props
  useEffect(() => {
    const unsubscribe = props.navigation.addListener("focus", () => {
      props.getMealsRequest()
      const newDate = moment(new Date()).format("YYYY-MM-DD")
      props.getAllSessionRequest(newDate)
      props.getDaySessionRequest(newDate)
    })
    return unsubscribe
  }, [props.navigation])

  const start = { x: 0, y: 0 }
  const end = { x: 1, y: 0 }

  const {
    small2xTMargin,
    smallHMargin,
    tinyHMargin,
    regularHPadding,
    regularVPadding
  } = Gutters
  const { row, fill, center, fullWidth, justifyContentBetween } = Layout
  const { secondaryBg } = Global

  const renderItem = ({ item, index }) => {
    return (
      <View style={smallHMargin}>
        <MealEmptyItem
          item={item}
          index={index}
          navigation={navigation}
          selectedMealsRequest={props.selectedMealsRequest}
          getMealFoodRequest={props.getMealFoodRequest}
        />
      </View>
    )
  }

  const pp = new Date(todaySessions?.id && todaySessions?.date_time)
  const weekDay = pp?.getDay()

  const d = new Date()
  const day = d.getDay()

  return (
    <SafeAreaView style={[secondaryBg, fill]}>
      <HeaderForDrawer hideHamburger />
      {/* <View style={[row, styles.wrapper, smallHMargin]}>
        <LinearGradient
          start={start}
          end={end}
          colors={["#5daffe", "#5daffe"]}
          style={[
            row,
            fill,
            regularHPadding,
            regularVPadding,
            tinyHMargin,
            styles.linearGradient
          ]}
        >
          <View style={justifyContentBetween}>
            <View style={row}>
              <Text
                style={styles.textStyle}
                text={`Day ${weekDay === 0 ? 7 : weekDay ? weekDay : day}`}
              />
              <Text style={styles.subTextStyle} text="W1" />
            </View>

            {todayRequest ? (
              <View>
                <ActivityIndicator size="small" color="white" />
              </View>
            ) : (
              <View>
                {todaySessions?.name ? (
                  <Text style={styles.textStyle} text={todaySessions.name} />
                ) : (
                  <Text style={styles.textStyle} text="Rest Day" />
                )}
              </View>
            )}
          </View>
          <View style={[center, styles.iconMainStyle]}>
            <Icon
              type="FontAwesome5"
              name="dumbbell"
              style={styles.iconInnerStyle}
            />
          </View>
        </LinearGradient>

        <LinearGradient
          start={start}
          end={end}
          colors={["#ff634e", "#ff634e"]}
          style={[
            row,
            fill,
            tinyHMargin,
            regularHPadding,
            regularVPadding,
            styles.linearGradient
          ]}
        >
          <View style={justifyContentBetween}>
            <View style={row}>
              <Text
                style={styles.textStyle}
                text={`Day ${weekDay === 0 ? 7 : weekDay ? weekDay : day}`}
              />
              <Text style={styles.subTextStyle} text="W1" />
            </View>

            <View style={row}>
              {todayRequest ? (
                <View>
                  <ActivityIndicator size="small" color="white" />
                </View>
              ) : todaySessions?.id ? (
                <View>
                  <Text
                    style={styles.middleTextStyle}
                    text={todaySessions?.cardio_length}
                  />
                  <Text style={styles.middleSubTextStyle} text="minutes" />
                </View>
              ) : (
                <Text style={styles.textStyle} text="Rest Day" />
              )}
            </View>
          </View>

          <View style={[center, styles.iconMainStyle, styles.iconMainStyle2]}>
            <Icon
              type="FontAwesome5"
              name="heartbeat"
              style={styles.iconInnerStyle}
            />
          </View>
        </LinearGradient>
      </View> */}
      {/* <View style={smallHMargin}>
        {todaySessions?.workouts?.length > 0 ? (
          <View style={[row, styles.wrapper, small2xTMargin]}>
            <LinearGradient
              start={start}
              end={end}
              colors={["#5bf547", "#32fc7d"]}
              style={[
                row,
                fill,
                regularHPadding,
                regularVPadding,
                tinyHMargin,
                styles.linearGradient
              ]}
            >
              <TouchableOpacity
                onPress={() => navigation.navigate("FatLoseProgram")}
                style={[fullWidth, center, { height: 70 }]}
              >
                <Text style={styles.startWorkoutWrapper}>
                  Start {"\n"} Workout
                </Text>
              </TouchableOpacity>
            </LinearGradient>

            <LinearGradient
              start={start}
              end={end}
              colors={["#fff", "#fff"]}
              style={[row, fill, regularHPadding, regularVPadding, tinyHMargin]}
            />
          </View>
        ) : null}
      </View> */}
      <View style={[fill, small2xTMargin, styles.lastContainer]}>
        {mealRequesting ? (
          <View style={styles.loaderStyle}>
            <ActivityIndicator size="large" color="green" />
          </View>
        ) : meals?.meal_times?.length > 0 ? (
          <FlatList
            refreshControl={
              <RefreshControl
                colors={["#9Bd35A", "#689F38"]}
                refreshing={mealRequesting}
                onRefresh={() => props.getMealsRequest()}
                progressViewOffset={20}
              />
            }
            data={meals?.meal_times && sortData(meals?.meal_times)}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            keyboardShouldPersistTaps={"handled"}
          />
        ) : (
          <View style={[fill, Layout.alignItemsCenter]}>
            <Text
              style={{ fontSize: 18, color: "black" }}
              text="No meals are available!"
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  startWorkoutWrapper: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
    textAlign: "center"
  },
  lastContainer: {
    borderTopColor: "gray"
  },
  linearGradient: {
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 6
  },
  wrapper: {
    height: 100,
    borderRadius: 25,
    position: "relative"
  },
  middleTextStyle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff"
  },
  middleSubTextStyle: {
    color: "#fff"
  },
  iconMainStyle: {
    top: 0,
    right: 0,
    width: 50,
    height: 50,
    borderRadius: 30,
    position: "absolute",
    backgroundColor: "#55c1ff"
  },
  iconMainStyle2: {
    backgroundColor: "#ff968d"
  },
  iconInnerStyle: {
    color: "#fff",
    fontSize: 20
  },
  textStyle: {
    fontWeight: "bold",
    fontSize: 13,
    color: "#fff"
  },
  subTextStyle: {
    fontSize: 13,
    fontWeight: "bold",
    paddingLeft: 5,
    color: "#fff"
  }
})

const mapStateToProps = state => ({
  mealRequesting: state.customCalReducer.mealRequesting,
  meals: state.customCalReducer.meals,
  loadingAllSession: state.programReducer.requesting,
  todaySessions: state.programReducer.todaySessions,
  todayRequest: state.programReducer.todayRequest,
  selectedMeal: state.nutritionReducer.selectedMeal
})

const mapDispatchToProps = dispatch => ({
  getMealsRequest: () => dispatch(getMealsRequest()),
  getAllSessionRequest: data => dispatch(getAllSessionRequest(data)),
  getDaySessionRequest: data => dispatch(getDaySessionRequest(data)),
  selectedMealsRequest: data => dispatch(selectedMealsRequest(data)),
  getMealFoodRequest: (data, id) => dispatch(getMealFoodRequest(data, id))
})
export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)
