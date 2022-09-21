import { all, call, put, takeLatest } from 'redux-saga/effects';
import AsyncStorage from '@react-native-async-storage/async-storage';

// config
import { API_URL } from '../config/app';

// utils
import XHR from 'src/utils/XHR';

//Types
const GET_CALORIES_REQUEST = 'CUSTOM_CAL_SCREEN/GET_CALORIES_REQUEST';
const GET_CALORIES_SUCCESS = 'CUSTOM_CAL_SCREEN/GET_CALORIES_SUCCESS';
const GET_CALORIES_FAILURE = 'CUSTOM_CAL_SCREEN/GET_CALORIES_FAILURE';

const GET_MEALS_REQUEST = 'CUSTOM_CAL_SCREEN/GET_MEALS_REQUEST';
const GET_MEALS_SUCCESS = 'CUSTOM_CAL_SCREEN/GET_MEALS_SUCCESS';
const GET_MEALS_FAILURE = 'CUSTOM_CAL_SCREEN/GET_MEALS_FAILURE';

const initialState = {
  requesting: false,
  getCalories: false,
  getCaloeriesError: false,

  meals: [],
  mealsError: false
}

//Actions
export const getCustomCalRequest = () => ({
  type: GET_CALORIES_REQUEST,
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
  type: GET_MEALS_REQUEST,
})

export const getMealsSuccess = data => ({
  type: GET_MEALS_SUCCESS,
  data
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
      return {
        ...state,
        requesting: true
      }
    case GET_MEALS_SUCCESS:
      return {
        ...state,
        meals: action.data,
        requesting: true,
      }

    default:
      return state
  }
}

//Saga
async function getCustomCalAPI() {
  const URL = `${API_URL}/consume-calories/`
  const token = await AsyncStorage.getItem('authToken')
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token  ${token}`
    }
  }

  return XHR(URL, options)
}

function* getCustomCal() {
  try {
    const response = yield call(getCustomCalAPI)
    console.log('CAL RESPONSE: ', response);
    yield put(getCustomCalSuccess(response.data))
  } catch (e) {
    console.log('CAL ERROR: ', e);
    yield put(getCustomCalFailure(e))
  }
}

//Saga
async function getMealsAPI() {
  const URL = `${API_URL}/meal/`
  const token = await AsyncStorage.getItem('authToken')
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token  ${token}`
    }
  }

  return XHR(URL, options)
}

function* getMeals() {
  try {
    const response = yield call(getMealsAPI)
    console.log('MEALS RESPONSE: ', response);
    yield put(getMealsSuccess(response.data))
  } catch (e) {
    console.log('MEALS ERROR: ', e);
    yield put(getMealsSuccess(false))
  }
}

export default all([
  takeLatest(GET_CALORIES_REQUEST, getCustomCal),
  takeLatest(GET_MEALS_REQUEST, getMeals),
])
