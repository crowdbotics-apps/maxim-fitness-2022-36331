import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Image,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from 'react-native';
import { Images } from 'src/theme';
import { Text } from '../../components';

const { backImage, searchImage, profile, followingButton, messageImage } =
  Images;
const MessageScreen = props => {
  const { navigation, profileUserData, requesting } = props;
  const { width } = Dimensions.get('window');
  const [followUser, setFollowUser] = useState([]);


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: 20, flexDirection: 'row', marginTop: 20, justifyContent: 'space-between' }}>
          <TouchableOpacity
            style={{ justifyContent: 'center' }}
            onPress={() => navigation.goBack()}
          >
            <Image source={backImage} style={{ height: 20, width: 30 }} />
          </TouchableOpacity>
            <Text text="Messages" style={{ fontSize: 22 }} bold />
            <Image source={messageImage} style={{ height: 30, width: 30 }} />
        </View>
        <View style={{ paddingHorizontal: 20, marginTop: 30, flexDirection: 'row' }}>
          <TextInput
            style={{
              height: 40,
              borderRadius: 20,
              borderColor: '#D3D3D3',
              borderWidth: 1,
              paddingHorizontal: 60,
              width: '100%',
              position: 'relative',
            }}
            placeholder="Search People"
            // onChangeText={e => props.getUserProfile(e)}
          />
          <View
            style={{
              position: 'absolute',
              marginTop: 5,
              paddingLeft: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Image source={searchImage} style={{ height: 30, width: 30 }} />
          </View>
        </View>
            <View
              style={{
                marginTop: 25,
                paddingHorizontal: 20,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ flexDirection: 'row' }}>
                <Image
                  source={profile}
                  style={{
                    height: (61 / 375) * width,
                    width: (61 / 375) * width,
                    borderRadius: (31 / 375) * width,
                  }}
                />
                <View style={{ justifyContent: 'center', marginLeft: 15 }}>
                  <Text text="Test User" bold style={{ fontSize: 12 }} />
                  <Text text="THE ROCK" style={{ color: '#D3D3D3', fontSize: 12 }} />
                </View>
              </View>
              <View style={{justifyContent: 'center'}}>
              <Text text="2 days" style={{ color: '#D3D3D3', fontSize: 12}} />
              </View>
            </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  backIconStyle: {
    height: 16,
    width: 8,
    marginTop: 46,
    marginLeft: 22,
  },
});

export default MessageScreen
