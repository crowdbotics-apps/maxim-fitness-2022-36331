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
import { connect } from 'react-redux';
import { Text } from '../../components';

//action
import { getUserProfile } from '../../ScreenRedux/searchProfileRedux';
import { followUser, unFollowUser } from '../../ScreenRedux/profileRedux';

const { backImage, searchImage, profileBackGround, followButton, profile, followingButton } = Images;
const SearchProfile = props => {
  const { navigation, profileUserData, requesting } = props;
  const { width } = Dimensions.get('window');
  const [followUser, setFollowUser] = useState([]);

  let newArray = []
  useEffect(() => {
    if (profileUserData) {
      let filterData = profileUserData.filter(item => item.follow === true)

      filterData.map(item => {
        newArray.push(item.user_detail.id)
      })
      setFollowUser(newArray)
    }
  }, [profileUserData])

  useEffect(() => {
    props.getUserProfile('');
  }, []);

  const followUnfollowUser = item => {
    if (followUser.length && followUser.includes(item?.user_detail?.id)) {
      let newData = followUser.filter(v => v !== item.user_detail.id);
      setFollowUser(newData);
    } else {
      setFollowUser(
        followUser.length ? [...followUser, item.user_detail.id] : [item.user_detail.id]
      );
    }
    if (followUser.includes(item?.user_detail?.id)) {
      props.unFollowUser({ id: item.user_detail.id })
    } else {
      props.followUser({ id: item.user_detail.id })
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: 20, flexDirection: 'row', marginTop: 20 }}>
          <TouchableOpacity
            style={{ flex: 1, justifyContent: 'center' }}
            onPress={() => navigation.goBack()}
          >
            <Image source={backImage} style={{ height: 20, width: 30 }} />
          </TouchableOpacity>
          <View style={{ flex: 1.5 }}>
            <Text text="People" style={{ fontSize: 22 }} bold />
          </View>
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
            onChangeText={e => props.getUserProfile(e)}
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
        {requesting ? (
          <ActivityIndicator size="large" color="#000" style={{ flex: 1 }} />
        ) : profileUserData?.length ? (
          profileUserData?.map(item => (
            <TouchableOpacity
              onPress={() => navigation.navigate('MessageScreen')}
              style={{
                marginTop: 25,
                paddingHorizontal: 20,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ flexDirection: 'row' }}>
                <Image
                  source={
                    item?.user_detail?.profile_picture
                      ? { uri: item?.user_detail?.profile_picture }
                      : profile
                  }
                  style={{
                    height: (61 / 375) * width,
                    width: (61 / 375) * width,
                    borderRadius: (31 / 375) * width,
                  }}
                />
                <View style={{ justifyContent: 'center', marginLeft: 15 }}>
                  <Text text={item?.user_detail?.username} bold style={{ fontSize: 12 }} />
                  <Text text="THE ROCK" style={{ color: '#D3D3D3', fontSize: 12 }} />
                </View>
              </View>
              <TouchableOpacity onPress={() => [followUnfollowUser(item)]}>
                <Image
                  source={
                    followUser.includes(item?.user_detail?.id) ? followingButton : followButton
                  }
                  style={{ height: (60 / 375) * width, width: (110 / 375) * width }}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        ) : (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text text="No Record Found" />
          </View>
        )}
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

const mapStateToProps = state => ({
  requesting: state.userProfileReducer.requesting,
  profileUserData: state.userProfileReducer.profileUserData,
});

const mapDispatchToProps = dispatch => ({
  getUserProfile: data => dispatch(getUserProfile(data)),
  followUser: data => dispatch(followUser(data)),
  unFollowUser: data => dispatch(unFollowUser(data)),
});
export default connect(mapStateToProps, mapDispatchToProps)(SearchProfile);
