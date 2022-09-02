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
import {Icon} from 'native-base';
import {Images, Layout, Global, Gutters, Colors} from 'src/theme';
import Video from 'react-native-video';
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
          <Image source={Images.profile} style={styles.profileImg} />
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
    marginHorizontal: 20
  },
  text1: {fontSize: 15, marginRight: 10},
  username: {flexDirection: 'row', alignItems: 'center', flex: 1, marginHorizontal: 10},
  profileImg: {width: 30, height: 30}
})

export default FeedCard;
