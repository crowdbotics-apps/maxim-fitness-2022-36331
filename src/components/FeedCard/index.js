import React, {useState} from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ImageBackground,
  Dimensions,
} from 'react-native';
import Text from '../Text';
import {Images, Layout, Global, Gutters, Colors} from 'src/theme';
import {calculatePostTime} from 'src/utils/functions';

const FeedCard = () => {

  return (
    <View style={styles.mainContainer}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Image source={Images.profile} style={styles.profileImg} />
          <View style={styles.username}>
            <Text text="Orum_training_oficial" style={styles.text1} />
            <Text text="2 m" style={styles.text2} />
          </View>
          <Image source={Images.etc} style={styles.profileImg} />
        </View>
        <View style={styles.cardBody}>
          <Image source={Images.foodImage} style={styles.foodImageStyle} />
        </View>
        <View style={styles.bottomTextStyle}>
          <Text
            text="Try out this power bowl that our favorite chef"
            style={{flex: 1, paddingVertical: 5, fontSize: 15, lineHeight: 16}}
            numberOfLines={1}
          />
          <Text
            text="see more"
            style={{paddingVertical: 5, fontSize: 15, lineHeight: 16, color: 'blue'}}
          />
        </View>
        <View style={styles.cardHeader1}>
          <View style={styles.socialIcons}>
            <Image source={Images.messageIcon} style={styles.socialImg1} />
            <Text text="723" style={styles.text2} />
          </View>
          <View style={styles.socialIcons}>
            <Image source={Images.heartIcon} style={styles.socialImg} />
            <Text text="1.3k" style={styles.text2} />
          </View>
          <View style={styles.socialIcons}>
            <Image source={Images.shareIcon} style={styles.socialImg2} />
          </View>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15
  },
  card: {
    height: 400,
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
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    // marginHorizontal: 15,
  },
  cardBody: {justifyContent: 'center', alignItems: 'center', marginTop: 10, borderRadius: 15},
  text1: {fontSize: 15, marginLeft: 10},
  text2: {fontSize: 15, marginLeft: 10},
  username: {flexDirection: 'row', alignItems: 'center', flex: 1},
  socialIcons: {flexDirection: 'row', alignItems: 'center'},
  profileImg: {width: 30, height: 30},
  socialImg: {width: 25, height: 25, resizeMode: 'contain'},
  socialImg1: {width: 25, height: 25, resizeMode: 'contain'},
  socialImg2: {width: 22, height: 22, resizeMode: 'contain'},
  foodImageStyle: {width: '91%', height: 260, paddingHorizontal: 15, borderRadius: 15},
  bottomTextStyle: {flexDirection: 'row', flex: 1, paddingHorizontal: 15}
})

export default FeedCard;
