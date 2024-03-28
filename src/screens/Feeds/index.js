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
  Platform,
  Dimensions,
  TextInput
} from "react-native"
import { Text, Header, FeedCard } from "../../components"
import { Images } from "src/theme"
import Video from "react-native-video"
import { connect } from "react-redux"
import ImageView from "react-native-image-viewing"
import Modal from "react-native-modal"
import { useFocusEffect, useIsFocused } from "@react-navigation/native"

//actions
import { getFeedsRequest, postLikeRequest } from "../../ScreenRedux/feedRedux"
import { postReportRequest } from "../../ScreenRedux/feedRedux"

let deviceHeight = Dimensions.get("window").height

const Feeds = props => {
  const { feeds, requesting, navigation, profile, loadingReport, route } = props
  const flatListRef = useRef(null)

  const [feedsState, setFeedsState] = useState([])
  const [page, setPage] = useState(1)
  const [visible, setIsVisible] = useState(false)
  const [images, setImages] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [videoUri, setVideoUri] = useState(false)
  const [imageIndex, setImageIndex] = useState(0)
  const [isModalVisible, setModalVisible] = useState(false)
  const [reason, setReason] = useState("")
  const [itemData, setItemData] = useState(false)
  const [refresh, setRefresh] = useState(false)

  // const [uploadAvatar, setUploadAvatar] = useState('');
  const onFocus = useIsFocused()
  useEffect(() => {
    props.getFeedsRequest(1)
  }, [onFocus])

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

  const handleButtonPress = () => {
    let data = {
      user: profile?.id,
      reason: reason,
      comment: "",
      post: itemData?.id
    }
    props.postReportRequest(data, callback)
  }

  const callback = () => {
    setReason("")
    setItemData(false)
    setModalVisible(false)
    // setTimeout(() => {
    //   setModalVisible(false)
    // }, 500)
  }

  const scrollToIndex = index => {
    flatListRef?.current?.scrollToIndex({ animated: true, index: index })
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
        setModalVisible={setModalVisible}
        setItemData={setItemData}
        scrollToIndex={scrollToIndex}
      />
      // </TouchableOpacity>
    )
  }

  const onPullToRefresh = () => {
    setRefresh(true)
    setPage(1)
    props.getFeedsRequest(1)
    setRefresh(false)
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
          ref={flatListRef}
          onRefresh={onPullToRefresh}
          data={feedsState}
          refreshing={refresh}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          extraData={feedsState}
          onEndReached={onEnd}
          windowSize={250}
          ListFooterComponent={
            requesting ? (
              <View style={{ height: 50 }}>
                <ActivityIndicator
                  color="black"
                  size="large"
                  style={{ flex: 1 }}
                />
              </View>
            ) : null
          }
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
        style={{ flex: 1, margin: 0, padding: 0 }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.imageModal}>
            <View style={{ flex: 1, justifyContent: "center" }}>
              {loading && (
                <View
                  style={{
                    alignSelf: "center",
                    position: "absolute"
                  }}
                >
                  <ActivityIndicator size="large" color="white" />
                </View>
              )}

              <Video
                source={{
                  uri: videoUri?.video
                }}
                muted={false}
                repeat={true}
                resizeMode="contain"
                style={styles.videoStyle}
                rate={1}
                posterResizeMode="stretch"
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
            <TouchableOpacity
              onPress={() => setShowModal(false)}
              style={{
                justifyContent: "flex-end",
                right: 20,
                alignItems: "flex-end",
                position: "absolute",
                marginTop: 20
              }}
            >
              <Image
                source={Images.closeBtn}
                style={{
                  height: 35,
                  width: 35
                }}
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
      <Modal
        isVisible={isModalVisible}
        animationIn="zoomIn"
        animationOut={"zoomOut"}
      // onBackdropPress={() => toggleModal(false)}
      >
        <View style={styles.modalStyle}>
          <View style={styles.reportStyle}>
            <Text style={styles.reportText}>Report on post</Text>
            <TextInput
              value={reason}
              onChangeText={value => setReason(value)}
              style={styles.inputStyle}
              placeholder="Reason"
              placeholderTextColor="#525252"
            />

            <View style={styles.btnStyles}>
              <TouchableOpacity
                style={[styles.smallBtnStyle, { backgroundColor: "yellow" }]}
                onPress={callback}
              >
                <Text style={{ color: "#626262" }}>Cancel</Text>
              </TouchableOpacity>

              <View style={{ paddingHorizontal: 5 }} />
              <TouchableOpacity
                style={[styles.smallBtnStyle, { backgroundColor: "gray" }]}
                onPress={handleButtonPress}
                disabled={loadingReport || reason === ""}
              >
                {loadingReport ? (
                  <ActivityIndicator color={"white"} />
                ) : (
                  <Text style={{ color: "white" }}>Submit</Text>
                )}
              </TouchableOpacity>
            </View>
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
    marginTop: Platform.OS === "android" ? 0 : 30
  },
  imageModal: {
    backgroundColor: "black",
    paddingHorizontal: 5,
    flex: 1,
    paddingTop: 20
  },
  modalStyle: {
    height: deviceHeight * 0.3,
    borderRadius: 20,
    backgroundColor: "white"
  },
  reportText: {
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 18,
    marginVertical: 20,
    fontWeight: "bold",
    color: "black"
  },
  inputStyle: {
    height: 53,
    borderRadius: 8,
    borderColor: "#C4C4C4",
    borderWidth: 1,
    paddingHorizontal: 10,
    color: "black"
  },
  btnStyles: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25
  },
  smallBtnStyle: {
    flex: 1,
    alignItems: "center",
    padding: 10,
    borderRadius: 10
  },
  reportStyle: {
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  videoStyle: {
    height: "100%",
    resizeMode: "contain",
    width: "100%"
  }
})

const mapStateToProps = state => ({
  requesting: state.feedsReducer.requesting,
  feeds: state.feedsReducer.feeds,
  profile: state.login.userDetail,
  loadingReport: state.feedsReducer.loading
})

const mapDispatchToProps = dispatch => ({
  getFeedsRequest: data => dispatch(getFeedsRequest(data)),
  postLikeRequest: data => dispatch(postLikeRequest(data)),
  postReportRequest: (data, callback) =>
    dispatch(postReportRequest(data, callback))
})
export default connect(mapStateToProps, mapDispatchToProps)(Feeds)
