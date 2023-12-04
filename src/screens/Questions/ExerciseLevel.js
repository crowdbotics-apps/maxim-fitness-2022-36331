import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';

//Components
import { Text, Button } from '../../components';
import HeaderTitle from './Components/HeaderTitle';

//Themes
import { Images, Global, Layout, Gutters, Fonts, Colors } from '../../theme';

//Actions
import { updateAnswer } from './Redux';

const ExerciseLevel = props => {
  const {
    navigation: { navigate },
  } = props;
  const [exerciseLevel, setExerciseLevel] = useState(false);

  useEffect(() => {
    if (props.answers && props.answers.exercise_level) {
      setExerciseLevel(props.answers.exercise_level);
    }
  }, []);

  const exerciseArray = [
    { heading: 'Sedantry', description: 'No exercise experience', value: 1 },
    { heading: 'Intermediate', description: 'less than 2 years of training, off and on', value: 2 },
    { heading: 'Advanced', description: 'more than 2 years of dedicated training', value: 3 },
  ];

  const onNext = () => {
    const tempData = props.answers;
    tempData.exercise_level = exerciseLevel;
    props.updateAnswers(tempData);
    navigate('ActivityLevel');
  };

  return (
    <SafeAreaView style={[Global.secondaryBg, Layout.fill]}>
      <HeaderTitle percentage={0.18} showBackButton />
      <ScrollView
        contentContainerStyle={[
          Layout.fillGrow,
          Gutters.small2xHPadding,
          Layout.justifyContentBetween,
        ]}
      >
        <View style={Gutters.mediumTMargin}>
          <Text
            color="commonCol"
            style={Fonts.titleRegular}
            text={'What is level of your exercise?'}
          />
        </View>
        <View style={[Layout.justifyContentStart, Layout.fill, Gutters.mediumTMargin]}>
          {exerciseArray.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[
                Layout.row,
                Gutters.smallHPadding,
                Layout.alignItemsCenter,
                Layout.justifyContentBetween,
                exerciseLevel === item.value ? Global.border : Global.borderB,
                exerciseLevel !== item.value ? Global.borderAlto : { borderColor: Colors.primary },
              ]}
              onPress={() => setExerciseLevel(item.value)}
            >
              <View style={[Layout.justifyContentBetween, Gutters.regularVMargin]}>
                <Text text={item.heading} color="commonCol" style={Fonts.titleSmall} bold />
                <Text
                  color="commonCol"
                  style={[Fonts.textMedium, Gutters.tinyTMargin]}
                  text={item.description}
                />
              </View>
              <Image source={Images.forwardIcon} style={styles.rightArrow} />
            </TouchableOpacity>
          ))}
        </View>
        <View style={Layout.justifyContentEnd}>
          <Button
            block
            text={'Next'}
            color="primary"
            onPress={onNext}
            disabled={!exerciseLevel}
            style={Gutters.regularBMargin}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  rightArrow: { height: 20, width: 20, resizeMode: 'contain', tintColor: Colors.nobel }
});

const mapStateToProps = state => ({
  answers: state.questionReducer.answers,
});

const mapDispatchToProps = dispatch => ({
  updateAnswers: data => dispatch(updateAnswer(data)),
});
export default connect(mapStateToProps, mapDispatchToProps)(ExerciseLevel);
