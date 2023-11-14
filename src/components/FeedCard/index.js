import React, { useState } from 'react';
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
} from 'react-native';
import Text from '../Text';
import { Images } from 'src/theme';
import { calculatePostTime } from 'src/utils/functions';
import { SliderBox } from 'react-native-image-slider-box';
import Share from 'react-native-share';
import { connect } from 'react-redux';
import { routeData } from '../../ScreenRedux/profileRedux';
import { postReportRequest, postDeleteRequest } from '../../ScreenRedux/feedRedux';
import Carousel from 'react-native-snap-carousel';
import Video from 'react-native-video';
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
import Modal from 'react-native-modal';
import useForm from '../../utils/useForm';

let deviceWidth = Dimensions.get('window').width;
let deviceHeight = Dimensions.get('window').height;

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
  } = props;

  const [showMore, setShowMore] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [itemData, setItemData] = useState('');

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    hideMenu();
  };

  const [visible, setVisible] = useState(false);

  const hideMenu = () => setVisible(false);

  const showMenu = () => setVisible(true);

  const addLikeAction = () => {
    let feedId = item.id;
    filterData(feedId);
    const callBack = status => {};

    const data = { feedId, callBack };
    props.postLikeRequest(data);
  };

  const filterData = feedId => {
    const updatedFeeds = [...feeds.results];
    const index = updatedFeeds.findIndex(item => item.id === feedId);
    const objToUpdate = updatedFeeds[index];
    if (objToUpdate.liked) {
      objToUpdate.liked = !objToUpdate.liked;
      objToUpdate.likes = objToUpdate.likes - 1;
    } else {
      objToUpdate.liked = !objToUpdate.liked;
      objToUpdate.likes = objToUpdate.likes + 1;
    }
    updatedFeeds[index] = objToUpdate;
    setFeedsState(updatedFeeds);
  };

  const sharePost = async () => {
    const data = { message: 'hello' };
    await Share.open(data)
      .then(res => {})
      .catch(err => {});
  };

  const movetoNextScreen = item => {
    routeData(item);
    navigation.navigate('ProfileScreen');
  };

  const renderData = () => {
    return (
      <Video
        source={{
          uri: 'https://maxim-fitness-2022-36331.s3.amazonaws.com/media/post_video/video/mixkit-baby-on-the-belly-of-his-mother-plays-and-smiles-4042-large_am3NaY6.mp4',
        }}
        style={{ height: 200, width: 200 }}
      />
    );
  };

  const action = (item, type) => {
    setItemData(item);
    hideMenu();
    if (type === 'delete') {
      setTimeout(() => {
        showConfirmDialog(item.id);
      }, 500);
    } else {
      hideMenu();
      setTimeout(() => {
        setModalVisible(true);
      }, 500);
    }
  };

  const handleButtonPress = () => {
    let data = {
      user: profile?.id,
      reason: state.reason.value,
      comment: '',
      post: itemData?.id,
    };
    props.postReportRequest(data, callback);
  };

  const stateSchema = {
    reason: {
      value: '',
      error: '',
    },
  };

  const validationStateSchema = {
    reason: {
      required: true,
    },
  };

  const { state, handleOnChange, disable, setState } = useForm(stateSchema, validationStateSchema);

  const callback = () => {
    hideMenu();
    setState(stateSchema);
    setModalVisible(false);
    setItemData('');
  };

  const showConfirmDialog = id => {
    return Alert.alert('Remove Post', 'Are you sure you want to remove this post?', [
      {
        text: 'Yes',
        onPress: () => {
          props.postDeleteRequest(id);
        },
      },
      // The "No" button
      // Does nothing but dismiss the dialog when tapped
      {
        text: 'No',
        onPress: () => {
          callback();
        },
      },
    ]);
  };

  return (
    <>
      <View style={styles.mainContainer}>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ViewPost', item)}>
          <View style={styles.cardHeader}>
            <Image
              source={
                item && item?.user && item?.user?.profile_picture
                  ? { uri: item.user.profile_picture }
                  : Images.profile
              }
              style={styles.profileImg}
            />
            <TouchableOpacity style={styles.username} onPress={() => movetoNextScreen(item)}>
              <Text
                text={
                  item && item.user && item.user.username
                    ? item.user.username
                    : 'Orum_training_oficial'
                }
                style={styles.text1}
              />
              <Text text={calculatePostTime(item)} style={styles.text2} />
            </TouchableOpacity>
            <TouchableOpacity onPress={showMenu}>
              <Menu visible={visible} onRequestClose={hideMenu}>
                {profile?.id === item?.user?.id ? (
                  <MenuItem textStyle={{ color: 'red' }} onPress={() => action(item, 'delete')}>
                    Remove post
                  </MenuItem>
                ) : (
                  <MenuItem onPress={() => action(item, 'report')}>Report post</MenuItem>
                )}
              </Menu>

              <Image source={Images.etc} style={styles.dotImg} />
            </TouchableOpacity>
          </View>
          <View style={styles.cardBody}>
            <SliderBox
              images={
                item && (item?.post_image?.length && item?.post_video?.length) > 0
                  ? [...item.post_image, ...item.post_video].map(item =>
                      item.image ? item.image : item.video_thumbnail
                    )
                  : item?.post_image?.length > 0 && item.post_video?.length === 0
                  ? item.post_image.map(item => item.image)
                  : item?.post_video?.length > 0 && item?.post_image?.length === 0
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
                if (item?.post_image?.length) {
                  setIsVisible(true);
                  setImages(item?.post_image?.length && item?.post_image);
                  setImageIndex(index);
                }
                if (item?.post_video?.length) {
                  setShowModal(true);
                  setVideoUri(item?.post_video?.length && item?.post_video[index]);
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
                text={item && item.comments && item.comments.length ? item.comments.length : null}
                style={styles.text2}
              />
            </View>
            <Pressable style={styles.socialIcons} onPress={addLikeAction}>
              <Image
                source={Images.heartIcon}
                style={[styles.socialImg, { tintColor: item.liked ? 'red' : 'black' }]}
                tintColor={item.liked ? 'red' : 'black'}
              />
              <Text text={item && item.likes ? item.likes : null} style={styles.text2} />
            </Pressable>
            <Pressable style={styles.socialIcons} onPress={sharePost}>
              <Image source={Images.shareIcon} style={styles.socialImg2} />
            </Pressable>
          </View>
        </TouchableOpacity>
      </View>

      <Modal
        isVisible={isModalVisible}
        animationIn="zoomIn"
        animationOut={'zoomOut'}
        // onBackdropPress={() => toggleModal(false)}
      >
        <View style={styles.modalStyle}>
          <View style={styles.reportStyle}>
            <Text style={styles.reportText}>Report on post</Text>
            <TextInput
              value={state.reason.value}
              onChangeText={value => handleOnChange('reason', value)}
              style={styles.inputStyle}
              placeholder="Reason"
            />

            <Text style={{ color: 'red' }}>{state.reason.error}</Text>

            <View style={styles.btnStyles}>
              <TouchableOpacity
                style={[styles.smallBtnStyle, { backgroundColor: 'yellow' }]}
                onPress={callback}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.smallBtnStyle, { backgroundColor: 'gray' }]}
                onPress={handleButtonPress}
                disabled={loading || disable}
              >
                {loading ? (
                  <ActivityIndicator color={'white'} />
                ) : (
                  <Text style={{ color: 'white' }}>Submit</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  card: {
    width: '100%',
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,
  },
  cardHeader: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  cardHeader1: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 15,
  },
  cardBody: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
    borderRadius: 15,
  },
  foodImageStyle: {
    width: '100%',
    height: 260,
    alignSelf: 'center',
    borderRadius: 15,
  },
  text1: { fontSize: 15, marginLeft: 10 },
  text2: { fontSize: 15, marginLeft: 10 },
  username: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  profileImg: { width: 30, height: 30, borderRadius: 50, resizeMode: 'cover' },
  dotImg: { width: 30, height: 30 },
  socialImg: { width: 25, height: 25, resizeMode: 'contain' },
  socialImg1: { width: 25, height: 25, resizeMode: 'contain' },
  socialImg2: { width: 22, height: 22, resizeMode: 'contain' },

  sliderBoxStyle: {
    width: 8,
    height: 8,
    borderRadius: 5,
    marginHorizontal: -10,
    padding: 0,
    margin: 0,
    top: 40,
  },
  bottomTextStyle: { flexDirection: 'row', flex: 1, paddingHorizontal: 15 },
  seeMoreStyle: {
    paddingVertical: 5,
    fontSize: 15,
    lineHeight: 16,
    color: 'blue',
  },
  contentStyle: { flex: 1, paddingVertical: 5, fontSize: 15, lineHeight: 16 },
  modalStyle: {
    height: deviceHeight * 0.35,
    borderRadius: 20,
    backgroundColor: 'white',
  },
  reportText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 18,
    marginVertical: 20,
    fontWeight: 'bold',
  },
  inputStyle: {
    // height: 53,
    borderRadius: 8,
    borderColor: '#C4C4C4',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  btnStyles: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
  },
  smallBtnStyle: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
  },
  reportStyle: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});

const mapStateToProps = state => ({
  loading: state.feedsReducer.loading,
});

const mapDispatchToProps = dispatch => ({
  routeData: data => dispatch(routeData(data)),
  postReportRequest: (data, callback) => dispatch(postReportRequest(data, callback)),
  postDeleteRequest: id => dispatch(postDeleteRequest(id)),
});
export default connect(mapStateToProps, mapDispatchToProps)(FeedCard);
