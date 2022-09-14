import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Modal,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

//Libraires
import LinearGradient from 'react-native-linear-gradient';
import { Overlay } from 'react-native-elements';

//Components
import { Text } from '../../components';
import HeaderTitle from './Components/headerTitle';

//Themes
import Images from '../../theme/Images';

const ThingsToKnow = props => {
  const { forwardIcon, otLogo } = Images;

  const thingsArray = [
    {
      number: 1,
      heading: 'Consult with your Doctor',
      description:
        'Before starting any type of physical activity, consult with your physician. Your physician may have different advice on the best exercises and activity for your specific needs.',
    },
    {
      number: 2,
      heading: 'Consult with a Dietician',
      description:
        'A registered dietician is a professionalwho can inform you about eating healthy.Contact a registered dietician beforestarting any diet or meal plan to ensureyou are consuming the appropriate    amount of nutrients',
    },
    {
      number: 3,
      heading: 'Limitations of Liability',
      description:
        'Orum Training is science based and follows the highest industry standards in exercise science and nutrition. However, it is important to consult a physician and/ or registered dietician before starting our services, to identify your limitations. By clicking slide to accept, you accept responsibility to consult with health professionals and do not hold Orum Training responsible for injuries from exercise or diet.',
    },
  ];

  const {
    navigation: { navigate },
  } = props;
  return (
    <SafeAreaView style={styles.container}>
      <HeaderTitle showBackButton={true} percentage={0.9} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            marginHorizontal: 40,
            marginTop: 20,
          }}
        >
          <View />
          <Text style={{ fontSize: 16, color: '#377eb5' }}>Cancel</Text>
        </View>

        <View style={{ marginTop: 20, marginHorizontal: 40 }}>
          <Text style={{ fontSize: 24, fontWeight: '700' }}>Three Things You Should Know</Text>
        </View>

        <View>
          {thingsArray.map(item => (
            <View
              style={{
                marginHorizontal: 40,
                backgroundColor: '#d3d3d3',
                borderRadius: 18,
                paddingBottom: 20,
                marginVertical: 10,

                // height: 100  ,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  marginHorizontal: 9,
                  marginTop: 9,
                  alignItems: 'center',
                }}
              >
                <View
                  style={[
                    styles.centeredView,
                    {
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      backgroundColor: '#317fbd',
                      marginRight: 10,
                    },
                  ]}
                >
                  <Text style={{ color: '#fff', fontWeight: '500' }}>{item.number}</Text>
                </View>
                <Text style={{ fontWeight: '700' }}>{item.heading} </Text>
              </View>

              <Text style={{ marginHorizontal: 10, marginTop: 8 }}>{item.description}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logInButton: {
    height: 53,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '700',
  },
});

export default ThingsToKnow;
