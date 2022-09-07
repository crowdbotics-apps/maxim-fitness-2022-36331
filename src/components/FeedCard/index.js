import React, {useState} from 'react';
import {View, Image, StyleSheet, Dimensions, Pressable} from 'react-native';
import Text from '../Text';
import {Images} from 'src/theme';
import {calculatePostTime} from 'src/utils/functions';
import {SliderBox} from 'react-native-image-slider-box';
import Share from 'react-native-share';

const FeedCard = props => {
  const {item, feeds, setFeedsState} = props
  const [showMore, setShowMore] = useState(false)

  const addLikeAction = () => {
    let feedId = item.id
    filterData(feedId)
    const callBack = status => {
      console.log('status: ', status)
    }

    const data = {feedId, item, callBack}
    props.postLikeRequest(data)
  }

  const filterData = feedId => {
    const updatedFeeds = [...feeds.results]
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

  const imagesData = [
    Images.foodImage,
    Images.foodImage,
    Images.foodImage,
    Images.foodImage,
    Images.foodImage
  ]

  let deviceWidth = Dimensions.get('window').width
  let deviceHeight = Dimensions.get('window').height

  const sharePost = async () => {
    const data = {message: 'hello'}
    await Share.open(data)
      .then(res => {
        console.log('SHARE RESPONSE: ', res)
      })
      .catch(err => {
        err && console.log('SHARE ERROR: ', err)
      })
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Image
            source={
              item && item.user && item.user.profile_picture_url
                ? item.user.profile_picture_url
                : Images.profile
            }
            style={styles.profileImg}
          />
          <View style={styles.username}>
            <Text
              text={
                item && item.user && item.user.username
                  ? item.user.username
                  : 'Orum_training_oficial'
              }
              style={styles.text1}
            />
            <Text text={calculatePostTime(item)} style={styles.text2} />
          </View>
          <Image source={Images.etc} style={styles.profileImg} />
        </View>
        <View style={styles.cardBody}>
          <SliderBox
            images={
              item && item?.post_image_video?.length > 0
                ? item.post_image_video.map(item => item.image)
                : []
            }
            style={styles.foodImageStyle}
            sliderBoxHeight={260}
            parentWidth={deviceWidth - 60}
            dotColor="#D4D4D4"
            inactiveDotColor="#D4D4D4"
            dotStyle={styles.sliderBoxStyle}
            paginationBoxVerticalPadding={20}
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
              text={item && item.comments && item.comments.length ? item.comments.length : null}
              style={styles.text2}
            />
          </View>
          <Pressable style={styles.socialIcons} onPress={addLikeAction}>
            <Image
              source={Images.heartIcon}
              style={[styles.socialImg, {tintColor: item.liked ? 'red' : 'black'}]}
              tintColor={item.liked ? 'red' : 'black'}
            />
            <Text text={item && item.likes ? item.likes : null} style={styles.text2} />
          </Pressable>
          <Pressable style={styles.socialIcons} onPress={sharePost}>
            <Image source={Images.shareIcon} style={styles.socialImg2} />
          </Pressable>
        </View>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15
  },
  card: {
    width: '100%',
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
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
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginHorizontal: 15
  },
  cardHeader1: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 15
  },
  cardBody: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
    borderRadius: 15
  },
  text1: {fontSize: 15, marginLeft: 10},
  text2: {fontSize: 15, marginLeft: 10},
  username: {flexDirection: 'row', alignItems: 'center', flex: 1},
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  profileImg: {width: 30, height: 30},
  socialImg: {width: 25, height: 25, resizeMode: 'contain'},
  socialImg1: {width: 25, height: 25, resizeMode: 'contain'},
  socialImg2: {width: 22, height: 22, resizeMode: 'contain'},
  foodImageStyle: {
    width: '100%',
    height: 260,
    alignSelf: 'center',
    borderRadius: 15
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
  bottomTextStyle: {flexDirection: 'row', flex: 1, paddingHorizontal: 15},
  seeMoreStyle: {
    paddingVertical: 5,
    fontSize: 15,
    lineHeight: 16,
    color: 'blue',
  },
  contentStyle: {flex: 1, paddingVertical: 5, fontSize: 15, lineHeight: 16}
})

export default FeedCard
