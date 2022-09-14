import React, { useState, useEffect, useRef } from 'react';
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
import { Text, BottomSheet, Button } from '../../components';
import { Images } from 'src/theme';
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import { editProfile } from '../../ScreenRedux/profileRedux';

//useForm
import useForm from '../../utils/useForm';
import validator from '../../utils/validation';

const EditProfile = props => {
  const { profileBackGround, cameraIcon, backArrow } = Images;
  const { navigation, userDetail, editRequesting } = props;
  const { width, height } = Dimensions.get('window');
  console.log('userDetail----', userDetail);
  const stateSchema = {
    firstName: {
      value: '',
      error: '',
    },
    lastName: {
      value: '',
      error: '',
    },
    userName: {
      value: '',
      error: '',
    },
    discription: {
      value: '',
      error: '',
    },
    profileImage: {
      value: '',
      error: '',
    },
    backgroundImage: {
      value: '',
      error: '',
    },
  };

  const validationStateSchema = {
    firstName: {
      required: true,
    },
    lastName: {
      required: true,
    },
    userName: {
      required: true,
    },
    discription: {
      required: true,
    },
    profileImage: {
      required: false,
    },
    backgroundImage: {
      required: false,
    },
  };

  useEffect(() => {
    if (userDetail) {
      handleOnChange('firstName', userDetail.first_name);
      handleOnChange('lastName', userDetail.last_name);
      handleOnChange('userName', userDetail.username);
      handleOnChange('discription', userDetail.description);
      handleOnChange('profileImage', userDetail.profile_picture);
      handleOnChange('backgroundImage', userDetail.background_picture);
    }
  }, [userDetail]);

  const { state, handleOnChange, disable, setState } = useForm(stateSchema, validationStateSchema);

  console.log('state-----', state);

  const editProfileData = () => {
    let formData = new FormData();
    formData.append('first_name', state.firstName.value);
    formData.append('last_name', state.lastName.value);
    formData.append('user_name', state.userName.value);
    formData.append('description', state.discription.value);
    if (state?.profileImage?.value) {
      formData.append('profile_picture', {
        uri: state.profileImage.value.path,
        type: state.profileImage.value.mime,
        name: state.profileImage.value.path,
      });
    }
    if (state?.backgroundImage?.value) {
      formData.append('background_picture', {
        uri: state.backgroundImage.value.path,
        type: state.backgroundImage.value.mime,
        name: state.backgroundImage.value.path,
      });
    }
    props.editProfile(formData, userDetail.id);
  };

  const onChangeProfileImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      handleOnChange('profileImage', image);
    });
  };

  const onChangebackgroundImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      handleOnChange('backgroundImage', image);
    });
  };
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
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={backArrow} style={{ height: 20, width: 30 }} />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, color: 'gray', fontWeight: 'bold' }} text="Edit Profile" />
        <View />
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
        <View>
          <ImageBackground
            source={
              state?.backgroundImage?.value?.path
                ? { uri: state.backgroundImage.value.path }
                : state?.backgroundImage?.value
                ? { uri: state.backgroundImage.value }
                : profileBackGround
            }
            style={{ height: (273 / 375) * width, width: '100%' }}
          >
            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
                marginTop: 10,
                marginRight: 10,
              }}
            >
              <View />
              <TouchableOpacity onPress={() => onChangebackgroundImage()}>
                <Image source={cameraIcon} style={{ height: 30, width: 30 }} />
              </TouchableOpacity>
            </View>
          </ImageBackground>
          <TouchableOpacity
            style={{
              position: 'absolute',
              bottom: 15,
              marginLeft: 10,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            }}
            onPress={() => onChangeProfileImage()}
          >
            <Image
              source={
                state?.profileImage?.value?.path
                  ? { uri: state.profileImage.value.path }
                  : state?.profileImage?.value
                  ? { uri: state.profileImage.value }
                  : profileBackGround
              }
              style={{
                height: 100,
                width: 100,
                borderRadius: 50,
              }}
            />
            <Image
              source={cameraIcon}
              style={{ height: 30, width: 30, marginLeft: -25, marginTop: 60 }}
            />
          </TouchableOpacity>
        </View>
        <View style={{ paddingHorizontal: 20, marginTop: 15 }}>
          <Text style={{ fontSize: 14, color: 'gray', paddingLeft: 5 }} text="First Name" />
          <TextInput
            style={{ borderBottomColor: 'gray', borderBottomWidth: 1, paddingVertical: 0 }}
            onChangeText={value => handleOnChange('firstName', value)}
            value={state.firstName.value}
            placeholder="First Name"
          />
          <Text style={{ color: 'red' }} text={state.firstName.error} />
          <Text
            style={{ fontSize: 14, color: 'gray', paddingLeft: 5, marginTop: 20 }}
            text="Last Name"
          />
          <TextInput
            style={{ borderBottomColor: 'gray', borderBottomWidth: 1, paddingVertical: 0 }}
            onChangeText={value => handleOnChange('lastName', value)}
            value={state.lastName.value}
            placeholder="Last Name"
          />
          <Text style={{ color: 'red' }} text={state.lastName.error} />

          <Text
            style={{ fontSize: 14, color: 'gray', paddingLeft: 5, marginTop: 20 }}
            text="User Name"
          />
          <TextInput
            style={{ borderBottomColor: 'gray', borderBottomWidth: 1, paddingVertical: 0 }}
            onChangeText={value => handleOnChange('userName', value)}
            value={state.userName.value}
            placeholder="User Name"
          />
          <Text style={{ color: 'red' }} text={state.userName.error} />
          <Text
            style={{ fontSize: 14, color: 'gray', paddingLeft: 5, marginTop: 20 }}
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
            onChangeText={value => handleOnChange('discription', value)}
            value={state.discription.value}
          />
          <Text style={{ color: 'red' }} text={state.discription.error} />
        </View>
        <View style={{ justifyContent: 'center', flexDirection: 'row', marginTop: 20 }}>
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
                alignItems: 'center',
              },
            ]}
            loading={editRequesting}
            onPress={() => editProfileData()}
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
  mainTextStyle: { fontSize: 20, fontWeight: 'bold' },
  subTextStyle: { fontSize: 16, color: 'gray' },
});

const mapStateToProps = state => ({
  userDetail: state.login.userDetail,
  editRequesting: state.profileReducer.editRequesting,
});

const mapDispatchToProps = dispatch => ({
  editProfile: (data, id) => dispatch(editProfile(data, id)),
});
export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);
