import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import Modal from 'react-native-modal';
import HorizontalScrollView from '../../components/HorizontalScrollView';
import { useDispatch } from 'react-redux';
import { Text, Button, RuningCard, RuningWorkout, ProfileHeaderFeed } from '../../components';
// import {launchImageLibrary} from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';

// import {
//   userInfoReducer,
//   addFollowAction,
//   getProfile,
//   updateProfile,
//   changeAvatarImage,
// } from '@/redux/modules/authReducer';
import { Content, Icon } from 'native-base';
import { Layout, Global, Gutters, Colors, Images } from '../../theme';
import LinearGradient from 'react-native-linear-gradient';
import { calculatePostTime } from '../../utils/functions';
import moment from 'moment';
// import {
//   getPushNotificationAction,
//   getMealCalories,
//   getCountNotification,
// } from '@/redux/modules/feedReducer';
// import MealHistory from '@/components/MealHistory';
import { TabOne, TabThree } from './components';
import { useIsFocused } from '@react-navigation/native';
// import auth from '@react-native-firebase/auth';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import ChatRoom from './ChatRoom';
// import { pushNotificationAction } from '@/redux/modules/feedReducer';
import { getNumberOfDayByString } from '../../utils/common';
// import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
// import Video from 'react-native-video';

// redux
// import {
//   getMealAction,
//   getConsumeCalories,
//   getConsumeCaloriesGet,
// } from '@/redux/modules/nutritionReducer';
// import { getSessionByDay, getAllSessions } from '@/redux/modules/sessionReducer';
// import Fonts from '@/assets/fonts';
import { useNetInfo } from '@react-native-community/netinfo';

const ProfileContainer = props => {
  const {
    // profile: { id },
    // navigation,
    // meals = [],
    // allSessions,
    // // profile,
    // getPushNotify,
    // msg,
    // loadingAllSession,
    // userInfo,
    // consumeCalories,
  } = props;
  const [fullName, setFullName] = useState('');
  const [currentTab, setCurrentTab] = useState(0);
  const [tab, setTab] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalHistory, setShowModalHistory] = useState(false);
  const [uploadAvatar, setUploadAvatar] = useState('');
  const [value, setValue] = useState(false);
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(false);

  const startSocial = { x: 0, y: 0 };
  const endSocial = { x: 0.4, y: 1 };
  const dispatch = useDispatch();

  const isFocused = useIsFocused();

  let netInfo = useNetInfo();

  // useEffect(() => {
  //   isFocused && calculateMeals();
  // }, [meals, isFocused]);

  // useEffect(() => {
  //   if (isFocused) {
  //     allSessions &&
  //       allSessions.query &&
  //       allSessions.query.map(item => {
  //         setSession(item.workouts[item.workouts.length - 1]?.done === true);
  //       });
  //   }
  // }, [isFocused]);

  // useEffect(() => {
  //   isFocused && setLoading(true);
  //   setTimeout(() => setLoading(false), 3000);
  // }, [isFocused]);

  // useEffect(() => {
  //   if (profile && profile.weight === null) {
  //     navigation.navigate('SurveyScreen');
  //   }
  // }, [isFocused, meals]);

  // useEffect(() => {
  //   if (isFocused) {
  //     props.getConsumeCaloriesGet();
  //     // props.getPushNotificationAction();
  //   }
  // }, [isFocused]);

  // useEffect(() => {
  //   if (calculatedData && calculatedData.user) {
  //     props.getConsumeCalories(calculatedData);
  //   }
  // }, [meals, calculatedData]);

  // const calculateMeals = () => {
  //   if (meals.length) {
  //     let percentTotalCal = 0;
  //     let percentToGetProtein = 0;
  //     let percentToGetCarbohydrate = 0;
  //     let percentToGetFat = 0;
  //     meals &&
  //       meals.forEach(item => {
  //         item.food_items.map(food => {
  //           const currentDate = moment(new Date()).format('YYYY-MM-DD');
  //           if (currentDate === moment(food.created).format('YYYY-MM-DD')) {
  //             let cal = Math.ceil(food.food.calories * food.unit.quantity);
  //             let carbs = Math.ceil(food.food.carbohydrate * food.unit.quantity);
  //             let protein = Math.ceil(food.food.proteins * food.unit.quantity);
  //             let fat = Math.ceil(food.food.fat * food.unit.quantity);
  //             percentTotalCal += cal;
  //             percentToGetProtein += protein;
  //             percentToGetCarbohydrate += carbs;
  //             percentToGetFat += fat;
  //           }
  //         });
  //       });
  //     const conCalData = {
  //       user: profile && profile.id,
  //       calories: Math.ceil(percentTotalCal),
  //       protein: Math.ceil(percentToGetProtein),
  //       carbs: Math.ceil(percentToGetCarbohydrate),
  //       fat: Math.ceil(percentToGetFat),
  //     };
  //     // props.getConsumeCalories(conCalData);
  //     // setCalculatedData(conCalData);
  //   }
  // };

  const dateTime = new Date();
  const formattedDate = moment(dateTime).format('YYYY-MM-DD');
  const todayDayStr = moment(dateTime).format('dddd');
  const { numberOfDayForBackend } = getNumberOfDayByString(todayDayStr);

  // useEffect(() => {
  //   if (isFocused) {
  //     // props.getSessionByDay(numberOfDayForBackend);
  //     props.getMealAction(formattedDate);
  //   }
  // }, [isFocused, formattedDate]);

  // useEffect(() => {
  //   if (isFocused) {
  //     props.userInfoReducer(id);
  //   }
  // }, [id, isFocused]);

  // const onUpdate = async () => {
  //   profile.weight = value;
  //   props.updateProfile(profile && profile.id, value, setShowModal, setValue);
  //   Keyboard.dismiss();
  // };
  // const onMealUpdate = () => {
  //   if (profile && profile.number_of_meal >= 6) {
  //     return Alert.alert('Maximum add food limit exceeded');
  //   } else {
  //     const mealValue = 6 - profile?.number_of_meal;
  //     navigation.navigate('SurveyScreenMeal', { mealValue });
  //   }
  // };

  const onAvatarChange = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      includeBase64: true,
    }).then(image => {
      const img = {
        uri: image.path,
        name: image.path,
        type: image.mime,
      };
      const data = {
        image: `data:${img.type};base64, ${image.data}`,
      };

      setUploadAvatar(image);
      // props.changeAvatarImage(data);
    });
  };

  // const signOut = async () => {
  //   try {
  //     if (props.socialLogin) {
  //       await GoogleSignin.revokeAccess();
  //       await GoogleSignin.signOut();
  //       AsyncStorage.clear();
  //       auth()
  //         .signOut()
  //         .then(res => res)
  //         .catch(err => err);
  //       // props.logout();
  //       await dispatch(logOut());
  //       navigation.navigate('Login');
  //     } else {
  //       AsyncStorage.clear();
  //       auth()
  //         .signOut()
  //         .then(res => res)
  //         .catch(err => err);
  //       // props.logout();
  //       await dispatch(logOut());
  //       navigation.navigate('Login');
  //     }
  //   } catch (err) {
  //     console.log('err:--------- ', err);
  //   }
  // };

  // const connectAlexa = async () => {
  //   navigation.navigate('Alexa');
  // };

  const {
    row,
    fill,
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

  // const countNotification = item => {
  //   props.getCountNotification(item && item.is_read, item && item.id);
  // };

  // const notificationLength = notifyData => {
  //   let a = 0;
  //   notifyData.map(item => {
  //     if (item.is_read === false) {
  //       a = a + 1;
  //     }
  //   });
  //   return a;
  // };

  // let imageUrl = String(profile?.profile_picture_url).split('?')[0];

  // const checkData = () => {
  //   if (!getPushNotify.length) {
  //     return (
  //       <View style={[regularLMargin, center]}>
  //         <Text
  //           style={{
  //             fontFamily: Fonts.HELVETICA_NORMAL,
  //             fontSize: 14,
  //             fontWeight: 'bold',
  //             color: 'black',
  //           }}
  //         >
  //           Currently no data available.
  //         </Text>
  //       </View>
  //     );
  //   }
  //   return <></>;
  // };

  const tabSettings = i => {
    setTab(i);
    // if (i === 2) {
    //   props.getMealCalories();
    // } else if (i === 1) {
    //   const newDate = moment(new Date()).format('YYYY-MM-DD');
    //   props.getAllSessions(newDate);
    //   props.getSessionByDay(numberOfDayForBackend);
    // }
  };

  return (
    <>
      <SafeAreaView style={[fill, secondaryBg, fullWidth]}>
        {/* <ChatRoom /> */}
        <View style={[row, smallVPadding, regularHMargin, alignItemsCenter, justifyContentBetween]}>
          <ProfileHeaderFeed
            imageUrl={
              // profile?.profile_picture_url === null
              //   ?
              Images.profile
              // : profile
              //   ? { uri: imageUrl }
              //   : uploadAvatar
            }
            fullName={fullName}
            changeFullNameFuc={val => setFullName(val)}
            onAvatarChange={onAvatarChange}
            style={[fill, justifyContentStart, alignItemsStart]}
          />
          <View style={[row, justifyContentCenter, styles.currentTabStyle]}>
            <TouchableOpacity
              style={[
                fill,
                center,
                Platform.OS === 'ios' && currentTab === 0
                  ? { borderBottomWidth: 2, borderBottomColor: Colors.azureradiance }
                  : { borderBottomWidth: 2, borderBottomColor: 'white' },
              ]}
              onPress={() => setCurrentTab(0)}
            >
              <Text
                style={[
                  currentTab === 0 ? styles.bottomBorderStyle : styles.bottomBorderStyleActive,
                  styles.currentTabText,
                ]}
                text="My Stats"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                fill,
                center,
                Platform.OS === 'ios' && currentTab === 1
                  ? { borderBottomWidth: 2, borderBottomColor: Colors.azureradiance }
                  : { borderBottomWidth: 2, borderBottomColor: 'white' },
              ]}
              // onPress={() => [setCurrentTab(1), props.userInfoReducer(id)]}
            >
              <Text
                style={[
                  currentTab === 1 ? styles.bottomBorderStyle : styles.bottomBorderStyleActive,
                  styles.currentTabText,
                ]}
                text="Social"
              />
            </TouchableOpacity>
          </View>
          <View style={[row, fill, alignItemsCenter, justifyContentEnd]}>
            <TouchableOpacity
              onPress={() => {
                // props.getPushNotificationAction();
                setIsVisible(true);
              }}
            >
              <Icon type="FontAwesome5" name="bell" />
              {true && (
                <View style={true ? styles.notificationStyle : ''}>
                  <Text text={'notify'} style={styles.notificationStyleText} />
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={regularLMargin}
              // onPress={() => {
              //   props.unReadMsgResetAction();
              //   navigation.navigate('ChatRoom');
              // }}
            >
              <Icon type="FontAwesome5" name="comment-alt" />
              {true && (
                <View style={styles.messageStyle}>
                  <Text text={'msg'} style={styles.messageStyleText} />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
        <>
          <View style={[row, justifyContentBetween, regularHPadding, styles.currentTabStyleMap]}>
            {data.map((item, i) => {
              return (
                <TouchableOpacity key={i} style={[fill, center]} onPress={() => tabSettings(i)}>
                  <Text
                    style={[
                      tab === i
                        ? { color: Colors.black, fontWeight: 'bold' }
                        : { color: Colors.alto },
                      styles.currentTabText,
                    ]}
                    text={item}
                  />
                  {tab !== i && <View style={{ width: 12, height: 10 }} />}
                  {tab === i && (
                    <View
                      style={{
                        width: 12,
                        height: 10,
                        backgroundColor: '#55bfff',
                        borderRadius: 100,
                      }}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          <Content showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
            {tab === 0 && (
              <>
                <TabOne
                  showModal={showModal}
                  setShowModal={setShowModal}
                  // profileData={profile}
                  // signOut={signOut}
                  // navigation={navigation}
                  // connectAlexa={connectAlexa}
                />
              </>
            )}
            {tab === 1 && (
              <Content
                contentContainerStyle={{
                  flexGrow: 1,
                }}
              >
                <View>
                  <View
                    style={[
                      row,
                      justifyContentBetween,
                      alignItemsCenter,
                      small2xHMargin,
                      smallVPadding,
                    ]}
                  >
                    <Text style={styles.comingSoonWork} text="Workouts" />
                    {/* <Text style={styles.comingSoonMore} text="show more" /> */}
                  </View>
                </View>
                {/* {netInfo.isConnected ? (
                  loadingAllSession ? (
                    <View style={styles.container}>
                      <ActivityIndicator size="large" color="#000" />
                    </View>
                  ) : (
                    <View style={[fill, center]}>
                      {session ? (
                        allSessions &&
                        allSessions.query &&
                        allSessions.query.map((item, index) => {
                          const todayDayString = moment(item.date_time).format('MM/DD/YYYY');
                          if (item.workouts[item.workouts.length - 1]?.done === true) {
                            return (
                              <View key={index} style={{ width: '100%' }}>
                                <TouchableOpacity
                                  key={index}
                                  onPress={() =>
                                    navigation.navigate('WorkoutCard', {
                                      summary: item.workouts,
                                      uppercard: item,
                                    })
                                  }
                                >
                                  <RuningWorkout
                                    item={item}
                                    index={index}
                                    todayDayStr={todayDayString}
                                  />
                                </TouchableOpacity>
                              </View>
                            );
                          }
                        })
                      ) : (
                        <View style={[fill, center]}>
                          <Text
                            text="No workout available."
                            style={{ color: 'black', fontSize: 22 }}
                          />
                        </View>
                      )}
                    </View>
                  )
                ) : (
                  <View style={[fill, center]}>
                    <Text style={styles.emptyListLabel}>{'Network error!'}</Text>
                  </View>
                )} */}
              </Content>
            )}
            {tab === 2 && (
              <>
                {loading ? (
                  <View style={[fill, center]}>
                    <ActivityIndicator size="large" color="#000" />
                  </View>
                ) : (
                  <TabThree
                  // profileData={profile}
                  // setMealModal={onMealUpdate}
                  // consumeCalories={consumeCalories}
                  // setShowModalHistory={() => navigation.navigate('MealHistoryScreen')}
                  />
                )}
              </>
            )}
            {tab === 3 && (
              <>
                <View style={[row, alignItemsCenter, regularHMargin]}>
                  <Text style={styles.commingSoonWork} text="My Health" />
                  <Image source={Images.iconMyFav} style={[regularLMargin, styles.myFavImage]} />
                </View>
                <View
                  style={[
                    border,
                    borderAlto,
                    regularHMargin,
                    regularVMargin,
                    styles.myHealthParent,
                  ]}
                >
                  <View
                    style={[
                      row,
                      regularVPadding,
                      regularLPadding,
                      borderAlto,
                      { borderBottomWidth: 1 },
                    ]}
                  >
                    <Text text={'Injuries'} bold />
                    <Text
                      style={{
                        fontSize: 12,
                        color: Colors.nobel,
                        marginTop: 6,
                      }}
                      text={' Past and Present'}
                      bold
                    />
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
                      <Text
                        style={[borderAlto, regularVPadding, regularHPadding]}
                        text={item}
                        bold
                      />
                    </View>
                  ))}
                </View>
              </>
            )}
          </Content>
        </>
      </SafeAreaView>
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

      <Modal
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={500}
        animationOutTiming={500}
        useNativeDriver={true}
        isVisible={showModal}
        transparent={true}
        onRequestClose={() => {
          setShowModal(!showModal);
        }}
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: 'rgba(52, 52, 52, 0.5)',
        }}
      >
        <TouchableOpacity onPress={() => setShowModal(!showModal)} style={{ flex: 1.5 }} />
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View
              style={[
                fill,
                {
                  backgroundColor: '#fff',
                  margin: 0,
                  padding: 0,
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                },
              ]}
            >
              <View style={[regularVMargin, { borderWidth: 1, width: 30, alignSelf: 'center' }]} />
              <View
                style={{
                  flex: 1,
                  paddingVertical: 20,
                  justifyContent: 'space-between',
                }}
              >
                <View
                  style={[
                    border,
                    regularHMargin,
                    {
                      height: 50,
                      borderRadius: 10,
                      marginBottom: 20,
                      borderColor: 'gray',
                      paddingHorizontal: 10,
                      backgroundColor: '#f5f5f5',
                    },
                  ]}
                >
                  <TextInput
                    value={value}
                    onChangeText={val => setValue(val)}
                    placeholder="Enter weight..."
                    autoCapitalize="none"
                    keyboardType="numeric"
                    style={{ height: 50 }}
                  />
                </View>
                {/*<View style={[center, mediumVMargin, row, fill]}>*/}
                <Button
                  color="primary"
                  // onPress={onUpdate}
                  // disabled={!value || value.trim().length === 0}
                  text="Update"
                  style={regularHMargin}
                  // loading={props.requesting}
                  block
                />
                {/*</View>*/}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>

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
    </>
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
});

const mapStateToProps = state => ({
  // meals: state.nutrition && state.nutrition.meals,
  // profile: state.auth && state.auth.profile,
  // getPushNotify: state.feeds && state.feeds.getPushNotify,
  // msg: state.nutrition && state.nutrition.msg,
  // loadingAllSession: state.sessions && state.sessions.loadingAllSession,
  // mealCalories: state.feeds && state.feeds.mealCalories,
  // userInfo: state.auth && state.auth.userInfo,
  // consumeCalories: state.nutrition && state.nutrition.consumeCalories,
  // socialLogin: state.auth && state.auth.socialLogin,
  // requesting: state.auth && state.auth.requesting,
  // profile: state.auth && state.auth.profile,
  // allSessions: state.sessions && state.sessions.allSessions,
});

const mapDispatchToProps = dispatch => ({
  // changeAvatarImage: resp => dispatch(changeAvatarImage(resp)),
  // updateProfile: (data, val, setShowModal, setValue) =>
  //   dispatch(updateProfile(data, val, setShowModal, setValue)),
  // getProfile: () => dispatch(getProfile()),
  // getMealAction: data => dispatch(getMealAction(data)),
  // getSessionByDay: data => dispatch(getSessionByDay(data)),
  // getAllSessions: data => dispatch(getAllSessions(data)),
  // getPushNotificationAction: () => dispatch(getPushNotificationAction()),
  // getMealCalories: () => dispatch(getMealCalories()),
  // userInfoReducer: id => dispatch(userInfoReducer(id)),
  // getConsumeCalories: data => dispatch(getConsumeCalories(data)),
  // getConsumeCaloriesGet: () => dispatch(getConsumeCaloriesGet()),
  // addFollowAction: data => dispatch(addFollowAction(data)),
  // pushNotificationAction: data => dispatch(pushNotificationAction(data)),
  // getCountNotification: (is_read, id) => dispatch(getCountNotification(is_read, id)),
});
export default connect(mapStateToProps, mapDispatchToProps)(ProfileContainer);
