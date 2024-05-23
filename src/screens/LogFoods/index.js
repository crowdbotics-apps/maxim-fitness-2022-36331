import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator
} from "react-native"
import { connect } from "react-redux"
import { SwipeListView } from "react-native-swipe-list-view"

import SwipeSelectedItem from "../../components/LogFoodsComponents/SwipeSelectedItem"
import SwipeScanItem from "../../components/LogFoodsComponents/SwipeScanItem"
import SwipeBrandedItem from "../../components/LogFoodsComponents/SwipeBrandedItem"
import SwipeCommonItem from "../../components/LogFoodsComponents/SwipeCommonItem"
import SwipeSpeechItem from "../../components/LogFoodsComponents/SwipeSpeechItem"
import { getNutritions } from "../../utils/api"

import SwipeDeleteButton from "../../components/LogFoodsComponents/SwipeDeleteButton"

import GradientButton from "../../components/LogFoodsComponents/GradientButton"
import TableColumn from "./TableColumn"
import TouchableDeleteAll from "./TouchableDeleteAll"

// import HeaderWithSearch from '../../components/HeaderWithSearch';
// import Fonts from '../../assets/fonts';
import { Images, Layout, Gutters, Global } from "../../theme"
import moment from "moment"
import {
  postLogFoodRequest,
  resetFoodItems,
  deleteAllMeals,
  productUnitAction,
  getMealFoodSuccess
  // updateFoodItems
} from "../../ScreenRedux/nutritionRedux"

const LogFoods = props => {
  const {
    removeAllSelectedProductsAction,
    // updateFoodItems,
    food,
    navigation,
    scannedProduct,
    resetFoodItems,
    meals,

    speechState,
    brandedState,
    commonState,
    selectedMeal,
    loaderLogFood,

    getMealsFood,
    removeSelectedProductsAction,
    productUnitAction,
    requesting
  } = props
  const [loading, setLoading] = useState(false)
  const [value, setValue] = useState("")

  const [speechData, setSpeechData] = useState([])
  const [commonData, setCommonData] = useState([])
  const [brandedData, setBrandedData] = useState([])
  const [scanData, setScanData] = useState([])
  const [mealsFood, setMealsFood] = useState([])

  const [totalCal, setTotalCal] = useState(0)
  const [totalProtein, setTotalProtein] = useState(0)
  const [totalCarbs, setTotalCarbs] = useState(0)
  const [totalFat, setTotalFat] = useState(0)

  const [totalCalFirst, setTotalCalFirst] = useState(0)
  const [totalProteinFirst, setTotalProteinFirst] = useState(0)
  const [totalCarbsFirst, setTotalCarbsFirst] = useState(0)
  const [totalFatFirst, setTotalFatFirst] = useState(0)

  const [qtySelected, setQtySelected] = useState(0)

  const [qtyScan, setQtyScan] = useState(0)
  const [qtyVoice, setQtyVoice] = useState(0)
  const [qtyCommon, setQtyCommon] = useState(0)
  const [qtyBranded, setQtyBranded] = useState(0)

  const [loader, setLoader] = useState(true)
  const [disable, setDisable] = useState(true)
  const isFocused = navigation.isFocused()

  useEffect(() => {
    if (
      isFocused &&
      (speechData.length ||
        commonData.length ||
        brandedData.length ||
        scanData.length ||
        mealsFood.length)
    ) {
      setDisable(false)
    } else {
      setDisable(true)
    }
  }, [isFocused, speechData, commonData, brandedData, scanData, mealsFood])

  useEffect(() => {
    (isFocused) && setLoader(true)
    !requesting && setTimeout(() => setLoader(false), 3000)
  }, [isFocused, requesting])

  const clearAllData = () => {
    resetFoodItems()
    setValue("")

    setSpeechData([])
    setCommonData([])
    setBrandedData([])
    setScanData([])
    setMealsFood([])

    setTotalCal(0)
    setTotalProtein(0)
    setTotalCarbs(0)
    setTotalFat(0)

    setTotalCalFirst(0)
    setTotalProteinFirst(0)
    setTotalCarbsFirst(0)
    setTotalFatFirst(0)
  }

  useEffect(() => {
    // createNewMealSpeach();
    return () => {
      resetFoodItems()
    }
  }, [])

  useEffect(() => {
    if (getMealsFood && getMealsFood[0]?.food_items) {
      const newArray = getMealsFood[0].food_items.map(item => ({
        ...item,
        total_quantity: item.unit.quantity
      }))

      setMealsFood(newArray)
    }
  }, [getMealsFood])

  useEffect(() => {
    if (speechState && speechState?.length) {
      const newArray = speechState.map(item => ({
        ...item,
        total_quantity: item.serving_qty,
        localCal: item.nf_calories
      }))

      setSpeechData(newArray)
    }
  }, [speechState])
  // useEffect(() => {
  //   if (brandedState) {
  //     brandedState["total_quantity"] = brandedState.serving_qty
  //     brandedState["localCal"] = brandedState.nf_calories
  //     setBrandedData([brandedState])
  //   }
  // }, [brandedState])
  useEffect(() => {
    if (brandedState) {
      if (Array.isArray(brandedState)) {
        // Handle brandedState as an array
        const updatedBrandedState = brandedState.map((item) => {
          if (item.foods && Array.isArray(item.foods)) {
            const updatedFoods = item.foods.map((foodItem) => ({
              ...foodItem,
              total_quantity: foodItem.serving_qty,
              localCal: foodItem.nf_calories
            }));

            return {
              ...item,
              foods: updatedFoods
            };
          }
          return item;
        });
        setBrandedData(updatedBrandedState);
      } else if (brandedState.foods && Array.isArray(brandedState.foods)) {
        // Handle brandedState as an object
        const updatedFoods = brandedState.foods.map((foodItem) => ({
          ...foodItem,
          total_quantity: foodItem.serving_qty,
          localCal: foodItem.nf_calories
        }));

        const updatedBrandedState = {
          ...brandedState,
          foods: updatedFoods
        };

        setBrandedData(updatedBrandedState);
      }
    }
  }, [brandedState]);



  useEffect(() => {
    if (commonState) {
      if (Array.isArray(commonState)) {
        // Handle commonState as an array
        const updatedCommonState = commonState.map((item) => {
          if (item.foods && Array.isArray(item.foods)) {
            const updatedFoods = item.foods.map((foodItem) => ({
              ...foodItem,
              total_quantity: foodItem.serving_qty,
              localCal: foodItem.nf_calories
            }));

            return {
              ...item,
              foods: updatedFoods
            };
          }
          return item;
        });

        setCommonData(updatedCommonState);
      } else if (commonState.foods && Array.isArray(commonState.foods)) {
        // Handle commonState as an object
        const updatedFoods = commonState.foods.map((foodItem) => ({
          ...foodItem,
          total_quantity: foodItem.serving_qty,
          localCal: foodItem.nf_calories
        }));

        const updatedCommonState = {
          ...commonState,
          foods: updatedFoods
        };

        setCommonData(updatedCommonState);
      }
    }
  }, [commonState]);



  // useEffect(() => {
  //   if (scannedProduct) {
  //     scannedProduct["total_quantity"] = scannedProduct.serving_qty
  //     scannedProduct["localCal"] = scannedProduct.nf_calories
  //     setScanData([scannedProduct])
  //   }
  // }, [scannedProduct])
  useEffect(() => {
    if (scannedProduct) {
      const updatedFoods = scannedProduct.foods?.map(food => ({
        ...food,
        total_quantity: food?.serving_qty,
        localCal: food?.nf_calories
      }));

      setScanData([{ foods: updatedFoods }]);
    }
  }, [scannedProduct]);
  useEffect(() => {
    if (mealsFood.length) {
      let array = [...mealsFood]
      calcCalProteinCarbsFat(array || 0)
    }
  }, [mealsFood])

  const calcCalProteinCarbsFat = data => {
    let totalCalc = 0
    let totalProteinCalc = 0
    let totalCarbsCalc = 0
    let totalFatCalc = 0
    if (data && data.length) {
      data.forEach(item => {
        totalCalc += Math.round(
          (item?.food?.calories / item?.unit?.quantity) * item.total_quantity
        )
        totalProteinCalc += Math.round(
          (item?.food?.proteins / item?.unit?.quantity) * item.total_quantity
        )
        totalCarbsCalc += Math.round(
          (item?.food?.carbohydrate / item?.unit?.quantity) *
          item.total_quantity
        )
        totalFatCalc += Math.round(
          (item?.food?.fat / item?.unit?.quantity) * item.total_quantity
        )
      })
    }
    setTotalCalFirst(totalCalc)
    setTotalProteinFirst(totalProteinCalc)
    setTotalCarbsFirst(totalCarbsCalc)
    setTotalFatFirst(totalFatCalc)
  }

  useEffect(() => {
    if (
      (speechData && speechData.length) ||
      (commonData && commonData.length) ||
      (brandedData && brandedData.length) ||
      (scanData && scanData.length)
    ) {
      let array = [...speechData, ...commonData, ...brandedData, ...scanData]
      calProteinCarbsFat(array || 0)
    }
  }, [speechData, commonData, brandedData, scanData])


  const calProteinCarbsFat = value => {
    let totalCalc = 0;
    let totalProteinCalc = 0;
    let totalCarbsCalc = 0;
    let totalFatCalc = 0;

    value?.forEach(data => {
      if (data && data.foods?.length) {
        data.foods.forEach(item => {
          totalCalc += Math.round(
            (item?.nf_calories / item.serving_qty) * item.total_quantity
          );
          totalProteinCalc += Math.round(
            (item?.nf_protein / item.serving_qty) * item.total_quantity
          );
          totalCarbsCalc += Math.round(
            item.nf_total_carbohydrate * item.total_quantity
          );
          totalFatCalc += Math.round(
            (item.nf_total_fat / item.serving_qty) * item.total_quantity
          );
        });
      }
    });

    setTotalCal(totalCalc || 0);
    setTotalProtein(totalProteinCalc || 0);
    setTotalCarbs(totalCarbsCalc || 0);
    setTotalFat(totalFatCalc || 0);
  };


  const onDeleteSelectedProduct = item => {
    let newData = mealsFood && mealsFood?.filter(c => c.id !== item.id)
    setMealsFood(newData)
    const data = {
      food_id: item.id,
      id: selectedMeal.id
    }
    props.getMealFoodSuccess(newData)
    props.deleteAllMeals(data)

    resetFoodItems()
    setValue("")

    setTotalCal(0)
    setTotalProtein(0)
    setTotalCarbs(0)
    setTotalFat(0)
    setTotalCalFirst(0)
    setTotalProteinFirst(0)
    setTotalCarbsFirst(0)
    setTotalFatFirst(0)

    let array = [...speechData, ...commonData, ...brandedData, ...scanData]
    calProteinCarbsFat(array)
  }
  const onDeleteAllProduct = () => {
    setMealsFood([])
    setCommonData([])
    setBrandedData([])
    setScanData([])
    if (mealsFood) {
      let newData = mealsFood && mealsFood?.map(c => c.id)
      const data = {
        list_of_ids: newData,
        id: selectedMeal.id
      }
      props.deleteAllMeals(data, "Home")
    }
    resetFoodItems()
    setValue("")

    setTotalCal(0)
    setTotalProtein(0)
    setTotalCarbs(0)
    setTotalFat(0)
    setTotalCalFirst(0)
    setTotalProteinFirst(0)
    setTotalCarbsFirst(0)
    setTotalFatFirst(0)
  }

  const onDeleteVoice = (item, index) => {
    let newData = speechData.filter(c => c.food_name !== item.food_name)
    setSpeechData(newData)

    resetFoodItems()
    setValue("")

    setTotalCal(0)
    setTotalProtein(0)
    setTotalCarbs(0)
    setTotalFat(0)
    setTotalCalFirst(0)
    setTotalProteinFirst(0)
    setTotalCarbsFirst(0)
    setTotalFatFirst(0)
    if (mealsFood?.length) {
      let array = [...mealsFood]
      calcCalProteinCarbsFat(array)
    }
  }

  const onDeleteCommon = (item, index) => {
    let newData = commonData.filter((_, i) => i !== index);
    setCommonData(newData);

    resetFoodItems();
    setValue("");

    setTotalCal(0);
    setTotalProtein(0);
    setTotalCarbs(0);
    setTotalFat(0);
    setTotalCalFirst(0);
    setTotalProteinFirst(0);
    setTotalCarbsFirst(0);
    setTotalFatFirst(0);

    if (mealsFood?.length) {
      let array = [...mealsFood];
      calcCalProteinCarbsFat(array);
    }
  }


  const onDeleteBranded = (item, index) => {
    setBrandedData(prevBrandedData => prevBrandedData.filter((_, i) => i !== index));

    resetFoodItems();
    setValue("");

    setTotalCal(0);
    setTotalProtein(0);
    setTotalCarbs(0);
    setTotalFat(0);
    setTotalCalFirst(0);
    setTotalProteinFirst(0);
    setTotalCarbsFirst(0);
    setTotalFatFirst(0);

    if (mealsFood?.length) {
      let array = [...mealsFood];
      calcCalProteinCarbsFat(array);
    }
  }


  const onDeleteScan = () => {
    setScanData([])

    resetFoodItems()
    setValue("")

    setTotalCal(0)
    setTotalProtein(0)
    setTotalCarbs(0)
    setTotalFat(0)
    setTotalCalFirst(0)
    setTotalProteinFirst(0)
    setTotalCarbsFirst(0)
    setTotalFatFirst(0)
    if (mealsFood?.length) {
      let array = [...mealsFood]
      calcCalProteinCarbsFat(array)
    }
  }

  const {
    row,
    fill,
    fill3x,
    center,
    fullWidth,
    justifyContentBetween,
    justifyContentCenter,
    alignItemsCenter
  } = Layout
  const { border, secondaryBg } = Global
  const {
    smallHPadding,
    regularLMargin,
    tinyVPadding,
    small2xHMargin,
    small2xVPadding,
    smallBPadding,
    mediumXBPadding,
    regularHPadding
  } = Gutters

  const logFoodAction = async () => {
    const dateTime = new Date()
    const formatedDate = moment(dateTime).format("YYYY-MM-DD")
    let speakVoice =
      speechData.length > 0
        ? speechData.map(item => ({
          food_name: item.food_name,
          nf_calories: item.nf_calories || 0,
          nf_total_carbohydrate: item.nf_total_carbohydrate || 0,
          nf_protein: item.nf_protein || 0,
          nf_total_fat: item.nf_total_fat || 0,
          nix_item_id: item.nix_item_id || "",
          weight: item.serving_weight_grams || 1,
          thumb: item.photo.thumb,
          serving_unit: item.serving_unit,
          serving_qty: item.total_quantity,
          created: formatedDate,
          alt_measures: item?.alt_measures
        }))
        : []
    let common =
      commonData.length > 0
        ? commonData.map(item => ({
          food_name: item?.foods?.[0]?.food_name,
          nf_calories: item?.foods?.[0]?.nf_calories || 0,
          nf_total_carbohydrate: item?.foods?.[0]?.nf_total_carbohydrate || 0,
          nf_protein: item?.foods?.[0]?.nf_protein || 0,
          nf_total_fat: item?.foods?.[0]?.nf_total_fat || 0,
          nix_item_id: item?.foods?.[0]?.nix_item_id || "",
          weight: item?.foods?.[0]?.serving_weight_grams || 1,
          thumb: item?.foods?.[0]?.photo.thumb,
          serving_unit: item?.foods?.[0]?.serving_unit,
          serving_qty: item?.foods?.[0]?.total_quantity,
          created: formatedDate,
          alt_measures: item?.foods?.[0]?.alt_measures
        }))
        : []
    let branded =
      brandedData.length > 0
        ? brandedData.map(item => ({
          food_name: item?.foods?.[0]?.food_name,
          nf_calories: calculateCalories(item?.foods?.[0]) || 0,
          nf_total_carbohydrate:
            Math.round(item?.foods?.[0]?.nf_total_carbohydrate / item.serving_qty) *
            item.total_quantity || 0,
          nf_protein:
            Math.round(item?.foods?.[0]?.nf_protein / item?.foods?.[0].serving_qty) *
            item?.foods?.[0].total_quantity || 0,
          nf_total_fat:
            Math.round(item?.foods?.[0]?.nf_total_fat / item.serving_qty) *
            item?.foods?.[0]?.total_quantity || 0,
          nix_item_id: item?.foods?.[0]?.nix_item_id || "",
          weight: item?.foods?.[0]?.serving_weight_grams || 1,
          thumb: item?.foods?.[0]?.photo.thumb,
          serving_unit: item?.foods?.[0]?.serving_unit,
          serving_qty: item?.foods?.[0]?.total_quantity,
          created: formatedDate,
          alt_measures: item?.foods?.[0]?.alt_measures
        }))
        : []
    let scan =
      scanData.length > 0
        ? scanData.map(item => ({
          food_name: item?.foods?.[0].food_name,
          nf_calories: item?.foods?.[0].nf_calories || 0,
          nf_total_carbohydrate: item?.foods?.[0].nf_total_carbohydrate || 0,
          nf_protein: item?.foods?.[0].nf_protein || 0,
          nf_total_fat: item?.foods?.[0].nf_total_fat || 0,
          nix_item_id: item?.foods?.[0].nix_item_id || "",
          weight: item?.foods?.[0].serving_weight_grams || 1,
          thumb: item?.foods?.[0].photo.thumb,
          serving_unit: item?.foods?.[0].serving_unit,
          serving_qty: item?.foods?.[0]?.total_quantity,
          created: formatedDate,
          alt_measures: item?.foods?.[0]?.alt_measures
        }))
        : []

    const data = [
      {
        common: common,
        branded: branded,
        voice: speakVoice,
        scan: scan,
        meal_time_id: selectedMeal?.id
      }
    ]

    await props.postLogFoodRequest(meals?.id, data)
    clearAllData()
  }

  const updateNutritions = async (value, item, type, index) => {
    const query = `${item?.total_quantity ? item?.total_quantity : 1} ${value} ${item?.food?.name ? item?.food?.name : item.food_name}`;

    const selectedData = item.alt_measures.find(items => items.measure === value);

    try {
      const data = await getNutritions(query);

      let foodData =
        type === "all"
          ? [...mealsFood]
          : type === "speech"
            ? [...speechData]
            : [...commonData];

      const updatedFood = {
        ...data.foods[0],
        alt_measures: item?.alt_measures,
        serving_unit: selectedData?.measure,
        total_quantity: item?.total_quantity ? item?.total_quantity : 1,
        id: item?.id ? item?.id : data.foods[0]?.id,
      };

      const updatedItem = {
        food: {
          calories: data.foods[0].nf_calories,
          carbohydrate: data.foods[0].nf_total_carbohydrate,
          fat: data.foods[0].nf_total_fat,
          name: data.foods[0].food_name,
          proteins: data.foods[0]?.nf_protein,
          thumb: data.foods[0]?.photo?.thumb,
          weight: data.foods[0]?.serving_weight_grams,
        },
        unit: {
          id: item?.unit?.id,
          name: selectedData?.measure,
          product: selectedData.product,
          quantity: item?.total_quantity,
          weight: selectedData?.serving_weight,
        },
      };

      if (type === "branded" || type === "common") {
        foodData[index] = { foods: [updatedFood], ...updatedItem };
      } else {
        foodData[index] = { ...updatedFood, ...updatedItem };
      }

      if (type === "all") {
        setMealsFood(foodData);
        const itemData = foodData[index];

        if (itemData?.total_quantity > 0) {
          productUnitAction(item?.unit?.id, itemData?.total_quantity, itemData);
        }
      } else if (type === "speech") {
        setSpeechData(foodData);
      } else {
        setCommonData(foodData);
      }

    } catch (err) { }
  };


  const selectedCalories = f => {
    const data = (f?.food.calories / f?.unit?.quantity) * f.total_quantity
    return data
  }

  const calculateCalories = cal => {
    const data = (cal?.nf_calories / cal.serving_qty) * cal.total_quantity
    return data
  }

  const onChangeSpeech = (e, index) => {
    let arr = [...speechData]
    let objToUpdate = arr[index]
    objToUpdate.total_quantity = e
    arr[index] = objToUpdate
    setQtyVoice(e)
    setSpeechData(arr)
  }



  const onChangeCommon = (e, index) => {
    let arr = [...commonData];
    let objToUpdate = { ...arr[index] };
    if (objToUpdate?.foods?.[0]) {
      objToUpdate.foods[0].total_quantity = e;
    }
    arr[index] = objToUpdate;
    setQtyCommon(e);
    setCommonData(arr);
  };

  const onChangeBranded = (e, index) => {
    let arr = [...brandedData];
    let objToUpdate = { ...arr[index] };
    if (objToUpdate?.foods?.[0]) {
      objToUpdate.foods[0].total_quantity = e;
    }
    arr[index] = objToUpdate;
    setQtyBranded(e);
    setBrandedData(arr);
  };

  const onChangeScan = (e, index) => {
    let arr = [...scanData]
    let objToUpdate = arr[index]
    if (objToUpdate?.foods?.[0]) {
      objToUpdate.foods[0].total_quantity = e;
    }
    arr[index] = objToUpdate
    setQtyScan(e)
    setScanData(arr)
  }
  const onChangeSelected = (e, index, item) => {
    let arr = [...mealsFood]
    let objToUpdate = arr[index]
    let itemId = objToUpdate.unit.id
    objToUpdate.total_quantity = e
    arr[index] = objToUpdate
    setQtySelected(e)
    setMealsFood(arr)
    if (e > 0) {
      productUnitAction(itemId, e, item)
    }
  }

  const emptyList = () => (
    <View style={[fill, center]}>
      <Text text="No voice data is available!" />
    </View>
  )

  const emptyList2 = () => (
    <View style={[fill, center]}>
      <Text text="No branded data is available!" />
    </View>
  )

  const emptyList3 = () => (
    <View style={[fill, center]}>
      <Text text="No scane data is available!" />
    </View>
  )

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
              fontWeight: "bold",
              color: "black",
              textAlign: "center"
            }}
          >
            {"No logged food items found,\n please search to log new items"}
          </Text>
        </View>
      )
    }
    return <></>
  }

  const deleteFnc = () => {
    if (
      !mealsFood.length &&
      !speechData.length &&
      !scanData.length &&
      !brandedData.length &&
      !commonData.length
    ) {
      return false
    }
    return <></>
  }

  const totalCalories = Math.round(totalCal) + Math.round(totalCalFirst)

  return (
    <SafeAreaView style={[fill, secondaryBg]}>
      <>
        <View style={fill3x}>
          <View
            style={[
              Layout.row,
              Layout.alignItemsCenter,
              Layout.justifyContentBetween,
              Global.height65,
              Gutters.regularHMargin
            ]}
          >
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={[
                Layout.fill,
                Layout.justifyContentCenter,
                Layout.alignItemsStart
              ]}
            >
              <Image style={styles.leftArrowStyle} source={Images.leftArrow} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setQtyScan(0)
                setQtyVoice(0)
                setQtyCommon(0)
                setQtyBranded(0)
                navigation.navigate("SelectBrand")
              }}
              style={{
                flex: 4,
                alignItems: "flex-start",
                paddingHorizontal: 15,
                paddingVertical: 15,
                borderBottomWidth: 1,
                borderBottomColor: "gray"
              }}
            >
              <Text style={{ fontSize: 15, color: "gray" }}>
                Search Foods and Products
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                Layout.fill,
                Layout.justifyContentCenter,
                Layout.alignItemsEnd
              ]}
              onPress={() => navigation.navigate("BarCodeScreen")}
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
                      <Text style={styles.swipeHeaderText}>
                        All Foods items
                      </Text>
                      <SwipeListView
                        LisHeaderComponent={
                          <>
                            <Text>
                              Take a look at the list of recipes below:
                            </Text>
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
                              updateNutritions={updateNutritions}
                              type="all"
                              value={
                                item?.total_quantity.toString() ||
                                qtySelected.toString()
                              }
                              onChangeText={text =>
                                onChangeSelected(text, index, item)
                              }
                              calories={selectedCalories(item)}
                            />
                          )
                        }}
                        renderHiddenItem={({ item, index }, rowMap) => {
                          return (
                            <SwipeDeleteButton
                              onDeleteClicked={() => {
                                rowMap[index].closeRow()
                                onDeleteSelectedProduct(item)
                              }}
                            />
                          )
                        }}
                        leftOpenValue={0}
                        rightOpenValue={-75}
                        ListEmptyComponent={emptyList3}
                      />
                    </View>
                  )}

                  {scanData && scanData.length > 0 && (
                    <View style={styles.scanDataStyle}>
                      <Text style={styles.swipeHeaderText}>
                        {" "}
                        Scanned items{" "}
                      </Text>
                      <SwipeListView
                        data={scanData}
                        disableRightSwipe
                        closeOnScroll
                        closeOnRowOpen
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={({ item, index }) => {
                          return (
                            <SwipeScanItem
                              item={item.foods[0]}
                              value={
                                item.foods[0]?.total_quantity?.toString() ||
                                qtyScan.toString()
                              }
                              onChangeText={e => onChangeScan(e, index)}
                              calories={calculateCalories(item.foods[0])}
                            />
                          )
                        }}
                        renderHiddenItem={({ item, index }, rowMap) => {
                          return (
                            <SwipeDeleteButton
                              onDeleteClicked={() => {
                                rowMap[index].closeRow()
                                onDeleteScan(item)
                              }}
                            />
                          )
                        }}
                        leftOpenValue={0}
                        rightOpenValue={-75}
                        ListEmptyComponent={emptyList}
                      />
                    </View>
                  )}

                  {brandedData && brandedData.length > 0 && (
                    <View style={mediumXBPadding}>
                      <Text style={styles.swipeHeaderText}>
                        {" "}
                        Branded items{" "}
                      </Text>
                      <SwipeListView
                        data={brandedData}
                        disableRightSwipe
                        closeOnScroll
                        closeOnRowOpen
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={({ item, index }) => {
                          return (
                            <SwipeBrandedItem
                              item={item?.foods?.[0]}
                              value={
                                item?.foods?.[0]?.total_quantity?.toString() ||
                                qtyBranded.toString()
                              }
                              onChangeText={e => onChangeBranded(e, index)}
                              calories={calculateCalories(item?.foods?.[0])}
                            />
                          )
                        }}
                        renderHiddenItem={({ item, index }, rowMap) => {
                          return (
                            <SwipeDeleteButton
                              onDeleteClicked={() => {
                                rowMap[index].closeRow()
                                onDeleteBranded(item, index)
                              }}
                            />
                          )
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
                              item={item?.foods?.[0]}
                              index={index}
                              type="common"
                              updateNutritions={updateNutritions}
                              value={
                                item?.foods?.[0]?.total_quantity?.toString() ||
                                qtyCommon.toString()
                              }
                              onChangeText={e => onChangeCommon(e, index)}
                              caloriesCalc={calculateCalories(item?.foods?.[0])}
                            />
                          )
                        }}
                        renderHiddenItem={({ item, index }, rowMap) => {
                          return (
                            <SwipeDeleteButton
                              onDeleteClicked={() => {
                                rowMap[index].closeRow()
                                onDeleteCommon(item, index)
                              }}
                            />
                          )
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
                              type="speech"
                              updateNutritions={updateNutritions}
                              item={item}
                              index={index}
                              value={
                                item?.total_quantity?.toString() ||
                                qtyVoice.toString()
                              }
                              onChangeText={e => onChangeSpeech(e, index)}
                              caloriesCalc={calculateCalories(item)}
                            />
                          )
                        }}
                        renderHiddenItem={({ item, index }, rowMap) => {
                          return (
                            <SwipeDeleteButton
                              onDeleteClicked={() => {
                                rowMap[index].closeRow()
                                onDeleteVoice(item, index)
                              }}
                            />
                          )
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
                styles.tableColumnContainer
              ]}
            >
              <TableColumn
                name="Protein"
                value={Math.round(totalProtein) + Math.round(totalProteinFirst)}
              />
              <TableColumn
                name="Carbs"
                value={Math.round(totalCarbs) + Math.round(totalCarbsFirst)}
              />
              <TableColumn
                name="Fat"
                value={Math.round(totalFat) + Math.round(totalFatFirst)}
              />
            </View>
            <View style={[regularHPadding, tinyVPadding, center, row]}>
              <View style={[regularLMargin, center]}>
                <Text style={styles.tableHeadLeft}>Total calories</Text>
              </View>
              <View style={[regularLMargin, center, fill]}>
                <Text
                  style={[border, smallHPadding, styles.tableHeadRightText]}
                  numberOfLines={1}
                >
                  {Math.round(totalCal) + Math.round(totalCalFirst)}
                </Text>
              </View>
            </View>
          </View>
          <View style={[center, fullWidth]}>
            <GradientButton
              buttonContainerText={"Log Foods"}
              buttonContainerStyleProp={[
                center,
                secondaryBg,
                styles.findRecipesButtonContainer
              ]}
              buttonContainerTextStyle={styles.buttonContainerTextStyle}
              buttonContentContainerProp={{ paddingBottom: 0 }}
              onPress={logFoodAction}
              isDone={disable || totalCalories === 0}
              loading={loaderLogFood}
            />
          </View>
          {deleteFnc() && (
            <View
              style={[
                row,
                fill,
                justifyContentCenter,
                alignItemsCenter,
                regularHPadding
              ]}
            >
              <TouchableDeleteAll onPress={onDeleteAllProduct} />
            </View>
          )}
        </View>
      </>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  mainContainerList: {
    minHeight: 165,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -8
    },
    shadowOpacity: 0.08,
    shadowRadius: 2.84,

    elevation: 25
  },
  gradientButtonContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  spinnerContainer: {
    width: 295,
    height: 100,
    borderRadius: 10,
    marginTop: 10
  },
  spinnerStyle: {
    width: 30,
    height: 20
  },
  findRecipesButtonContainer: {
    paddingHorizontal: 8,
    alignSelf: "center",
    textAlign: "center",
    textAlignVertical: "center",
    borderRadius: 10,
    marginRight: 0,
    marginBottom: 0
  },
  buttonContainerTextStyle: {
    fontSize: 21,
    fontWeight: "normal",
    textAlign: "center",
    textAlignVertical: "center",
    paddingHorizontal: 10
  },
  tableColumnContainer: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30
  },
  tableHeadSub: {
    marginLeft: 15,
    alignItems: "center",
    justifyContent: "center"
  },
  tableHeadRightText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "rgb(70,162,248)",
    borderColor: "rgb(70, 162,248)"
    // fontFamily: Fonts.HELVETICA_BOLD,
  },
  tableHeadLeft: {
    // fontFamily: Fonts.HELVETICA_NORMAL,
    fontSize: 20,
    fontWeight: "bold",
    color: "black"
  },
  mainSwipeContainer: {
    marginHorizontal: 20,
    flex: 1
  },
  swipeHeaderText: {
    fontSize: 14,
    color: "rgb(224, 224, 224)"
  },
  swipeListWrapper: {
    paddingBottom: 50
  },
  onSearchDiv: {
    left: 102,
    top: 10,
    width: "52%",
    height: 70,
    zIndex: 222,
    position: "absolute"
  },
  headerContainer: {
    zIndex: 1
  },
  scanDataStyle: {
    minHeight: 110
  },
  barCodeStyle: {
    height: 40,
    width: 40,
    resizeMode: "cover"
  }
})

const mapStateToProps = state => ({
  speechState: state.nutritionReducer.speechState,
  commonState: state.nutritionReducer.commonState,
  brandedState: state.nutritionReducer.brandedState,
  selectedMeal: state.nutritionReducer.selectedMeal,
  scannedProduct: state.nutritionReducer.scannedProduct,
  meals: state.customCalReducer.meals,
  loaderLogFood: state.nutritionReducer.loader,
  getMealsFood: state.nutritionReducer.getMealsFoodState,
  requesting: state.nutritionReducer.request,

})


const mapDispatchToProps = dispatch => ({
  postLogFoodRequest: (id, data) => dispatch(postLogFoodRequest(id, data)),
  resetFoodItems: () => dispatch(resetFoodItems()),
  deleteAllMeals: (data, screenName) =>
    dispatch(deleteAllMeals(data, screenName)),
  productUnitAction: (itemId, value, data) =>
    dispatch(productUnitAction(itemId, value, data)),
  getMealFoodSuccess: data => dispatch(getMealFoodSuccess(data))
  // updateFoodItems: data => dispatch(updateFoodItems(data))
})
export default connect(mapStateToProps, mapDispatchToProps)(LogFoods)
