import { all, call, put, takeLatest } from "redux-saga/effects"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { navigate } from "../navigation/NavigationService"

// config
import { API_URL } from "../config/app"

// utils
import XHR from "src/utils/XHR"
import moment from "moment"

//Types
const GET_CALORIES_REQUEST = "CUSTOM_CAL_SCREEN/GET_CALORIES_REQUEST"
const GET_CALORIES_SUCCESS = "CUSTOM_CAL_SCREEN/GET_CALORIES_SUCCESS"
const GET_CALORIES_FAILURE = "CUSTOM_CAL_SCREEN/GET_CALORIES_FAILURE"

const GET_MEALS_REQUEST = "CUSTOM_CAL_SCREEN/GET_MEALS_REQUEST"
const GET_MEALS_SUCCESS = "CUSTOM_CAL_SCREEN/GET_MEALS_SUCCESS"
const GET_MEALS_FAILURE = "CUSTOM_CAL_SCREEN/GET_MEALS_FAILURE"

const GET_MEALS_HISTORY_REQUEST = "CUSTOM_CAL_SCREEN/GET_MEALS_HISTORY_REQUEST"
const GET_MEALS_HISTORY_SUCCESS = "CUSTOM_CAL_SCREEN/GET_MEALS_HISTORY_SUCCESS"

const REQUIRED_CALORIES_REQUEST = "CUSTOM_CAL_SCREEN/REQUIRED_CALORIES_REQUEST"
const REQUIRED_CALORIES_SUCCESS = "CUSTOM_CAL_SCREEN/REQUIRED_CALORIES_SUCCESS"
const REQUIRED_CALORIES_FAILURE = "CUSTOM_CAL_SCREEN/REQUIRED_CALORIES_FAILURE"
const initialState = {
  requesting: false,
  getCalories: false,
  getCaloeriesError: false,

  mealRequesting: false,
  meals: [],
  mealsError: false,

  rCalRequest: false,
  requiredCalories: false,
  requiredCalError: false,
  mealsHistory: false
}

//Actions
export const getCustomCalRequest = data => ({
  type: GET_CALORIES_REQUEST,
  data
})

export const getCustomCalSuccess = data => ({
  type: GET_CALORIES_SUCCESS,
  data
})

export const getCustomCalFailure = error => ({
  type: GET_CALORIES_FAILURE,
  error
})

export const getMealsRequest = () => ({
  type: GET_MEALS_REQUEST
})

export const getMealsSuccess = data => ({
  type: GET_MEALS_SUCCESS,
  data
})

export const getMealsHistoryRequest = () => ({
  type: GET_MEALS_HISTORY_REQUEST
})

export const getMealsHistorySuccess = data => ({
  type: GET_MEALS_HISTORY_SUCCESS,
  data
})

export const postRequiredCalRequest = (data) => ({
  type: REQUIRED_CALORIES_REQUEST,
  data
})

export const postRequiredCalSuccess = data => ({
  type: REQUIRED_CALORIES_SUCCESS,
  data
})

export const postRequiredCalFailure = error => ({
  type: REQUIRED_CALORIES_FAILURE,
  error
})

//Reducers
export const customCalReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CALORIES_REQUEST:
      return {
        ...state,
        requesting: true
      }
    case GET_CALORIES_SUCCESS:
      return {
        ...state,
        getCalories: action.data,
        requesting: false
      }
    case GET_CALORIES_FAILURE:
      return {
        ...state,
        getCaloeriesError: action.error,
        requesting: false
      }

    case GET_MEALS_REQUEST:
    case GET_MEALS_HISTORY_REQUEST:
      return {
        ...state,
        mealRequesting: true
      }
    case GET_MEALS_SUCCESS:
      return {
        ...state,
        meals: action.data,
        mealRequesting: false
      }

    case GET_MEALS_HISTORY_SUCCESS:
      return {
        ...state,
        mealsHistory: action.data,
        mealRequesting: false
      }

    case REQUIRED_CALORIES_REQUEST:
      return {
        ...state,
        rCalRequest: true
      }
    case REQUIRED_CALORIES_SUCCESS:
      return {
        ...state,
        requiredCalories: action.data,
        rCalRequest: false
      }
    case REQUIRED_CALORIES_FAILURE:
      return {
        ...state,
        requiredCalError: action.error,
        rCalRequest: false
      }

    default:
      return state
  }
}

//Saga
async function postCustomAPI(data) {
  const URL = `${API_URL}/consume-calories/`
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

async function getCustomCalAPI() {
  const newDate = moment(new Date()).format("YYYY-MM-DD")
  const URL = `${API_URL}/consume-calories/?date=${newDate}`
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

function* getCustomCal({ data }) {
  try {
    if (data) {
      const response = yield call(postCustomAPI, data)

      yield put(getCustomCalSuccess(response.data))
    } else {
      const response = yield call(getCustomCalAPI)
      yield put(getCustomCalSuccess(response.data))
    }
  } catch (e) {
    yield put(getCustomCalFailure(e))
  }
}

//Saga
async function getMealsAPI() {
  const URL = `${API_URL}/meal/`
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

function* getMeals() {
  try {
    const response = yield call(getMealsAPI)
    yield put(getMealsSuccess(response.data))
  } catch (e) {
    yield put(getMealsSuccess(false))
  }
}

async function getMealsHistoryAPI() {
  const URL = `${API_URL}/meal/history/`
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

function* getMealsHistiry() {
  try {
    const response = yield call(getMealsHistoryAPI)
    yield put(getMealsHistorySuccess(response.data))
  } catch (e) {
    yield put(getMealsHistorySuccess(false))
  }
}

async function postRequiredCalAPI(id, data) {
  const URL = `${API_URL}/calories-required/${id}/`
  const token = await AsyncStorage.getItem("authToken")
  const options = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token  ${token}`
    },
    data: data
  }

  return XHR(URL, options)
}

function* postRequiredCal({ data }) {
  try {
    const response = yield call(postRequiredCalAPI, data.id, data.param)
    yield put(postRequiredCalSuccess(response.data))
    navigate("CustomCalories")
  } catch (e) {
    data.callBackAction(e?.response?.data || "Something went wrong")
    yield put(postRequiredCalFailure(e))
  }
}

export default all([
  takeLatest(REQUIRED_CALORIES_REQUEST, postRequiredCal),
  takeLatest(GET_CALORIES_REQUEST, getCustomCal),
  takeLatest(GET_MEALS_REQUEST, getMeals),
  takeLatest(GET_MEALS_HISTORY_REQUEST, getMealsHistiry)
])
