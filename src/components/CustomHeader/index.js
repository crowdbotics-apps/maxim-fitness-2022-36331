import React from 'react';
import { View, StyleSheet, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import { Images } from 'src/theme';
import { Text, Button } from '../../components';

const { backImage } = Images;

const CustomHeader = props => {
  const { navigation, header } = props;

  return (
    <SafeAreaView>
      <View style={styles.main}>
        <TouchableOpacity
          style={{ flex: 1, justifyContent: 'center' }}
          onPress={() => navigation.goBack()}
        >
          <Image source={backImage} style={styles.imageStyle} />
        </TouchableOpacity>
        <View style={{ flex: 1.5 }}>
          <Text text={header} style={styles.headerText} bold />
        </View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  main: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    marginTop: 20,
  },
  headerText: {
    fontSize: 22,
    color: '#0D5565',
  },
  imageStyle: { height: 20, width: 30 },
});

export default CustomHeader;
