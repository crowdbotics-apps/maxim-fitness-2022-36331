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
  KeyboardAvoidingView
} from "react-native"
import { Text, ProfileHeader, SkeletonLoader } from "src/components"
import { API_URL } from "../../config/app"
import { Images } from "src/theme"
import { calculatePostTime } from "src/utils/functions"
import { connect } from "react-redux"
import { SliderBox } from "react-native-image-slider-box"
import { Menu, MenuItem, MenuDivider } from "react-native-material-menu"
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
  addComment
} from "../../ScreenRedux/feedRedux"
import Share from "react-native-share"

let deviceHeight = Dimensions.get("window").height

const ViewPost = props => {
  const {
    navigation: { goBack },
    route,
    requesting,
    postData,
    feeds,
    userDetail,
    loading
  } = props
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

  const [visible, setVisible] = useState(false)

  const hideMenu = () => {
    setVisible("")
  }

  const showMenu = item => {
    setVisible(item)
  }

  const inputRef = useRef()

  useEffect(() => {
    if (route?.params) {
      setParam(route.params)
    }
  }, [route])

  useEffect(() => {
    if (param?.id) {
      props.getPost(param?.id)
    }
  }, [param?.id])

  useEffect(() => {
    if (postData && postData?.comments?.length) {
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
    }
  }, [postData?.comments])

  const callBack = status => {
    if (status) {
      setCommentData(false)
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
      props.replyComment(replyCommentData, subCommentData, callBack)
    } else {
      const apiData = {
        comment: commentData,
        id: param?.id
      }
      props.addComment(apiData, postData, callBack)
    }
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
    const data = { message: `${API_URL + "/" + param?.id}/` }
    await Share.open(data)
      .then(res => {})
      .catch(err => {})
  }

  const likeSubComment = item => {
    let apiData = {
      comment_reply: item.id,
      user: item.user
    }
    subCommentFilter(item.comment, item.id)
    props.likeComment(apiData)
  }

  let deviceWidth = Dimensions.get("window").width

  const addLikeAction = () => {
    let feedId = param?.id
    likeFilter(feedId)
    const callBack = status => {}

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
    } else {
      param.liked = !param.liked
      param.likes = param.likes + 1
    }
    updatedFeeds[index] = objToUpdate || param
    setFeedsState(updatedFeeds)
  }

  const action = (item, type, isReply) => {
    setItemData(item)
    hideMenu()
    if (type === "delete") {
      const data = {
        id: item?.id,
        comment_user_id: item?.userId,
        post_id: param?.id
      }
      props.postCommentDelete(isReply ? item.id : data, getComments, isReply)
    } else {
      hideMenu()
      setTimeout(() => {
        setModalVisible(true)
      }, 500)
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

  const callback = () => {
    hideMenu()
    setReason("")
    setItemData("")
    setTimeout(() => {
      setModalVisible(false)
      setReportType(false)
    }, 500)
  }

  const getComments = () => {
    props.getPost(param?.id, true)
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {requesting ? (
        <SkeletonLoader />
      ) : (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          enabled
          keyboardVerticalOffset={100}
        >
          <ScrollView
            contentContainerStyle={styles.mainContainer}
            // keyboardShouldPersistTaps="handled"
          >
            <TouchableOpacity style={styles.leftArrow} onPress={() => goBack()}>
              <Image source={Images.backArrow} style={styles.backArrowStyle} />
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
                        item.image ? item.image : item.video
                      )
                    : param?.post_image?.length > 0
                    ? param.post_image.map(item => item.image)
                    : param?.post_video?.length > 0
                    ? param.post_video.map(item => item.video_thumbnail)
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
                            <TouchableOpacity
                              style={styles.dotImg}
                              onPress={() => showMenu(comment)}
                            >
                              <Menu
                                visible={visible?.id === comment.id}
                                onRequestClose={() => hideMenu()}
                              >
                                {userDetail?.id === comment?.userId ? (
                                  <MenuItem
                                    textStyle={{ color: "red" }}
                                    onPress={() =>
                                      action(comment, "delete", false)
                                    }
                                  >
                                    Remove comment
                                  </MenuItem>
                                ) : (
                                  <MenuItem
                                    onPress={() =>
                                      action(comment, "report", false)
                                    }
                                  >
                                    Report comment
                                  </MenuItem>
                                )}
                              </Menu>

                              <Image
                                source={Images.etc}
                                style={styles.profileImg}
                              />
                            </TouchableOpacity>
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
                                  { tintColor: comment.liked ? "red" : "black" }
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
                                  <TouchableOpacity
                                    style={styles.dotImg}
                                    onPress={() => {
                                      setReportType(true)
                                      showMenu(subComment)
                                    }}
                                  >
                                    <Menu
                                      visible={visible?.id === subComment.id}
                                      onRequestClose={() => hideMenu()}
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
                                  </TouchableOpacity>
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
              <Text style={{ fontWeight: "700" }}>
                reply to {focusreply && focusreply.name}
              </Text>
              <Text style={{ fontWeight: "700" }}>Cancel</Text>
            </TouchableOpacity>
          )}
          <View style={{ flexDirection: "row" }}>
            <TextInput
              placeholder="Write a comment"
              value={commentData}
              onChangeText={value => setCommentData(value)}
              style={{ paddingHorizontal: 20, width: "90%" }}
              ref={inputRef}
            />
            <TouchableOpacity
              style={{ justifyContent: "center" }}
              onPress={() => {
                commentData && addAComment()
              }}
            >
              <Image
                source={Images.arrowIcon}
                style={{ height: 30, width: 30 }}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}

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
            />

            <View style={styles.btnStyles}>
              <TouchableOpacity
                style={[styles.smallBtnStyle, { backgroundColor: "yellow" }]}
                onPress={callback}
              >
                <Text>Cancel</Text>
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
    fontWeight: "bold"
  },
  timeText: {
    fontSize: 10,
    marginLeft: 10,
    lineHeight: 12,
    fontWeight: "bold"
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
    flexWrap: "wrap"
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
    fontWeight: "bold"
  },
  comText1: {
    fontSize: 10,
    marginHorizontal: 10,
    lineHeight: 12,
    fontWeight: "bold"
  },
  comText2: {
    fontSize: 10,
    marginRight: 10,
    lineHeight: 12,
    fontWeight: "bold"
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
  requesting: state.postReducer.requesting,
  postData: state.postReducer.postData,
  userDetail: state.login.userDetail,
  feeds: state.feedsReducer.feeds,
  loading: state.feedsReducer.loading
})

const mapDispatchToProps = dispatch => ({
  getPost: (data, isLoader) => dispatch(getPost(data, isLoader)),
  addComment: (data, postData, callBack) =>
    dispatch(addComment(data, postData, callBack)),
  replyComment: (data, subCommentData, callBack) =>
    dispatch(replyComment(data, subCommentData, callBack)),
  likeComment: data => dispatch(likeComment(data)),
  postLikeRequest: data => dispatch(postLikeRequest(data)),
  postCommentReportRequest: (data, callback, isReply) =>
    dispatch(postCommentReportRequest(data, callback, isReply)),
  postCommentDelete: (data, callBack, isReply) =>
    dispatch(postCommentDelete(data, callBack, isReply))
})
export default connect(mapStateToProps, mapDispatchToProps)(ViewPost)
