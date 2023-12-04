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

const Gender = props => {
  const {
    navigation: { navigate },
  } = props;
  const genderArray = ['Male', 'Female'];

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
    <SafeAreaView style={[Global.secondaryBg, Layout.fill]}>
      <HeaderTitle percentage={0.1} showBackButton={true} />
      <ScrollView
        contentContainerStyle={[
          Layout.fillGrow,
          Gutters.small2xHPadding,
          Layout.justifyContentBetween,
        ]}
      >
        <View style={Gutters.mediumTMargin}>
          <Text color="commonCol" style={Fonts.titleRegular} text={'What is your gender?'} />
          <Text
            color="commonCol"
            style={[Gutters.regularVMargin, Fonts.textMedium]}
            text="This answer has influence on how your program is designed"
          />
        </View>
        <View style={[Layout.justifyContentStart, Layout.fill]}>
          {genderArray.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[
                Layout.row,
                Global.height65,
                Gutters.smallHPadding,
                Layout.alignItemsCenter,
                Layout.justifyContentBetween,
                gender === item ? Global.border : Global.borderB,
                gender !== item ? Global.borderAlto : { borderColor: Colors.primary },
              ]}
              onPress={() => setGender(item)}
            >
              <Text text={item} color="commonCol" style={Fonts.titleRegular} />
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
            disabled={!gender}
            style={Gutters.regularBMargin}
          />
        </View>
      </ScrollView>

      <Modal visible={welcomeModal} style={Layout.fill} animationType="slide" transparent={true}>
        <ScrollView
          contentContainerStyle={[
            Layout.fillGrow,
            Global.opacityBg75,
            Layout.justifyContentBetween,
          ]}
        >
          <View style={[Layout.fill, Layout.justifyContentCenter]}>
            <View style={[Layout.center, { zIndex: 1 }]}>
              <Image source={Images.otLogo} style={styles.logoStyle} />
            </View>

            <View style={[Layout.center, Gutters.small2xTMargin]}>
              <Text text="Welcome to Orum Training !" color="secondary" style={Fonts.titleMedium} />
              <Text
                color="secondary"
                style={[
                  Fonts.textLarge,
                  Fonts.textLeft,
                  Gutters.small2xTMargin,
                  Gutters.mediumHMargin,
                ]}
                text="Next, we are going to ask you questions regarding your exercise goals then nutrition preferences"
              />
            </View>
          </View>

          <View style={Layout.justifyContentEnd}>
            <Button
              block
              text={'Next'}
              color="primary"
              onPress={() => {
                setWelcomeModal(false);
                navigate('ExerciseLevel');
              }}
              disabled={!gender}
              style={[Gutters.small2xHMargin, Gutters.regularVMargin]}
            />
          </View>
        </ScrollView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  logoStyle: { height: 140, width: 140, resizeMode: 'contain' },
  rightArrow: { height: 20, width: 20, resizeMode: 'contain', tintColor: Colors.nobel },
});

const mapStateToProps = state => ({
  answers: state.questionReducer.answers,
});

const mapDispatchToProps = dispatch => ({
  updateAnswers: data => dispatch(updateAnswer(data)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Gender);
