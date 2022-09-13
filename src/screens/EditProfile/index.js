import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
  Image,
  Dimensions,
  ScrollView,
  TextInput,
} from 'react-native';
import {Text, BottomSheet, Button} from '../../components';
import {Images} from 'src/theme';
import {connect} from 'react-redux';

const EditProfile = ({navigation}) => {
  const {profileBackGround, cameraIcon, backArrow} = Images;
  const {width, height} = Dimensions.get('window');
  const refRBSheet = useRef();
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          height: 50,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 20,
        }}
      >
        <TouchableOpacity onPress={()=> navigation.goBack()}>
        <Image source={backArrow} style={{height: 20, width: 30}} />
        </TouchableOpacity>
        <Text style={{fontSize: 20, color: 'gray', fontWeight: 'bold'}} text="Edit Profile" />
        <View></View>
      </View>
      <ScrollView contentContainerStyle={{paddingBottom: 50}}>
        <View>
          <ImageBackground
            source={profileBackGround}
            style={{height: (273 / 375) * width, width: '100%'}}
          >
            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
                marginTop: 10,
                marginRight: 10,
              }}
            >
              <View></View>
              <Image source={cameraIcon} style={{height: 30, width: 30}} />
            </View>
          </ImageBackground>
          <View
            style={{
              position: 'absolute',
              bottom: 15,
              marginLeft: 10,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            }}
          >
            <Image
              source={profileBackGround}
              style={{
                height: 100,
                width: 100,
                borderRadius: 50,
              }}
            />
            <Image
              source={cameraIcon}
              style={{height: 30, width: 30, marginLeft: -25, marginTop: 60}}
            />
          </View>
        </View>
        <View style={{paddingHorizontal: 20, marginTop: 15}}>
          <Text style={{fontSize: 14, color: 'gray', paddingLeft: 5}} text="First Name" />
          <TextInput
            style={{borderBottomColor: 'gray', borderBottomWidth: 1, paddingVertical: 0}}
            //   onChangeText={value => handleOnChange('email', value)}
            placeholder="First Name"
          />
          <Text
            style={{fontSize: 14, color: 'gray', paddingLeft: 5, marginTop: 20}}
            text="Last Name"
          />
          <TextInput
            style={{borderBottomColor: 'gray', borderBottomWidth: 1, paddingVertical: 0}}
            placeholder="Last Name"
          />

          <Text
            style={{fontSize: 14, color: 'gray', paddingLeft: 5, marginTop: 20}}
            text="User Name"
          />
          <TextInput
            style={{borderBottomColor: 'gray', borderBottomWidth: 1, paddingVertical: 0}}
            placeholder="User Name"
          />
          <Text
            style={{fontSize: 14, color: 'gray', paddingLeft: 5, marginTop: 20}}
            text="Discription"
          />
          <TextInput
            style={{
              backgroundColor: 'white',
              marginTop: 20,
              borderWidth: 0.5,
              borderColor: 'gray',
              textAlignVertical: 'top',
              paddingHorizontal: 20,
              paddingTop: 10,
              borderRadius: 6,
              height: 180,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 12,
              },
              shadowOpacity: 0.58,
              shadowRadius: 16.0,
              elevation: 6,
            }}
            multiline
            numberOfLines={10}
            placeholder="Type here..."
            // onChangeText={e => {
            //   setValue(e), showError && setShowError(false);
            // }}
          />
         
        </View>
        <View style={{justifyContent: 'center',flexDirection: 'row',marginTop: 20}}>
            <Button
              color="primary"
              text={'Save'}
              style={[
                {
                  height: 40,
                  width: 150,
                  borderRadius: 40,
                  backgroundColor: '#635eff',
                  borderColor: 'white',
                  justifyContent: 'center',
                  alignItems:'center',
                },
              ]}
            />
          </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'white',
    paddingBottom: 20,
  },
  backgroundStyle: {
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 30,
    flexDirection: 'row',
  },
  mainTextStyle: {fontSize: 20, fontWeight: 'bold'},
  subTextStyle: {fontSize: 16, color: 'gray'},
});

const mapStateToProps = state => ({
  //   requesting: state.feedsReducer.requesting,
});

const mapDispatchToProps = dispatch => ({
  //   getFeedsRequest: data => dispatch(getFeedsRequest(data)),
});
export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);
