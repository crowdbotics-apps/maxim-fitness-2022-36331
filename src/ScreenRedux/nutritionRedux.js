import { all, call, put, takeLatest } from "redux-saga/effects"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { goBack, navigate } from "../navigation/NavigationService"
import { showMessage } from "react-native-flash-message"
import { NIX_APP_ID, NIX_API_KEY } from '@env'

// config
import { API_URL, NUTRITIONIX_SEARCH_URL } from "../config/app"

// utils
import XHR from "src/utils/XHR"

//Types
const GET_SPEECH_REQUEST = "NutritionScreen/GET_SPEECH_REQUEST"
const GET_SPEECH_SUCCESS = "NutritionScreen/GET_SPEECH_SUCCESS"
const GET_SPEECH_FAILURE = "NutritionScreen/GET_SPEECH_FAILURE"

const GET_FOODS_SEARCH_REQUEST = "NutritionScreen/GET_FOODS_SEARCH_REQUEST"
const GET_FOODS_SEARCH_SUCCESS = "NutritionScreen/GET_FOODS_SEARCH_SUCCESS"
const GET_FOODS_SEARCH_FAILURE = "NutritionScreen/GET_FOODS_SEARCH_FAILURE"

const GET_COMMON_BRANDED_REQUEST = "NutritionScreen/GET_COMMON_BRANDED_REQUEST"
const GET_COMMON_SUCCESS = "NutritionScreen/GET_COMMON_SUCCESS"
const GET_BRANDED_SUCCESS = "NutritionScreen/GET_BRANDED_SUCCESS"
const GET_COMMON_BRANDED_FAIL = "NutritionScreen/GET_BRANDED_FAIL"

const POST_LOG_FOOD_REQUEST = "NutritionScreen/POST_LOG_FOOD_REQUEST"
const POST_LOG_FOOD_SUCCESS = "NutritionScreen/POST_LOG_FOOD_SUCCESS"

const PRODUCT_UNIT_ACTION = "NutritionScreen/PRODUCT_UNIT_ACTION"

const SELECTED_MEALS = "NutritionScreen/SELECTED_MEALS"

const RESET_FOOD_ITEMS = "NutritionScreen/RESET_FOOD_ITEMS"

const GET_MEALS_REQUEST = "NutritionScreen/GET_MEALS_REQUEST"
const GET_MEALS_SUCCESS = "NutritionScreen/GET_MEALS_SUCCESS"

const GET_SCAN_FOODS_REQUEST = "NutritionScreen/GET_SCAN_FOODS_REQUEST"
const GET_SCAN_FOODS_SUCCESS = "NutritionScreen/GET_SCAN_FOODS_SUCCESS"

const GET_UNREAD_NOTIFICATIONS = "NutritionScreen/GET_UNREAD_NOTIFICATIONS"
const GET_UNREAD_NOTIFICATIONS_SUCCESS =
  "NutritionScreen/GET_UNREAD_NOTIFICATIONS_SUCCESS"

const DELETE_ALL_MEALS = "NutritionScreen/DELETE_ALL_MEALS"

const initialState = {
  requesting: false,

  speechState: false,
  speechError: false,

  foodRequesting: false,
  foodSearchState: false,

  requestingScan: false,
  request: false,
  commonState: false,
  brandedState: false,
  scannedProduct: false,

  loader: false,
  logFoodState: false,

  selectedMeal: false,

  getMealsFoodState: false,

  unreadCount: false
}

// speech food action
export const getSpeechRequest = data => ({
  type: GET_SPEECH_REQUEST,
  data
})

export const getSpeechSuccess = data => ({
  type: GET_SPEECH_SUCCESS,
  data
})

export const getSpeechFailure = error => ({
  type: GET_SPEECH_FAILURE,
  error
})
// search food action
export const getFoodsSearchRequest = data => ({
  type: GET_FOODS_SEARCH_REQUEST,
  data
})

export const getFoodsSearchSuccess = data => ({
  type: GET_FOODS_SEARCH_SUCCESS,
  data
})

export const getFoodsSearchFailure = error => ({
  type: GET_FOODS_SEARCH_FAILURE,
  error
})
// common branded action

export const commonBrandedRequest = (common, branded) => ({
  type: GET_COMMON_BRANDED_REQUEST,
  common,
  branded
})

export const commonSuccess = data => ({
  type: GET_COMMON_SUCCESS,
  data
})

export const brandedSuccess = data => ({
  type: GET_BRANDED_SUCCESS,
  data
})

export const commonBrandedFail = () => ({
  type: GET_COMMON_BRANDED_FAIL
})
export const postLogFoodRequest = (id, data) => ({
  type: POST_LOG_FOOD_REQUEST,
  id,
  data
})

export const postLogFoodSuccess = data => ({
  type: POST_LOG_FOOD_SUCCESS,
  data
})

export const selectedMealsRequest = data => ({
  type: SELECTED_MEALS,
  data
})

export const resetFoodItems = () => ({
  type: RESET_FOOD_ITEMS
})

export const getMealFoodRequest = (data, id) => ({
  type: GET_MEALS_REQUEST,
  data,
  id
})

export const getMealFoodSuccess = data => ({
  type: GET_MEALS_SUCCESS,
  data
})

export const deleteAllMeals = (data, screenName) => ({
  type: DELETE_ALL_MEALS,
  data,
  screenName
})

export const getNotificationCount = () => ({
  type: GET_UNREAD_NOTIFICATIONS
})

export const getNotificationCountSuccess = data => ({
  type: GET_UNREAD_NOTIFICATIONS_SUCCESS,
  payload: data
})

export const productUnitAction = (itemId, value, data) => ({
  type: PRODUCT_UNIT_ACTION,
  itemId,
  value,
  data
})

// search food action
export const getScanFoodsRequest = data => ({
  type: GET_SCAN_FOODS_REQUEST,
  data
})

export const getScanFoodsSuccess = data => ({
  type: GET_SCAN_FOODS_SUCCESS,
  data
})

//Reducers
export const nutritionReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SPEECH_REQUEST:
      return {
        ...state,
        requesting: true
      }

    case GET_SPEECH_SUCCESS:
      return {
        ...state,
        speechState: action.data,
        requesting: false
      }

    case GET_SPEECH_FAILURE:
      return {
        ...state,
        speechError: action.error,
        requesting: false
      }

    case GET_SCAN_FOODS_REQUEST:
      return {
        ...state,
        requestingScan: true
      }
    case GET_SCAN_FOODS_SUCCESS:
      return {
        ...state,
        scannedProduct: action.data,
        requestingScan: false
      }

    case GET_UNREAD_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        unreadCount: action.payload
      }

    case GET_FOODS_SEARCH_REQUEST:
      return {
        ...state,
        foodRequesting: true
      }

    case GET_FOODS_SEARCH_SUCCESS:
      return {
        ...state,
        foodSearchState: action.data,
        foodRequesting: false
      }
    case GET_FOODS_SEARCH_FAILURE:
      return {
        ...state,
        speechError: action.error,
        foodRequesting: false
      }

    case GET_COMMON_BRANDED_REQUEST:
      return {
        ...state,
        request: true
      }

    case GET_COMMON_SUCCESS:
      return {
        ...state,
        commonState: action.data,
        request: false
      }

    case GET_BRANDED_SUCCESS:
      return {
        ...state,
        brandedState: action.data,
        request: false
      }
    case GET_COMMON_BRANDED_FAIL:
      return {
        ...state,
        commonState: false,
        brandedState: false,
        request: false
      }

    case POST_LOG_FOOD_REQUEST:
      return {
        ...state,
        loader: true
      }
    case POST_LOG_FOOD_SUCCESS:
      return {
        ...state,
        logFoodState: action.data,
        loader: false
      }

    case SELECTED_MEALS:
      return {
        ...state,
        selectedMeal: action.data,
        loader: false
      }
    case RESET_FOOD_ITEMS: {
      return {
        ...state,
        speechState: false,
        foodSearchState: false,
        commonState: false,
        brandedState: false,
        getMealsFood: false,
        scannedProduct: false
      }
    }

    case GET_MEALS_REQUEST:
      return {
        ...state,
        mealRequesting: true
      }
    case GET_MEALS_SUCCESS:
      return {
        ...state,
        getMealsFoodState: action.data,
        mealRequesting: false
      }
    default:
      return state
  }
}

//SPEECH API
async function getSpeechAPI(data) {
  const URL = `${API_URL}/food/search/?query=${data}`
  const token = await AsyncStorage.getItem("authToken")
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token  ${token}`
    },
  }
  return XHR(URL, options)
}

function* getSpeech({ data }) {
  try {
    const response = yield call(getSpeechAPI, data)
    yield put(getFoodsSearchSuccess(response.data))
    yield put(commonSuccess(response.data))
    yield put(brandedSuccess(response.data))
  } catch (e) {
    yield put(getSpeechFailure(e))
  }
}

//FOODS SEARCH API
async function getFoodsSearchAPI(data) {
  const URL = `${NUTRITIONIX_SEARCH_URL}/instant/?query=${data}`
  const options = {
    method: "GET",
    headers: {
      "x-app-id": NIX_APP_ID,
      "x-app-key": NIX_API_KEY
    }
  }

  return XHR(URL, options)
}

function* getFoodsSearch({ data }) {
  try {
    const response = yield call(getFoodsSearchAPI, data)
    yield put(getFoodsSearchSuccess(response.data))
  } catch (e) {
    yield put(getFoodsSearchFailure(e))
  }
}

// common branded sagas
async function commonAPI(name) {
  const URL = `${API_URL}/food/search_food/`
  const token = await AsyncStorage.getItem("authToken")
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token  ${token}`
    },
    data: { query: name }
  }

  return XHR(URL, options)
}


async function brandedAPI(id) {
  const data = { item_id: id }
  const URL = `${API_URL}/products/code/`
  const token = await AsyncStorage.getItem("authToken")
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token  ${token}`
    },
    data: data
  }

  return XHR(URL, options)
}

function* commonBranded({ common, branded }) {
  try {

    if (branded.item === 'branded') {
      const response = yield call(brandedAPI, branded.id)
      yield put(brandedSuccess(response.data))
    }
    if (common.item === 'common') {
      const response = yield call(commonAPI, common.name)
      yield put(commonSuccess(response.data))
    }

  } catch (e) {
    showMessage({
      message: e.error.message || "Something want wrong",
      type: "danger"
    })
    commonBrandedFail()
  }
}

async function postLogFoodAPI(id, data) {
  const URL = `${API_URL}/meal/${id}/add_log_food/`
  const token = await AsyncStorage.getItem("authToken")
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token  ${token}`
    },
    data: data
  }

  return XHR(URL, options)
}

function* postLogFood({ id, data }) {
  try {
    const response = yield call(postLogFoodAPI, id, data)
    yield put(brandedSuccess(response.data))
    navigate("HomeScreen")
  } catch (e) {
    // yield put(postLogFoodFailure(e))
  }
}

async function getMealsFoodAPI(data, id) {
  const URL = `${API_URL}/meal/get_by_date/?date=${data}&id=${id}`
  const token = await AsyncStorage.getItem("authToken")
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token  ${token}`
    }
  }

  return XHR(URL, options)
}

function* getMealsFood({ data, id }) {
  try {
    const response = yield call(getMealsFoodAPI, data, id)
    yield put(getMealFoodSuccess(response.data))
  } catch (e) {
    // yield put(getMealsFoodFailure(e))
  }
}

async function deleteAllMealsReqAPI(data) {
  const URL = `${API_URL}/meal/delete_food/`
  const token = await AsyncStorage.getItem("authToken")
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token  ${token}`
    },
    data
  }

  return XHR(URL, options)
}

function* deleteAllMealsReq({ data, screenName }) {
  try {
    const response = yield call(deleteAllMealsReqAPI, data)
    if (screenName) {
      navigate(screenName)
    }

    // yield put(getMealFoodSuccess(response.data))
  } catch (e) {
    // yield put(deleteAllMealsReqFailure(e))
  }
}

async function getUnreadNotificationsApi() {
  const URL = `${API_URL}/notification/unread_count/`
  const token = await AsyncStorage.getItem("authToken")
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token  ${token}`
    }
  }

  return XHR(URL, options)
}

function* getUnreadNotifications() {
  try {
    const response = yield call(getUnreadNotificationsApi)
    yield put(getNotificationCountSuccess(response?.data?.unread_count))
  } catch (e) { }
}

async function productUnitAPI(itemId, value, data) {
  const objToUpdate = { ...data }
  objToUpdate.food.calories =
    ((objToUpdate && objToUpdate.food && objToUpdate.food.calories) /
      (objToUpdate && objToUpdate.unit && objToUpdate.unit.quantity)) *
    value
  objToUpdate.food.carbohydrate =
    ((objToUpdate && objToUpdate.food && objToUpdate.food.carbohydrate) /
      (objToUpdate && objToUpdate.unit && objToUpdate.unit.quantity)) *
    value
  objToUpdate.food.fat =
    ((objToUpdate && objToUpdate.food && objToUpdate.food.fat) /
      (objToUpdate && objToUpdate.unit && objToUpdate.unit.quantity)) *
    value
  objToUpdate.food.proteins =
    ((objToUpdate && objToUpdate.food && objToUpdate.food.proteins) /
      (objToUpdate && objToUpdate.unit && objToUpdate.unit.quantity)) *
    value
  objToUpdate.unit.quantity = value

  const URL = `${API_URL}/product-unit/${itemId}/`
  const token = await AsyncStorage.getItem("authToken")
  const options = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token  ${token}`
    },
    data: objToUpdate
  }

  return XHR(URL, options)
}

function* productUnitData({ itemId, value, data }) {
  try {
    const response = yield call(productUnitAPI, itemId, value, data)
  } catch (e) { }
}
async function getScanFoodAPI(barcode) {
  const URL = `${NUTRITIONIX_SEARCH_URL}/item/?upc=${barcode}`
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-app-id": NIX_APP_ID,
      "x-app-key": NIX_API_KEY
    }
  }

  return XHR(URL, options)
}

function* getScanMealsFood({ data }) {
  try {
    const response = yield call(getScanFoodAPI, data)
    yield put(getScanFoodsSuccess(response.data))
    navigate("LogFoods")
  } catch (e) {
    goBack()
    yield put(getScanFoodsSuccess(false))
    if (e?.response?.data) {
      showMessage({ message: e?.response?.data, type: "danger" })
    }

    // yield put(getMealsFoodFailure(e))
  }
}

export default all([
  takeLatest(DELETE_ALL_MEALS, deleteAllMealsReq),
  takeLatest(GET_MEALS_REQUEST, getMealsFood),
  takeLatest(POST_LOG_FOOD_REQUEST, postLogFood),
  takeLatest(GET_COMMON_BRANDED_REQUEST, commonBranded),
  takeLatest(GET_FOODS_SEARCH_REQUEST, getFoodsSearch),
  takeLatest(GET_SPEECH_REQUEST, getSpeech),
  takeLatest(GET_UNREAD_NOTIFICATIONS, getUnreadNotifications),
  takeLatest(PRODUCT_UNIT_ACTION, productUnitData),
  takeLatest(GET_SCAN_FOODS_REQUEST, getScanMealsFood)
])
