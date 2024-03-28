import React, { useState } from "react"
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
  SafeAreaView,
  Platform
} from "react-native"
import Text from "../Text"
import { Images } from "src/theme"
import { calculatePostTime, letterCapitalize } from "src/utils/functions"
import { SliderBox } from "react-native-image-slider-box"
import { DEEP_LINKING_API_URL } from "../../config/app"
import Share from "react-native-share"
import { connect } from "react-redux"
import { routeData } from "../../ScreenRedux/profileRedux"
import { postDeleteRequest } from "../../ScreenRedux/feedRedux"
import Modal from "react-native-modal"
import { postReportRequest } from "../../ScreenRedux/feedRedux"
// import { Menu, MenuItem, MenuDivider } from "react-native-material-menu"
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger
} from "react-native-popup-menu"

let deviceWidth = Dimensions.get("window").width
let deviceHeight = Dimensions.get("window").height

const FeedCard = props => {
  const {
    item,
    feeds,
    setFeedsState,
    navigation,
    routeData,
    setIsVisible,
    setImages,
    loading,
    profile,
    setShowModal,
    setVideoUri,
    setImageIndex,
    setModalVisible,
    setItemData,
    scrollToIndex,
    index
  } = props

  const [showMore, setShowMore] = useState(false)

  const addLikeAction = () => {
    let feedId = item.id
    filterData(feedId)
    const callBack = status => { }

    const data = { feedId, callBack }
    props.postLikeRequest(data)
  }

  const filterData = feedId => {
    const updatedFeeds = [...feeds]

    const index = updatedFeeds.findIndex(item => item.id === feedId)
    const objToUpdate = updatedFeeds[index]

    if (objToUpdate.liked) {
      objToUpdate.liked = !objToUpdate.liked
      objToUpdate.likes = objToUpdate.likes - 1
    } else {
      objToUpdate.liked = !objToUpdate.liked
      objToUpdate.likes = objToUpdate.likes + 1
    }
    updatedFeeds[index] = objToUpdate
    setFeedsState(updatedFeeds)
  }

  const sharePost = async item => {
    const title = "Orum Training"
    const url = `${DEEP_LINKING_API_URL + "/post/" + item?.id}/`
    const options = Platform.select({
      ios: {
        activityItemSources: [
          {
            placeholderItem: { type: "url", content: url },
            item: {
              default: { type: "url", content: url }
            },
            subject: {
              default: title
            },
            linkMetadata: { originalUrl: url, url, title }
          }
        ]
      },
      default: {
        title,
        subject: title,
        message: url
      }
    })
    await Share.open(options)
      .then(res => { })
      .catch(err => { })
  }

  const movetoNextScreen = item => {
    routeData(item)
    navigation.navigate("ProfileScreen", { item })
  }

  const action = (item, type) => {
    setItemData(item)
    if (type === "delete") {
      setTimeout(() => {
        showConfirmDialog(item.id)
      }, 500)
    } else {
      setModalVisible(true)
    }
  }

  const callback = () => {
    setItemData("")
    setModalVisible(false)
    // setTimeout(() => {
    //   setModalVisible(false)
    // }, 500)
  }

  const showConfirmDialog = id => {
    return Alert.alert(
      "Remove Post",
      "Are you sure you want to remove this post?",
      [
        {
          text: "Yes",
          onPress: () => {
            props.postDeleteRequest(id)
          }
        },
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: "No",
          onPress: () => {
            callback()
          }
        }
      ]
    )
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.mainContainer}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => {
            navigation.navigate("ViewPost", item)
            scrollToIndex(index)
          }}
        >
          <View style={styles.cardHeader}>
            <Image
              source={
                item && item?.user && item?.user?.profile_picture
                  ? { uri: item.user.profile_picture }
                  : Images.profile
              }
              style={styles.profileImg}
            />
            <TouchableOpacity
              style={styles.username}
              onPress={() => movetoNextScreen(item)}
            >
              <Text
                bold
                text={
                  item && item.user && item.user.username
                    ? item.user.username
                    : "Orum_training_oficial"
                }
                style={styles.text1}
              />
              <Text text={calculatePostTime(item)} style={styles.text2} />
            </TouchableOpacity>
            <Menu>
              <MenuTrigger>
                <Image source={Images.etc} style={styles.dotImg} />
              </MenuTrigger>
              <MenuOptions
                optionsContainerStyle={{ width: 105, borderRadius: 5 }}
              >
                {profile?.id === item?.user?.id ? (
                  <MenuOption onSelect={() => action(item, "delete")}>
                    <Text
                      style={{
                        color: "red",
                        paddingVertical: 6,
                        textAlign: "center"
                      }}
                    >
                      Remove post
                    </Text>
                  </MenuOption>
                ) : (
                  <MenuOption onSelect={() => action(item, "report")}>
                    <Text
                      style={{
                        paddingVertical: 6,
                        textAlign: "center",
                        color: "#626262"
                      }}
                    >
                      Report post
                    </Text>
                  </MenuOption>
                )}
              </MenuOptions>
            </Menu>
            {/* </TouchableOpacity> */}
          </View>
          <View style={styles.cardBody}>
            <SliderBox
              images={
                item &&
                  (item?.post_image?.length && item?.post_video?.length) > 0
                  ? [...item.post_image, ...item.post_video].map(item =>
                    item.image ? item.image : item.video_thumbnail
                  )
                  : item?.post_image?.length > 0 &&
                    item.post_video?.length === 0
                    ? item.post_image.map(item => item.image)
                    : item?.post_video?.length > 0 &&
                      item?.post_image?.length === 0
                      ? item.post_video.map(item => item.video_thumbnail)
                      : []
              }
              style={styles.foodImageStyle}
              sliderBoxHeight={260}
              parentWidth={deviceWidth - 60}
              dotColor="#D4D4D4"
              inactiveDotColor="#D4D4D4"
              dotStyle={styles.sliderBoxStyle}
              paginationBoxVerticalPadding={20}
              onCurrentImagePressed={index => {
                const currentMedia = (item?.post_image || []).concat(
                  item?.post_video || []
                )[index]
                if (currentMedia && currentMedia?.image) {
                  setIsVisible(true)
                  setImages(item?.post_image || [])
                  setImageIndex(index)
                } else if (currentMedia && currentMedia?.video) {
                  setShowModal(true)
                  setVideoUri(currentMedia)
                }
              }}
            />
          </View>
          <View style={styles.bottomTextStyle}>
            <Text
              text={item && item.content}
              style={styles.contentStyle}
              numberOfLines={showMore ? 5 : 1}
              onPress={() => setShowMore(!showMore)}
            />
            {!showMore && item?.content?.length > 50 ? (
              <Text
                text="see more"
                style={styles.seeMoreStyle}
                onPress={() => setShowMore(!showMore)}
              />
            ) : null}
          </View>
          <View style={styles.cardHeader1}>
            <View style={styles.socialIcons}>
              <Image source={Images.messageIcon} style={styles.socialImg1} />
              <Text
                text={
                  item && item.comments && item.comments.length
                    ? item.comments.length
                    : null
                }
                style={styles.text2}
              />
            </View>
            <Pressable style={styles.socialIcons} onPress={addLikeAction}>
              <Image
                source={Images.heartIcon}
                style={[
                  styles.socialImg,
                  { tintColor: item.liked ? "red" : "black" }
                ]}
                tintColor={item.liked ? "red" : "black"}
              />
              <Text
                text={item && item.likes ? item.likes : null}
                style={styles.text2}
              />
            </Pressable>
            <Pressable
              style={styles.socialIcons}
              onPress={() => sharePost(item)}
            >
              <Image source={Images.shareIcon} style={styles.socialImg2} />
            </Pressable>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 15
  },
  card: {
    width: "100%",
    borderRadius: 10,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10
  },
  cardHeader: {
    height: 50,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginHorizontal: 15
  },
  cardHeader1: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 15
  },
  cardBody: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
    borderRadius: 15
  },
  foodImageStyle: {
    width: "100%",
    height: 260,
    alignSelf: "center",
    borderRadius: 15
  },
  text1: { fontSize: 15, marginLeft: 10, color: "#626262" },
  text2: { fontSize: 15, marginLeft: 10, color: "#626262" },
  username: { flexDirection: "row", alignItems: "center", flex: 1 },
  socialIcons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
    // flex: 1,
  },
  profileImg: { width: 30, height: 30, borderRadius: 50, resizeMode: "cover" },
  dotImg: {
    width: 40,
    height: 40,
    resizeMode: "cover"
  },
  socialImg: { width: 25, height: 25, resizeMode: "contain" },
  socialImg1: { width: 25, height: 25, resizeMode: "contain" },
  socialImg2: { width: 22, height: 22, resizeMode: "contain" },

  sliderBoxStyle: {
    width: 8,
    height: 8,
    borderRadius: 5,
    marginHorizontal: -10,
    padding: 0,
    margin: 0,
    top: 40
  },
  bottomTextStyle: { flexDirection: "row", flex: 1, paddingHorizontal: 15 },
  seeMoreStyle: {
    paddingVertical: 5,
    fontSize: 15,
    lineHeight: 16,
    color: "blue"
  },
  contentStyle: {
    flex: 1,
    paddingVertical: 5,
    fontSize: 15,
    lineHeight: 16,
    color: "#626262"
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
    fontWeight: "bold"
  },
  inputStyle: {
    height: 53,
    borderRadius: 8,
    borderColor: "#C4C4C4",
    borderWidth: 1,
    paddingHorizontal: 10
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
  }
})

const mapStateToProps = state => ({
  loading: state.feedsReducer.loading
})

const mapDispatchToProps = dispatch => ({
  routeData: data => dispatch(routeData(data)),
  postDeleteRequest: id => dispatch(postDeleteRequest(id))
})
export default connect(mapStateToProps, mapDispatchToProps)(FeedCard)
