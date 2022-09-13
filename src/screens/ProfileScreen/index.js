import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import {Text, BottomSheet} from '../../components';
import {Images} from 'src/theme';
import {connect} from 'react-redux';

const ProfileScreen = ({navigation}) => {
  const {profileBackGround, whiteBackArrow, whiteDots, followButton, blockIcon, flagIcon} = Images;
  let imageArray = ["profileBackGround", "whiteBackArrow", "whiteDots", "followButton", "blockIcon", "flagIcon", 'kk']
  const {width, height} = Dimensions.get('window');
  const refRBSheet = useRef();
  return (
    <SafeAreaView>
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <ImageBackground source={profileBackGround} style={{height: (273 / 375) * width, width: '100%'}}>
          <View
            style={styles.backgroundStyle}
          >
            <Image source={whiteBackArrow} style={{height: 15, width: 20}} />
            <TouchableOpacity onPress={()=>refRBSheet.current.open()}>
            <Image source={whiteDots} style={{height: 15, width: 25, resizeMode: 'contain'}} />
            </TouchableOpacity>
          </View>
        </ImageBackground>
        <View
          style={styles.profileImage}
        >
          <Image
            source={profileBackGround}
            style={{
              height: 100,
              width: 100,
              borderRadius: 50,
              borderWidth: 2,
              borderColor: 'white',
            }}
          />
        </View>
      </View>
      <View style={{paddingHorizontal: 40, flexDirection: 'row'}}>
        <View>
          <Text style={[styles.mainTextStyle,{marginTop: 60}]} text="Sierra Leone" />
          <Text style={styles.subTextStyle} text="@testuser675" />
        </View>
        <TouchableOpacity onPress={()=> navigation.navigate('EditProfile')}>
        <Image source={followButton} style={{height: 60, width: 120, marginTop: 10, marginLeft: 40}} />
        </TouchableOpacity>
      </View>
      <Text style={{fontSize: 14, color: 'gray', paddingHorizontal: 30, marginTop: 20, textAlign: 'center'}} text="is simply dummy text of the printing and typesetting industry Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book" />
      <View style={{paddingHorizontal: 50, marginTop: 20, flexDirection: 'row', justifyContent: 'space-between'}}>
        <View style={{alignItems: 'center'}}>
        <Text style={styles.mainTextStyle} text="36K"/>
        <Text style={styles.subTextStyle} text="Followers"/>
        </View>
        <View style={{alignItems: 'center'}}>
        <Text style={styles.mainTextStyle} text="150K"/>
        <Text style={styles.subTextStyle} text="Likes"/>
        </View>
        <View style={{alignItems: 'center'}}>
        <Text style={styles.mainTextStyle} text="234"/>
        <Text style={styles.subTextStyle} text="Posts"/>
        </View>
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 20}}>
      <Text style={{fontSize: 20, fontWeight: 'bold', color: '#635eff'}} text="Pictures"/>
      <Text style={{fontSize: 20, fontWeight: 'bold', paddingLeft: 40, color: 'gray'}} text="Videos"/>
      </View>
      <View style={{flexDirection: 'row', marginTop: 20, marginHorizontal: 10 }}>
        <Image source={profileBackGround} style={{height: (300 / 375) * width, width: (175 / 375) * width, borderRadius: 20 }}/>
        <View style={{marginLeft: 10}}>
        <Image source={profileBackGround} style={{height: (145 / 375) * width, width: (175 / 375) * width, borderRadius: 20 }}/>
        <Image source={profileBackGround} style={{height: (145 / 375) * width, width: (175 / 375) * width, borderRadius: 20, marginTop: 10 }}/>
        </View>
      </View>
      <View style={{flexDirection: 'row', marginTop: 20, marginHorizontal: 10 }}>
      <View style={{}}>
        <Image source={profileBackGround} style={{height: (145 / 375) * width, width: (175 / 375) * width, borderRadius: 20 }}/>
        <Image source={profileBackGround} style={{height: (145 / 375) * width, width: (175 / 375) * width, borderRadius: 20, marginTop: 10 }}/>
        </View>
        <Image source={profileBackGround} style={{height: (300 / 375) * width, width: (175 / 375) * width, borderRadius: 20, marginLeft: 10 }}/>
      </View>

    </ScrollView>
    <BottomSheet reff={refRBSheet} h={200}>
        <View style={{marginTop: 30, paddingHorizontal: 40}}>
        <View style={{flexDirection: 'row'}}>
        <Image source={flagIcon} style={{height: 40, width: 30, resizeMode: 'contain'}} />
        <Text style={[styles.mainTextStyle, {marginLeft: 30}]} text={'Report User'} />
        </View>
        <View style={{flexDirection: 'row', marginTop: 20}}>
        <Image source={blockIcon} style={{height: 40, width: 30, resizeMode: 'contain'}} />
        <Text style={[styles.mainTextStyle, {marginLeft: 30}]} text={'Block User'} />
        </View>
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, backgroundColor: 'white', paddingBottom: 20
  },
  backgroundStyle: {
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 30,
    flexDirection: 'row',
  },
  profileImage: {
    position: 'absolute',
    bottom: -50,
    marginHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  mainTextStyle: {fontSize: 20, fontWeight: 'bold'},
  subTextStyle: {fontSize: 16, color: 'gray'}
});

const mapStateToProps = state => ({
  //   requesting: state.feedsReducer.requesting,
});

const mapDispatchToProps = dispatch => ({
  //   getFeedsRequest: data => dispatch(getFeedsRequest(data)),
});
export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);
