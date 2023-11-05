import React, { useEffect, useState, useRef } from 'react';
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
  Animated,
} from 'react-native';
import { Images } from 'src/theme';
import { Text, Header } from '../../components';

const { backImage, sendMessage, profile, uploadMedia, messageImage } = Images;
const ChatScreen = props => {
  const { navigation, profileUserData, requesting } = props;
  const { width } = Dimensions.get('window');
  const [followUser, setFollowUser] = useState([]);

  let scrollOffsetY = useRef(new Animated.Value(100)).current;

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 60 }}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }], {
            useNativeDriver: false,
          })}
        >
          <View style={{ paddingHorizontal: 20, flexDirection: 'row', marginTop: 20 }}>
            <TouchableOpacity
              style={{ justifyContent: 'center', flex: 1 }}
              onPress={() => navigation.goBack()}
            >
              <Image source={backImage} style={{ height: 20, width: 30 }} />
            </TouchableOpacity>
            <View style={{ flex: 1.5 }}>
              <Image
                source={profile}
                style={{
                  height: (61 / 375) * width,
                  width: (61 / 375) * width,
                  borderRadius: (31 / 375) * width,
                }}
              />
            </View>
          </View>
          <View style={{ alignItems: 'center', marginTop: 10 }}>
            <Text text="Test User" bold style={{ fontSize: 20 }} />
            <Text text="THE ROCK" style={{ color: '#D3D3D3', fontSize: 12 }} />
            <Text text="june 12 5:6 am" style={{ color: '#D3D3D3', fontSize: 14, marginTop: 20 }} />
          </View>
          <View style={{ paddingHorizontal: 10, marginTop: 20 }}>
            <View style={{ flexDirection: 'row' }}>
              <Image
                source={profile}
                style={{
                  height: (40 / 375) * width,
                  width: (40 / 375) * width,
                  borderRadius: (20 / 375) * width,
                }}
              />
              <View
                style={{
                  backgroundColor: '#D3D3D3',
                  paddingVertical: 20,
                  paddingHorizontal: 10,
                  width: '85%',
                  marginLeft: 10,
                  borderRadius: 10,
                }}
              >
                <Text
                  text="hy orum hope you are doing well this is our first conversation on orum app"
                  bold
                  style={{ fontSize: 14 }}
                />
              </View>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 20 }}>
              <View
                style={{
                  backgroundColor: '#add8e6',
                  paddingVertical: 20,
                  paddingHorizontal: 10,
                  width: '85%',
                  marginRight: 10,
                  borderRadius: 10,
                }}
              >
                <Text
                  text="hy orum hope you are doing well this is our first conversation on orum app"
                  style={{ fontSize: 16, color: 'white' }}
                />
              </View>
              <Image
                source={profile}
                style={{
                  height: (40 / 375) * width,
                  width: (40 / 375) * width,
                  borderRadius: (20 / 375) * width,
                }}
              />
            </View>
            <View style={{ flexDirection: 'row', marginTop: 20 }}>
              <View
                style={{
                  backgroundColor: '#add8e6',
                  paddingVertical: 20,
                  paddingHorizontal: 10,
                  width: '85%',
                  marginRight: 10,
                  borderRadius: 10,
                }}
              >
                <Text
                  text="hy orum hope you are doing well this is our first conversation on orum app"
                  style={{ fontSize: 16, color: 'white' }}
                />
              </View>
              <Image
                source={profile}
                style={{
                  height: (40 / 375) * width,
                  width: (40 / 375) * width,
                  borderRadius: (20 / 375) * width,
                }}
              />
            </View>
            <View style={{ flexDirection: 'row', marginTop: 20 }}>
              <View
                style={{
                  backgroundColor: '#add8e6',
                  paddingVertical: 20,
                  paddingHorizontal: 10,
                  width: '85%',
                  marginRight: 10,
                  borderRadius: 10,
                }}
              >
                <Text
                  text="hy orum hope you are doing well this is our first conversation on orum app"
                  style={{ fontSize: 16, color: 'white' }}
                />
              </View>
              <Image
                source={profile}
                style={{
                  height: (40 / 375) * width,
                  width: (40 / 375) * width,
                  borderRadius: (20 / 375) * width,
                }}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
      <View
        style={{
          backgroundColor: 'white',
          paddingBottom: 15,
          paddingHorizontal: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <TextInput
          style={{
            borderWidth: 1,
            width: '70%',
            borderRadius: 20,
            borderColor: 'gray',
            paddingLeft: 30,
            height: 40,
          }}
          placeholder="Write Message"
        />
        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between' }}>
          <Image
            source={uploadMedia}
            style={{
              height: (35 / 375) * width,
              width: (35 / 375) * width,
              marginLeft: 10,
            }}
          />
          <Image
            source={sendMessage}
            style={{
              height: (35 / 375) * width,
              width: (35 / 375) * width,
            }}
          />
        </View>
      </View>
    </>
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

export default ChatScreen;
