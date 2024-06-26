import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import {
  View,
  Image,
  Platform,
  Keyboard,
  TextInput,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from 'react-native';
import Modal from 'react-native-modal';
import {
  Text,
  Button,
  RuningCard,
  RuningWorkout,
  ProfileComponent,
  BottomSheet,
  ModalInput,
} from '../../components';
import { Content, Icon } from 'native-base';
import { Layout, Global, Gutters, Colors, Images } from '../../theme';
import { calculatePostTime } from '../../utils/functions';
import { TabOne, TabThree } from './components';
import { getCustomCalRequest, getMealsRequest } from '../../ScreenRedux/customCalRedux';
import moment from 'moment';
import { useIsFocused } from '@react-navigation/native';

const CustomCalories = props => {
  const { meals, profile, getCalories } = props
  let refWeight = useRef('');
  const [tab, setTab] = useState(2);
  const [value, setValue] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [showModalHistory, setShowModalHistory] = useState(false);


  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      // props.getCustomCalRequest()
      props.getMealsRequest()
    });
    return unsubscribe;
  }, [props.navigation]);

  const isFocused = useIsFocused();

  useEffect(() => {
    isFocused && calculateMeals() && props.getCustomCalRequest(calculateMeals())
  }, [meals, isFocused]);

  useEffect(() => {
    isFocused && props.getCustomCalRequest()
  }, [meals, isFocused]);

  const calculateMeals = () => {
    if (meals.length) {
      let percentTotalCal = 0;
      let percentToGetProtein = 0;
      let percentToGetCarbohydrate = 0;
      let percentToGetFat = 0;
      meals &&
        meals.forEach(item => {
          item.food_items.map(food => {
            const currentDate = moment(new Date()).format('YYYY-MM-DD');
            if (currentDate === moment(food.created).format('YYYY-MM-DD')) {
              let cal = Math.ceil(food.food.calories * food.unit.quantity);
              let carbs = Math.ceil(food.food.carbohydrate * food.unit.quantity);
              let protein = Math.ceil(food.food.proteins * food.unit.quantity);
              let fat = Math.ceil(food.food.fat * food.unit.quantity);
              percentTotalCal += cal;
              percentToGetProtein += protein;
              percentToGetCarbohydrate += carbs;
              percentToGetFat += fat;
            }
          });
        });
      const conCalData = {
        user: profile && profile.id,
        calories: Math.ceil(percentTotalCal),
        protein: Math.ceil(percentToGetProtein),
        carbs: Math.ceil(percentToGetCarbohydrate),
        fat: Math.ceil(percentToGetFat),
      };
      return conCalData
    }
  };

  const {
    row,
    fill,
    fillGrow,
    center,
    fullWidth,
    alignItemsStart,
    alignItemsCenter,
    justifyContentEnd,
    justifyContentCenter,
    justifyContentStart,
    justifyContentBetween,
  } = Layout;
  const { border, secondaryBg, borderAlto } = Global;
  const {
    largeHMargin,
    smallHPadding,
    regularLMargin,
    small2xHMargin,
    smallTMargin,
    regularHPadding,
    regularVPadding,
    regularLPadding,
    smallVPadding,
    regularHMargin,
    regularVMargin,
    regularTMargin,
    mediumVMargin,
    smallHMargin,
  } = Gutters;

  const data = ['Home', 'Exercise', 'Nutrition'];

  const myHealthData = [
    'Disease',
    'Heart',
    'Mobitlity',
    'Activity',
    'Body Measurements',
    'Mobility',
    'Respiratory',
    'Vitals',
  ];

  const tabSettings = i => {
    setTab(i);
  };

  return (
    <SafeAreaView style={[fill, secondaryBg, fullWidth]}>
      <ProfileComponent
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onPressSocial={() => props.navigation.navigate('ProfileScreen')}
      />
      <View style={[row, justifyContentBetween, regularHPadding, styles.currentTabStyleMap]}>
        {data.map((item, i) => {
          return (
            <TouchableOpacity key={i} style={[fill, center]} onPress={() => tabSettings(i)}>
              <Text
                style={[
                  tab === i ? { color: Colors.black, fontWeight: 'bold' } : { color: Colors.alto },
                  styles.currentTabText,
                ]}
                text={item}
              />
              {tab !== i && <View style={styles.bottomStyle} />}
              {tab === i && <View style={styles.bottomStyle2} />}
            </TouchableOpacity>
          );
        })}
      </View>
      <Content showsVerticalScrollIndicator={false} contentContainerStyle={fillGrow}>
        {tab === 0 && <TabOne setShowModal={() => refWeight.current.open()} />}
        {tab === 1 && (
          <Content contentContainerStyle={fillGrow}>
            <View
              style={[row, justifyContentBetween, alignItemsCenter, small2xHMargin, smallVPadding]}
            >
              <Text style={styles.comingSoonWork} text="Workouts" />
            </View>
            <TouchableOpacity>
              <RuningWorkout />
            </TouchableOpacity>
            {false && (
              <View style={[fill, center]}>
                <Text text="No workout available." style={{ color: 'black', fontSize: 22 }} />
              </View>
            )}
          </Content>
        )}
        {tab === 2 &&
          <TabThree
            navigation={props.navigation}
            profileData={profile}
            consumeCalories={getCalories} />
        }
        {tab === 3 && (
          <>
            <View style={[row, alignItemsCenter, regularHMargin]}>
              <Text style={styles.comingSoonWork} text="My Health" />
              <Image source={Images.iconMyFav} style={[regularLMargin, styles.myFavImage]} />
            </View>
            <View
              style={[border, borderAlto, regularHMargin, regularVMargin, styles.myHealthParent]}
            >
              <View
                style={[
                  row,
                  borderAlto,
                  regularVPadding,
                  regularLPadding,
                  { borderBottomWidth: 1 },
                ]}
              >
                <Text text={'Injuries'} bold />
                <Text bold text={' Past and Present'} style={styles.pastPresentStyle} />
              </View>
              {myHealthData.map((item, i) => (
                <View
                  key={i}
                  style={[
                    borderAlto,
                    Platform.OS === 'ios' ? { borderBottomWidth: 0 } : { borderBottomWidth: 1 },
                    myHealthData.length - 1 === i && { borderBottomWidth: 0 },
                  ]}
                >
                  <Text bold text={item} style={[borderAlto, regularVPadding, regularHPadding]} />
                </View>
              ))}
            </View>
          </>
        )}
      </Content>

      {/* Modals area starts */}

      <Modal
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={500}
        animationOutTiming={500}
        useNativeDriver={true}
        isVisible={isVisible}
        onRequestClose={() => {
          setIsVisible(false);
        }}
        style={{
          margin: 0,
          padding: 0,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: 'transparent',
            margin: 0,
            padding: 0,
            height: '100%',
            width: '100%',
            position: 'absolute',
            zIndex: -2,
          }}
          onPress={() => setIsVisible(false)}
        />
        <View style={{ flex: 1, zIndex: -333, backgroundColor: 'transparent' }} />
        <View
          style={[
            regularHPadding,
            {
              zIndex: 2,
              flex: 1.5,
              margin: 0,
              padding: 0,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              backgroundColor: '#fff',
            },
          ]}
        >
          <View style={[regularVMargin, { borderWidth: 1, width: 30, alignSelf: 'center' }]} />
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
            }}
            showsVerticalScrollIndicator={false}
          >
            <View>
              {true
                ? [1, 2, 3].map((item, i) => {
                  return (
                    <TouchableOpacity
                      key={i}
                    // onPress={() => {
                    //   if (item.message === 'Comment Post' || 'Like Post') {
                    //     navigation.navigate('PostDetail', { item: item });
                    //     setIsVisible(!isVisible);
                    //     countNotification(item);
                    //   }
                    //   if (item.message === 'Started following you') {
                    //     navigation.navigate('ProfileView', item);
                    //   }
                    //   if (item.message === 'Message') {
                    //     navigation.navigate('ChatRoom');
                    //     setIsVisible(!isVisible);
                    //     countNotification(item);
                    //   }
                    // }}
                    >
                      <RuningCard
                        item={item}
                        Notification={item.message}
                        Time={calculatePostTime(item)}
                      />
                    </TouchableOpacity>
                  );
                })
                : null}
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/*===============================================*/}
      <BottomSheet reff={refWeight} h={200}>
        <View style={[fill, regularHMargin, regularVMargin]}>
          <ModalInput
            value={value}
            onChangeText={val => setValue(val)}
            placeholder="Enter weight..."
            keyboardType="numeric"
            text="Update weight"
          />
        </View>
        <View style={[row, regularVMargin]}>
          <Button
            color="primary"
            text="Update"
            style={[regularHMargin, fill, center]}
            onPress={() => refWeight.current.close()}
          />
        </View>
      </BottomSheet>
      {/*===============================================*/}

      <Modal
        animationType="slide"
        visible={showModalHistory}
        onRequestClose={() => {
          setShowModalHistory(!showModalHistory);
        }}
        style={{
          flex: 1,
          backgroundColor: '#f9f9f9',
          padding: 0,
          margin: 0,
          marginTop: Platform.OS === 'ios' ? 50 : 0,
        }}
      >
        <View style={[row, alignItemsCenter, justifyContentEnd, regularHMargin, regularTMargin]}>
          <TouchableOpacity onPress={() => setShowModalHistory(!showModalHistory)}>
            <Icon type="FontAwesome5" name="times" />
          </TouchableOpacity>
        </View>
        {/* <MealHistory mealsByDate={meals} /> */}
      </Modal>

      {/* Modals area ends */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // height: 400,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  cardText: {
    fontSize: 14,
    color: 'black',
    textAlign: 'center',
  },
  currentTabStyle: {
    width: 140,
    height: 30,
  },
  currentTabStyleMap: {
    width: '100%',
    height: 60,
  },
  currentTabText: {
    fontSize: 15,
    lineHeight: 15,
    paddingVertical: 5,
  },
  bottomStyle: { width: 12, height: 10 },
  bottomStyle2: {
    width: 12,
    height: 10,
    backgroundColor: '#55bfff',
    borderRadius: 100,
  },
  comingSoonWork: {
    fontSize: 30,
    color: 'black',
    fontWeight: 'bold',
  },
  comingSoonMore: {
    fontSize: 16,
    color: Colors.azureradiance,
  },
  imageStyle: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  gradientWrapper: {
    width: 160,
    height: 160,
    borderRadius: 20,
    borderColor: Colors.azureradiance,
  },
  gradientWrapperSocial: {
    width: '100%',
    height: 300,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderColor: Colors.azureradiance,
  },
  myFavImage: {
    width: 40,
    height: 40,
  },
  myHealthParent: {
    borderRadius: 20,
  },
  pastPresentStyle: {
    fontSize: 12,
    color: Colors.nobel,
    marginTop: 6,
  },
  avatarWrapper: {
    marginTop: -100,
  },
  avatarImageStyle: {
    width: 150,
    height: 150,
    justifyContent: 'flex-end',
    alignItems: 'center',
    bottom: 0,
    borderWidth: 1,
    borderRadius: 100,
    borderColor: '#000',
    backgroundColor: '#fff',
  },
  challengeCard: {
    height: 250,
    borderRadius: 30,
    borderWidth: 2,
  },
  bottomBorderStyle: {
    color: Colors.black,
    borderBottomWidth: 2,
    borderBottomColor: Colors.azureradiance,
    fontWeight: 'bold',
  },
  bottomBorderStyleActive: {
    color: Colors.alto,
    borderBottomWidth: 2,
    borderBottomColor: Colors.white,
  },
  textStyle: {
    fontSize: 15,
    color: 'black',
    fontWeight: 'bold',
  },
  textSmallStyle: {
    fontSize: 12,
    color: Colors.nobel,
    fontWeight: 'bold',
  },
  messageStyle: {
    top: -10,
    width: 21,
    right: -10,
    height: 21,
    borderRadius: 100,
    position: 'absolute',
    backgroundColor: 'red',
  },
  messageStyleText: {
    fontSize: 12,
    marginTop: 2,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  notificationStyle: {
    width: 21,
    height: 21,
    borderRadius: 100,
    backgroundColor: 'red',
    position: 'absolute',
    top: -10,
    right: -10,
  },
  notificationStyleText: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 2,
  },
  profileImage: {
    borderRadius: 100,
    width: 50,
    height: 50,
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: 'gray'
  },
});

const mapStateToProps = state => ({
  getCalories: state.customCalReducer.getCalories,
  meals: state.customCalReducer.meals,
  profile: state.login.userDetail,
});

const mapDispatchToProps = dispatch => ({
  getCustomCalRequest: (data) => dispatch(getCustomCalRequest(data)),
  getMealsRequest: () => dispatch(getMealsRequest()),
});
export default connect(mapStateToProps, mapDispatchToProps)(CustomCalories);
