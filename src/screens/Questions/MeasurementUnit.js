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

const MeasurementUnit = props => {
  const {
    navigation: { navigate },
  } = props;
  const exerciseArray = ['Feet/Pounds', 'Meters/Kilograms'];
  const [exerciseLevel, setExerciseLevel] = useState(false);

  useEffect(() => {
    if (props.answers && props.answers.unit) {
      setExerciseLevel(props.answers.unit);
    }
  }, []);

  const onNext = () => {
    const tempData = props.answers;
    tempData.unit = exerciseLevel;
    exerciseLevel === 'Feet/Pounds' && navigate('FeetHeight');
    exerciseLevel === 'Meters/Kilograms' && navigate('HeightCentimeters');
    props.updateAnswers(tempData);
  };

  return (
    <SafeAreaView style={[Global.secondaryBg, Layout.fill]}>
      <HeaderTitle percentage={0.37} showBackButton />
      <ScrollView
        contentContainerStyle={[
          Layout.fillGrow,
          Gutters.small2xHPadding,
          Layout.justifyContentBetween,
        ]}
      >
        <View style={Gutters.mediumTMargin}>
          <Text color="commonCol" style={Fonts.titleRegular} text={'Choose units of measurement'} />
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
                exerciseLevel === item ? Global.border : Global.borderB,
                exerciseLevel !== item ? Global.borderAlto : { borderColor: Colors.primary },
              ]}
              onPress={() => setExerciseLevel(item)}
            >
              <Text text={item} color="commonCol" style={Fonts.titleSmall} />
              <Image source={Images.forwardIcon} style={styles.rightArrow} />
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
export default connect(mapStateToProps, mapDispatchToProps)(MeasurementUnit);
