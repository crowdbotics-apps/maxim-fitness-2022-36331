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

const TrainingDays = props => {
  const { forwardIcon, otLogo } = Images;

  const {
    navigation: { navigate },
  } = props;

  const exerciseArray = ['3 Days', '4 Days', '5 Days'];

  const [exerciseLevel, setExerciseLevel] = useState(false);

  const onNext = () => {
    const tempData = props.answers;
    tempData.number_of_training_days = exerciseLevel;
    props.updateAnswers(tempData);
    navigate('MealPreference');
  };
  useEffect(() => {
    if (props.answers && props.answers.number_of_training_days) {
      setExerciseLevel(props.answers.number_of_training_days);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <HeaderTitle showBackButton={true} percentage={0.62} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ marginHorizontal: 40, marginTop: 30 }}>
          <Text
            style={{ fontSize: 24, color: '#6f6f6f', fontWeight: '500' }}
            text={'How many days a week do you want to train?'}
          />
        </View>

        <View style={{ marginTop: 10, flex: 1 }}>
          {exerciseArray.map(item => (
            <TouchableOpacity
              style={[
                {
                  marginHorizontal: 40,
                  borderBottomWidth: exerciseLevel !== item ? 1 : null,
                  borderBottomColor: exerciseLevel !== item ? '#e1e1e1' : '#a5c2d0',
                  borderWidth: exerciseLevel === item ? 1 : null,
                  paddingVertical: 25,
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
                  <Text style={{ fontSize: 20, color: '#6f6f6f', fontWeight: '600' }}>{item}</Text>
                  {/* <Text style={{color: '#7d7d7d', marginTop: 5}}>{item.description}</Text> */}
                </View>
                <View style={{ justifyContent: 'center' }}>
                  <Image source={forwardIcon} style={{ height: 20, width: 10, marginRight: 10 }} />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ justifyContent: 'flex-end' }}>
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
      </ScrollView>
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
export default connect(mapStateToProps, mapDispatchToProps)(TrainingDays);