import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
} from 'react-native';

//Libraries
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';

//Actions
import { updateAnswer } from './Redux';

//Components
import { Text } from '../../components';
import HeaderTitle from './Components/headerTitle';

const WeightKg = props => {
  const {
    navigation: { navigate },
  } = props;

  const [kilograms, setKilograms] = useState(false);

  const onNext = () => {
    const tempData = props.answers;
    tempData.weight = kilograms;
    props.updateAnswers(tempData);
    navigate('FitnessGoal');
  };

  console.log('tes', props.answers);
  return (
    <SafeAreaView style={styles.container}>
      <HeaderTitle percentage={0.52} showBackButton={true} />

      <View style={{ marginHorizontal: 40, marginTop: 30 }}>
        <Text
          style={{ fontSize: 24, color: '#6f6f6f', fontWeight: '500' }}
          text={'What is your Weight?'}
        />
        {/*
        <Text style={{marginTop: 18}}>
          This answer has influence on how your program is designed
        </Text> */}
      </View>

      <View
        style={[
          {
            height: 65,
            marginTop: 20,
            marginHorizontal: 40,
            justifyContent: 'center',
            borderBottomWidth: 1,
            borderBottomColor: '#808080',
          },
        ]}
      >
        <TextInput
          style={{ fontSize: 24 }}
          placeholder={'Kilograms'}
          keyboardType="number-pad"
          onChangeText={val => setKilograms(val)}
          maxLength={3}
        />
      </View>

      <View style={{ height: '69%', justifyContent: 'flex-end' }}>
        <TouchableOpacity
          style={{ marginHorizontal: 40, marginBottom: 25 }}
          onPress={() => onNext()}
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
export default connect(mapStateToProps, mapDispatchToProps)(WeightKg);
