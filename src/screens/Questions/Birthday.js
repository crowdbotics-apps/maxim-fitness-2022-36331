import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Modal,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

//Components
import { Text } from '../../components';
import HeaderTitle from './Components/headerTitle';

//Libraries
import DatePicker from 'react-native-date-picker';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import moment from 'moment';
import { updateAnswer } from './Redux';

const Birthday = props => {
  const {
    navigation: { navigate },
  } = props;

  const [dateModal, setDateModal] = useState(false);
  const [date, setDate] = useState(new Date());
  const [navState, setNavState] = useState(false);

  const onNext = () => {
    const tempData = props.answers;
    tempData.dob = navState;
    navigate('Gender');
  };
  return (
    <SafeAreaView style={styles.container}>
      <HeaderTitle percentage={0.02} showBackButton={false} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ marginHorizontal: 40, marginTop: 30 }}>
          <Text
            style={{ fontSize: 24, color: '#6f6f6f', fontWeight: '500' }}
            text={'When were you born?'}
          />
          {/*
        <Text style={{marginTop: 18}}>
          This answer has influence on how your program is designed
        </Text> */}
        </View>

        <TouchableOpacity
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
          onPress={() => setDateModal(true)}
        >
          <Text style={{ fontSize: 24, color: '#d3d3d3', fontWeight: '500' }}>
            {navState ? navState : 'Birthday'}
          </Text>
        </TouchableOpacity>
        <View style={{ height: '68%', justifyContent: 'flex-end' }}>
          <TouchableOpacity
            style={{ marginHorizontal: 40, marginBottom: 25 }}
            onPress={() => onNext()}
            disabled={!navState}
          >
            <LinearGradient style={[styles.logInButton]} colors={['#048ECC', '#0460BB', '#0480C6']}>
              <Text style={styles.loginText}>Next</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Modal visible={dateModal} style={{ flex: 1 }} animationType="slide" transparent={true}>
        <View style={[{ backgroundColor: 'rgba(0, 0, 0, 0.85);', flex: 1 }, styles.centeredView]}>
          <DatePicker
            date={date}
            onDateChange={val => {
              const dob = moment(val).format('YYYY-MM-DD');
              setNavState(dob);
            }}
            androidVariant="iosClone"
            style={{ backgroundColor: '#fff' }}
            mode="date"
          />

          <TouchableOpacity
            style={{ width: '80%', marginVertical: 25 }}
            onPress={() => setDateModal(false)}
          >
            <LinearGradient style={[styles.logInButton]} colors={['#048ECC', '#0460BB', '#0480C6']}>
              <Text style={styles.loginText}>Select Date of Birth</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={{ width: '80%' }} onPress={() => setDateModal(false)}>
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
export default connect(mapStateToProps, mapDispatchToProps)(Birthday);
