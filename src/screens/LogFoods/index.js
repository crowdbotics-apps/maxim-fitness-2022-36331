import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { connect } from 'react-redux';
import { SwipeListView } from 'react-native-swipe-list-view';

import SwipeSelectedItem from '../../components/LogFoodsComponents/SwipeSelectedItem';
import SwipeScanItem from '../../components/LogFoodsComponents/SwipeScanItem';
import SwipeBrandedItem from '../../components/LogFoodsComponents/SwipeBrandedItem';
import SwipeCommonItem from '../../components/LogFoodsComponents/SwipeCommonItem';
import SwipeSpeechItem from '../../components/LogFoodsComponents/SwipeSpeechItem';

import SwipeDeleteButton from '../../components/LogFoodsComponents/SwipeDeleteButton';

import GradientButton from '../../components/LogFoodsComponents/GradientButton';
import TableColumn from './TableColumn';
import TouchableDeleteAll from './TouchableDeleteAll';

// import HeaderWithSearch from '../../components/HeaderWithSearch';
// import Fonts from '../../assets/fonts';
import { Images, Layout, Gutters, Global } from '../../theme';
import moment from 'moment';
import { postLogFoodRequest, resetFoodItems, deleteAllMeals } from '../../ScreenRedux/nutritionRedux';

const LogFoods = (props) => {
  const {
    removeAllSelectedProductsAction,
    updateFoodItems,
    food,
    navigation,
    scannedProduct,
    resetFoodItems,

    speechState,
    brandedState,
    commonState,
    selectedMeal,
    loaderLogFood,

    getMealsFood,
    removeSelectedProductsAction,
    productUnitAction,
  } = props
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState('');

  const [speechData, setSpeechData] = useState([]);
  const [commonData, setCommonData] = useState([]);
  const [brandedData, setBrandedData] = useState([]);
  const [scanData, setScanData] = useState([]);
  const [mealsFood, setMealsFood] = useState([]);

  const [totalCal, setTotalCal] = useState(0);
  const [totalProtein, setTotalProtein] = useState(0);
  const [totalCarbs, setTotalCarbs] = useState(0);
  const [totalFat, setTotalFat] = useState(0);

  const [totalCalFirst, setTotalCalFirst] = useState(0);
  const [totalProteinFirst, setTotalProteinFirst] = useState(0);
  const [totalCarbsFirst, setTotalCarbsFirst] = useState(0);
  const [totalFatFirst, setTotalFatFirst] = useState(0);

  const [qtySelected, setQtySelected] = useState(0);

  const [qtyScan, setQtyScan] = useState(0);
  const [qtyVoice, setQtyVoice] = useState(0);
  const [qtyCommon, setQtyCommon] = useState(0);
  const [qtyBranded, setQtyBranded] = useState(0);

  const [loader, setLoader] = useState(true);
  const [disable, setDisable] = useState(true);
  const isFocused = navigation.isFocused();

  useEffect(() => {
    if (
      isFocused &&
      (speechData.length ||
        commonData.length ||
        brandedData.length ||
        scanData.length ||
        mealsFood.length)
    ) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  }, [isFocused, speechData, commonData, brandedData, scanData, mealsFood]);

  useEffect(() => {
    isFocused && setLoader(true);
    setTimeout(() => setLoader(false), 3000);
  }, [isFocused]);

  const clearAllData = () => {
    resetFoodItems();
    setValue('');

    setSpeechData([]);
    setCommonData([]);
    setBrandedData([]);
    setScanData([]);
    setMealsFood([]);

    setTotalCal(0);
    setTotalProtein(0);
    setTotalCarbs(0);
    setTotalFat(0);

    setTotalCalFirst(0);
    setTotalProteinFirst(0);
    setTotalCarbsFirst(0);
    setTotalFatFirst(0);
  };

  useEffect(() => {
    // createNewMealSpeach();
    return () => {
      resetFoodItems();
    };
  }, []);

  useEffect(() => {
    if (getMealsFood && getMealsFood[0]?.food_items) {
      setMealsFood(getMealsFood[0].food_items);
    }
  }, [getMealsFood]);

  useEffect(() => {
    if (speechState && speechState.length) {
      setSpeechData(speechState);
    }
  }, [speechState]);

  useEffect(() => {
    if (brandedState) {
      setBrandedData([brandedState]);
    }
  }, [brandedState]);

  useEffect(() => {
    if (commonState && commonState.length) {
      setCommonData(commonState);
    }
  }, [commonState]);

  useEffect(() => {
    if (scannedProduct) {
      setScanData([scannedProduct]);
    }
  }, [scannedProduct]);

  useEffect(() => {
    if (mealsFood.length) {
      let array = [...mealsFood];
      calcCalProteinCarbsFat(array || 0);
    }
  }, [mealsFood]);

  const calcCalProteinCarbsFat = data => {
    let totalCalc = 0;
    let totalProteinCalc = 0;
    let totalCarbsCalc = 0;
    let totalFatCalc = 0;
    if (data && data.length) {
      data.forEach(item => {
        totalCalc += Math.ceil(item.food.calories * item.unit.quantity);
        totalProteinCalc += Math.ceil(item.food.proteins * item.unit.quantity);
        totalCarbsCalc += Math.ceil(item.food.carbohydrate * item.unit.quantity);
        totalFatCalc += Math.ceil(item.food.fat * item.unit.quantity);
      });
    }
    setTotalCalFirst(totalCalc);
    setTotalProteinFirst(totalProteinCalc);
    setTotalCarbsFirst(totalCarbsCalc);
    setTotalFatFirst(totalFatCalc);
  };

  useEffect(() => {
    if (
      (speechData && speechData.length) ||
      (commonData && commonData.length) ||
      (brandedData && brandedData.length) ||
      (scanData && scanData.length) ||
      (mealsFood && mealsFood.length)
    ) {
      let array = [...speechData, ...commonData, ...brandedData, ...scanData];
      calProteinCarbsFat(array || 0);
    }
  }, [speechData, commonData, brandedData, scanData]);

  const calProteinCarbsFat = data => {
    let totalCalc = 0;
    let totalProteinCalc = 0;
    let totalCarbsCalc = 0;
    let totalFatCalc = 0;
    if (data && data.length) {
      data.forEach(item => {
        totalCalc += Math.ceil(item.nf_calories * item.serving_qty);
        totalProteinCalc += Math.ceil(item.nf_protein * item.serving_qty);
        totalCarbsCalc += Math.ceil(item.nf_total_carbohydrate * item.serving_qty);
        totalFatCalc += Math.ceil(item.nf_total_fat * item.serving_qty);
      });
    }
    setTotalCal(totalCalc);
    setTotalProtein(totalProteinCalc);
    setTotalCarbs(totalCarbsCalc);
    setTotalFat(totalFatCalc);
  };

  const onDeleteSelectedProduct = item => {
    let newData = mealsFood.filter(c => c.id !== item.id);
    setMealsFood(newData);
    removeSelectedProductsAction(item.id);
    // updateFoodItems(newData);

    resetFoodItems();
    setValue('');

    setTotalCal(0);
    setTotalProtein(0);
    setTotalCarbs(0);
    setTotalFat(0);
    setTotalCalFirst(0);
    setTotalProteinFirst(0);
    setTotalCarbsFirst(0);
    setTotalFatFirst(0);
  };

  const onDeleteVoice = item => {
    let newData = speechData.filter(c => c.food_name !== item.food_name);
    setSpeechData(newData);
    updateFoodItems(newData);

    resetFoodItems();
    setValue('');

    setTotalCal(0);
    setTotalProtein(0);
    setTotalCarbs(0);
    setTotalFat(0);
    setTotalCalFirst(0);
    setTotalProteinFirst(0);
    setTotalCarbsFirst(0);
    setTotalFatFirst(0);
  };

  const onDeleteCommon = item => {
    let newData = commonData.filter(c => c.food_name !== item.food_name);
    setCommonData(newData);
    updateFoodItems(newData);

    resetFoodItems();
    setValue('');

    setTotalCal(0);
    setTotalProtein(0);
    setTotalCarbs(0);
    setTotalFat(0);
    setTotalCalFirst(0);
    setTotalProteinFirst(0);
    setTotalCarbsFirst(0);
    setTotalFatFirst(0);
  };

  const onDeleteBranded = () => {
    setBrandedData([]);

    resetFoodItems();
    setValue('');

    setTotalCal(0);
    setTotalProtein(0);
    setTotalCarbs(0);
    setTotalFat(0);
    setTotalCalFirst(0);
    setTotalProteinFirst(0);
    setTotalCarbsFirst(0);
    setTotalFatFirst(0);
  };

  const onDeleteScan = () => {
    setScanData([]);

    resetFoodItems();
    setValue('');

    setTotalCal(0);
    setTotalProtein(0);
    setTotalCarbs(0);
    setTotalFat(0);
    setTotalCalFirst(0);
    setTotalProteinFirst(0);
    setTotalCarbsFirst(0);
    setTotalFatFirst(0);
  };

  const {
    row,
    fill,
    fill3x,
    center,
    fullWidth,
    justifyContentBetween,
    justifyContentCenter,
    alignItemsCenter,
  } = Layout;
  const { border, secondaryBg } = Global;
  const {
    smallHPadding,
    regularLMargin,
    tinyVPadding,
    small2xHMargin,
    small2xVPadding,
    smallBPadding,
    mediumXBPadding,
    regularHPadding,
  } = Gutters;

  const logFoodAction = async () => {
    const dateTime = new Date();
    const formatedDate = moment(dateTime).format('YYYY-MM-DD');
    let speakVoice =
      speechData.length > 0
        ? speechData.map(item => ({
          food_name: item.food_name,
          nf_calories: item.nf_calories || 0,
          nf_total_carbohydrate: item.nf_total_carbohydrate || 0,
          nf_protein: item.nf_protein || 0,
          nf_total_fat: item.nf_total_fat || 0,
          nix_item_id: item.nix_item_id || '',
          weight: item.serving_weight_grams || 1,
          thumb: item.photo.thumb,
          serving_unit: item.serving_unit,
          serving_qty: item.serving_qty,
          created: formatedDate,
        }))
        : [];
    let common =
      commonData.length > 0
        ? commonData.map(item => ({
          food_name: item.food_name,
          nf_calories: item.nf_calories || 0,
          nf_total_carbohydrate: item.nf_total_carbohydrate || 0,
          nf_protein: item.nf_protein || 0,
          nf_total_fat: item.nf_total_fat || 0,
          nix_item_id: item.nix_item_id || '',
          weight: item.serving_weight_grams || 1,
          thumb: item.photo.thumb,
          serving_unit: item.serving_unit,
          serving_qty: item.serving_qty,
          created: formatedDate,
        }))
        : [];
    let branded =
      brandedData.length > 0
        ? brandedData.map(item => ({
          food_name: item.food_name,
          nf_calories: item.nf_calories || 0,
          nf_total_carbohydrate: item.nf_total_carbohydrate || 0,
          nf_protein: item.nf_protein || 0,
          nf_total_fat: item.nf_total_fat || 0,
          nix_item_id: item.nix_item_id || '',
          weight: item.serving_weight_grams || 1,
          thumb: item.photo.thumb,
          serving_unit: item.serving_unit,
          serving_qty: item.serving_qty,
          created: formatedDate,
        }))
        : [];
    let scan =
      scanData.length > 0
        ? scanData.map(item => ({
          food_name: item.food_name,
          nf_calories: item.nf_calories || 0,
          nf_total_carbohydrate: item.nf_total_carbohydrate || 0,
          nf_protein: item.nf_protein || 0,
          nf_total_fat: item.nf_total_fat || 0,
          nix_item_id: item.nix_item_id || '',
          weight: item.serving_weight_grams || 1,
          thumb: item.photo.thumb,
          serving_unit: item.serving_unit,
          serving_qty: item.serving_qty,
          created: formatedDate,
        }))
        : [];

    const data = [
      {
        common: common,
        branded: branded,
        voice: speakVoice,
        scan: scan,
      },
    ];
    await props.postLogFoodRequest(selectedMeal?.id, data);
    clearAllData();
  };

  const selectedCalories = f => {
    return f.food.calories * f?.unit?.quantity;
  };

  const scanCalories = f => {
    return f?.nf_calories * f?.serving_qty;
  };

  const speechCalories = v => {
    return v?.nf_calories * v?.serving_qty;
  };

  const brandedCalories = cal => {
    return cal?.nf_calories * cal?.serving_qty;
  };

  const commonCalories = cal => {
    return cal?.nf_calories * cal?.serving_qty;
  };

  const onChangeSpeech = (e, index) => {
    let arr = [...speechData];
    let objToUpdate = arr[index];
    objToUpdate.serving_qty = e;
    arr[index] = objToUpdate;
    setQtyVoice(e);
    setSpeechData(arr);
  };

  const onChangeCommon = (e, index) => {
    let arr = [...commonData];
    let objToUpdate = arr[index];
    objToUpdate.serving_qty = e;
    arr[index] = objToUpdate;
    setQtyCommon(e);
    setCommonData(arr);
  };

  const onChangeBranded = (e, index) => {
    let arr = [...brandedData];
    let objToUpdate = arr[index];
    objToUpdate.serving_qty = e;
    arr[index] = objToUpdate;
    setQtyBranded(e);
    setBrandedData(arr);
  };

  const onChangeScan = (e, index) => {
    let arr = [...scanData];
    let objToUpdate = arr[index];
    objToUpdate.serving_qty = e;
    arr[index] = objToUpdate;
    setQtyScan(e);
    setScanData(arr);
  };

  const onChangeSelected = (e, index) => {
    let arr = [...mealsFood];
    let objToUpdate = arr[index];
    let itemId = objToUpdate.food.units[0].id;
    objToUpdate.unit.quantity = e;
    arr[index] = objToUpdate;
    setQtySelected(e);
    setMealsFood(arr);
    productUnitAction(itemId, e);
  };

  const emptyList = () => (
    <View style={[fill, center]}>
      <Text text="No voice data is available!" />
    </View>
  );

  const emptyList2 = () => (
    <View style={[fill, center]}>
      <Text text="No branded data is available!" />
    </View>
  );

  const emptyList3 = () => (
    <View style={[fill, center]}>
      <Text text="No scane data is available!" />
    </View>
  );

  const checkData = () => {
    if (
      !mealsFood.length &&
      !speechData.length &&
      !scanData.length &&
      !brandedData.length &&
      !commonData.length
    ) {
      return (
        <View style={[fill, center]}>
          <Text
            style={{
              // fontFamily: Fonts.HELVETICA_NORMAL,
              fontSize: 14,
              fontWeight: 'bold',
              color: 'black',
              textAlign: 'center',
            }}
          >
            {'No logged food items found,\n please search to log new items'}
          </Text>
        </View>
      );
    }
    return <></>;
  };

  const deleteFnc = () => {
    if (
      !mealsFood.length &&
      !speechData.length &&
      !scanData.length &&
      !brandedData.length &&
      !commonData.length
    ) {
      return false;
    }
    return <></>;
  };

  return (
    <SafeAreaView style={[fill, secondaryBg]}>
      <>
        <View style={fill3x}>
          <View style={[Layout.row, Layout.alignItemsCenter, Layout.justifyContentBetween, Global.height65, Gutters.regularHMargin]}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={[Layout.fill, Layout.justifyContentCenter, Layout.alignItemsStart]} >
              <Image style={styles.leftArrowStyle} source={Images.leftArrow} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('SelectBrand')} style={{ flex: 4, alignItems: 'flex-start', paddingHorizontal: 15, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: 'gray' }}>
              <Text style={{ fontSize: 15, color: 'gray' }}>Search Foods and Products</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[Layout.fill, Layout.justifyContentCenter, Layout.alignItemsEnd]}
              onPress={() => navigation.navigate('SelectBrand')}
            >
              <Image style={styles.barCodeStyle} source={Images.barCode} />
            </TouchableOpacity>
          </View>
          <View style={[fill, small2xHMargin]}>
            <View style={[center, small2xVPadding, fullWidth]}>
              <Text style={styles.swipeHeaderText}> Swipe left to delete </Text>
            </View>

            <ScrollView
              horizontal={false}
              contentContainerStyle={{ flexGrow: 1 }}
              showsVerticalScrollIndicator={false}
            >
              {loader ? (
                <View style={[fill, center]}>
                  <ActivityIndicator color="black" />
                </View>
              ) : (
                <View style={[fill, smallBPadding]}>
                  {checkData()}
                  {mealsFood && mealsFood.length > 0 && (
                    <View style={mediumXBPadding}>
                      <Text style={styles.swipeHeaderText}>All Foods items</Text>
                      <SwipeListView
                        LisHeaderComponent={
                          <>
                            <Text>Take a look at the list of recipes below:</Text>
                          </>
                        }
                        data={mealsFood}
                        disableRightSwipe
                        closeOnScroll
                        closeOnRowOpen
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={({ item, index }) => {
                          return (
                            <SwipeSelectedItem
                              item={item}
                              index={index}
                              value={item?.unit?.quantity.toString() || qtySelected.toString()}
                              onChangeText={text => onChangeSelected(text, index)}
                              calories={selectedCalories(item)}
                            />
                          );
                        }}
                        renderHiddenItem={({ item, index }, rowMap) => {
                          return (
                            <SwipeDeleteButton
                              onDeleteClicked={() => {
                                rowMap[index].closeRow();
                                onDeleteSelectedProduct(item);
                              }}
                            />
                          );
                        }}
                        leftOpenValue={0}
                        rightOpenValue={-75}
                        ListEmptyComponent={emptyList3}
                      />
                    </View>
                  )}

                  {scanData && scanData.length > 0 && (
                    <View style={styles.scanDataStyle}>
                      <Text style={styles.swipeHeaderText}> Scanned items </Text>
                      <SwipeListView
                        data={scanData}
                        disableRightSwipe
                        closeOnScroll
                        closeOnRowOpen
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={({ item, index }) => {
                          return (
                            <SwipeScanItem
                              item={item}
                              value={item?.serving_qty?.toString() || qtyScan.toString()}
                              onChangeText={e => onChangeScan(e, index)}
                              calories={scanCalories(item)}
                            />
                          );
                        }}
                        renderHiddenItem={({ item, index }, rowMap) => {
                          return (
                            <SwipeDeleteButton
                              onDeleteClicked={() => {
                                rowMap[index].closeRow();
                                onDeleteScan(item);
                              }}
                            />
                          );
                        }}
                        leftOpenValue={0}
                        rightOpenValue={-75}
                        ListEmptyComponent={emptyList}
                      />
                    </View>
                  )}

                  {brandedData && brandedData.length > 0 && (
                    <View style={mediumXBPadding}>
                      <Text style={styles.swipeHeaderText}> Branded items </Text>
                      <SwipeListView
                        data={brandedData}
                        disableRightSwipe
                        closeOnScroll
                        closeOnRowOpen
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={({ item, index }) => {
                          return (
                            <SwipeBrandedItem
                              item={item}
                              value={item?.serving_qty?.toString() || qtyBranded.toString()}
                              onChangeText={e => onChangeBranded(e, index)}
                              calories={brandedCalories(item)}
                            />
                          );
                        }}
                        renderHiddenItem={({ item, index }, rowMap) => {
                          return (
                            <SwipeDeleteButton
                              onDeleteClicked={() => {
                                rowMap[index].closeRow();
                                onDeleteBranded(item);
                              }}
                            />
                          );
                        }}
                        leftOpenValue={0}
                        rightOpenValue={-75}
                        ListEmptyComponent={emptyList2}
                      />
                    </View>
                  )}

                  {commonData && commonData.length > 0 && (
                    <View style={mediumXBPadding}>
                      <Text style={styles.swipeHeaderText}>Common items </Text>
                      <SwipeListView
                        data={commonData}
                        disableRightSwipe
                        closeOnScroll
                        closeOnRowOpen
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={({ item, index }) => {
                          return (
                            <SwipeCommonItem
                              commonData={commonData}
                              setCommonData={setCommonData}
                              item={item}
                              index={index}
                              value={item?.serving_qty?.toString() || qtyCommon.toString()}
                              onChangeText={e => onChangeCommon(e, index)}
                              caloriesCalc={commonCalories(item)}
                            />
                          );
                        }}
                        renderHiddenItem={({ item, index }, rowMap) => {
                          return (
                            <SwipeDeleteButton
                              onDeleteClicked={() => {
                                rowMap[index].closeRow();
                                onDeleteCommon(item);
                              }}
                            />
                          );
                        }}
                        leftOpenValue={0}
                        rightOpenValue={-75}
                        ListEmptyComponent={emptyList3}
                      />
                    </View>
                  )}

                  {speechData && speechData.length > 0 && (
                    <View style={mediumXBPadding}>
                      <Text style={styles.swipeHeaderText}> Speech items </Text>
                      <SwipeListView
                        data={speechData}
                        disableRightSwipe
                        closeOnScroll
                        closeOnRowOpen
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={({ item, index }) => {
                          return (
                            <SwipeSpeechItem
                              speechData={speechData}
                              setSpeechData={setSpeechData}
                              item={item}
                              index={index}
                              value={item?.serving_qty?.toString() || qtyVoice.toString()}
                              onChangeText={e => onChangeSpeech(e, index)}
                              caloriesCalc={speechCalories(item)}
                            />
                          );
                        }}
                        renderHiddenItem={({ item, index }, rowMap) => {
                          return (
                            <SwipeDeleteButton
                              onDeleteClicked={() => {
                                rowMap[index].closeRow();
                                onDeleteVoice(item);
                              }}
                            />
                          );
                        }}
                        leftOpenValue={0}
                        rightOpenValue={-75}
                        ListEmptyComponent={emptyList3}
                      />
                    </View>
                  )}
                </View>
              )}
            </ScrollView>
          </View>
        </View>
        <View style={[secondaryBg, styles.mainContainerList]}>
          <View style={fullWidth}>
            <View
              style={[
                row,
                fullWidth,
                alignItemsCenter,
                justifyContentBetween,
                regularHPadding,
                styles.tableColumnContainer,
              ]}
            >
              <TableColumn
                name="Protein"
                value={Math.ceil(totalProtein) + Math.ceil(totalProteinFirst)}
              />
              <TableColumn
                name="Carbs"
                value={Math.ceil(totalCarbs) + Math.ceil(totalCarbsFirst)}
              />
              <TableColumn name="Fat" value={Math.ceil(totalFat) + Math.ceil(totalFatFirst)} />
            </View>
            <View style={[regularHPadding, tinyVPadding, center, row]}>
              <View style={[regularLMargin, center]}>
                <Text style={styles.tableHeadLeft}>Total calories</Text>
              </View>
              <View style={[regularLMargin, center, fill]}>
                <Text style={[border, smallHPadding, styles.tableHeadRightText]} numberOfLines={1}>
                  {Math.ceil(totalCal) + Math.ceil(totalCalFirst)}
                </Text>
              </View>
            </View>
          </View>
          <View style={[center, fullWidth]}>
            <GradientButton
              buttonContainerText={'Log Foods'}
              buttonContainerStyleProp={[center, secondaryBg, styles.findRecipesButtonContainer]}
              buttonContainerTextStyle={styles.buttonContainerTextStyle}
              buttonContentContainerProp={{ paddingBottom: 0 }}
              onPress={logFoodAction}
              isDone={disable}
              loading={loaderLogFood}
            />
          </View>
          {deleteFnc() && (
            <View style={[row, fill, justifyContentCenter, alignItemsCenter, regularHPadding]}>
              <TouchableDeleteAll
                onPress={() => {
                  const data = {
                    foodId: selectedMeal?.food_items?.id,
                    mealId: selectedMeal.id
                  }
                  // props.deleteAllMeals(data);
                  // navigation.navigate('Home');
                }}
              />
            </View>
          )}
        </View>
      </>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainerList: {
    minHeight: 165,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -8,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2.84,

    elevation: 25,
  },
  gradientButtonContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinnerContainer: {
    width: 295,
    height: 100,
    borderRadius: 10,
    marginTop: 10,
  },
  spinnerStyle: {
    width: 30,
    height: 20,
  },
  findRecipesButtonContainer: {
    paddingHorizontal: 8,
    alignSelf: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: 10,
    marginRight: 0,
    marginBottom: 0,
  },
  buttonContainerTextStyle: {
    fontSize: 21,
    fontWeight: 'normal',
    textAlign: 'center',
    textAlignVertical: 'center',
    paddingHorizontal: 10,
  },
  tableColumnContainer: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  tableHeadSub: {
    marginLeft: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableHeadRightText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'rgb(70,162,248)',
    borderColor: 'rgb(70, 162,248)',
    // fontFamily: Fonts.HELVETICA_BOLD,
  },
  tableHeadLeft: {
    // fontFamily: Fonts.HELVETICA_NORMAL,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  mainSwipeContainer: {
    marginHorizontal: 20,
    flex: 1,
  },
  swipeHeaderText: {
    fontSize: 14,
    color: 'rgb(224, 224, 224)',
  },
  swipeListWrapper: {
    paddingBottom: 50,
  },
  onSearchDiv: {
    left: 102,
    top: 10,
    width: '52%',
    height: 70,
    zIndex: 222,
    position: 'absolute',
  },
  headerContainer: {
    zIndex: 1,
  },
  scanDataStyle: {
    minHeight: 110,
  },
  barCodeStyle: {
    height: 40,
    width: 40,
    resizeMode: 'cover'
  },
});

const mapStateToProps = state => ({
  speechState: state.nutritionReducer.speechState,
  commonState: state.nutritionReducer.commonState,
  brandedState: state.nutritionReducer.brandedState,
  selectedMeal: state.nutritionReducer.selectedMeal,
  loaderLogFood: state.nutritionReducer.loader,
  getMealsFood: state.nutritionReducer.getMealsFoodState,
});

const mapDispatchToProps = dispatch => ({
  postLogFoodRequest: (id, data) => dispatch(postLogFoodRequest(id, data)),
  resetFoodItems: () => dispatch(resetFoodItems()),
  deleteAllMeals: (data) => dispatch(deleteAllMeals(data))
});
export default connect(mapStateToProps, mapDispatchToProps)(LogFoods);
