import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { connect } from 'react-redux';

//Components
import { Text, Button, InputField } from '../../components';
import HeaderTitle from './Components/HeaderTitle';

//Themes
import { Global, Layout, Gutters, Fonts, Colors } from '../../theme';

//Actions
import { updateAnswer } from './Redux';

const HeightCentimeters = props => {
  const {
    navigation: { navigate },
  } = props;
  const [height, setHeight] = useState(false);

  const onNext = () => {
    const tempData = props.answers;
    tempData.height = height;
    props.updateAnswers(tempData);
    navigate('WeightKg');
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderTitle percentage={0.42} showBackButton={true} />

      <ScrollView
        contentContainerStyle={[
          Layout.fillGrow,
          Gutters.small2xHPadding,
          Layout.justifyContentBetween,
        ]}
      >
        <View style={Gutters.mediumTMargin}>
          <Text color="commonCol" style={Fonts.titleRegular} text={'What is your height?'} />
        </View>
        <View style={[Layout.justifyContentStart, Layout.fill, Gutters.mediumTMargin]}>
          <View
            style={[
              Layout.row,
              Global.height65,
              Layout.alignItemsCenter,
              Layout.justifyContentBetween,
              Global.borderB,
              Global.borderAlto,
            ]}
          >
            <InputField
              inputStyle={[
                Fonts.titleRegular,
                Layout.fill,
                {
                  paddingHorizontal: 0,
                  height: Platform.OS === 'android' ? 0 : 60,
                },
              ]}
              value={height}
              onChangeText={val => setHeight(val)}
              placeholder="Height"
              autoCapitalize="none"
              keyboardType="numeric"
            />
          </View>
        </View>
        <View style={[Layout.justifyContentEnd, Gutters.mediumTMargin]}>
          <Button
            block
            text={'Next'}
            color="primary"
            onPress={onNext}
            disabled={!height}
            style={Gutters.regularBMargin}
          />
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
});

const mapDispatchToProps = dispatch => ({
  updateAnswers: data => dispatch(updateAnswer(data)),
});
export default connect(mapStateToProps, mapDispatchToProps)(HeightCentimeters);
