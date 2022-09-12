import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

//Components
import {Text} from '../../components';
import HeaderTitle from './Components/headerTitle';

//Themes
import Images from '../../theme/Images';

const Gender = props => {
  const {forwardIcon} = Images;

  const genderArray = ['Male', 'Female', 'Prefer not to answer'];

  const [gender, setGender] = useState(false);
  return (
    <SafeAreaView style={styles.container}>
      {/* <ScrollView> */}
      <HeaderTitle percentage={0.1} showBackButton={true} />

      <View style={{marginHorizontal: 40, marginTop: 30}}>
        <Text
          style={{fontSize: 24, color: '#6f6f6f', fontWeight: '500'}}
          text={'What is your gender?'}
        />

        <Text style={{marginTop: 18, color: '#828282', fontSize: 17, marginBottom: 20}}>
          This answer has influence on how your program is designed
        </Text>
      </View>

      {genderArray.map(item => (
        <TouchableOpacity
          style={[
            {
              height: 65,
              //   marginTop: 15,
              marginHorizontal: 40,
              alignItems: 'center',
              borderBottomWidth: gender !== item ? 1 : null,
              flexDirection: 'row',
              borderBottomColor: gender !== item ? '#e1e1e1' : '#a5c2d0',
              justifyContent: 'space-between',
              paddingHorizontal: 11,
              borderWidth: gender === item ? 1 : null,
              borderColor: '#a5c2d0',
            },
          ]}
          onPress={() => setGender(item)}
        >
          <Text style={{fontSize: 24, color: '#d3d3d3', fontWeight: '500'}}>{item}</Text>
          <Image source={forwardIcon} style={{height: 20, width: 10}} />
        </TouchableOpacity>
      ))}

      <View style={{height: '38%', justifyContent: 'flex-end'}}>
        <TouchableOpacity style={{marginHorizontal: 40, marginBottom: 25}}>
          <LinearGradient style={[styles.logInButton]} colors={['#048ECC', '#0460BB', '#0480C6']}>
            <Text style={styles.loginText}>Next</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      {/* </ScrollView> */}
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

export default Gender;
