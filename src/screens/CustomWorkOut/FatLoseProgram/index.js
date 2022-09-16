import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Image,
  Keyboard,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  Text,
  SetButton,
  VideoExercise,
  FatExerciseButton,
  FatExerciseIconButton,
  FatGradientIconButton,
  RestContainer,
  BottomSheet,
  StaticTimer,
  InputField,
  Button,
  ModalInput,
} from '../../../components';
import { Layout, Global, Gutters, Images, Colors } from '../../../theme';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { Icon } from 'native-base';
import DatePicker from 'react-native-date-picker';

const FatLoseProgram = props => {
  const { findbtn, etc, workoutbtn } = Images;

  const {
    row,
    fill,
    center,
    fill2x,
    fill4x,
    fillHalf,
    fillGrow,
    fullWidth,
    fillOnePoint5,
    alignItemsStart,
    alignItemsEnd,
    alignItemsCenter,
    justifyContentStart,
    justifyContentCenter,
    justifyContentBetween,
  } = Layout;
  const {
    border,
    punchBg,
    height40,
    borderR10,
    secondaryBg,
    halfOpacityBg,
    blackOpacityBg,
    topLRBorderRadius20,
    borderAlto,
  } = Global;
  const {
    zeroMargin,
    zeroPadding,
    tinyHPadding,
    tinyVPadding,
    smallVMargin,
    smallHMargin,
    largeTPadding,
    largeBPadding,
    smallHPadding,
    regularHMargin,
    regularVMargin,
    tiny2xHPadding,
    tinyLMargin,
  } = Gutters;
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  return (
    <SafeAreaView style={[fill, { backgroundColor: 'white' }]}>
    <ScrollView>
      <View style={[smallVMargin, regularHMargin]}>
        <Text style={styles.heading}>Max's Fat Loss Program</Text>
        <View style={[row, alignItemsCenter, justifyContentBetween, { marginTop: 20 }]}>
          <View style={[row]}>
            <Text
              onPress={() => {
                setDate(true);
              }}
              color="primary"
              text={`Week 1`}
              style={[tinyLMargin, styles.smallText]}
            />
            <Icon type="FontAwesome5" name="chevron-right" style={styles.IconStyle} />
          </View>
          <View style={[row]}>
            <Text
              text={`Calendar`}
              style={[tinyLMargin, styles.CalenderText]}
              onPress={() => setOpen(true)}
            />
            <Icon type="FontAwesome5" name="chevron-right" style={styles.IconStyle} />
          </View>
        </View>
        <View style={{ alignSelf: 'center', marginTop: 10 }}>
          <DatePicker
            style={{ height: 70 }}
            open={open}
            date={date}
            onConfirm={date => {
              setOpen();
              setDate(date);
            }}
            onCancel={() => {
              setOpen(false);
            }}
          />
        </View>
        <Text text={`Today's Workout`} style={styles.headind2} />
        <View style={[styles.cardView]}>
          <View style={[row, justifyContentBetween]}>
            <Text text={`Day 3`} color="primary" style={styles.dayText} />
            <Image source={etc} style={styles.imgStyle} />
          </View>
          <Text
            text={`Built upon the proven RG400 platform, Loram’s RGS Specialty Rail Grinder features 24 stones driven by 30 hp electric motors, achieving class-leading metal removal, productivity and throughput. `}
            style={{
              fontSize: 12,
              lineHeight: 16,
              color: 'gray',
              fontWeight: '500',
            }}
          />

          <Image source={findbtn} style={styles.btn1} />
        </View>
        <View style={[center, styles.cardView2]}>
          <Text text={`Create the a Custom Workout`} style={styles.heading3} />
          <View style={{ marginHorizontal: 10, marginTop: 10 }}>
            <Text
              text={`Built upon the proven RG400 platform, Loram’s RGS Specialty Rail Grinder features 24 stones driven by 30 hp electric motors, achieving class-leading metal removal, productivity and throughput`}
              style={styles.praText}
            />
            <Image source={workoutbtn} style={styles.btn2} />
          </View>
        </View>
      </View>
    </ScrollView>
  </SafeAreaView>
  );
};
const styles = StyleSheet.create({
    heading: {
      fontSize: 30,
      fontWeight: 'bold',
      lineHeight: 40,
      marginTop: 10,
      opacity: 0.8,
    },
    smallText: { fontSize: 15, lineHeight: 18 },
    IconStyle: { color: Colors.primary, fontSize: 15, marginLeft: 3 },
    CalenderText: { fontSize: 15, lineHeight: 18, color: 'gray' },
    headind2: {
      fontSize: 25,
      lineHeight: 30,
      color: 'black',
      marginTop: 25,
      fontWeight: 'bold',
      opacity: 0.6,
    },
    cardView: {
      padding: 10,
      marginTop: 15,
      width: '100%',
      borderRadius: 10,
      backgroundColor: 'white',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 5,
      },
      shadowOpacity: 0.34,
      shadowRadius: 6.27,
  
      elevation: 10,
    },
    dayText: {
      fontSize: 12,
      lineHeight: 20,
  
      fontWeight: 'bold',
    },
    imgStyle: { height: 25, width: 20, marginRight: 10 },
    btn1: { height: 50, width: 140, alignSelf: 'center', marginVertical: 10 },
    cardView2: {
      borderWidth: 2,
      padding: 10,
      marginTop: 40,
      width: '100%',
      borderRadius: 10,
      backgroundColor: 'white',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 5,
      },
      shadowOpacity: 0.34,
      shadowRadius: 6.27,
  
      elevation: 10,
      borderColor: Colors.primary,
    },
    heading3: {
      fontSize: 15,
      lineHeight: 20,
      color: 'black',
      fontWeight: 'bold',
    },
    praText: {
      fontSize: 12,
      lineHeight: 16,
      color: 'gray',
      fontWeight: '500',
      textAlign: 'left',
    },
    btn2: { height: 50, width: 150, alignSelf: 'center', marginTop: 10 },
  });
export default FatLoseProgram;
