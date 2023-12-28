import React, { useState, useEffect, useRef } from "react"
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Platform
} from "react-native"
import { Text, Header, FeedCard } from "../../components"
import { Images } from "src/theme"
import Video from "react-native-video"
import { connect } from "react-redux"
import ImagePicker from "react-native-image-crop-picker"
import ImageView from "react-native-image-viewing"
import Modal from "react-native-modal"

//actions
import { getFeedsRequest, postLikeRequest } from "../../ScreenRedux/feedRedux"

const Feeds = props => {
  const { feeds, requesting, navigation, profile } = props
  const [feedsState, setFeedsState] = useState([])
  const [page, setPage] = useState(1)
  const [visible, setIsVisible] = useState(false)
  const [images, setImages] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [videoUri, setVideoUri] = useState(false)
  const [imageIndex, setImageIndex] = useState(0)

  // const [uploadAvatar, setUploadAvatar] = useState('');

  useEffect(() => {
    props.getFeedsRequest(1)
  }, [])

  const renderImages = () => {
    if (images?.length) {
      return images?.map(item => ({ uri: item.image }))
    }
  }

  useEffect(() => {
    if (feeds?.results?.length) {
      if (feedsState?.length && page > 1) {
        setFeedsState([...feedsState, ...feeds.results])
      } else {
        setFeedsState(feeds?.results)
      }
    }
  }, [feeds])

  const onEnd = () => {
    if (feeds?.next) {
      setPage(feeds.next?.split("&page=")[1])
      props.getFeedsRequest(feeds.next?.split("&page=")[1])
    } else {
      setPage(1)
    }
  }

  const renderItem = ({ item, index }) => {
    return (
      // <TouchableOpacity>
      <FeedCard
        item={item}
        index={index}
        feeds={feedsState}
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
    )
  }

  const onPullToRefresh = () => {
    setPage(1)
    props.getFeedsRequest(1)
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        imageUrl={
          profile && profile.profile_picture === null
            ? Images.profile
            : { uri: profile?.profile_picture }
        }
        onPressPlus={() => navigation.navigate("AddPost")}
        onPressSearch={() => navigation.navigate("SearchProfile")}
        onAvatarChange={() => navigation.navigate("SettingScreen")}
      />
      <Text style={styles.content} text="Latest" />

      {requesting && !feedsState?.length ? (
        <View style={styles.loaderStyle}>
          <ActivityIndicator size="large" color="green" />
        </View>
      ) : feedsState.length > 0 ? (
        <FlatList
          // ref={flatList}
          refreshControl={
            <RefreshControl
              colors={["#9Bd35A", "#689F38"]}
              refreshing={requesting}
              onRefresh={() => onPullToRefresh()}
              // progressViewOffset={20}
            />
          }
          data={feedsState}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          extraData={feedsState}
          onEndReached={onEnd}
          windowSize={250}
          // onViewableItemsChanged={onViewRef.current}
          // viewabilityConfig={viewConfigRef.current}
          keyboardShouldPersistTaps={"handled"}
        />
      ) : null}
      {renderImages() && (
        <ImageView
          images={renderImages() && renderImages()}
          imageIndex={imageIndex}
          visible={visible}
          onRequestClose={() => setIsVisible(false)}
          HeaderComponent={() => (
            <View style={styles.closeBtn}>
              <TouchableOpacity onPress={() => setIsVisible(false)}>
                <Image
                  source={Images.closeBtn}
                  style={{ width: 35, height: 35 }}
                />
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <Modal
        isVisible={showModal}
        onBackdropPress={() => setShowModal(false)}
        style={{ flex: 1, margin: 0 }}
      >
        <View style={styles.imageModal}>
          <TouchableOpacity
            onPress={() => setShowModal(false)}
            style={{ alignItems: "flex-end" }}
          >
            <Image
              source={Images.closeBtn}
              style={{
                height: 35,
                width: 35
              }}
            />
          </TouchableOpacity>
          <View style={{ flex: 1, justifyContent: "center" }}>
            {loading && <ActivityIndicator size="large" color="white" />}
            <Video
              source={{
                uri: videoUri?.video
              }}
              style={{ height: 300, width: "100%" }}
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
              mixWithOthers={"mix"}
              controls={true}
              onLoadStart={() => setLoading(true)}
              onLoad={() => setLoading(false)}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  content: {
    fontSize: 15,
    color: "gray",
    paddingHorizontal: 15,
    marginTop: 10
  },
  loaderStyle: { flex: 1, justifyContent: "center", alignItems: "center" },
  comingSoon: { fontSize: 20, lineHeight: 18, color: "black" },
  closeBtn: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 10,
    marginTop: Platform.OS === "android" ? 0 : 10
  },
  imageModal: {
    backgroundColor: "black",
    paddingHorizontal: 5,
    flex: 1,
    paddingTop: 20
  }
})

const mapStateToProps = state => ({
  requesting: state.feedsReducer.requesting,
  feeds: state.feedsReducer.feeds,
  profile: state.login.userDetail
})

const mapDispatchToProps = dispatch => ({
  getFeedsRequest: data => dispatch(getFeedsRequest(data)),
  postLikeRequest: data => dispatch(postLikeRequest(data))
})
export default connect(mapStateToProps, mapDispatchToProps)(Feeds)
