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
import { Overlay } from 'react-native-elements';
import { connect } from 'react-redux';

//Components
import { Text } from '../../components';
import HeaderTitle from './Components/headerTitle';

//Themes
import Images from '../../theme/Images';

//Actions
import { updateAnswer } from './Redux';

const ExerciseLevel = props => {
  const { forwardIcon, otLogo } = Images;

  const exerciseArray = [
    { heading: 'Sedantry', description: 'No exercise experience' },
    { heading: 'Intermediate', description: 'less than 2 years of training, off and on' },
    { heading: 'Advanced', description: 'more than 2 years of dedicated training' },
  ];

  const {
    navigation: { navigate },
  } = props;

  const [exerciseLevel, setExerciseLevel] = useState(false);

  const onNext = () => {
    const tempData = props.answers;
    tempData.exercise_level = exerciseLevel;
    navigate('ActivityLevel');
    props.updateAnswers(tempData);
  };
  useEffect(() => {
    if (props.answers && props.answers.exercise_level) {
      setExerciseLevel(props.answers.exercise_level);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <HeaderTitle showBackButton={true} percentage={0.18} />

      <View style={{ marginHorizontal: 40, marginTop: 30 }}>
        <Text
          style={{ fontSize: 24, color: '#6f6f6f', fontWeight: '500' }}
          text={'What is level of your exercise?'}
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
                borderBottomWidth: exerciseLevel !== item.heading ? 1 : null,
                borderBottomColor: exerciseLevel !== item.heading ? '#e1e1e1' : '#a5c2d0',
                borderWidth: exerciseLevel === item.heading ? 1 : null,
                paddingVertical: 11,
                borderColor: '#a5c2d0',
              },
            ]}
            onPress={() => setExerciseLevel(item.heading)}
          >
            <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
              <View
                style={{
                  paddingHorizontal: 11,
                }}
              >
                <Text style={{ fontSize: 20, color: '#6f6f6f', fontWeight: '600' }}>
                  {item.heading}
                </Text>
                <Text style={{ color: '#7d7d7d', marginTop: 5 }}>{item.description}</Text>
              </View>
              <View>
                <Image
                  source={forwardIcon}
                  style={{ height: 20, width: 10, marginTop: 10, marginRight: 10 }}
                />
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ height: '41%', justifyContent: 'flex-end' }}>
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
export default connect(mapStateToProps, mapDispatchToProps)(ExerciseLevel);
