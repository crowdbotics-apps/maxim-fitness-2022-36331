import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Layout, Global, Gutters, Colors, Images } from '../../../theme';
import { Text, Button, DashboardCard } from '../../../components';
import LinearGradient from 'react-native-linear-gradient';
// import { useTranslation } from 'react-i18next';
import { useIsFocused } from '@react-navigation/native';
import { useNetInfo } from '@react-native-community/netinfo';

const TabOne = props => {
  const { showModal, setShowModal, profileData, signOut, navigation, connectAlexa } = props;
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  // const { t } = useTranslation();
  const {
    row,
    fill,
    center,
    alignItemsEnd,
    alignItemsStart,
    alignItemsCenter,
    justifyContentCenter,
    justifyContentStart,
    justifyContentBetween,
  } = Layout;
  const { border } = Global;
  const {
    smallHPadding,
    regularVPadding,
    regularHMargin,
    smallLMargin,
    mediumVMargin,
    smallTPadding,
  } = Gutters;

  useEffect(() => {
    if (isFocused) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  }, [isFocused]);

  let netInfo = useNetInfo();

  const start = { x: 0, y: 1 };
  const end = { x: 0, y: 0 };

  return (
    <>
      {profileData && profileData.weight ? (
        <>
          <View style={[row, justifyContentBetween, alignItemsCenter]}>
            <DashboardCard style={fill}>
              <LinearGradient
                start={start}
                end={end}
                colors={['#3c61ff', '#55bfff']}
                style={[
                  fill,
                  regularHMargin,
                  mediumVMargin,
                  regularVPadding,
                  smallHPadding,
                  styles.gradientWrapper,
                ]}
              >
                <View style={[row, justifyContentBetween]}>
                  <Text text={'Current \nWeight'} color="secondary" bold center />
                  <Image source={Images.icon} style={styles.imageStyle} />
                </View>
                <TouchableOpacity
                  onPress={() => setShowModal(!showModal)}
                  style={[row, justifyContentCenter, alignItemsEnd, fill]}
                >
                  <Text text={profileData?.weight} color="secondary" bold center />
                  <Text text="lbs" color="secondary" center style={smallLMargin} />
                </TouchableOpacity>
              </LinearGradient>
            </DashboardCard>
            <DashboardCard style={fill}>
              <TouchableOpacity onPress={() => !loading && navigation.navigate('SurveyScreen')}>
                <LinearGradient
                  start={start}
                  end={end}
                  colors={['#fff', '#fff']}
                  style={[
                    fill,
                    border,
                    smallHPadding,
                    mediumVMargin,
                    regularHMargin,
                    regularVPadding,
                    justifyContentBetween,
                    styles.gradientWrapper,
                  ]}
                >
                  <View style={[row, justifyContentBetween]}>
                    <Text text={'Fitness \nGoal'} color="quinary" bold center />
                    <Image source={Images.goal} style={styles.imageStyle} />
                  </View>
                  {netInfo.isConnected && loading && (
                    <ActivityIndicator size="large" color="#000" />
                  )}
                  <View>
                    {profileData?.fitness_goal === 1 && (
                      <Text text={'Fat Loss'} color="nonary" bold center />
                    )}
                    {profileData?.fitness_goal === 2 && (
                      <Text text={'Strength and Hypertropy'} color="nonary" bold center />
                    )}
                    {profileData?.fitness_goal === 3 && (
                      <Text text={'Maintenance'} color="nonary" bold center />
                    )}
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </DashboardCard>
          </View>
          <View style={[row, justifyContentBetween, alignItemsCenter]}>
            <DashboardCard style={fill}>
              <LinearGradient
                start={start}
                end={end}
                colors={['#fff', '#fff']}
                style={[
                  fill,
                  border,
                  regularHMargin,
                  regularVPadding,
                  smallHPadding,
                  justifyContentBetween,
                  styles.gradientWrapper,
                ]}
              >
                <View style={[row, justifyContentBetween]}>
                  <Text text={'Training'} color="quinary" bold center />
                  <Image source={Images.programsIcon} style={styles.imageStyle} />
                </View>
                <View style={[justifyContentStart, alignItemsStart]}>
                  <Text text={profileData?.number_of_training_days} color="nonary" bold center />
                  <Text text="Days" color="septenary" center />
                </View>
              </LinearGradient>
            </DashboardCard>
            <DashboardCard style={fill} />
          </View>
        </>
      ) : (
        <ActivityIndicator size={'large'} />
      )}
      <View style={[center, mediumVMargin, row, fill]}>
        <Button
          color="secondary"
          onPress={signOut}
          text={'logout'}
          style={[
            border,
            center,
            regularHMargin,
            fill,
            { height: 50, borderColor: Colors.azureradiance },
          ]}
          textStyle={{
            lineHeight: 16,
            fontSize: 16,
          }}
        />
      </View>
      <View style={[center, row, fill, { marginBottom: 20 }]}>
        <Button
          textStyle={{
            color: 'white',
            lineHeight: 16,
            fontSize: 16,
          }}
          color="secondary"
          onPress={connectAlexa}
          text={'Connect with Alexa'}
          disabled
          style={[
            // border,
            center,
            regularHMargin,
            fill,
            { height: 50, backgroundColor: Colors.azureradiance },
          ]}
        />
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  imageStyle: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  gradientWrapper: {
    height: 160,
    borderRadius: 20,
    borderColor: Colors.azureradiance,
  },
});
export default TabOne;
