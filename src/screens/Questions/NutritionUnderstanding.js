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

const NutritionUnderstanding = props => {
  const { navigation: { navigate } } = props;
  const { forwardIcon } = Images;
  const [exerciseLevel, setExerciseLevel] = useState(false);

  useEffect(() => {
    if (props.answers && props.answers.understanding_level) {
      setExerciseLevel(props.answers.understanding_level);
    }
  }, []);

  const exerciseArray = [
    {
      heading: 'Beginner',
      description: 'No real understanding of nutrition',
    },
    {
      heading: 'Intermediate',
      description: 'I have tried diets before and had mediocre results',
    },
    {
      heading: 'Advanced',
      description: 'I am educated in nutrition',
    },
  ];


  const onNext = () => {
    const tempData = props.answers;
    tempData.understanding_level = exerciseLevel;
    props.updateAnswers(tempData);
    navigate('ThingsToKnow');
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderTitle showBackButton={true} percentage={0.83} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

        <View style={{ marginHorizontal: 40, marginTop: 20 }}>
          <Text
            style={{ fontSize: 24, color: '#6f6f6f', fontWeight: '500' }}
            text={'What is your level of understanding nutrition?'}
          />
        </View>

        <View style={{ marginTop: 20, flex: 1 }}>
          {exerciseArray.map(item => (
            <TouchableOpacity
              style={[
                {
                  marginHorizontal: 40,
                  borderBottomWidth: exerciseLevel !== item.heading ? 1 : null,
                  borderBottomColor: exerciseLevel !== item.heading ? '#e1e1e1' : '#a5c2d0',
                  borderWidth: exerciseLevel === item.heading ? 1 : null,
                  paddingVertical: 15,
                  borderColor: '#a5c2d0',
                },
              ]}
              onPress={() => setExerciseLevel(item.heading)}
            >
              <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                <View style={{ paddingHorizontal: 11 }}>
                  <Text style={{ fontSize: 20, color: '#6f6f6f', fontWeight: '600' }}>
                    {item.heading}
                  </Text>
                  <Text style={{ color: '#7d7d7d', marginTop: 5 }}>{item.description}</Text>
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
export default connect(mapStateToProps, mapDispatchToProps)(NutritionUnderstanding);
