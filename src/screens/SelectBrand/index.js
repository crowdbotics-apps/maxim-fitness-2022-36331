import React, { useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform
} from "react-native";
import { connect } from "react-redux";
import SwipeListSelectBrand from "../../components/SwipeListSelectBrand";
import Icon from "react-native-vector-icons/FontAwesome5";
import { Button, InputField } from "../../components";
import { Images, Layout, Gutters, Global } from "../../theme";
import {
  getFoodsSearchRequest,
  commonBrandedRequest,
} from "../../ScreenRedux/nutritionRedux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import CheckBox from "@react-native-community/checkbox";
import LinearGradient from "react-native-linear-gradient";
import { useRoute } from "@react-navigation/native";

const SelectBrand = (props) => {
  const { row, fill, center, alignItemsCenter, justifyContentBetween } =
    Layout;

  const { navigation, foodSearchState, foodRequesting } = props;
  const route = useRoute()
  const [value, setValue] = useState(route?.params?.items[0] ? route?.params?.items[0] : "");
  const [filterData, setFilterData] = useState([]);
  const [filterCommon, setFilterCommon] = useState([]);
  const [filterBranded, setFilterBranded] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedCommonItems, setSelectedCommonItems] = useState([]);
  const [selectedBrandedItems, setSelectedBrandedItems] = useState([]);
  const [brandedData, setBrandedData] = useState([]);
  const [commonData, setCommonData] = useState([]);

  useEffect(() => {
    value && props.getFoodsSearchRequest(value);
  }, [value, route]);

  useEffect(() => {
    foodSearchState && setFilterCommon(foodSearchState.common);
    foodSearchState && setFilterBranded(foodSearchState.branded);
  }, [foodSearchState]);

  const setSearchString = (val) => {
    if (val) {
      const clonedData = [...filterData];
      const dataFinal = clonedData.filter((item) =>
        value ? item.brand_name.toLowerCase().includes(value.toLowerCase()) : true
      );
      if (!val) {
        setFilterData([...foodSearchState]);
      } else {
        setFilterData(dataFinal);
      }
    }
    setValue(val);
  };


  const handleItemSelect = (item, key) => {
    let allSelectedItems = [...selectedItems];
    if (allSelectedItems.includes(item.food_name)) {
      allSelectedItems = allSelectedItems.filter((i) => i !== item.food_name);
    } else {
      allSelectedItems.push(item.food_name);
    }
    setSelectedItems(allSelectedItems);

    if (key === 'common') {
      let newSelectedItems = [...selectedCommonItems];
      if (newSelectedItems.includes(item.food_name)) {
        newSelectedItems = newSelectedItems.filter(
          (i) => i !== item.food_name
        );
      } else {
        newSelectedItems.push(item.food_name);
      }
      setSelectedCommonItems(newSelectedItems);

      if (newSelectedItems.length) {
        const data = {
          name: newSelectedItems,
          item: key,
        };
        setCommonData(data)
      }
    } else {
      let newSelectedItems = [...selectedBrandedItems];
      if (newSelectedItems.includes(item.nix_item_id)) {
        newSelectedItems = newSelectedItems.filter(
          (i) => i !== item.nix_item_id
        );
      } else {
        newSelectedItems.push(item.nix_item_id);
      }
      setSelectedBrandedItems(newSelectedItems);

      if (newSelectedItems.length) {
        const data = {
          id: newSelectedItems,
          item: key,
        };
        setBrandedData(data)
      }

    }
  };


  const renderedData = () => {
    if (filterCommon.length) {
      return (
        <View style={{ paddingVertical: 30 }}>
          <Text style={styles.swipeHeaderText}>Common Foods</Text>
          {filterCommon.slice(0, 5).map((item, index) => (
            <TouchableOpacity
              key={index}
              style={{ flexDirection: 'row', alignItems: 'center' }}
              onPress={() => handleItemSelect(item, 'common')}
            >
              <CheckBox
                style={{ margin: Platform.OS === 'ios' ? 4 : 1 }}
                disabled={false}
                value={selectedItems?.length ? selectedItems.includes(item.food_name) : null}
              // onValueChange={() => handleItemSelect(item)}
              />
              <View style={{ flex: 1 }}>
                <SwipeListSelectBrand item={item} index={index} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      );
    } else {
      return (
        <Text
          style={{
            color: "gray",
            fontSize: 15,
            textAlign: "center",
            lineHeight: 30,
            marginTop: "40%",
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
              style={{ flexDirection: 'row', alignItems: 'center' }}
              onPress={() => handleItemSelect(item, 'branded')}
            >
              <CheckBox
                disabled={false}
                value={selectedItems?.length ? selectedItems.includes(item.food_name) : null}
                style={{ margin: Platform.OS === 'ios' ? 4 : 1 }}
              // value={selectedItems.includes(item.food_name)}
              // onValueChange={() => handleItemSelect(item)}
              />
              <View style={{ flex: 1 }}>
                <SwipeListSelectBrand item={item} index={index} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      );
    } else {
      return (
        <Text
          style={{
            color: "gray",
            fontSize: 15,
            textAlign: "center",
            lineHeight: 30,
            marginTop: "40%",
          }}
        >
          No Food Found
        </Text>
      );
    }
  };
  const submitData = async () => {
    if (selectedItems.length) {
      await props.commonBrandedRequest(commonData, brandedData)

      navigation.navigate("LogFoods", {
        item: selectedItems,
        index: 0,
        partialResults: [],
      })
      setSelectedItems([])


    }
  }
  return (
    <SafeAreaView style={styles.safeArea}>
      <View
        style={[
          Layout.row,
          Layout.alignItemsCenter,
          Layout.justifyContentBetween,
          Global.height65,
          Gutters.regularHMargin,
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[
            Layout.fill,
            Layout.justifyContentCenter,
            Layout.alignItemsStart,
          ]}
        >
          <Image style={styles.leftArrowStyle} source={Images.backImage} />
        </TouchableOpacity>
        <View
          style={{
            flex: 4,
            alignItems: "flex-start",
            borderBottomWidth: 1,
            borderBottomColor: "gray",
          }}
        >
          <InputField
            inputStyle={Layout.fullWidth}
            value={value}
            onChangeText={setSearchString}
            placeholder="Search Foods and Products"
            autoCapitalize="none"
            placeholderTextColor="#525252"
          />
        </View>
        <TouchableOpacity
          style={[
            Layout.fill,
            Layout.justifyContentCenter,
            Layout.alignItemsEnd,
          ]}
          onPress={() => navigation.navigate("BarCodeScreen")}
        >
          <Image style={styles.barCodeStyle} source={Images.barCode} />
        </TouchableOpacity>
      </View>
      <View style={[Layout.row, Layout.alignItemsCenter, Layout.justifyContentBetween, Gutters.regularHMargin, { marginTop: 10 }]}>



        <TouchableOpacity
          onPress={submitData}
          disabled={selectedItems.length === 0}
          style={[
            styles.buttonStyle,
            { backgroundColor: selectedItems.length === 0 ? "#838383" : "#048ECC" }
          ]}
        >

          <Text style={styles.buttonText}>Done</Text>

        </TouchableOpacity>
      </View>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={"handled"}
      >
        <View style={[Layout.fill, Gutters.small2xHMargin, Global.secondaryBg]}>
          {value === "" ? (
            <View
              style={[
                Layout.fill,
                Gutters.mediumHMargin,
                Gutters.mediumTMargin,
                Layout.alignItemsCenter,
                Layout.justifyContentStart,
              ]}
            >
              <Icon
                type="FontAwesome5"
                name="arrow-up"
                size={25}
                style={{ color: "gray" }}
              />
              <Text
                style={{
                  color: "gray",
                  fontSize: 15,
                  textAlign: "center",
                  lineHeight: 30,
                  marginTop: 15,
                }}
              >
                Use the search box above to search for foods to add to your log
              </Text>
            </View>
          ) : foodRequesting ? (
            <View style={styles.loaderStyle}>
              <ActivityIndicator size="large" color="green" />
            </View>
          ) : (
            <>
              <View>{filterCommon && renderedData()}</View>
              <View>{filterBranded && renderFilterData()}</View>
            </>
          )}
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  swipeHeaderText: {
    fontSize: 14,
    color: "rgb(224, 224, 224)",
  },
  barCodeStyle: {
    height: 40,
    width: 40,
    resizeMode: "cover",
  },
  leftArrowStyle: {
    height: 30,
    width: 30,
    resizeMode: "contain",
  },
  doneButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
  },
  doneButtonText: {
    color: "white",
    fontSize: 16,
  },
  loaderStyle: {
    flex: 1,
    justifyContent: "center",
  },
  buttonStyle: {
    flex: 1,
    borderRadius: 10,
    height: 40,
    paddingHorizontal: 10,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  }

});

const mapStateToProps = (state) => ({
  foodRequesting: state.nutritionReducer.foodRequesting,
  foodSearchState: state.nutritionReducer.foodSearchState,
});

const mapDispatchToProps = (dispatch) => ({
  getFoodsSearchRequest: (data) => dispatch(getFoodsSearchRequest(data)),
  commonBrandedRequest: (commonData, brandedData) => dispatch(commonBrandedRequest(commonData, brandedData)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectBrand);

