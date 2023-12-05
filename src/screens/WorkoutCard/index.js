import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Text } from '../../components';
import { Gutters, Layout } from '../../theme';
import * as Progress from 'react-native-progress';
import { ExerciseCard } from '../../components';

const WorkoutCard = ({ navigation, route }) => {
  const { regularHPadding, regularVPadding } = Gutters;
  const { row, fill, center } = Layout;
  const [counter, setCounter] = useState(false);
  const start = { x: 0, y: 0 };
  const end = { x: 1, y: 0 };

  useEffect(() => {}, [route]);

  useEffect(() => {
    let qty = 0;
    route?.params?.item?.map(item => {
      if (item.done === true) {
        qty = qty + 1;
        setCounter(qty);
      }
    });
  }, []);

  useEffect(() => {
    let qty = 0;
    route?.params?.summary?.map(item => {
      if (item.done === true) {
        qty = qty + 1;
        setCounter(qty);
      }
    });
  }, []);

  return (
    <SafeAreaView style={fill}>
      <View style={[fill, styles.mainWrapper]}>
        <View style={styles.CardHeadingStyle}>
          <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'black' }}>Workout Summary</Text>
        </View>
        <View style={styles.CardHeadingStyle}>
          <Text style={{ fontSize: 22, fontWeight: 'bold' }}>
            {route?.params?.uppercard?.params?.item?.name
              ? route?.params?.uppercard?.params?.item?.name
              : route?.params?.uppercard?.name}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 10,
          }}
        />
        <View style={{ paddingHorizontal: 15 }}>
          <View style={styles.UpperCardMainStyle}>
            <View style={styles.UpperCardStyle}>
              <View>
                <Text style={styles.UpperCard}>53:06</Text>
                <Text>Time</Text>
              </View>
              <View>
                <Text style={styles.UpperCard}>286</Text>
                <Text>Calories</Text>
              </View>
            </View>
            <View style={styles.LowerCardStyle}>
              <>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#fead00',
                    width: 100,
                    height: 40,
                    borderRadius: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: 15, color: 'white' }}>Strength</Text>
                </TouchableOpacity>
              </>
              <>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#ff644e',
                    width: 100,
                    height: 40,
                    borderRadius: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: 15, color: 'white' }}>Cardio</Text>
                </TouchableOpacity>
              </>
            </View>
            <View style={styles.LowerCardStyle}>
              <Progress.Circle size={50} borderWidth={7} color={'#66F542'} />
              <Progress.Circle size={50} borderWidth={7} color={'#66F542'} />
            </View>
            <View style={styles.LowerCardStyle}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Text style={{ color: '#00A1FF' }}>
                  {counter} {''}
                </Text>
                <Text style={{ color: 'black' }}>{''} of </Text>
                <Text style={{ color: '#00A1FF' }}>
                  {route?.params?.item?.length
                    ? route?.params?.item?.length
                    : route?.params?.summary?.length}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Text style={{ color: '#00A1FF' }}>35 {''}</Text>
                <Text style={{ color: 'black' }}>{''} of </Text>
                <Text style={{ color: '#00A1FF' }}>35</Text>
              </View>
            </View>
            <View style={styles.LowerCardStyle}>
              <Text style={{ color: 'black' }}>Exercises</Text>
              <Text style={{ color: 'black' }}>Minutes</Text>
            </View>
          </View>
        </View>
        <>
          <ScrollView showsHorizontalScrollIndicator={false}>
            <View style={fill}>
              <ExerciseCard route={route} />
              <View style={[fill, center, { marginBottom: 10, marginTop: 10 }]}>
                <LinearGradient
                  start={start}
                  end={end}
                  colors={['#5BF547', '#32FC7D']}
                  style={[row, center, regularVPadding, regularHPadding, styles.linearGradient]}
                  onPress={() => Alert.alert('working')}
                >
                  <Text
                    style={styles.startWorkoutWrapper}
                    onPress={() => navigation.navigate('Exercise')}
                  >
                    complete
                  </Text>
                </LinearGradient>
              </View>
            </View>
          </ScrollView>
        </>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  mainWrapper: {
    backgroundColor: '#fff',
  },
  linearGradient: {
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 6,
    width: 130,
  },
  startWorkoutWrapper: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
  },
  CardHeadingStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  UpperCardMainStyle: {
    borderWidth: 1,
    marginTop: 20,
    borderRadius: 30,
    borderColor: '#00A1FF',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  UpperCardStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  UpperCard: {
    color: 'black',
    fontSize: 22,
    fontWeight: 'bold',
  },
  LowerCardStyle: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
});
export default WorkoutCard;
