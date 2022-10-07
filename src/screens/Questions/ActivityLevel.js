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

const ActivityLevel = props => {
  const {
    navigation: { navigate },
  } = props;
  const [exerciseLevel, setExerciseLevel] = useState(false);

  useEffect(() => {
    if (props.answers && props.answers.activity_level) {
      setExerciseLevel(props.answers.activity_level);
    }
  }, []);

  const onNext = () => {
    const tempData = props.answers;
    tempData.activity_level = exerciseLevel;
    props.updateAnswers(tempData);
    navigate('MeasurementUnit');
  };

  const exerciseArray = [
    {
      value: 1,
      heading: 'Sedantry',
      description:
        'Office job, watches TV for extended periods, video gaming, minimal movement on daily basis',
    },
    {
      value: 2,
      heading: 'Low Activity',
      description:
        '30-60 minutes per day of moderate intensity physical activity(210-240 minutes per week)',
    },
    {
      value: 3,
      heading: 'Active',
      description: 'Atleast 60 minutes per day of moderate intensity physical activity',
    },
    {
      value: 4,
      heading: 'Very Active',
      description: '120 minutes per day of vigorous physical activity',
    },
  ];

  return (
    <SafeAreaView style={[Global.secondaryBg, Layout.fill]}>
      <HeaderTitle percentage={0.33} showBackButton />
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
            text={'What is level of your Activity?'}
          />
        </View>
        <View style={[Layout.justifyContentStart, Layout.fill, Gutters.mediumTMargin]}>
          {exerciseArray.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[
                Layout.row,
                // Global.height65,
                Gutters.smallHPadding,
                Layout.alignItemsCenter,
                Layout.justifyContentBetween,
                exerciseLevel === item.value ? Global.border : Global.borderB,
                exerciseLevel !== item.value ? Global.borderAlto : { borderColor: Colors.primary },
              ]}
              onPress={() => setExerciseLevel(item.value)}
            >
              <View style={[Layout.justifyContentBetween, Gutters.regularVMargin, Layout.fill4x]}>
                <Text text={item.heading} color="commonCol" style={Fonts.titleSmall} bold />
                <Text
                  color="commonCol"
                  style={[Fonts.textMedium, Gutters.tinyTMargin]}
                  text={item.description}
                />
              </View>
              <View style={[Layout.fillHalf, Layout.alignItemsEnd]}>
                <Image source={Images.forwardIcon} style={styles.rightArrow} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <View style={[Layout.justifyContentEnd, Gutters.mediumTMargin]}>
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
export default connect(mapStateToProps, mapDispatchToProps)(ActivityLevel);
