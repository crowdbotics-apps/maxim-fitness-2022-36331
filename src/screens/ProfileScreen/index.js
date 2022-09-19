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
  RefreshControl,
} from 'react-native';
import { Text, BottomSheet, Loader } from '../../components';
import { Images } from 'src/theme';
import { connect } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import Video from 'react-native-video';

//action
import {
  getProfile,
  routeData,
  followUser,
  unFollowUser,
  blockUser,
  reportUser,
} from '../../ScreenRedux/profileRedux';

const ProfileScreen = props => {
  const { navigation, route, profileData, userDetail, routeData, routeDetail } = props;
  const [follow, setFollow] = useState(profileData?.follow);
  const [showVideo, setShowVideo] = useState(false);
  const {
    profileBackGround,
    whiteBackArrow,
    whiteDots,
    followButton,
    blockIcon,
    flagIcon,
    editProfileButton,
    followingButton,
  } = Images;

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      if (routeDetail) {
        props.getProfile(routeDetail?.user?.id);
      } else {
        props.getProfile(props?.userDetail?.id);
      }
    }
    if (!isFocused) {
      routeData(false);
    }
  }, [isFocused]);

  useEffect(() => {
    if (profileData?.follow) {
      setFollow(profileData?.follow);
    }
  }, [profileData?.follow]);

  const renderData = () => {
    userDetail?.id === routeDetail?.user?.id || !routeDetail
      ? navigation.navigate('EditProfile')
      : follow
      ? [
          setFollow(!follow),
          props.unFollowUser({ id: routeDetail ? routeDetail?.user?.id : userDetail.id }),
        ]
      : [
          setFollow(!follow),
          props.followUser({ id: routeDetail ? routeDetail?.user?.id : userDetail.id }),
        ];
  };

  const blockRequestedUser = () => {
    let apiData = {
      requested_user: userDetail.id,
      blocked_user: routeDetail?.user?.id,
    };
    props.blockUser(apiData);
  };

  const reportUserRequest = () => {
    let apiData = {
      reporter_user: userDetail.id,
      Banned_user: routeDetail?.user?.id,
    };
    props.reportUser(apiData);
  };

  const calculatedData = () => {
    let imagesData = [];
    if (showVideo) {
      if (profileData?.post_video?.length) {
        const chunkSize = 3;
        for (let i = 0; i < profileData?.post_video?.length; i += chunkSize) {
          let chunk = profileData?.post_video?.slice(i, i + chunkSize);
          imagesData.push(chunk);
        }
        return imagesData;
      }
    } else if (profileData?.post_image?.length) {
      const chunkSize = 3;
      for (let i = 0; i < profileData?.post_image?.length; i += chunkSize) {
        let chunk = profileData?.post_image?.slice(i, i + chunkSize);
        imagesData.push(chunk);
      }
      return imagesData;
    }
  };

  const onPullToRefresh = () => {
    if (routeDetail) {
      props.getProfile(routeDetail?.user?.id);
    } else {
      props.getProfile(props?.userDetail?.id);
    }
  };

  const { width, height } = Dimensions.get('window');
  const refRBSheet = useRef();
  return (
    <SafeAreaView>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            colors={['#9Bd35A', '#689F38']}
            refreshing={props.requesting}
            onRefresh={() => onPullToRefresh()}
            progressViewOffset={20}
          />
        }
      >
        <Loader isLoading={props.requesting} />
        <View>
          <ImageBackground
            source={profileBackGround}
            style={{ height: (273 / 375) * width, width: '100%' }}
          >
            <View style={styles.backgroundStyle}>
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack(), props.routeData(false);
                }}
              >
                <Image source={whiteBackArrow} style={{ height: 15, width: 20 }} />
              </TouchableOpacity>
              {!(userDetail?.id === routeDetail?.user?.id || !routeDetail) && (
                <TouchableOpacity onPress={() => refRBSheet.current.open()}>
                  <Image
                    source={whiteDots}
                    style={{ height: 15, width: 25, resizeMode: 'contain' }}
                  />
                </TouchableOpacity>
              )}
            </View>
          </ImageBackground>
          <View style={styles.profileImage}>
            <Image
              source={profileBackGround}
              style={{
                height: 100,
                width: 100,
                borderRadius: 50,
                borderWidth: 2,
                borderColor: 'white',
              }}
            />
          </View>
        </View>
        <View style={{ paddingHorizontal: 40, flexDirection: 'row' }}>
          <View style={{ width: 150 }}>
            <Text
              style={[styles.mainTextStyle, { marginTop: 60 }]}
              text={profileData?.user_detail?.username}
            />
            <Text style={styles.subTextStyle} text={profileData?.user_detail?.email} />
          </View>
          <TouchableOpacity onPress={() => renderData()}>
            <Image
              source={
                userDetail?.id === routeDetail?.user?.id || !routeDetail
                  ? editProfileButton
                  : follow
                  ? followingButton
                  : followButton
              }
              style={{ height: 60, width: 120, marginTop: 10, marginLeft: 40 }}
            />
          </TouchableOpacity>
        </View>
        <Text
          style={{
            fontSize: 14,
            color: 'gray',
            paddingHorizontal: 30,
            marginTop: 20,
            textAlign: 'center',
          }}
          text={profileData?.user_detail?.description}
        />
        <View
          style={{
            paddingHorizontal: 50,
            marginTop: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.mainTextStyle} text={profileData?.follower?.toString()} />
            <Text style={styles.subTextStyle} text="Followers" />
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.mainTextStyle} text="150K" />
            <Text style={styles.subTextStyle} text="Likes" />
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.mainTextStyle} text={profileData?.post?.toString()} />
            <Text style={styles.subTextStyle} text="Posts" />
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
          <TouchableOpacity onPress={() => setShowVideo(false)}>
            <Text
              style={{ fontSize: 20, fontWeight: 'bold', color: showVideo ? 'gray' : '#635eff' }}
              text="Pictures"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowVideo(true)}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                paddingLeft: 40,
                color: showVideo ? '#635eff' : 'gray',
              }}
              text="Videos"
            />
          </TouchableOpacity>
        </View>
        {calculatedData()?.length &&
          calculatedData().map((item, i) => {
            return (
              <View
                style={{
                  flexDirection: i % 2 === 0 ? 'row' : 'row-reverse',
                  marginTop: 20,
                  marginHorizontal: 10,
                }}
              >
                {showVideo && item[0]?.video ? (
                  <Video
                    source={{
                      uri: item[0]?.video,
                    }}
                    style={{
                      height: (300 / 375) * width,
                      width: (175 / 375) * width,
                      borderRadius: 20,
                    }}
                    resizeMode="cover"
                    posterResizeMode="cover"
                  />
                ) : (
                  <Image
                    source={{ uri: item[0]?.image }}
                    style={{
                      height: (300 / 375) * width,
                      width: (175 / 375) * width,
                      borderRadius: 20,
                    }}
                  />
                )}
                <View
                  style={{ marginLeft: i % 2 === 0 ? 10 : 0, marginRight: i % 2 === 0 ? 0 : 10 }}
                >
                  {showVideo ? (
                    <Video
                      source={{
                        uri: item[1]?.video,
                      }}
                      style={{
                        height: (145 / 375) * width,
                        width: (175 / 375) * width,
                        borderRadius: 20,
                      }}
                      resizeMode="cover"
                      posterResizeMode="cover"
                    />
                  ) : (
                    <Image
                      source={{ uri: item[1]?.image }}
                      style={{
                        height: (145 / 375) * width,
                        width: (175 / 375) * width,
                        borderRadius: 20,
                      }}
                    />
                  )}
                  {showVideo ? (
                    <Video
                      source={{
                        uri: item[1]?.video,
                      }}
                      style={{
                        height: (145 / 375) * width,
                        width: (175 / 375) * width,
                        borderRadius: 20,
                        marginTop: 10,
                      }}
                      resizeMode="cover"
                      posterResizeMode="cover"
                    />
                  ) : (
                    <Image
                      source={{ uri: item[1]?.image }}
                      style={{
                        height: (145 / 375) * width,
                        width: (175 / 375) * width,
                        borderRadius: 20,
                        marginTop: 10,
                      }}
                    />
                  )}
                </View>
              </View>
            );
          })}
      </ScrollView>
      <BottomSheet reff={refRBSheet} h={200}>
        <View style={{ marginTop: 30, paddingHorizontal: 40 }}>
          <TouchableOpacity
            style={{ flexDirection: 'row' }}
            onPress={() => [reportUserRequest(), refRBSheet.current.close()]}
          >
            <Image source={flagIcon} style={{ height: 40, width: 30, resizeMode: 'contain' }} />
            <Text style={[styles.mainTextStyle, { marginLeft: 30 }]} text={'Report User'} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flexDirection: 'row', marginTop: 20 }}
            onPress={() => [blockRequestedUser(), refRBSheet.current.close()]}
          >
            <Image source={blockIcon} style={{ height: 40, width: 30, resizeMode: 'contain' }} />
            <Text style={[styles.mainTextStyle, { marginLeft: 30 }]} text={'Block User'} />
          </TouchableOpacity>
        </View>
      </BottomSheet>
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
  profileImage: {
    position: 'absolute',
    bottom: -50,
    marginHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  mainTextStyle: { fontSize: 20, fontWeight: 'bold' },
  subTextStyle: { fontSize: 16, color: 'gray' },
});

const mapStateToProps = state => ({
  requesting: state.profileReducer.requesting,
  routeDetail: state.profileReducer.routeDetail,
  profileData: state.profileReducer.profileData,
  userDetail: state.login.userDetail,
});

const mapDispatchToProps = dispatch => ({
  getProfile: data => dispatch(getProfile(data)),
  routeData: data => dispatch(routeData(data)),
  followUser: data => dispatch(followUser(data)),
  unFollowUser: data => dispatch(unFollowUser(data)),
  blockUser: data => dispatch(blockUser(data)),
  reportUser: data => dispatch(reportUser(data)),
});
export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);