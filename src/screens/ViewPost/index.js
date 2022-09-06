import React, {useEffect, useState} from 'react';
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
  SafeAreaView
} from 'react-native';
import moment from 'moment';
import {Text, Loader} from 'src/components';
import {Images, Layout, Global, Gutters, Colors} from 'src/theme';
import {calculatePostTime} from 'src/utils/functions';
import {Icon} from 'native-base'
import {connect} from "react-redux";
//action
import {getPost, addComment} from '../../ScreenRedux/viewPostRedux'


const ViewPost = (props) => {
  const {navigation: {goBack}, route, requesting, postData} = props
  const {circleClose} = Images
  const [commentData, setCommentData] = useState(false)
  const [postComments, setPostComments] = useState([])
  const [focusreply, setFocusReply] = useState(false)


  useEffect(()=>{
    if(postData){
      formarttedData()
    }
  },[postData])

  const formarttedData=()=>{
    const now = moment(postData?.created_at);
    const expiration = moment(new Date());
    const diff = expiration.diff(now);
    const diffDuration = moment.duration(diff);
    return(
      diffDuration.months() ? `${diffDuration.months()} month` : diffDuration.days() ? `${diffDuration.days()} day` : diffDuration.hours() ? `${diffDuration.hours()} hour` : `${diffDuration.minutes()} minutes`
    )
  }


  useEffect(()=>{
    if(route?.params?.id){
     props.getPost(route?.params?.id)
    }
  },[route?.params?.id])


  useEffect(()=>{
    if(postData&&postData?.comments?.length){
      let data = [
        postData&&postData?.comments?.length && postData.comments.map((item)=>({
          image: Images.profile,
          text: item.content,
          userName: item.user.username,
          subComment: []
        }))
      ]
      setPostComments(data[0])
    }
  },[postData?.comments])

    

  const addAComment=()=>{
    let newData={
      image: Images.profile,
      text: commentData,
      userName: props.userDetail.username,
      subComment: []
      }
      let newdata = [newData, ...postComments]
      setPostComments(newdata)
    const apiData={
      comment: commentData,
      id: route?.params?.id
    }
    setCommentData(false)
    props.addComment(apiData)
  }

  const ProfileHeader = () => {
    return (
      <View style={styles.cardHeader}>
        <Image source={Images.profile} style={styles.profileImg} />
        <View style={{flex: 1}}>
          <View style={styles.profileSection}>
            <Text text={postData?.user?.username} style={styles.nameText} />
            <Text text={formarttedData()} style={styles.timeText} />
          </View>
          <Text text="#Orum_training_oficial" style={styles.pageText} />
        </View>
        <Image source={Images.etc} style={styles.profileImg} />
      </View>
    )
  }

  const likeComment=(i)=>{
      
  }
  
  return (
    <SafeAreaView style={{flex: 1}}>
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
              <Text text={postData?.comments?.length} style={styles.timeText} />
            </View>
            <View style={styles.socialIcons}>
              <Image source={Images.heartIcon} style={styles.likeImageStyle} />
              <Text text={postData?.likes?.toString()} style={styles.timeText} />
            </View>
            <View style={styles.socialIcons}>
              <Image source={Images.shareIcon} style={styles.shareImageStyle} />
            </View>
          </View>
        </View>
        {postComments.map((comment, i) => {
          return (
            <View key={i}>
              <View style={styles.commentStyle}>
                <View style={styles.commentSection}>
                  <Image source={Images.profile} style={styles.profileImg} />
                  <View style={styles.commentBody}>
                    <View style={styles.commentBodyStyle}>
                      <View style={styles.commentUsername}>
                        <View style={styles.commentHeading}>
                          <Text text={comment.userName} style={styles.nameText} />
                          <Text text="23 min" style={styles.timeText} />
                        </View>
                        <Image source={Images.etc} style={styles.profileImg} />
                      </View>
                      <Text
                        text={comment.text}
                        style={styles.commentBodyText}
                      />
                    </View>
                    <View style={styles.commentSecond}>
                      <View style={styles.socialIcons}>
                        <Text text="5 min" style={styles.comText} />
                        <TouchableOpacity onPress={()=>setFocusReply(true)}>
                        <Text text="Reply" style={styles.comText1} />
                        </TouchableOpacity>
                      </View>
                      <View style={styles.socialIcons}>
                        <Text text="23" style={styles.comText2} />
                        <TouchableOpacity onPress={()=>likeComment(i)}>
                        <Image source={Images.fillheart} style={[styles.comImage, {tintColor:'yellow'}]} />
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
                                <Text text="Orum Training" style={styles.nameText} />
                                <Text text="23 min" style={styles.timeText} />
                              </View>
                              <Image source={Images.etc} style={styles.profileImg} />
                            </View>
                            <Text
                              text="Try out this power bowl that our favorite chef  this power bowl that our favorite cheft this power bowl that our favorite chef"
                              style={styles.commentBodyText}
                            />
                          </View>
                          <View style={styles.commentSecond}>
                            <View style={styles.socialIcons}>
                              {true && <Text text="Now" style={styles.comText} />}
                              <Text text="Reply" style={styles.comText1} />
                            </View>
                            <View style={styles.socialIcons}>
                              {false && <Text text="23" style={styles.comText2} />}
                              <Image source={Images.heartIcon} style={styles.comImage} />
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
      <View style={{flexDirection: 'row'}}>
      <TextInput placeholder='Write a comment' value={commentData} onChangeText={(value)=>setCommentData(value)} style={{paddingHorizontal: 20,width: '90%'}} autoFocus={focusreply} />
      <TouchableOpacity style={{justifyContent: 'center'}} onPress={()=> addAComment()}>
      <Image source={circleClose} style={{height: 30, width: 30}}/>
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
    backgroundColor: 'white',
  },
  cardSocials: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
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
  foodImageStyle: {width: '100%', height: 260},
  bottomTextStyle: {flexDirection: 'row', flex: 1, paddingHorizontal: 15},
  leftArrow: {width: "100%", paddingHorizontal: 15},
  backArrowStyle: {width: 30, height: 40, resizeMode: 'contain'},
  iconWrapper: {fontSize: 10},

  commentStyle: {flex: 1, marginTop: 20},
  subCommentStyle: {flex: 1, flexDirection: 'row'},
  subCom: {flex: 0.5},
  subCom1: {flex: 4, marginTop: 10},
  commentBodyText: {flex: 1, paddingBottom: 15, paddingHorizontal: 10, fontSize: 13, lineHeight: 15, flexWrap: 'wrap'},
  commentSection: {
    flex: 1,
    flexDirection: 'row',
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
  commentHeading: {flexDirection: 'row'},
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
  addComment: data => dispatch(addComment(data)),

})
export default connect(mapStateToProps, mapDispatchToProps)(ViewPost)
