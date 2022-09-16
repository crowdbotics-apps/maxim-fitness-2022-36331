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

const Gender = props => {
  const { forwardIcon, otLogo } = Images;

  const {
    navigation: { navigate },
  } = props;

  const genderArray = ['Male', 'Female', 'Prefer not to answer'];

  const [gender, setGender] = useState(false);
  const [welcomeModal, setWelcomeModal] = useState(false);

  const onNext = () => {
    const tempData = props.answers;
    tempData.gender = gender;

    props.updateAnswers(tempData);
    setWelcomeModal(true);
  };
  useEffect(() => {
    if (props.answers && props.answers.gender) {
      setGender(props.answers.gender);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <HeaderTitle percentage={0.1} showBackButton={true} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ marginHorizontal: 40, marginTop: 30 }}>
          <Text
            style={{ fontSize: 24, color: '#6f6f6f', fontWeight: '500' }}
            text={'What is your gender?'}
          />

          <Text style={{ marginTop: 18, color: '#828282', fontSize: 17, marginBottom: 20 }}>
            This answer has influence on how your program is designed
          </Text>
        </View>

        {genderArray.map(item => (
          <TouchableOpacity
            style={[
              {
                height: 65,
                //   marginTop: 15,
                marginHorizontal: 40,
                alignItems: 'center',
                borderBottomWidth: gender !== item ? 1 : null,
                flexDirection: 'row',
                borderBottomColor: gender !== item ? '#e1e1e1' : '#a5c2d0',
                justifyContent: 'space-between',
                paddingHorizontal: 11,
                borderWidth: gender === item ? 1 : null,
                borderColor: '#a5c2d0',
              },
            ]}
            onPress={() => setGender(item)}
          >
            <Text style={{ fontSize: 24, color: '#6f6f6f', fontWeight: '500' }}>{item}</Text>
            <Image source={forwardIcon} style={{ height: 20, width: 10 }} />
          </TouchableOpacity>
        ))}

        <View style={{ height: '42%', justifyContent: 'flex-end' }}>
          <TouchableOpacity
            style={{ marginHorizontal: 40, marginBottom: 25, opacity: gender !== false ? 1 : 0.7 }}
            disabled={!gender}
            onPress={() => onNext()}
          >
            <LinearGradient style={[styles.logInButton]} colors={['#048ECC', '#0460BB', '#0480C6']}>
              <Text style={styles.loginText}>Next</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={welcomeModal}
        style={{ backgroundColor: 'red', flex: 1 }}
        animationType="slide"
        transparent={true}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: 'rgba(0, 0, 0, 0.85);', justifyContent: 'space-between' }}>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <View style={[styles.centeredView, { zIndex: 1 }]}>
              <Image source={otLogo} style={{ height: 110, width: 140 }} />
            </View>

            <View style={[styles.centeredView, { marginTop: 20 }]}>
              <Text style={{ fontSize: 24, color: '#fff' }}>Welcome to Orum Training!</Text>
            </View>

            <View style={[styles.centeredView, { marginTop: 24, marginHorizontal: 39 }]}>
              <Text style={{ fontSize: 18, color: '#fff', textAlign: 'left' }}>
                Next, we are going to ask you questions regarding your exercise goals then nutrition
                preferences
              </Text>
            </View>
          </View>

          <View style={{ justifyContent: 'flex-end' }}>
            <TouchableOpacity
              style={{ marginHorizontal: 40, marginBottom: 25 }}
              onPress={() => {
                setWelcomeModal(false);
                navigate('ExerciseLevel');
              }}
            >
              <LinearGradient
                style={[styles.logInButton]}
                colors={['#048ECC', '#0460BB', '#0480C6']}
              >
                <Text style={styles.loginText}>Next</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
export default connect(mapStateToProps, mapDispatchToProps)(Gender);
