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
  ScrollView
} from 'react-native';

//Components
import { Text } from '../../components';
import HeaderTitle from './Components/headerTitle';

//Libraires
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';

//Actions
import { updateAnswer } from './Redux';

const WeightPounds = props => {
  const {
    navigation: { navigate },
  } = props;

  const [pound, setPounds] = useState(false);

  const onNext = () => {
    const tempData = props.answers;
    tempData.weight = pound;
    props.updateAnswers(tempData);
    navigate('FitnessGoal');
  };


  return (
    <SafeAreaView style={styles.container}>
      <HeaderTitle percentage={0.52} showBackButton={true} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1 }}>
          <View style={{ marginHorizontal: 40, marginTop: 30 }}>
            <Text
              style={{ fontSize: 24, color: '#6f6f6f', fontWeight: '500' }}
              text={'What is your Weight?'}
            />
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
              placeholder={'Pounds'}
              keyboardType="numeric"
              onChangeText={val => setPounds(val)}
            />
          </View>
        </View>

        <View style={{ justifyContent: 'flex-end' }}>
          <TouchableOpacity
            style={{ marginHorizontal: 40, marginBottom: 25 }}
            onPress={() => onNext()}
            disabled={!pound}
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
export default connect(mapStateToProps, mapDispatchToProps)(WeightPounds);
