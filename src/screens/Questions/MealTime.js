import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Modal,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

//Libraires
import DatePicker from 'react-native-date-picker';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import moment from 'moment';

//Components
import { Text } from '../../components';
import HeaderTitle from './Components/headerTitle';

//Themes
import Images from '../../theme/Images';

//Actions
import { updateAnswer } from './Redux';

const MealTime = props => {
  const { forwardIcon, downIcon } = Images;

  const {
    navigation: { navigate },
    route: { params },
  } = props;

  const { numberOfMeals } = params;
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    totalMeals() && setMeals(totalMeals());
  }, []);

  const totalMeals = () => {
    return Array(numberOfMeals)
      .fill()
      .map((item, index) => {
        return {
          meal: `Meal ${index + 1}`,
          time: '',
        };
      });
  };

  const onSelectMeal = (index, time) => {
    const data = [...meals];
    data[index].time = time;
    setMeals(data);
  };

  const [exerciseLevel, setExerciseLevel] = useState(false);
  const [timeModal, setTimeModal] = useState(false);
  const [time, setTime] = useState(new Date());
  const [selectedMeal, setSelectedMeal] = useState('');

  const onNext = () => {
    const tempData = props.answers;
    tempData.mealTimes = meals;
    props.updateAnswers(tempData);
    navigate('NutritionUnderstanding');
  };

  useEffect(() => {
    if (props.answers && props.answers.mealTimes) {
      setMeals(props.answers.mealTimes);
    }
  }, []);

  const buttonDiabled = () => {
    return meals.map(item => {
      return item.time;
    });
  };


  return (
    <SafeAreaView style={styles.container}>
      <HeaderTitle showBackButton={true} percentage={0.75} />

      <View style={{ marginHorizontal: 40, marginTop: 30 }}>
        <Text
          style={{ fontSize: 24, color: '#6f6f6f', fontWeight: '500' }}
          text={'What times do you want to eat?'}
        />
      </View>

      <View style={{ marginTop: 30 }}>
        {meals &&
          meals.map((item, i) => (
            <TouchableOpacity
              style={[
                {
                  marginHorizontal: 40,
                  borderBottomWidth: exerciseLevel !== item ? 1 : null,
                  borderBottomColor: exerciseLevel !== item ? '#e1e1e1' : '#a5c2d0',
                  borderWidth: exerciseLevel === item ? 1 : null,
                  paddingVertical: 18,
                  borderColor: '#a5c2d0',
                },
              ]}
              onPress={() => {
                setSelectedMeal(i);
                setTimeModal(true);
              }}
            >
              <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                <View
                  style={{
                    paddingHorizontal: 11,
                  }}
                >
                  <Text style={{ fontSize: 20, color: '#6f6f6f', fontWeight: '700' }}>
                    {item.meal}
                  </Text>
                  {/* <Text style={{color: '#7d7d7d', marginTop: 5}}>{item.description}</Text> */}
                </View>
                <View style={{ justifyContent: 'center' }}>
                  {item.time ? (
                    <Text>{item.time}</Text>
                  ) : (
                    <Image source={downIcon} style={{ height: 10, width: 20, marginRight: 10 }} />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
      </View>

      <View style={{ height: '18.8%', justifyContent: 'flex-end' }}>
        <TouchableOpacity
          style={{
            marginHorizontal: 40,
            marginBottom: 25,
            opacity: Boolean(buttonDiabled().includes('')) ? 0.7 : 1,
          }}
          disabled={Boolean(buttonDiabled().includes('')) ? true : false}
          onPress={() => {
            onNext();
          }}
        >
          <LinearGradient style={[styles.logInButton]} colors={['#048ECC', '#0460BB', '#0480C6']}>
            <Text style={styles.loginText}>Next</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <Modal visible={timeModal} style={{ flex: 1 }} animationType="slide" transparent={true}>
        <View style={[{ backgroundColor: 'rgba(0, 0, 0, 0.85);', flex: 1 }, styles.centeredView]}>
          <DatePicker
            date={time}
            onDateChange={val => {
              setTime(val);
              const timee = moment(val, ['h:mm A']).format('HH:mm');
              onSelectMeal(selectedMeal, timee);

              // setMealsArray(prevData => [...prevData, (prevData[selectedMeal].time = timee)]);
            }}
            androidVariant="iosClone"
            style={{ backgroundColor: '#fff' }}
            mode="time"
          />

          <TouchableOpacity
            style={{ width: '80%', marginVertical: 25 }}
            onPress={() => setTimeModal(false)}
          >
            <LinearGradient style={[styles.logInButton]} colors={['#048ECC', '#0460BB', '#0480C6']}>
              <Text style={styles.loginText}>Select Time</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={{ width: '80%' }} onPress={() => setTimeModal(false)}>
            <LinearGradient style={[styles.logInButton]} colors={['#e52b39', '#ef3d49', '#fb5a60']}>
              <Text style={styles.loginText}>Cancel</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logInButton: {
    height: 53,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: {
    fontSize: 16,
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
