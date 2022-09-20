import React, { useState, useEffect } from 'react';
import {
  View,
  Modal,
  Image,
  Alert,
  StyleSheet,
  ScrollView,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment'

//Components
import { Text, Button } from '../../components';
import HeaderTitle from './Components/HeaderTitle';

//Themes
import { Images, Global, Layout, Gutters, Fonts } from '../../theme';

//Actions
import { updateAnswer } from './Redux';
import DatePicker from 'react-native-date-picker';
import LinearGradient from 'react-native-linear-gradient';

const MealTime = props => {
  const { navigation: { navigate }, route: { params } } = props;
  const deviceWidth = Dimensions.get('window').width
  const { numberOfMeals } = params;
  const [meals, setMeals] = useState([]);
  const [exerciseLevel, setExerciseLevel] = useState(false);
  const [timeModal, setTimeModal] = useState(false);
  const [time, setTime] = useState(new Date());
  const [selectedMeal, setSelectedMeal] = useState('');

  console.log('numberOfMeals: ', numberOfMeals);

  const totalMeals = () => {
    return Array(numberOfMeals)
      .fill()
      .map((item, index) => {
        return {
          meal: `Meal ${index + 1}`,
          time: '',
          mealTime: ''
        };
      });
  };

  useEffect(() => {
    totalMeals() && setMeals(totalMeals());
  }, []);

  useEffect(() => {
    if (props.answers && props.answers.mealTimes) {
      setMeals(props.answers.mealTimes);
    }
  }, []);

  const onSelectMeal = (index, time, mealTime) => {
    const data = [...meals];
    data[index].time = time;
    data[index].mealTime = mealTime
    setMeals(data);

    let newArray = [];
    meals.map(item => newArray.push(moment(item.time).format('HH:mm')));
    let duplicateArray = newArray.filter(function (item, i, orig) {
      return orig.indexOf(item, i + 1) === -1;
    });
    if (meals.length === duplicateArray.length) {
      Alert.alert('Please choose different time');
      return false
    } else {
      return true
    }

  };

  const onNext = () => {
    const tempData = props.answers;
    tempData.mealTimes = meals;
    props.updateAnswers(tempData);
    navigate('NutritionUnderstanding');
  };

  const buttonDiabled = () => {
    return meals.map(item => {
      return item.time;
    });
  };


  return (
    <SafeAreaView style={[Global.secondaryBg, Layout.fill]}>
      <HeaderTitle showBackButton={true} percentage={0.75} />
      <ScrollView contentContainerStyle={[Layout.fillGrow, Gutters.small2xHPadding, Layout.justifyContentBetween]}>
        <View style={Gutters.mediumTMargin}>
          <Text
            color="commonCol"
            style={Fonts.titleRegular}
            text={'What times do you want to eat?'}
          />
        </View>
        <View style={[Layout.justifyContentStart, Layout.fill, Gutters.mediumTMargin]}>
          {meals && meals.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[
                Layout.row,
                Global.height65,
                Gutters.smallHPadding,
                Layout.alignItemsCenter,
                Layout.justifyContentBetween,
                exerciseLevel === item ? Global.border : Global.borderB,
                exerciseLevel !== item ? Global.borderAlto : '#a5c2d0',
              ]}
              onPress={() => {
                setSelectedMeal(i);
                setTimeModal(true);
              }}
            >
              <Text
                text={item.meal}
                color="commonCol"
                style={Fonts.titleRegular}
              />
              {item.time ? (
                <Text
                  text={item.time}
                  color="commonCol"
                  style={Fonts.titleRegular}
                />
              ) : (
                <Image source={Images.downIcon} style={styles.rightArrow} />
              )}

            </TouchableOpacity>
          ))}
        </View>
        <View style={Layout.justifyContentEnd}>
          <Button
            block
            text={'Next'}
            color="primary"
            onPress={onNext}
            disabled={Boolean(buttonDiabled().includes('')) ? true : false}
            style={Gutters.regularBMargin}
          />
        </View>
      </ScrollView>

      <Modal
        visible={timeModal}
        style={Layout.fill}
        animationType="slide"
        transparent={true}
      >
        <ScrollView contentContainerStyle={[Layout.fillGrow, Global.opacityBg75, Layout.justifyContentBetween]}>
          <View style={[Layout.fill, Layout.center]}>
            <DatePicker
              date={time}
              mode="time"
              onDateChange={val => {
                setTime(val);
                const timee = moment(val, ['h:mm A']).format('HH:mm');
                onSelectMeal(selectedMeal, timee, val);
              }}
              androidVariant="iosClone"
              style={Global.secondaryBg}
            />
            <TouchableOpacity
              style={[Gutters.small2xVMargin, { width: deviceWidth - 100 }]}
              onPress={() => setTimeModal(false)}
            >
              <LinearGradient style={styles.gradientStyle} colors={['#048ECC', '#0460BB', '#0480C6']}>
                <Text style={styles.loginText}>Select Date of Birth</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ width: deviceWidth - 100 }}
              onPress={() => setTimeModal(false)}
            >
              <LinearGradient style={styles.gradientStyle} colors={['#e52b39', '#ef3d49', '#fb5a60']}>
                <Text style={styles.loginText}>Cancel</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>
    </SafeAreaView>
    // <SafeAreaView style={styles.container}>
    //   <HeaderTitle showBackButton={true} percentage={0.75} />
    //   <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
    //     <View style={{ marginHorizontal: 40, marginTop: 20 }}>
    //       <Text
    //         style={{ fontSize: 24, color: '#6f6f6f', fontWeight: '500' }}
    //         text={'What times do you want to eat?'}
    //       />
    //     </View>

    //     <View style={{ marginTop: 10, flex: 1 }}>
    //       <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
    //         {meals &&
    //           meals.map((item, i) => (
    //             <TouchableOpacity
    //               key={i}
    //               style={[
    //                 {
    //                   marginHorizontal: 40,
    //                   borderBottomWidth: exerciseLevel !== item ? 1 : null,
    //                   borderBottomColor: exerciseLevel !== item ? '#e1e1e1' : '#a5c2d0',
    //                   borderWidth: exerciseLevel === item ? 1 : null,
    //                   paddingVertical: 25,
    //                   borderColor: '#a5c2d0',
    //                 },
    //               ]}
    //               onPress={() => {
    //                 setSelectedMeal(i);
    //                 setTimeModal(true);
    //               }}
    //             >
    //               <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
    //                 <View
    //                   style={{
    //                     paddingHorizontal: 11,
    //                   }}
    //                 >
    //                   <Text style={{ fontSize: 20, color: '#6f6f6f', fontWeight: '700' }}>
    //                     {item.meal}
    //                   </Text>
    //                   {/* <Text style={{color: '#7d7d7d', marginTop: 5}}>{item.description}</Text> */}
    //                 </View>
    //                 <View style={{ justifyContent: 'center' }}>
    //                   {item.time ? (
    //                     <Text>{item.time}</Text>
    //                   ) : (
    //                     <Image source={downIcon} style={{ height: 10, width: 20, marginRight: 10 }} />
    //                   )}
    //                 </View>
    //               </View>
    //             </TouchableOpacity>
    //           ))}
    //       </ScrollView>
    //     </View>

    //     <View style={{ justifyContent: 'flex-end' }}>
    //       <TouchableOpacity
    //         style={{
    //           marginHorizontal: 40,
    //           marginBottom: 25,
    //           opacity: Boolean(buttonDiabled().includes('')) ? 0.7 : 1,
    //         }}
    //         disabled={Boolean(buttonDiabled().includes('')) ? true : false}
    //         onPress={() => {
    //           onNext();
    //         }}
    //       >
    //         <LinearGradient style={[styles.logInButton]} colors={['#048ECC', '#0460BB', '#0480C6']}>
    //           <Text style={styles.loginText}>Next</Text>
    //         </LinearGradient>
    //       </TouchableOpacity>
    //     </View>
    //   </ScrollView>
    //   <Modal visible={timeModal} style={{ flex: 1 }} animationType="slide" transparent={true}>
    //     <View style={[{ backgroundColor: 'rgba(0, 0, 0, 0.85);', flex: 1 }, styles.centeredView]}>
    //       <DatePicker
    //         date={time}
    //         onDateChange={val => {
    //           setTime(val);
    //           const timee = moment(val, ['h:mm A']).format('HH:mm');
    //           onSelectMeal(selectedMeal, timee, val);

    //           // setMealsArray(prevData => [...prevData, (prevData[selectedMeal].time = timee)]);
    //         }}
    //         androidVariant="iosClone"
    //         style={{ backgroundColor: '#fff' }}
    //         mode="time"
    //       />

    //       <TouchableOpacity
    //         style={{ width: '80%', marginVertical: 25 }}
    //         onPress={() => setTimeModal(false)}
    //       >
    //         <LinearGradient style={[styles.logInButton]} colors={['#048ECC', '#0460BB', '#0480C6']}>
    //           <Text style={styles.loginText}>Select Time</Text>
    //         </LinearGradient>
    //       </TouchableOpacity>

    //       <TouchableOpacity style={{ width: '80%' }} onPress={() => setTimeModal(false)}>
    //         <LinearGradient style={[styles.logInButton]} colors={['#e52b39', '#ef3d49', '#fb5a60']}>
    //           <Text style={styles.loginText}>Cancel</Text>
    //         </LinearGradient>
    //       </TouchableOpacity>
    //     </View>
    //   </Modal>
    // </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  rightArrow: { height: 20, width: 20, resizeMode: 'contain' },
  gradientStyle: {
    height: 53,
    borderRadius: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: {
    fontSize: 20,
    color: 'white',
    fontWeight: '700',
  },
});

const mapStateToProps = state => ({
  answers: state.questionReducer.answers,
});

const mapDispatchToProps = dispatch => ({
  updateAnswers: data => dispatch(updateAnswer(data)),
});
export default connect(mapStateToProps, mapDispatchToProps)(MealTime);
