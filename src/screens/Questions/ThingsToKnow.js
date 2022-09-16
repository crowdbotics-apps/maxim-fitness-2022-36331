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
import { connect } from 'react-redux';

//Components
import { Text } from '../../components';
import HeaderTitle from './Components/headerTitle';
import { submitQuestionRequest } from './Redux';

//Themes
import Images from '../../theme/Images';

const ThingsToKnow = props => {

  const {
    navigation: { navigate },
    answers,
    profile
  } = props;

  console.log('answers: ', answers);
  const { forwardIcon, otLogo } = Images;

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
        onPress={() => props.submitQuestionRequest(profile, answers)}
      >
        <Text style={{ fontSize: 16, color: '#377eb5' }} >Cancel</Text>
      </TouchableOpacity>

      <View style={{ marginTop: 10, marginHorizontal: 40 }}>
        <Text style={{ fontSize: 24, fontWeight: '700' }}>Three Things You Should Know</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>

        <View>
          {thingsArray.map(item => (
            <View
              style={{
                marginHorizontal: 40,
                backgroundColor: '#d3d3d3',
                borderRadius: 18,
                paddingBottom: 20,
                marginVertical: 10,

                // height: 100  ,
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
