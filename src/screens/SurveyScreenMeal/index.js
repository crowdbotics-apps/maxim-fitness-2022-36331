import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, ScrollView, Alert } from 'react-native';
import Question from '../../components/SurveyMeal/Question';
import SurveyHeader from '../../components/SurveyMeal/SurveyHeader';
import { connect } from 'react-redux';
import { editProfileMeal } from '../../ScreenRedux/profileRedux';
import moment from 'moment';

const SurveyScreenMeal = props => {
  const {
    route: { params },
    profileData,
    editRequesting,
  } = props;

  const questionsData = {
    id: 1,
    type: 'eatTime',
    question: 'What times do you want to eat?',
    description: '',
    options: Array(parseInt(params?.mealValue))
      .fill(0)
      .map((item, i) => {
        return { option: `${i + 1} Meal`, description: '', value: i + 1 };
      }),
    answer: '',
  };
  const [isDisabled, setIsDisabled] = useState(true);

  const selectAnswer = answer => {
    const data = answer.map((item, i) => {
      if (item.mealTime !== '') {
        return {
          mealTime: item.mealTime,
        };
      }
    });
    const dd = data.filter(item => {
      return item !== undefined;
    });

    let firstArray = [];
    let secondArray = [];
    dd.map(item => firstArray.push(moment(item.mealTime).format('HH:mm')));
    props.meals.map(item => secondArray.push(moment(item.date_time).format('HH:mm')));

    let result = firstArray.map(function (element) {
      return secondArray.includes(element);
    });

    let newArray = [];
    dd.map(item => newArray.push(moment(item.mealTime).format('HH:mm')));
    let duplicateArray = newArray.filter(function (item, i, orig) {
      return orig.indexOf(item, i + 1) === -1;
    });

    if (dd.length === duplicateArray.length && result?.every(v => v === false)) {
      const data = {
        date_time: dd,
        number_of_meal: dd?.length,
        request_type: 'mealTime',
      };
      props.editProfileMeal(data, profileData.id);
    } else {
      Alert.alert('Please choose different time');
    }
    setIsDisabled(false);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SurveyHeader onArrowPress={() => props.navigation.goBack()} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flex: 1,
          position: 'relative',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            flex: 1,
            position: 'relative',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View style={{ flex: 1, width: '100%', maxWidth: 320 }}>
            <Question
              singleQuestion={questionsData}
              selectAnswer={selectAnswer}
              isDisabled={isDisabled}
              setIsDisabled={setIsDisabled}
              params={params}
              loading={editRequesting}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const mapStateToProps = state => ({
  profileData: state.login.userDetail,
  meals: state.customCalReducer.meals,
  editRequesting: state.profileReducer.mealRequest,
});

const mapDispatchToProps = dispatch => ({
  editProfileMeal: (mealtime, id) => dispatch(editProfileMeal(mealtime, id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SurveyScreenMeal);
