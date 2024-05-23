import React, { useEffect, useState, useRef } from "react"
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  ScrollView,
  SafeAreaView,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from "react-native"
import { Text, ProfileHeader, SkeletonLoader } from "src/components"
import { DEEP_LINKING_API_URL } from "../../config/app"
import { Images } from "src/theme"
import { calculatePostTime } from "src/utils/functions"
import { connect } from "react-redux"
import { SliderBox } from "react-native-image-slider-box"
// import { Menu, MenuItem, MenuDivider } from "react-native-material-menu"
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger
} from "react-native-popup-menu"

import Modal from "react-native-modal"

//action
import {
  getPost,
  replyComment,
  likeComment
} from "../../ScreenRedux/viewPostRedux"

import {
  postLikeRequest,
  postCommentReportRequest,
  postCommentDelete,
  addComment,
  getFeedsSuccess
} from "../../ScreenRedux/feedRedux"
import Share from "react-native-share"
import { useNavigation } from "@react-navigation/native"

let deviceHeight = Dimensions.get("window").height

const ViewPost = props => {
  const {
    route,
    requesting,
    postData,
    feeds,
    userDetail,
    loading,
    deleteLoading
  } = props
  const navigation = useNavigation()
  let deviceWidth = Dimensions.get("window").width
  const [commentData, setCommentData] = useState(false)
  const [postComments, setPostComments] = useState([])
  const [subCommentData, setSubCommentData] = useState(false)
  const [showCancelOption, setCancelOption] = useState(false)
  const [focusreply, setFocusReply] = useState(false)
  const [param, setParam] = useState([])
  const [feedsState, setFeedsState] = useState([])
  const [isModalVisible, setModalVisible] = useState(false)
  const [reason, setReason] = useState("")
  const [itemData, setItemData] = useState("")
  const [reportType, setReportType] = useState(false)

  const inputRef = useRef()
  useEffect(() => {
    if (route?.params) {
      props.getPost(route?.params?.id ? route?.params?.id : route?.params?.id)
    }
  }, [route?.params])

  useEffect(() => {
    if (postData) {
      setParam(postData)
    }
  }, [postData])

  useEffect(() => {
    if (postData && postData?.comments?.length > 0) {
      let data = [
        postData &&
        postData?.comments?.length &&
        postData.comments.map(item => ({
          image: item?.user?.profile_picture,
          text: item.content,
          userName: item.user.username,
          id: item.id,
          userId: item.user.id,
          liked: item.liked,
          likes: item.likes,
          created_at: item.created,
          subComment: item.sub_comment.length ? item.sub_comment : []
        }))
      ]
      setPostComments(data[0])
    } else {
      setPostComments([])
    }
  }, [postData?.comments])

  const callBackFun = (status, response) => {
    if (status) {
      setCommentData(false)
    }
    if (response) {
      commentsFilter(true, response)
    }
  }

  const addAComment = () => {
    setCommentData("")
    if (showCancelOption) {
      let replyCommentData = {
        comment: focusreply.comment,
        user: userDetail.id,
        content: commentData
      }
      // setCommentData(false);
      setCancelOption(false)
      props.replyComment(replyCommentData, subCommentData, callBackFun)
    } else {
      const apiData = {
        comment: commentData,
        id: param?.id
      }
      props.addComment(apiData, postData, callBackFun)
    }
  }
  const callback = () => {
    setReason("")
    setItemData("")
    setModalVisible(false)
    setReportType(false)
  }

  const replyCommentData = item => {
    inputRef.current.focus()
    setCancelOption(true)
    postData.comments.map(v => {
      if (item.id === v.id) {
        setSubCommentData(item)
      }
    })
    let apidata = {
      comment: item.id,
      user: item.userId,
      content: commentData,
      name: item.userName
    }
    setFocusReply(apidata)
  }

  const likeComment = item => {
    let apiData = {
      comment: item.id,
      user: item.userId
    }
    filterData(item.id)
    props.likeComment(apiData)
  }

  const filterData = feedId => {
    const updatedFeeds = [...postComments]
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
    setPostComments(updatedFeeds)
  }

  const subCommentFilter = (feedId, id) => {
    const updatedFeeds = [...postComments]
    const index = updatedFeeds.findIndex(item => item.id === feedId)
    const mainObject = updatedFeeds[index]
    const mainIndex = mainObject.subComment.findIndex(item => item.id === id)
    const objToUpdate = mainObject.subComment[mainIndex]
    if (objToUpdate.liked) {
      objToUpdate.liked = !objToUpdate.liked
      objToUpdate.likes = objToUpdate.likes - 1
    } else {
      objToUpdate.liked = !objToUpdate.liked
      objToUpdate.likes = objToUpdate.likes + 1
    }
    mainObject.subComment[mainIndex] = objToUpdate
    setPostComments(updatedFeeds)
  }

  const sharePost = async () => {
    const title = "Orum Training"
    const url = `${DEEP_LINKING_API_URL + "/post/" + param?.id}/`
    const options = Platform.select({
      ios: {
        activityItemSources: [
          {
            // For sharing url with custom title.
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
        message: `${DEEP_LINKING_API_URL + "/post/" + param?.id}/`
      }
    })
    await Share.open(options)
      .then(res => { })
      .catch(err => { })
  }

  const likeSubComment = item => {
    let apiData = {
      comment_reply: item.id,
      user: item.user
    }
    subCommentFilter(item.comment, item.id)
    props.likeComment(apiData)
  }

  const addLikeAction = () => {
    let feedId = param?.id
    likeFilter(feedId)
    const callBack = status => { }

    const data = { feedId, callBack }
    props.postLikeRequest(data)
  }

  const likeFilter = postId => {
    const updatedFeeds = [...feeds.results]
    const index = updatedFeeds.findIndex(item => item.id === postId)
    const objToUpdate = updatedFeeds[index]
    if (param.liked) {
      param.liked = !param.liked
      param.likes = param.likes - 1

      objToUpdate.liked = !objToUpdate.liked
      objToUpdate.likes = objToUpdate.likes - 1
    } else {
      param.liked = !param.liked
      param.likes = param.likes + 1

      objToUpdate.liked = !objToUpdate.liked
      objToUpdate.likes = objToUpdate.likes + 1
    }
    updatedFeeds[index] = objToUpdate || param
    feeds["results"] = updatedFeeds
    setFeedsState(updatedFeeds)
    props.getFeedsSuccess(feeds)
  }

  const commentsFilter = (status, response) => {
    let postId = param?.id
    const updatedFeeds = [...feeds?.results]
    const index = updatedFeeds.findIndex(item => item.id === postId)
    const objToUpdate = updatedFeeds[index]
    if (status) {
      objToUpdate["comments"] = [...objToUpdate.comments, response]
    } else {
      objToUpdate["comments"] = objToUpdate?.comments?.filter(
        item => item?.id !== response?.id
      )
    }

    updatedFeeds[index] = objToUpdate
    feeds["results"] = updatedFeeds

    props.getFeedsSuccess(feeds)
  }

  const action = (item, type, isReply) => {
    setItemData(item)
    if (type === "delete") {
      const data = {
        id: item?.id,
        comment_user_id: item?.userId,
        post_id: param?.id
      }
      props.postCommentDelete(isReply ? item.id : data, getComments, isReply)
      !isReply && commentsFilter(false, data)
    } else {
      setModalVisible(true)
    }
  }

  const handleButtonPress = () => {
    let data = ""
    if (reportType) {
      data = {
        user: userDetail?.id,
        reason: reason,
        comment_reply: itemData?.id
      }
    } else {
      data = {
        user: userDetail?.id,
        reason: reason,
        comment: itemData?.id
      }
    }

    props.postCommentReportRequest(data, callback, reportType)
  }

  const getComments = () => {
    props.getPost(param?.id)
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" && "padding"}
        style={{ flex: 1 }}
      >
        {requesting ? (
          <View style={{ marginHorizontal: 10 }}>
            <SkeletonLoader />
          </View>
        ) : (
          <>
            <ScrollView
              contentContainerStyle={styles.mainContainer}
            // keyboardShouldPersistTaps="handled"
            >
              <TouchableOpacity
                style={styles.leftArrow}
                onPress={() => navigation.navigate('Feed')}
              >
                <Image
                  source={Images.backArrow}
                  style={styles.backArrowStyle}
                />
              </TouchableOpacity>
              <View style={styles.profileStyle}>
                <ProfileHeader
                  source={
                    postData?.user?.profile_picture === null
                      ? Images.profile
                      : { uri: postData?.user?.profile_picture }
                  }
                  userName={postData?.user?.username}
                  time={calculatePostTime(postData)}
                  content={postData?.content}
                />
                <SliderBox
                  images={
                    param &&
                      (param?.post_image?.length && param?.post_video?.length) > 0
                      ? [...param.post_image, ...param.post_video].map(item =>
                        item?.image ? item?.image : item?.video_thumbnail
                      )
                      : param?.post_image?.length > 0 &&
                        param?.post_video?.length === 0
                        ? param?.post_image?.map(item => item?.image)
                        : param?.post_video?.length > 0 &&
                          param?.post_image?.length === 0
                          ? param?.post_video.map(item => item?.video_thumbnail)
                          : []
                  }
                  style={styles.foodImageStyle}
                  sliderBoxHeight={260}
                  parentWidth={deviceWidth}
                  dotColor="#D4D4D4"
                  inactiveDotColor="#D4D4D4"
                  dotStyle={styles.sliderBoxStyle}
                  paginationBoxVerticalPadding={20}
                />
                <View style={styles.cardSocials}>
                  <View style={styles.socialIcons}>
                    <Image
                      source={Images.messageIcon}
                      style={styles.msgIconStyle}
                    />
                    <Text text={postComments?.length} style={styles.timeText} />
                  </View>
                  <Pressable style={styles.socialIcons} onPress={addLikeAction}>
                    <Image
                      source={Images.heartIcon}
                      style={[
                        styles.likeImageStyle,
                        { tintColor: param.liked ? "red" : "black" }
                      ]}
                      tintColor={param.liked ? "red" : "black"}
                    />
                    <Text
                      text={param.likes ? param.likes : ""}
                      style={styles.timeText}
                    />
                  </Pressable>
                  <View style={styles.socialIcons}>
                    <Pressable onPress={() => sharePost()}>
                      <Image
                        source={Images.shareIcon}
                        style={styles.shareImageStyle}
                      />
                    </Pressable>
                  </View>
                </View>
              </View>
              {postComments.map((comment, i) => {
                return (
                  <View key={i} style={{ paddingHorizontal: 10 }}>
                    <View style={styles.commentStyle}>
                      <View style={styles.commentSection}>
                        <Image
                          source={
                            comment.image
                              ? { uri: comment.image }
                              : Images.profile
                          }
                          style={styles.profileImg}
                        />
                        <View style={styles.commentBody}>
                          <View style={styles.commentBodyStyle}>
                            <View style={styles.commentUsername}>
                              <View style={styles.commentHeading}>
                                <Text
                                  text={comment.userName}
                                  style={styles.nameText}
                                />
                                {/* <Text text={calculatePostTime(comment)} style={styles.timeText} /> */}
                              </View>
                              <Menu>
                                <MenuTrigger>
                                  <Image
                                    source={Images.etc}
                                    style={styles.profileImg}
                                  />
                                </MenuTrigger>
                                <MenuOptions
                                  optionsContainerStyle={{
                                    width: 150,
                                    borderRadius: 5
                                  }}
                                >
                                  {userDetail?.id === comment?.userId ? (
                                    <MenuOption
                                      onSelect={() =>
                                        action(comment, "delete", false)
                                      }
                                    >
                                      <Text
                                        style={{
                                          color: "red",
                                          paddingVertical: 6,
                                          textAlign: "center"
                                        }}
                                      >
                                        Remove comment
                                      </Text>
                                    </MenuOption>
                                  ) : (
                                    <MenuOption
                                      onSelect={() =>
                                        action(comment, "report", false)
                                      }
                                    >
                                      <Text
                                        style={{
                                          paddingVertical: 6,
                                          textAlign: "center",
                                          color: "#626262"
                                        }}
                                      >
                                        Report comment
                                      </Text>
                                    </MenuOption>
                                  )}
                                </MenuOptions>
                              </Menu>
                            </View>
                            <Text
                              text={comment.text}
                              style={styles.commentBodyText}
                            />
                          </View>
                          <View style={styles.commentSecond}>
                            <View style={styles.socialIcons}>
                              <Text
                                text={calculatePostTime(comment)}
                                style={styles.comText}
                              />
                              <TouchableOpacity
                                onPress={() => replyCommentData(comment)}
                              >
                                <Text text="Reply" style={styles.comText1} />
                              </TouchableOpacity>
                            </View>
                            <View style={styles.socialIcons}>
                              <Text
                                text={comment.likes}
                                style={styles.comText2}
                              />
                              <TouchableOpacity
                                onPress={() => likeComment(comment)}
                              >
                                <Image
                                  source={Images.heartIcon}
                                  style={[
                                    styles.comImage,
                                    {
                                      tintColor: comment.liked ? "red" : "black"
                                    }
                                  ]}
                                  tintColor={comment.liked ? "red" : "black"}
                                />
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                    {comment?.subComment?.map((subComment, index) => {
                      return (
                        <View style={styles.subCommentStyle} key={index}>
                          <View style={styles.subCom} />
                          <View style={styles.subCom1}>
                            <View style={styles.commentSection}>
                              <Image
                                source={
                                  subComment?.user_detail?.profile_picture
                                    ? {
                                      uri: subComment?.user_detail
                                        ?.profile_picture
                                    }
                                    : Images.profile
                                }
                                style={styles.profileImg}
                              />
                              <View style={styles.commentBody}>
                                <View style={styles.commentBodyStyle}>
                                  <View style={styles.commentUsername}>
                                    <View style={styles.commentHeading}>
                                      <Text
                                        text={subComment?.user_detail?.username}
                                        style={styles.nameText}
                                      />
                                    </View>

                                    <Menu onSelect={() => setReportType(true)}>
                                      <MenuTrigger>
                                        <Image
                                          source={Images.etc}
                                          style={styles.profileImg}
                                        />
                                      </MenuTrigger>
                                      <MenuOptions
                                        optionsContainerStyle={{
                                          width: 120,
                                          borderRadius: 5
                                        }}
                                      >
                                        {userDetail?.id === subComment?.user ? (
                                          <MenuOption
                                            onSelect={() =>
                                              action(subComment, "delete", true)
                                            }
                                          >
                                            <Text
                                              style={{
                                                color: "red",
                                                paddingVertical: 6,
                                                textAlign: "center"
                                              }}
                                            >
                                              Remove reply
                                            </Text>
                                          </MenuOption>
                                        ) : (
                                          <MenuOption
                                            onSelect={() => {
                                              setReportType(true)
                                              action(subComment, "report", true)
                                            }}
                                          >
                                            <Text
                                              style={{
                                                paddingVertical: 6,
                                                textAlign: "center",
                                                color: "#626262"
                                              }}
                                            >
                                              Report reply
                                            </Text>
                                          </MenuOption>
                                        )}
                                      </MenuOptions>
                                    </Menu>

                                    {/* <TouchableOpacity
                                      style={styles.dotImg}
                                      onPress={() => {
                                        setReportType(true)
                                        showMenu(subComment)
                                      }}
                                    >
                                      <Menu
                                      >
                                        {userDetail?.id === subComment?.user ? (
                                          <MenuItem
                                            textStyle={{ color: "red" }}
                                            onPress={() =>
                                              action(subComment, "delete", true)
                                            }
                                          >
                                            Remove reply
                                          </MenuItem>
                                        ) : (
                                          <MenuItem
                                            onPress={() =>
                                              action(subComment, "report", true)
                                            }
                                          >
                                            Report reply
                                          </MenuItem>
                                        )}
                                      </Menu>

                                      <Image
                                        source={Images.etc}
                                        style={styles.profileImg}
                                      />
                                    </TouchableOpacity> */}
                                    {/* <View
                                  source={Images.etc}
                                  style={styles.profileImg}
                                /> */}
                                  </View>
                                  <Text
                                    text={subComment.content}
                                    style={styles.commentBodyText}
                                  />
                                </View>
                                <View style={styles.commentSecond}>
                                  <View style={styles.socialIcons}>
                                    {true && (
                                      <Text
                                        text={calculatePostTime({
                                          created_at: subComment.created
                                        })}
                                        style={styles.comText}
                                      />
                                    )}
                                    {/* <Text text="Reply" style={styles.comText1} /> */}
                                  </View>
                                  <View style={styles.socialIcons}>
                                    {false && (
                                      <Text text="23" style={styles.comText2} />
                                    )}
                                    <TouchableOpacity
                                      onPress={() => likeSubComment(subComment)}
                                    >
                                      <Image
                                        source={Images.heartIcon}
                                        style={[
                                          styles.comImage,
                                          {
                                            tintColor: subComment.liked
                                              ? "red"
                                              : "black"
                                          }
                                        ]}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              </View>
                            </View>
                          </View>
                        </View>
                      )
                    })}
                  </View>
                )
              })}
            </ScrollView>
            {showCancelOption && (
              <TouchableOpacity
                style={{
                  backgroundColor: "white",
                  paddingHorizontal: 30,
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
                onPress={() => setCancelOption(false)}
              >
                <Text style={{ fontWeight: "700", color: "#626262" }}>
                  reply to {focusreply && focusreply.name}
                </Text>
                <Text style={{ fontWeight: "700", color: "#626262" }}>
                  Cancel
                </Text>
              </TouchableOpacity>
            )}
            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: 10,
                paddingVertical: Platform.OS === "ios" ? 10 : 0,
                alignItems: "center"
              }}
            >
              <TextInput
                placeholder="Write a comment"
                placeholderTextColor="#525252"
                value={commentData}
                onChangeText={value => setCommentData(value)}
                style={{ paddingHorizontal: 10, flex: 1, color: "black" }}
                ref={inputRef}
              />
              <TouchableOpacity
                style={{ justifyContent: "center" }}
                onPress={() => {
                  commentData && addAComment()
                }}
              >
                <Image
                  source={Images.sendIcon}
                  style={{
                    height: 20,
                    width: 20,
                    marginRight: 10
                  }}
                />
              </TouchableOpacity>
            </View>
          </>
        )}
      </KeyboardAvoidingView>
      <Modal
        isVisible={isModalVisible}
        animationIn="zoomIn"
        animationOut={"zoomOut"}
        onBackdropPress={callback}
      >
        <View style={styles.modalStyle}>
          <View style={styles.reportStyle}>
            <Text style={styles.reportText}>
              Report on {reportType ? "reply" : "comment"}
            </Text>
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
                onPress={() => handleButtonPress("")}
                disabled={loading || reason === ""}
              >
                {loading ? (
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
  mainContainer: {
    flexGrow: 1,
    backgroundColor: "white",
    paddingVertical: 15
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 15
  },
  profileStyle: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: "white"
  },
  cardSocials: {
    marginTop: 40,
    height: 50,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center"
  },
  feedImageContainer: {
    height: 260,
    justifyContent: "center",
    alignItems: "center"
  },
  nameText: {
    fontSize: 14,
    marginLeft: 10,
    lineHeight: 14,
    fontWeight: "bold",
    color: "#626262"
  },
  timeText: {
    fontSize: 10,
    marginLeft: 10,
    lineHeight: 12,
    fontWeight: "bold",
    color: "#626262"
  },
  pageText: {
    fontSize: 12,
    marginLeft: 10,
    lineHeight: 12,
    fontWeight: "bold",
    marginTop: 8
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center"
  },
  socialIcons: {
    flexDirection: "row",
    alignItems: "center"
  },
  profileImg: {
    width: 40,
    height: 40,
    resizeMode: "cover",
    borderRadius: 50
  },
  likeImageStyle: {
    width: 25,
    height: 25,
    resizeMode: "contain"
  },
  msgIconStyle: {
    width: 25,
    height: 25,
    resizeMode: "contain"
  },
  shareImageStyle: {
    width: 22,
    height: 22,
    resizeMode: "contain"
  },
  bottomTextStyle: { flexDirection: "row", flex: 1, paddingHorizontal: 15 },
  leftArrow: { width: "100%", paddingHorizontal: 15 },
  backArrowStyle: { width: 30, height: 40, resizeMode: "contain" },
  iconWrapper: { fontSize: 10 },

  commentStyle: { flex: 1, marginTop: 20 },
  subCommentStyle: { flex: 1, flexDirection: "row" },
  subCom: { flex: 0.5 },
  subCom1: { flex: 4, marginTop: 10 },
  commentBodyText: {
    flex: 1,
    paddingBottom: 15,
    paddingHorizontal: 10,
    fontSize: 13,
    lineHeight: 15,
    flexWrap: "wrap",
    color: "#626262"
  },
  commentSection: {
    flex: 1,
    flexDirection: "row"
  },
  commentBody: {
    flex: 1,
    justifyContent: "space-between",
    marginLeft: 5
  },
  commentBodyStyle: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    paddingHorizontal: 8,
    marginRight: 15
  },
  commentUsername: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  commentHeading: { flexDirection: "row" },
  commentSecond: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginRight: 15
  },

  comText: {
    fontSize: 10,
    marginLeft: 15,
    lineHeight: 12,
    fontWeight: "bold",
    color: "#626262"
  },
  comText1: {
    fontSize: 10,
    marginHorizontal: 10,
    lineHeight: 12,
    fontWeight: "bold",
    color: "#626262"
  },
  comText2: {
    fontSize: 10,
    marginRight: 10,
    lineHeight: 12,
    fontWeight: "bold",
    color: "#626262"
  },
  comImage: {
    width: 22,
    height: 22,
    resizeMode: "contain"
  },
  foodImageStyle: {
    width: "100%",
    height: 260,
    alignSelf: "center",
    marginTop: 10
  },

  sliderBoxStyle: {
    width: 8,
    height: 8,
    borderRadius: 5,
    marginHorizontal: -10,
    padding: 0,
    margin: 0,
    top: 40
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
    color: "#626262"
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
  }
})

const mapStateToProps = state => ({
  requesting: state.postReducer.requesting,
  postData: state.postReducer.postData,
  userDetail: state.login.userDetail,
  feeds: state.feedsReducer.feeds,
  loading: state.feedsReducer.loading,
  deleteLoading: state.feedsReducer.requesting
})

const mapDispatchToProps = dispatch => ({
  getPost: data => dispatch(getPost(data)),
  addComment: (data, postData, callBack) =>
    dispatch(addComment(data, postData, callBack)),
  replyComment: (data, subCommentData, callBack) =>
    dispatch(replyComment(data, subCommentData, callBack)),
  likeComment: data => dispatch(likeComment(data)),
  postLikeRequest: data => dispatch(postLikeRequest(data)),
  postCommentReportRequest: (data, callback, isReply) =>
    dispatch(postCommentReportRequest(data, callback, isReply)),
  postCommentDelete: (data, callBack, isReply) =>
    dispatch(postCommentDelete(data, callBack, isReply)),
  getFeedsSuccess: data => dispatch(getFeedsSuccess(data))
})
export default connect(mapStateToProps, mapDispatchToProps)(ViewPost)
