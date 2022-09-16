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

import HeaderTitle from '../../Questions/Components/headerTitle';
import { Layout, Global, Gutters, Images, Colors } from '../../../theme';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { Icon } from 'native-base';
import DatePicker from 'react-native-date-picker';
import { TextInput } from 'react-native-gesture-handler';

const AddExercies = props => {
  const {
    row,
    fill,
    center,

    alignItemsCenter,

    justifyContentBetween,
  } = Layout;

  const { smallVMargin, regularHMargin, tinyLMargin } = Gutters;
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  let refDescription = useRef('');
  return (
    <SafeAreaView style={[fill, { backgroundColor: 'white' }]}>
      <ScrollView>
        <View style={{ marginHorizontal: 20 }}>
          <View style={[row, alignItemsCenter, { marginLeft: 10, marginTop: 20 }]}>
            <Image source={Images.backIcon} style={{ width: 24, height: 25 }} />
            <View style={[fill, center]}>
              <TextInput
                style={[{ width: 120, borderBottomWidth: 1, padding: 0 }]}
                placeholder="search,,,"
              />
            </View>
          </View>
          <View style={[{marginTop:20},row]}>
            <View style={[{borderWidth:1,height:40,width:90},center]}>
            <Text
              text="Super Set"
              style={{
                fontSize: 14,
                lineHeight: 20,
                fontWeight: '700',
                opacity: 0.7,
                marginTop: 15,
              }}
            />
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
    padding: 13,
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
    marginLeft: 5,
    fontWeight: 'bold',
  },
  imgStyle: { height: 25, width: 30, marginRight: 10 },
  btn1: { height: 50, width: 140, alignSelf: 'center', marginVertical: 10 },
  cardView2: {
    borderWidth: 2,
    padding: 13,
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
export default AddExercies;
