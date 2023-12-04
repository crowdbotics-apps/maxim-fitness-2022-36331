import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  Platform,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import HeaderForDrawer from '../../components/HeaderForDrawer';
import { Images } from '../../theme';

const SwapExerciseContainer = props => {
  const {
    navigation,
    navigation: { toggleDrawer },
    selectedSwapObj,
    swapExercisesAction,
    allExerciseSwapped,
    route,
    saveSwipeDateAction,
  } = props;
  const [loading, setLoading] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // useEffect(() => {
  //   // if (route?.params?.ScreenData?.id) {
  //   //   getAllSwapExercise(route.params.ScreenData.id);
  //   // } else {
  //   // getAllSwapExercise(selectedSwapObj.id);
  //   // }
  // }, []);

  useEffect(() => {
    setLoading([]);
    setTimeout(() => {
      setLoadingData(true);
    }, 1000);
  }, []);

  const onPress = item => {
    saveSwipeDateAction(
      route?.params?.ScreenData?.weekDate,
      route?.params?.ScreenData?.dateTime,
      route?.params?.ScreenData?.activeIndex
    );
    let rest_of_program = item.id;
    if (route?.params?.ScreenData?.data?.id) {
      swapExercisesAction(
        route?.params?.ScreenData?.data?.id,
        route?.params?.ScreenData?.data?.exercise.id,
        rest_of_program
      );
    } else {
      swapExercisesAction(selectedSwapObj.id, selectedSwapObj.exercise.id, rest_of_program);
    }
  };

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity key={index} onPress={() => onPress(item)} style={styles.mainContainer}>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Image
            source={{
              uri: item?.pictures[0]?.image_url,
            }}
            style={{ width: '100%', height: 80, resizeMode: 'cover' }}
            onLoadStart={() => setLoading(loading => [...loading, index])}
            onLoad={() => setLoading(loading.filter(item => item !== index))}
          />

          {loading && loading.filter(item => item === index).includes(index) && (
            <ActivityIndicator
              size="small"
              color="#000"
              style={{ position: 'absolute', left: 20 }}
            />
          )}
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ textAlign: 'center' }}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <TouchableOpacity
        style={{
          ...Platform.select({
            ios: { top: 63, zIndex: 22, left: 15, position: 'absolute' },
            android: { top: 20, zIndex: 22, left: 15, position: 'absolute' },
          }),
        }}
        onPress={() => {
          if (route && route.params.ScreenData === 'exerciseContainer') {
            navigation.goBack();
          } else {
            navigation.navigate('ProgramScreen');
          }
        }}
      >
        <Image style={{ width: 30, height: 30 }} source={Images.leftArrow} />
      </TouchableOpacity>
      <HeaderForDrawer
        navigation={navigation}
        headerNavProp={{ paddingBottom: 50 }}
        onDrawerButtonPress={() => {
          toggleDrawer();
        }}
      />
      <View style={{ flex: 1 }}>
        <>
          {allExerciseSwapped?.length > 0 && allExerciseSwapped !== 'no exercise available' ? (
            <FlatList
              data={allExerciseSwapped || []}
              keyExtractor={index => index.toString()}
              renderItem={renderItem}
            />
          ) : allExerciseSwapped === 'no exercise available' ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: 'black', fontSize: 20 }}>
                {loadingData ? 'No exercises found!' : null}
              </Text>
            </View>
          ) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: 'black', fontSize: 20 }}>
                {loadingData ? 'No exercises found!' : null}
              </Text>
            </View>
          )}
        </>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginVertical: 7.5,
    marginHorizontal: 15,
    borderRadius: 20,
  },
});

export default SwapExerciseContainer;
