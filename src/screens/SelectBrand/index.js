import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
// import HeaderWithSearch from '@/components/HeaderWithSearch';
import SwipeListSelectBrand from '../../components/SwipeListSelectBrand';
import { Icon } from 'native-base';
import { InputField } from '../../components';
import { Images, Layout, Gutters, Global } from '../../theme'

const SelectBrand = (props) => {
  const {
    navigation,
    // searchFood,
    // getSearchFoodItems,
    // getBrandedFood,
    // getCommonFood,
  } = props
  const [value, setValue] = useState('');
  const [filterData, setFilterData] = useState([]);
  const [filterCommon, setFilterCommon] = useState([]);
  const [filterBranded, setFilterBranded] = useState([]);

  // useEffect(() => {
  //   value && getSearchFoodItems(value);
  // }, [value]);

  // useEffect(() => {
  //   searchFood && setFilterCommon(searchFood.common);
  //   searchFood && setFilterBranded(searchFood.branded);
  // }, [searchFood]);

  const setSearchString = val => {
    if (val) {
      const clonedData = [...filterData];
      const dataFinal = clonedData.filter(item =>
        value ? item.brand_name.toLowerCase().includes(value.toLowerCase()) : true
      );
      if (!val) {
        setFilterData([...searchFood]);
      } else {
        setFilterData(dataFinal);
      }
    }
    setValue(val);
  };
  const renderedData = () => {
    if (filterCommon.length) {
      return (
        <View style={{ paddingVertical: 30 }}>
          <Text style={styles.swipeHeaderText}>Common Foods</Text>
          {filterCommon.slice(0, 5).map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                // getCommonFood(item.food_name);
                navigation.navigate('LogFoodsScreen', { item, index, partialResults: [] });
                setValue('');
              }}
            >
              <SwipeListSelectBrand item={item} index={index} />
            </TouchableOpacity>
          ))}
        </View>
      );
    } else {
      return (
        <Text
          style={{
            color: 'gray',
            fontSize: 15,
            textAlign: 'center',
            lineHeight: 30,
            marginTop: '40%',
          }}
        >
          No Food Found
        </Text>
      );
    }
  };
  const renderFilterData = () => {
    if (filterBranded.length) {
      return (
        <View style={{ paddingVertical: 30 }}>
          <Text style={styles.swipeHeaderText}>Branded Foods</Text>
          {filterBranded.slice(0, 5).map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                // getBrandedFood(item.nix_item_id);
                navigation.navigate('LogFoodsScreen', { item, index, partialResults: [] });
              }}
            >
              <SwipeListSelectBrand item={item} index={index} />
            </TouchableOpacity>
          ))}
        </View>
      );
    } else {
      return (
        <Text
          style={{
            color: 'gray',
            fontSize: 15,
            textAlign: 'center',
            lineHeight: 30,
            marginTop: '40%',
          }}
        >
          No Food Found
        </Text>
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[Layout.row, Layout.alignItemsCenter, Layout.justifyContentBetween, Global.height65, Gutters.regularHMargin]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={[Layout.fill, Layout.justifyContentCenter, Layout.alignItemsStart]} >
          <Image style={styles.leftArrowStyle} source={Images.leftArrow} />
        </TouchableOpacity>
        <View style={{ flex: 4, alignItems: 'flex-start', borderBottomWidth: 1, borderBottomColor: 'gray' }}>
          <InputField
            inputStyle={Layout.fullWidth}
            value={value}
            onChangeText={setSearchString}
            placeholder="Search Foods and Products"
            autoCapitalize="none"
          />
        </View>
        <TouchableOpacity
          style={[Layout.fill, Layout.justifyContentCenter, Layout.alignItemsEnd]}
        // onPress={() => navigation.navigate('SelectBrand')}
        >
          <Image style={styles.barCodeStyle} source={Images.barCode} />
        </TouchableOpacity>
      </View>
      <View style={[Layout.fill, Gutters.small2xHMargin, Global.secondaryBg]}>
        {value === '' ? (
          <View
            style={[
              Layout.fill,
              Gutters.mediumHMargin,
              Gutters.mediumTMargin,
              Layout.alignItemsCenter,
              Layout.justifyContentStart,
            ]}
          >
            <Icon type="FontAwesome5" name="arrow-up" style={{ color: 'gray' }} />
            <Text
              style={{
                color: 'gray',
                fontSize: 15,
                textAlign: 'center',
                lineHeight: 30,
                marginTop: 15,
              }}
            >
              Use the search box above to search for foods to add to your log
            </Text>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'}>
            <View>{filterCommon && renderedData()}</View>
            <View>{filterBranded && renderFilterData()}</View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  swipeHeaderText: {
    fontSize: 14,
    color: 'rgb(224, 224, 224)',
  },
  barCodeStyle: {
    height: 40,
    width: 40,
    resizeMode: 'cover'
  },
});

export default SelectBrand;
