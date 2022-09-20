import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import { Text, Header, FeedCard } from '../../components'
import { Images } from 'src/theme'
import { getFeedsRequest, postLikeRequest } from '../../ScreenRedux/feedRedux'
import { connect } from 'react-redux'
import { useNetInfo } from '@react-native-community/netinfo'
import ImagePicker from 'react-native-image-crop-picker'

const Feeds = props => {
  const { feeds, requesting, navigation, profile } = props
  console.log('profile: ', profile);
  const [feedsState, setFeedsState] = useState([])
  const [page, setPage] = useState(1);
  // const [uploadAvatar, setUploadAvatar] = useState('');

  let netInfo = useNetInfo();
  useEffect(() => {
    props.getFeedsRequest(page)
  }, [])
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

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity>
        <FeedCard
          item={item}
          index={index}
          feeds={feeds}
          profile={profile}
          postLikeRequest={props.postLikeRequest}
          setFeedsState={setFeedsState}
          navigation={navigation}
        />
      </TouchableOpacity>
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
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  content: {
    fontSize: 15,
    color: 'gray',
    paddingHorizontal: 15,
    marginTop: 10
  },
  loaderStyle: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  comingSoon: { fontSize: 20, lineHeight: 18, color: 'black' }
})

const mapStateToProps = state => ({
  requesting: state.feedsReducer.requesting,
  feeds: state.feedsReducer.feeds,
  profile: state.login.userDetail
})

const mapDispatchToProps = dispatch => ({
  getFeedsRequest: data => dispatch(getFeedsRequest(data)),
  postLikeRequest: data => dispatch(postLikeRequest(data)),
})
export default connect(mapStateToProps, mapDispatchToProps)(Feeds)
