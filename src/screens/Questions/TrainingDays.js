import React, { useState, useEffect } from 'react';
import {
  View,
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

const TrainingDays = props => {
  const { navigation: { navigate } } = props;

  const exerciseArray = [
    { value: 1, text: '3 Days' },
    { value: 2, text: '4 Days' },
    { value: 3, text: '5 Days' }
  ];

  const [exerciseLevel, setExerciseLevel] = useState(false);

  useEffect(() => {
    if (props.answers && props.answers.number_of_training_days) {
      setExerciseLevel(props.answers.number_of_training_days);
    }
  }, []);

  const onNext = () => {
    const tempData = props.answers;
    tempData.number_of_training_days = exerciseLevel;
    props.updateAnswers(tempData);
    navigate('MealPreference');
  };

  return (
    <SafeAreaView style={[Global.secondaryBg, Layout.fill]}>
      <HeaderTitle percentage={0.62} showBackButton={true} />
      <ScrollView contentContainerStyle={[Layout.fillGrow, Gutters.small2xHPadding, Layout.justifyContentBetween]}>
        <View style={Gutters.mediumTMargin}>
          <Text
            color="commonCol"
            style={Fonts.titleRegular}
            text={'How many days a week do you want to train?'}
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
                  text={item.text}
                  style={{ fontSize: 20, color: '#6f6f6f', fontWeight: '600' }}
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
  rightArrow: { height: 20, width: 20, resizeMode: 'contain' }
});

const mapStateToProps = state => ({
  answers: state.questionReducer.answers,
});

const mapDispatchToProps = dispatch => ({
  updateAnswers: data => dispatch(updateAnswer(data)),
});
export default connect(mapStateToProps, mapDispatchToProps)(TrainingDays);
