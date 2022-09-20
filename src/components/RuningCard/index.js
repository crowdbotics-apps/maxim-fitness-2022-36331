import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Text from '../Text';
import { Gutters, Layout, Global, Images } from '../../theme';

const RuningCard = props => {
  const { item, Notification, Time } = props;
  const {
    smallVPadding,
    smallHPadding,
    regularBMargin,
    small2xHPadding,
    small2xVPadding,
    smallVMargin,
  } = Gutters;
  const { row, fill, alignItemsCenter, justifyContentCenter, justifyContentBetween } = Layout;
  const { border, borderAlto } = Global;
  const start = { x: 0, y: 0 };
  const end = { x: 1, y: 0 };

  const CountReadNotification = item => {
    const data = {
      is_read: 'true',
    };
  };

  return (
    <>
      <LinearGradient
        start={start}
        end={end}
        colors={item?.is_read ? ['#fff', '#fff'] : ['#F3F1F4', '#F3F1F4']}
        style={[
          row,
          smallHPadding,
          regularBMargin,
          alignItemsCenter,
          justifyContentBetween,
          borderAlto,
          border,
          styles.linearGradiantWrapper,
        ]}
        onPress={item => CountReadNotification(item)}
      >
        <View style={styles.imageWrapperParent}>
          <Image
            source={
              item?.send?.profile_picture_url
                ? { uri: item?.send?.profile_picture_url }
                : Images.profile
            }
            style={styles.imageWrapper}
          />
        </View>

        <View style={[fill, smallHPadding, small2xVPadding, justifyContentCenter]}>
          <View style={justifyContentCenter}>
            <Text text={item?.send?.username} color="quinary" large bold numberOfLines={1} />
          </View>
          <View style={justifyContentCenter}>
            <Text
              text={Notification}
              color="quinary"
              medium
              numberOfLines={1}
              style={{ lineHeight: 24 }}
            />
          </View>
          <View style={[fill, justifyContentCenter]}>
            <Text text={Time} color="septenary" regular />
          </View>
        </View>
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  linearGradiantWrapper: {
    height: 90,
    borderRadius: 20,
    width: '100%',
  },
  imageWrapperParent: {
    borderRadius: 100,
    width: 60,
    height: 60,
    overflow: 'hidden',
  },
  imageWrapper: {
    width: 60,
    height: 60,
    resizeMode: 'cover',
  },
});
export default RuningCard;
