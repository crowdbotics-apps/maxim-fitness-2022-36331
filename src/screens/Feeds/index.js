import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Text, Header, FeedCard } from '../../components';
import { Images } from 'src/theme';
import Video from 'react-native-video';
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import ImageView from 'react-native-image-viewing';
import Modal from 'react-native-modal';

//actions
import { getFeedsRequest, postLikeRequest } from '../../ScreenRedux/feedRedux';

const Feeds = props => {
  const { feeds, requesting, navigation, profile } = props;
  const [feedsState, setFeedsState] = useState([]);
  const [page, setPage] = useState(1);
  const [visible, setIsVisible] = useState(false);
  const [images, setImages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [videoUri, setVideoUri] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  // const [uploadAvatar, setUploadAvatar] = useState('');

  useEffect(() => {
    props.getFeedsRequest(page);
  }, []);
  const flatList = useRef();
  const moveToTop = () => {
    props.getFeedsRequest(1);
    flatList?.current?.scrollToIndex({ index: 0, animated: true });
  };

  useEffect(() => {
    if (feeds?.results?.length) {
      if (feedsState.length && page > 1) {
        setFeedsState([...feedsState, ...feeds.results]);
      } else {
        setFeedsState(feeds?.results);
      }
    }
  }, [feeds]);

  const renderImages = () => {
    if (images?.length) {
      return images?.map(item => ({ uri: item.image }));
    }
  };

  const renderItem = ({ item, index }) => {
    return (
      // <TouchableOpacity>
      <FeedCard
        item={item}
        index={index}
        feeds={feeds}
        profile={profile}
        postLikeRequest={props.postLikeRequest}
        setFeedsState={setFeedsState}
        navigation={navigation}
        setIsVisible={setIsVisible}
        setImages={setImages}
        setShowModal={setShowModal}
        setVideoUri={setVideoUri}
        setImageIndex={setImageIndex}
      />
      // </TouchableOpacity>
    );
  };

  const onPullToRefresh = () => {
    setPage(1);
    props.getFeedsRequest(page);
    moveToTop();
  };

  // const onAvatarChange = () => {
  //   ImagePicker.openPicker({
  //     width: 300,
  //     height: 400,
  //     cropping: true,
  //     includeBase64: true,
  //   }).then(image => {
  //     const img = {
  //       uri: image.path,
  //       name: image.path,
  //       type: image.mime,
  //     };
  //     const data = {
  //       image: `data:${img.type};base64, ${image.data}`,
  //     };

  //     setUploadAvatar(image?.path);
  //     // props.changeAvatarImage(data);
  //   });
  // };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        imageUrl={
          profile && profile.profile_picture === null
            ? Images.profile
            : { uri: profile?.profile_picture }
        }
        onPressPlus={() => navigation.navigate('AddPost')}
        onPressSearch={() => navigation.navigate('SearchProfile')}
        onAvatarChange={() => navigation.navigate('SettingScreen')}
      />
      <Text style={styles.content} text="Latest" />

      {requesting ? (
        <View style={styles.loaderStyle}>
          <ActivityIndicator size="large" color="green" />
        </View>
      ) : feedsState.length > 0 ? (
        <FlatList
          ref={flatList}
          refreshControl={
            <RefreshControl
              colors={['#9Bd35A', '#689F38']}
              refreshing={requesting}
              onRefresh={() => onPullToRefresh()}
              progressViewOffset={20}
            />
          }
          data={feedsState}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          extraData={feedsState}
          // onEndReached={onEnd}
          windowSize={250}
          // onViewableItemsChanged={onViewRef.current}
          // viewabilityConfig={viewConfigRef.current}
          keyboardShouldPersistTaps={'handled'}
        />
      ) : null}
      {renderImages() && (
        <ImageView
          images={renderImages() && renderImages()}
          imageIndex={imageIndex}
          visible={visible}
          onRequestClose={() => setIsVisible(false)}
        />
      )}

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
              source={Images.circleClose}
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
                uri: videoUri?.video,
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    fontSize: 15,
    color: 'gray',
    paddingHorizontal: 15,
    marginTop: 10,
  },
  loaderStyle: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  comingSoon: { fontSize: 20, lineHeight: 18, color: 'black' },
});

const mapStateToProps = state => ({
  requesting: state.feedsReducer.requesting,
  feeds: state.feedsReducer.feeds,
  profile: state.login.userDetail,
});

const mapDispatchToProps = dispatch => ({
  getFeedsRequest: data => dispatch(getFeedsRequest(data)),
  postLikeRequest: data => dispatch(postLikeRequest(data)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Feeds);
