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
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

//Libraires
import { connect } from 'react-redux';

//Components
import { Text } from '../../components';
import HeaderTitle from './Components/HeaderTitle';
import { submitQuestionRequest } from './Redux';

//Themes
import Images from '../../theme/Images';
import Slider from 'react-native-slide-to-unlock';
import LinearGradient from 'react-native-linear-gradient';
import { Icon } from 'native-base';

const ThingsToKnow = props => {

  const {
    navigation: { navigate },
    answers,
    profile
  } = props;

  console.log('answers: ', answers);
  const deviceWidth = Dimensions.get('window').width

  const data = {
    gender: answers?.gender,
    dob: answers?.dob,
    weight: answers?.weight,
    height: answers?.height,
    unit: answers?.unit,
    exercise_level: answers?.exercise_level,
    activity_level: answers?.activity_level,
    understanding_level: answers?.understanding_level,
    number_of_meal: answers?.number_of_meal.value,
    number_of_training_days: answers?.number_of_training_days,
    fitness_goal: answers?.fitness_goal,
    date_time: answers?.mealTimes,
    request_type: 'question',
  };

  const thingsArray = [
    {
      number: 1,
      heading: 'Consult with your Doctor',
      description:
        'Before starting any type of physical activity, consult with your physician. Your physician may have different advice on the best exercises and activity for your specific needs.',
    },
    {
      number: 2,
      heading: 'Consult with a Dietician',
      description:
        'A registered dietician is a professionalwho can inform you about eating healthy.Contact a registered dietician beforestarting any diet or meal plan to ensureyou are consuming the appropriate    amount of nutrients',
    },
    {
      number: 3,
      heading: 'Limitations of Liability',
      description:
        'Orum Training is science based and follows the highest industry standards in exercise science and nutrition. However, it is important to consult a physician and/ or registered dietician before starting our services, to identify your limitations. By clicking slide to accept, you accept responsibility to consult with health professionals and do not hold Orum Training responsible for injuries from exercise or diet.',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <HeaderTitle showBackButton={true} percentage={0.9} />
      <TouchableOpacity
        style={{
          justifyContent: 'flex-end',
          flexDirection: 'row',
          marginHorizontal: 40,
          marginTop: 20,
        }}
        onPress={() => props.submitQuestionRequest(profile, data)}
      >
        <Text style={{ fontSize: 16, color: '#377eb5' }} >Cancel</Text>
      </TouchableOpacity>

      <View style={{ marginTop: 10, marginHorizontal: 40 }}>
        <Text style={{ fontSize: 24, fontWeight: '700' }}>Three Things You Should Know</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>

        <View>
          {thingsArray.map((item, i) => (
            <View
              key={i}
              style={{
                marginHorizontal: 40,
                backgroundColor: '#d3d3d3',
                borderRadius: 18,
                paddingBottom: 20,
                marginVertical: 10,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  marginHorizontal: 9,
                  marginTop: 9,
                  alignItems: 'center',
                }}
              >
                <View
                  style={[
                    styles.centeredView,
                    {
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      backgroundColor: '#317fbd',
                      marginRight: 10,
                    },
                  ]}
                >
                  <Text style={{ color: '#fff', fontWeight: '500' }}>{item.number}</Text>
                </View>
                <Text style={{ fontWeight: '700' }}>{item.heading} </Text>
              </View>

              <Text style={{ marginHorizontal: 10, marginTop: 8 }}>{item.description}</Text>
            </View>
          ))}
        </View>
        <View style={{ marginVertical: 10, justifyContent: 'center', alignItems: 'center' }}>
          <Slider
            childrenContainer={{}}
            onEndReached={() => props.submitQuestionRequest(profile, data)}
            containerStyle={{
              margin: 8,
              width: deviceWidth - 80,
              borderRadius: 10,
              overflow: 'hidden',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#d3d3d3',
            }}
            sliderElement={
              <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                colors={['#6EC2FA', '#3180BD']}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 10,
                }}
              >
                <View style={{ width: 50, height: 50, margin: 5, borderRadius: 10 }}>
                  <Icon
                    type="FontAwesome5"
                    name="arrow-right"
                    style={{ color: 'white', alignSelf: 'center', marginTop: 10 }}
                  />
                </View>
              </LinearGradient>
            }
          >
            <Text style={{ fontWeight: 'bold', color: 'black' }}>{'Slide to Accept'}</Text>
          </Slider>
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
  profile: state.login.userDetail
});

const mapDispatchToProps = dispatch => ({
  submitQuestionRequest: (profile, data) => dispatch(submitQuestionRequest(profile, data)),
});
export default connect(mapStateToProps, mapDispatchToProps)(ThingsToKnow);
