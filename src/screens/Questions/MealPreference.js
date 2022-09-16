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
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
//Components
import { Text } from '../../components';
import HeaderTitle from './Components/headerTitle';

//Themes
import Images from '../../theme/Images';

//Actions
import { updateAnswer } from './Redux';

const MealPreference = props => {
  const { forwardIcon, otLogo } = Images;

  const {
    navigation: { navigate },
  } = props;

  const exerciseArray = [
    { name: '4 Meals', value: 4 },
    { name: '5 Meals', value: 5 },
    { name: '6 Meals', value: 6 },
  ];

  const [exerciseLevel, setExerciseLevel] = useState(false);

  const onNext = () => {
    const tempData = props.answers;
    tempData.number_of_meal = exerciseLevel;
    props.updateAnswers(tempData);
    navigate('MealTime', { numberOfMeals: exerciseLevel.value });
  };
  useEffect(() => {
    if (props.answers && props.answers.number_of_meal) {
      setExerciseLevel(props.answers.number_of_meal);
    }
  }, []);

  console.log('answersss', props.answers);

  return (
    <SafeAreaView style={styles.container}>
      <HeaderTitle showBackButton={true} percentage={0.68} />

      <View style={{ marginHorizontal: 40, marginTop: 30 }}>
        <Text
          style={{ fontSize: 24, color: '#6f6f6f', fontWeight: '500' }}
          text={'How many meals do you prefer to eat in one day?'}
        />
      </View>

      <View style={{ marginTop: 30 }}>
        {exerciseArray.map(item => (
          <TouchableOpacity
            style={[
              {
                // height: 65,
                //   marginTop: 15,
                marginHorizontal: 40,
                borderBottomWidth: exerciseLevel.name !== item.name ? 1 : null,
                borderBottomColor: exerciseLevel.name !== item.name ? '#e1e1e1' : '#a5c2d0',
                borderWidth: exerciseLevel.name === item.name ? 1 : null,
                paddingVertical: 18,
                borderColor: '#a5c2d0',
              },
            ]}
            onPress={() => setExerciseLevel(item)}
          >
            <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
              <View
                style={{
                  paddingHorizontal: 11,
                }}
              >
                <Text style={{ fontSize: 20, color: '#6f6f6f', fontWeight: '600' }}>
                  {item.name}
                </Text>
                {/* <Text style={{color: '#7d7d7d', marginTop: 5}}>{item.description}</Text> */}
              </View>
              <View style={{ justifyContent: 'center' }}>
                <Image source={forwardIcon} style={{ height: 20, width: 10, marginRight: 10 }} />
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ height: '45.8%', justifyContent: 'flex-end' }}>
        <TouchableOpacity
          style={{
            marginHorizontal: 40,
            marginBottom: 25,
            opacity: exerciseLevel !== false ? 1 : 0.7,
          }}
          disabled={!exerciseLevel}
          onPress={() => {
            onNext();
          }}
        >
          <LinearGradient style={[styles.logInButton]} colors={['#048ECC', '#0460BB', '#0480C6']}>
            <Text style={styles.loginText}>Next</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
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
export default connect(mapStateToProps, mapDispatchToProps)(MealPreference);
