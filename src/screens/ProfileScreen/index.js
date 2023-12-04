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
  ActivityIndicator,
} from 'react-native';
import { Text, BottomSheet, Loader } from '../../components';
import { Images } from 'src/theme';
import { connect } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import Video from 'react-native-video';
import ImageView from 'react-native-image-viewing';
import Modal from 'react-native-modal';

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
  const [showLoader, setShowLoader] = useState(false);
  const [visible, setIsVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [videoUri, setVideoUri] = useState(false);

  const {
    profileBackGround,
    whiteBackArrow,
    whiteDots,
    followButton,
    blockIcon,
    flagIcon,
    editProfileButton,
    followingButton,
    circleClose,
  } = Images;

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      if (routeDetail && route?.params?.item) {
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
  let imagesArray = [];
  const renderImages = () => {
    if (profileData?.post_image?.length) {
      profileData?.post_image.map(item => {
        imagesArray.push({ uri: item.image });
      });
      return imagesArray;
    }
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
    setShowLoader(true);
    setTimeout(() => {
      setShowLoader(false);
    }, 10);
    if (routeDetail) {
      props.getProfile(routeDetail?.user?.id);
    } else {
      props.getProfile(props?.userDetail?.id);
    }
  };

  const { width, height } = Dimensions.get('window');
  const refRBSheet = useRef();

  return (
    <>
      <SafeAreaView>
        <ScrollView
          contentContainerStyle={styles.container}
          refreshControl={
            <RefreshControl
              colors={['#9Bd35A', '#689F38']}
              refreshing={showLoader}
              onRefresh={() => onPullToRefresh()}
              progressViewOffset={20}
            />
          }
        >
          <Loader isLoading={props.requesting} />
          <View>
            <ImageBackground
              source={
                routeDetail
                  ? userDetail?.id === routeDetail?.user?.id && userDetail?.background_picture
                    ? { uri: userDetail?.background_picture }
                    : routeDetail?.user?.background_picture
                    ? { uri: routeDetail?.user?.background_picture }
                    : profileBackGround
                  : !routeDetail && userDetail?.background_picture
                  ? { uri: userDetail?.background_picture }
                  : profileBackGround
              }
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
                source={
                  routeDetail
                    ? userDetail?.id === routeDetail?.user?.id && userDetail?.profile_picture
                      ? { uri: userDetail?.profile_picture }
                      : routeDetail?.user?.profile_picture
                      ? { uri: routeDetail?.user?.profile_picture }
                      : profileBackGround
                    : !routeDetail && userDetail?.profile_picture
                    ? { uri: userDetail?.profile_picture }
                    : profileBackGround
                }
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
              <Text style={styles.mainTextStyle} text={profileData?.likes_count?.toString()} />
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
                    <TouchableOpacity
                      onPress={() => [setShowModal(true), setVideoUri(item[0]?.video)]}
                    >
                      <Image
                        source={{
                          uri: item[0]?.video_thumbnail,
                        }}
                        style={{
                          height: (300 / 375) * width,
                          width: (175 / 375) * width,
                          borderRadius: 20,
                        }}
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={() => setIsVisible(true)}>
                      <Image
                        source={{ uri: item[0]?.image }}
                        style={{
                          height: (300 / 375) * width,
                          width: (175 / 375) * width,
                          borderRadius: 20,
                        }}
                      />
                    </TouchableOpacity>
                  )}
                  <View
                    style={{ marginLeft: i % 2 === 0 ? 10 : 0, marginRight: i % 2 === 0 ? 0 : 10 }}
                  >
                    {showVideo ? (
                      <TouchableOpacity
                        onPress={() => [setShowModal(true), setVideoUri(item[1]?.video)]}
                      >
                        <Image
                          source={{
                            uri: item[1]?.video_thumbnail,
                          }}
                          style={{
                            height: (145 / 375) * width,
                            width: (175 / 375) * width,
                            borderRadius: 20,
                          }}
                        />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity onPress={() => setIsVisible(true)}>
                        <Image
                          source={{ uri: item[1]?.image }}
                          style={{
                            height: (145 / 375) * width,
                            width: (175 / 375) * width,
                            borderRadius: 20,
                          }}
                        />
                      </TouchableOpacity>
                    )}
                    {showVideo ? (
                      <TouchableOpacity
                        onPress={() => [setShowModal(true), setVideoUri(item[2]?.video)]}
                      >
                        <Image
                          source={{
                            uri: item[2]?.video_thumbnail,
                          }}
                          style={{
                            height: (145 / 375) * width,
                            width: (175 / 375) * width,
                            borderRadius: 20,
                            marginTop: 10,
                          }}
                        />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity onPress={() => setIsVisible(true)}>
                        <Image
                          source={{ uri: item[2]?.image }}
                          style={{
                            height: (145 / 375) * width,
                            width: (175 / 375) * width,
                            borderRadius: 20,
                            marginTop: 10,
                          }}
                        />
                      </TouchableOpacity>
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
        <ImageView
          images={renderImages()}
          imageIndex={0}
          visible={visible}
          onRequestClose={() => setIsVisible(false)}
        />
      </SafeAreaView>
      <Modal
        isVisible={showModal}
        onBackdropPress={() => setShowModal(false)}
        style={{ flex: 1, margin: 0 }}
      >
        <View
          style={{
            backgroundColor: 'black',
            paddingHorizontal: 5,
            flex: 1,
            paddingTop: 20,
          }}
        >
          <TouchableOpacity onPress={() => setShowModal(false)} style={{ alignItems: 'flex-end' }}>
            <Image
              source={circleClose}
              style={{
                height: 40,
                width: 40,
                borderWidth: 1,
              }}
            />
          </TouchableOpacity>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            {loading && <ActivityIndicator size="large" color="white" />}
            <Video
              source={{
                uri: videoUri,
              }}
              style={{ height: 300, width: '100%' }}
              muted={false}
              repeat={true}
              // onEnd={() => setStart(false)}
              resizeMode="cover"
              rate={1}
              posterResizeMode="cover"
              playInBackground={true}
              playWhenInactive={true}
              ignoreSilentSwitch="ignore"
              disableFocus={true}
              mixWithOthers={'mix'}
              controls={true}
              onLoadStart={() => setLoading(true)}
              onLoad={() => setLoading(false)}
            />
          </View>
        </View>
      </Modal>
    </>
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
