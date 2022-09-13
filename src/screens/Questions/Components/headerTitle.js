import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

//Libraries
import ProgressBar from 'react-native-progress/Bar';
//Components
import {Text} from '../../../components';

//Themes
import Images from '../../../theme/Images';

const HeaderTitle = props => {
  const {orumIcon, backIcon} = Images;

  const {percentage, showBackButton} = props;

  const navigation = useNavigation();

  return (
    <>
      <View
        style={[
          {
            alignItems: 'center',
            flexDirection: 'row',
            marginHorizontal: 25,
            justifyContent: !showBackButton ? 'center' : null,
          },
        ]}
      >
        {showBackButton && (
          <TouchableOpacity style={{marginRight: 75}} onPress={() => navigation.goBack()}>
            <Image source={backIcon} style={{height: 20, width: 10}} />
          </TouchableOpacity>
        )}
        <Image source={orumIcon} style={{height: 40, width: 165, marginVertical: 15}} />
      </View>

      <View style={[styles.centeredView]}>
        <ProgressBar
          progress={percentage}
          width={310}
          color={'#317fbd'}
          borderRadius={0}
          height={15}
          unfilledColor={'#d3d3d3'}
          borderColor={'#f2f2f2'}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HeaderTitle;
