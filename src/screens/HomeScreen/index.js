import React, { useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import { Icon } from 'native-base';
// components
import { HeaderForDrawer, SearchablePaginatedList, MealEmptyItem, Text } from '../../components';
import { Gutters, Layout, Global } from '../../theme';
// Actions
import { getMealsRequest } from '../../ScreenRedux/customCalRedux';
import { getAllSessionRequest } from '../../ScreenRedux/programServices';

const HomeScreen = props => {
  const {
    meals = [],
    navigation,
    allSessions,
    loadingAllSession,
  } = props;

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      props.getMealsRequest()
      const newDate = moment(new Date()).format('YYYY-MM-DD');
      props.getAllSessionRequest(newDate);
    });
    return unsubscribe;
  }, [props.navigation]);

  const start = { x: 0, y: 0 };
  const end = { x: 1, y: 0 };

  const { small2xTMargin, smallHMargin, tinyHMargin, regularHPadding, regularVPadding } = Gutters;
  const { row, fill, center, fullWidth, justifyContentBetween } = Layout;
  const { secondaryBg } = Global;

  const emptyList = () => (
    <View style={[fill, center]}>
      <Text text={`Empty meals`} />
    </View>
  );

  const renderItem = (
    {
      date_time: clock,
      food_items: mealItems,
      carbohydrate: numberOfCarbs,
      protein: numberOfProtein,
      fat: numberOfFat,
      id,
    },
    index,
  ) => {
    return (
      <MealEmptyItem
        clock={clock}
        mealItems={mealItems}
        numberOfProtein={numberOfProtein}
        numberOfCarbs={numberOfCarbs}
        numberOfFat={numberOfFat}
        id={id}
        index={index}
        navigation={navigation}
        titleContainerStyle={{
          paddingTop: 0,
        }}
      />
    );
  };

  return (
    <SafeAreaView style={[secondaryBg, fill]}>
      <View style={[fill, fullWidth]}>
        <HeaderForDrawer hideHamburger />

        <View>
          <View style={[row, smallHMargin, styles.wrapper]}>
            <LinearGradient
              start={start}
              end={end}
              colors={['#5daffe', '#5daffe']}
              style={[
                row,
                fill,
                regularHPadding,
                regularVPadding,
                tinyHMargin,
                styles.linearGradient,
              ]}
            >
              <View style={justifyContentBetween}>
                <View style={row}>
                  <Text style={styles.textStyle} text="Day 1" />
                  <Text style={styles.subTextStyle} text="W1" />
                </View>

                {loadingAllSession ? (
                  <View>
                    <ActivityIndicator size="small" color="white" />
                  </View>
                ) : (
                  <>
                    {allSessions?.query?.length ? (
                      allSessions?.query?.map((item, index) => {
                        const currentDate = moment(new Date()).format('MM/DD/YYYY');
                        const todayDayString = moment(item.date_time).format('MM/DD/YYYY');
                        if (todayDayString === currentDate) {
                          return (
                            <View key={index}>
                              {item.name ? (
                                <Text key={index} style={styles.textStyle} text={item.name} />
                              ) : (
                                <Text key={index} style={styles.textStyle} text="Rest Day" />
                              )}
                            </View>
                          );
                        }
                      })
                    ) : (
                      <Text style={styles.textStyle} text="Rest Day" />
                    )}
                  </>
                )}
              </View>
              <View style={[center, styles.iconMainStyle]}>
                <Icon type="FontAwesome5" name="dumbbell" style={styles.iconInnerStyle} />
              </View>
            </LinearGradient>

            <LinearGradient
              start={start}
              end={end}
              colors={['#ff634e', '#ff634e']}
              style={[
                row,
                fill,
                regularHPadding,
                regularVPadding,
                tinyHMargin,
                styles.linearGradient,
              ]}
            >
              <View style={justifyContentBetween}>
                <View style={row}>
                  <Text style={styles.textStyle} text="Day 1" />
                  <Text style={styles.subTextStyle} text="W1" />
                </View>

                <View style={row}>
                  {loadingAllSession ? (
                    <View>
                      <ActivityIndicator size="small" color="white" />
                    </View>
                  ) : (
                    <>
                      {allSessions?.query?.length ? (
                        allSessions.query.map((item, index) => {
                          const currentDate = moment(new Date()).format('MM/DD/YYYY');
                          const todayDayString = moment(item.date_time).format('MM/DD/YYYY');
                          if (todayDayString === currentDate) {
                            return (
                              <View key={index}>
                                <Text
                                  style={styles.middleTextStyle}
                                  text={item && item.cardio_length}
                                />
                                <Text style={styles.middleSubTextStyle} text="minutes" />
                              </View>
                            );
                          }
                        })
                      ) : (
                        <Text style={styles.textStyle} text="Rest Day" />
                      )}
                    </>
                  )}
                </View>
              </View>

              <View style={[center, styles.iconMainStyle, styles.iconMainStyle2]}>
                <Icon type="FontAwesome5" name="heartbeat" style={styles.iconInnerStyle} />
              </View>
            </LinearGradient>
          </View>
          {true ? (
            <View style={[row, smallHMargin, styles.wrapper, small2xTMargin]}>
              <LinearGradient
                start={start}
                end={end}
                colors={['#5bf547', '#32fc7d']}
                style={[
                  row,
                  fill,
                  regularHPadding,
                  regularVPadding,
                  tinyHMargin,
                  styles.linearGradient,
                ]}
              >
                <TouchableOpacity
                  onPress={() => navigation.navigate('Exercise')}
                  style={[fullWidth, center, { height: 70 }]}
                >
                  <Text style={styles.startWorkoutWrapper}>Start {'\n'} Workout</Text>
                </TouchableOpacity>
              </LinearGradient>

              <LinearGradient
                start={start}
                end={end}
                colors={['#fff', '#fff']}
                style={[row, fill, regularHPadding, regularVPadding, tinyHMargin]}
              />
            </View>
          ) : null}
        </View>
        <View style={[fill, styles.lastContainer, small2xTMargin]}>
          <SearchablePaginatedList
            style={fill}
            ListEmptyComponent={emptyList}
            keyExtractor={item => `${item.id}`}
            list={meals}
            fetchListAction={() => props.getMealsRequest()}
            renderItem={({ item, index }) => renderItem(item, index)}
            search=""
            filter=""
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  startWorkoutWrapper: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  lastContainer: {
    borderTopColor: 'gray',
  },
  linearGradient: {
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 6,
  },

  wrapper: {
    height: 100,
    borderRadius: 25,
    position: 'relative',
  },
  middleTextStyle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  middleSubTextStyle: {
    // lineHeight: 30,
    // paddingLeft: 5,
    color: '#fff',
  },

  // old
  iconMainStyle: {
    top: 0,
    right: 0,
    width: 50,
    height: 50,
    borderRadius: 30,
    position: 'absolute',
    backgroundColor: '#55c1ff',
  },
  iconMainStyle2: {
    backgroundColor: '#ff968d',
  },
  iconInnerStyle: {
    color: '#fff',
    fontSize: 20,
  },
  textStyle: {
    fontWeight: 'bold',
    fontSize: 13,
    color: '#fff',
  },
  subTextStyle: {
    fontSize: 13,
    fontWeight: 'bold',
    paddingLeft: 5,
    color: '#fff',
  },
});

const mapStateToProps = state => ({
  meals: state.customCalReducer.meals,
  loadingAllSession: state.programReducer.requesting,
  allSessions: state.programReducer.getAllSessions,
});

const mapDispatchToProps = dispatch => ({
  getMealsRequest: () => dispatch(getMealsRequest()),
  getAllSessionRequest: data => dispatch(getAllSessionRequest(data)),
});
export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
