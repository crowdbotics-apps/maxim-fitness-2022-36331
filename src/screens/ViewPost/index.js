import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ImageBackground,
  Dimensions,
  ScrollView,
  SafeAreaView,
  Pressable
} from 'react-native';
import moment from 'moment';
import { Text, Loader } from 'src/components';
import { Images, Layout, Global, Gutters, Colors } from 'src/theme';
import { calculatePostTime } from 'src/utils/functions';
import { Icon } from 'native-base';
import { connect } from 'react-redux';
//action
import { getPost, addComment, replyComment, likeComment } from '../../ScreenRedux/viewPostRedux';

import Share from 'react-native-share';

const ViewPost = props => {
  const {
    navigation: { goBack },
    route,
    requesting,
    postData
  } = props
  const { circleClose } = Images
  const [commentData, setCommentData] = useState(false)
  const [postComments, setPostComments] = useState([])
  const [newCommentData, setNewCommentData] = useState(false)
  const [focusreply, setFocusReply] = useState(false)

  const inputRef = useRef()

  useEffect(() => {
    if (route?.params?.id) {
      props.getPost(route?.params?.id)
    }
  }, [route?.params?.id]);

  useEffect(() => {
    if (newCommentData) {
      let data = {
        image: Images.profile,
        text: newCommentData.content,
        userName: newCommentData.user.username,
        id: newCommentData.id,
        userId: newCommentData.user.id,
        liked: newCommentData.liked,
        likes: newCommentData.likes,
        created_at: newCommentData.created,
        subComment: newCommentData.sub_comment.length ? item.sub_comment : []
      }
      setPostComments([data, ...postComments])
    } else if (postData && postData?.comments?.length) {
      let data = [
        postData &&
        postData?.comments?.length &&
        postData.comments.map(item => ({
          image: Images.profile,
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
  }, [postData?.comments, newCommentData])

  const addAComment = () => {
    // let newData = {
    //   image: Images.profile,
    //   text: commentData,
    //   userName: props.userDetail.username,
    //   subComment: []
    // }
    // let newdata = [newData, ...postComments]
    // setPostComments(newdata)

    if (focusreply) {
      let replyCommentData = {
        comment: focusreply.comment,
        user: focusreply.user,
        content: commentData
      }
      setCommentData(false)
      props.replyComment(replyCommentData)
    } else {
      const apiData = {
        comment: commentData,
        id: route?.params?.id
      }
      setCommentData(false)
      props.addComment(apiData, setNewCommentData)
    }
  }

  const replyCommentData = item => {
    inputRef.current.focus()
    let apidata = {
      comment: item.id,
      user: item.userId,
      content: commentData
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

  const sharePost = async () => {
    const data = { message: 'hello' }
    await Share.open(data)
      .then(res => { })
      .catch(err => { })
  }

  const likeSubComment = item => {
    console.log('item----', item);
    let apiData = {
      comment_reply: item.id,
      user: item.user
    }
    // filterData(item.id)
    props.likeComment(apiData)
  }

  const ProfileHeader = () => {
    return (
      <View style={styles.cardHeader}>
        <Image source={Images.profile} style={styles.profileImg} />
        <View style={{ flex: 1 }}>
          <View style={styles.profileSection}>
            <Text text={postData?.user?.username} style={styles.nameText} />
            <Text text={calculatePostTime(postData)} style={styles.timeText} />
          </View>
          <Text text={postData?.content} style={styles.pageText} />
        </View>
        <Image source={Images.etc} style={styles.profileImg} />
      </View>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Loader isLoading={requesting} />
      <ScrollView contentContainerStyle={styles.mainContainer}>
        <TouchableOpacity style={styles.leftArrow} onPress={() => goBack()}>
          <Image source={Images.backArrow} style={styles.backArrowStyle} />
        </TouchableOpacity>
        <View style={styles.profileStyle}>
          <ProfileHeader />
          <View style={styles.feedImageContainer}>
            <Image source={Images.foodImage} style={styles.foodImageStyle} />
          </View>
          <View style={styles.cardSocials}>
            <View style={styles.socialIcons}>
              <Image source={Images.messageIcon} style={styles.msgIconStyle} />
              <Text text={postComments?.length} style={styles.timeText} />
            </View>
            <View style={styles.socialIcons}>
              <Image source={Images.heartIcon} style={styles.likeImageStyle} />
              <Text text={postData?.likes?.toString()} style={styles.timeText} />
            </View>
            <View style={styles.socialIcons}>
              <Pressable onPress={() => sharePost()}>
                <Image source={Images.shareIcon} style={styles.shareImageStyle} />
              </Pressable>
            </View>
          </View>
        </View>
        {postComments.map((comment, i) => {
          return (
            <View key={i} style={{ paddingHorizontal: 10 }}>
              <View style={styles.commentStyle}>
                <View style={styles.commentSection}>
                  <Image source={Images.profile} style={styles.profileImg} />
                  <View style={styles.commentBody}>
                    <View style={styles.commentBodyStyle}>
                      <View style={styles.commentUsername}>
                        <View style={styles.commentHeading}>
                          <Text text={comment.userName} style={styles.nameText} />
                          {/* <Text text={calculatePostTime(comment)} style={styles.timeText} /> */}
                        </View>
                        <Image source={Images.etc} style={styles.profileImg} />
                      </View>
                      <Text text={comment.text} style={styles.commentBodyText} />
                    </View>
                    <View style={styles.commentSecond}>
                      <View style={styles.socialIcons}>
                        <Text text={calculatePostTime(comment)} style={styles.comText} />
                        <TouchableOpacity onPress={() => replyCommentData(comment)}>
                          <Text text="Reply" style={styles.comText1} />
                        </TouchableOpacity>
                      </View>
                      <View style={styles.socialIcons}>
                        <Text text={comment.likes} style={styles.comText2} />
                        <TouchableOpacity onPress={() => likeComment(comment)}>
                          <Image
                            source={Images.fillheart}
                            style={[styles.comImage, { tintColor: comment.liked ? 'red' : 'black' }]}
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
                        <Image source={Images.profile} style={styles.profileImg} />
                        <View style={styles.commentBody}>
                          <View style={styles.commentBodyStyle}>
                            <View style={styles.commentUsername}>
                              <View style={styles.commentHeading}>
                                <Text
                                  text={subComment?.user_detail?.username}
                                  style={styles.nameText}
                                />
                              </View>
                              <Image source={Images.etc} style={styles.profileImg} />
                            </View>
                            <Text text={subComment.content} style={styles.commentBodyText} />
                          </View>
                          <View style={styles.commentSecond}>
                            <View style={styles.socialIcons}>
                              {true && (
                                <Text
                                  text={calculatePostTime({
                                    created_at: subComment.created,
                                  })}
                                  style={styles.comText}
                                />
                              )}
                              <Text text="Reply" style={styles.comText1} />
                            </View>
                            <View style={styles.socialIcons}>
                              {false && <Text text="23" style={styles.comText2} />}
                              <TouchableOpacity onPress={() => likeSubComment(subComment)}>
                                <Image
                                  source={Images.heartIcon}
                                  style={[
                                    styles.comImage,
                                    {
                                      tintColor: subComment.liked ? 'red' : 'black'
                                    },
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
      <View style={{ flexDirection: 'row' }}>
        <TextInput
          placeholder="Write a comment"
          value={commentData}
          onChangeText={value => setCommentData(value)}
          style={{ paddingHorizontal: 20, width: '90%' }}
          ref={inputRef}
        />
        <TouchableOpacity style={{ justifyContent: 'center' }} onPress={() => addAComment()}>
          <Image source={circleClose} style={{ height: 30, width: 30 }} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    flexGrow: 1,
    backgroundColor: 'white',
    paddingVertical: 15
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  profileStyle: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: 'white'
  },
  cardSocials: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  feedImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    borderRadius: 15
  },
  nameText: {
    fontSize: 14,
    marginLeft: 10,
    lineHeight: 14,
    fontWeight: 'bold'
  },
  timeText: {
    fontSize: 10,
    marginLeft: 10,
    lineHeight: 12,
    fontWeight: 'bold'
  },
  pageText: {
    fontSize: 12,
    marginLeft: 10,
    lineHeight: 12,
    fontWeight: 'bold',
    marginTop: 8
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  socialIcons: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  profileImg: {
    width: 40,
    height: 40,
    resizeMode: 'contain'
  },
  likeImageStyle: {
    width: 25,
    height: 25,
    resizeMode: 'contain'
  },
  msgIconStyle: {
    width: 25,
    height: 25,
    resizeMode: 'contain'
  },
  shareImageStyle: {
    width: 22,
    height: 22,
    resizeMode: 'contain'
  },
  foodImageStyle: { width: '100%', height: 260 },
  bottomTextStyle: { flexDirection: 'row', flex: 1, paddingHorizontal: 15 },
  leftArrow: { width: '100%', paddingHorizontal: 15 },
  backArrowStyle: { width: 30, height: 40, resizeMode: 'contain' },
  iconWrapper: { fontSize: 10 },

  commentStyle: { flex: 1, marginTop: 20 },
  subCommentStyle: { flex: 1, flexDirection: 'row' },
  subCom: { flex: 0.5 },
  subCom1: { flex: 4, marginTop: 10 },
  commentBodyText: {
    flex: 1,
    paddingBottom: 15,
    paddingHorizontal: 10,
    fontSize: 13,
    lineHeight: 15,
    flexWrap: 'wrap'
  },
  commentSection: {
    flex: 1,
    flexDirection: 'row'
  },
  commentBody: {
    flex: 1,
    justifyContent: 'space-between',
    marginLeft: 5
  },
  commentBodyStyle: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 8,
    marginRight: 15
  },
  commentUsername: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  commentHeading: { flexDirection: 'row' },
  commentSecond: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 15
  },

  comText: {
    fontSize: 10,
    marginLeft: 15,
    lineHeight: 12,
    fontWeight: 'bold'
  },
  comText1: {
    fontSize: 10,
    marginHorizontal: 10,
    lineHeight: 12,
    fontWeight: 'bold'
  },
  comText2: {
    fontSize: 10,
    marginRight: 10,
    lineHeight: 12,
    fontWeight: 'bold'
  },
  comImage: {
    width: 22,
    height: 22,
    resizeMode: 'contain'
  },
})

const mapStateToProps = state => ({
  requesting: state.postReducer.requesting,
  postData: state.postReducer.postData,
  userDetail: state.login.userDetail
})

const mapDispatchToProps = dispatch => ({
  getPost: data => dispatch(getPost(data)),
  addComment: (data, setNewCommentData) => dispatch(addComment(data, setNewCommentData)),
  replyComment: data => dispatch(replyComment(data)),
  likeComment: data => dispatch(likeComment(data))
})
export default connect(mapStateToProps, mapDispatchToProps)(ViewPost)
