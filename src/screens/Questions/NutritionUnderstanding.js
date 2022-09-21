import React, { useState, useEffect } from 'react';
import {
  View,
  Modal,
  Image,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';

//Components
import { Text, Button } from '../../components';
import HeaderTitle from './Components/HeaderTitle';

//Themes
import { Images, Global, Layout, Gutters, Fonts, Colors } from '../../theme';

//Actions
import { updateAnswer } from './Redux';

const NutritionUnderstanding = props => {
  const {
    navigation: { navigate },
  } = props;
  const { forwardIcon } = Images;
  const [exerciseLevel, setExerciseLevel] = useState(false);

  useEffect(() => {
    if (props.answers && props.answers.understanding_level) {
      setExerciseLevel(props.answers.understanding_level);
    }
  }, []);

  const exerciseArray = [
    {
      value: 1,
      heading: 'Beginner',
      description: 'No real understanding of nutrition',
    },
    {
      value: 2,
      heading: 'Intermediate',
      description: 'I have tried diets before and had mediocre results',
    },
    {
      value: 3,
      heading: 'Advanced',
      description: 'I am educated in nutrition',
    },
  ];

  const onNext = () => {
    const tempData = props.answers;
    tempData.understanding_level = exerciseLevel
      ; (tempData.request_type = 'question'), props.updateAnswers(tempData);
    navigate('ThingsToKnow');
  };

  return (
    <SafeAreaView style={[Global.secondaryBg, Layout.fill]}>
      <HeaderTitle percentage={0.83} showBackButton={true} />
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
            text={'What is your level of understanding nutrition?'}
          />
        </View>
        <View style={[Layout.justifyContentStart, Layout.fill, Gutters.mediumTMargin]}>
          {exerciseArray.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[
                Layout.row,
                Gutters.smallHPadding,
                Gutters.regularVPadding,
                Layout.alignItemsCenter,
                Layout.justifyContentBetween,
                exerciseLevel === item.value ? Global.border : Global.borderB,
                exerciseLevel !== item.value ? Global.borderAlto : { borderColor: Colors.primary },
              ]}
              onPress={() => setExerciseLevel(item.value)}
            >
              <View style={[Layout.justifyContentBetween]}>
                <Text
                  text={item.heading}
                  style={{ fontSize: 20, color: '#6f6f6f', fontWeight: '600' }}
                />
                <Text style={{ color: '#7d7d7d', marginTop: 5 }} text={item.description} />
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
export default connect(mapStateToProps, mapDispatchToProps)(NutritionUnderstanding);
