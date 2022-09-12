import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import * as Progress from 'react-native-progress';
import Timer from '../Timer';

const RestContainer = ({
  onPress,
  showBar,
  loading,
  isDisable,
}) => {
  const widthProgress = Dimensions.get('screen').width;
  const [increment, setIncrement] = useState(0);

  return (
    <View style={{ marginTop: 20, marginHorizontal: 20 }}>
      {showBar && (
        <View
          style={{
            marginVertical: 20,
            justifyContent: 'center',
            flexDirection: 'row',
            flex: 1,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: 0,
              position: 'absolute',
              left: 0,
              zIndex: 2,
              height: 20,
              marginTop: 2,
            }}
          >
            <Text
              style={{
                fontWeight: 'bold',
                color: 'black',
                fontSize: 15,
                marginLeft: 10,
                marginRight: 10,
              }}
            >
              Rest:
            </Text>
            <View>
              <Timer until={90} />
            </View>
          </View>

          <Progress.Bar
            progress={increment}
            height={25}
            width={widthProgress - 40}
            borderRadius={10}
            style={{ transform: [{ scaleX: -1 }] }}
            color={'#fff'}
            unfilledColor={'#3180BD'}
            borderColor={'#3180BD'}
          />
        </View>
      )}
      <TouchableOpacity
        onPress={onPress}
        style={[
          {
            backgroundColor: !isDisable ? '#838383' : '#db3b26',
            borderRadius: 10,
            height: 40,
            paddingHorizontal: 10,
            marginBottom: 20,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
          },
        ]}
        disabled={!isDisable}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#000" style={{ height: 35 }} />
        ) : (
          <Text style={{ fontSize: 18, color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
            Finish Workout
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default RestContainer;
