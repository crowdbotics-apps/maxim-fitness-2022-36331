import { all, call, put, takeLatest } from 'redux-saga/effects';
import AsyncStorage from '@react-native-async-storage/async-storage';

// config
import { API_URL } from '../config/app';

// utils
import XHR from 'src/utils/XHR';

//Types
const GET_PLAN_REQUEST = 'SUBSCRIPTION_SCREEN/GET_PLAN_REQUEST';
const GET_PLAN_SUCCESS = 'SUBSCRIPTION_SCREEN/GET_PLAN_SUCCESS';
const GET_PLAN_FAILURE = 'SUBSCRIPTION_SCREEN/GET_PLAN_FAILURE';

const GET_CUSTOMERID_REQUEST = 'SUBSCRIPTION_SCREEN/GET_CUSTOMERID_REQUEST';
const GET_CUSTOMERID_SUCCESS = 'SUBSCRIPTION_SCREEN/GET_CUSTOMERID_SUCCESS';
const GET_CUSTOMERID_FAILURE = 'SUBSCRIPTION_SCREEN/GET_CUSTOMERID_FAILURE';

const POST_SUBSCRIPTION_REQUEST = 'SUBSCRIPTION_SCREEN/POST_SUBSCRIPTION_REQUEST';
const POST_SUBSCRIPTION_SUCCESS = 'SUBSCRIPTION_SCREEN/POST_SUBSCRIPTION_SUCCESS';
const POST_SUBSCRIPTION_FAILURE = 'SUBSCRIPTION_SCREEN/POST_SUBSCRIPTION_FAILURE';

const initialState = {
  requesting: false,
  getPlanSuccess: false,
  getPlanFailure: false,

  cIRequesting: false,
  getCISuccess: false,
  getCIFailure: false,

  SRequesting: false,
  getSubscription: false,
  getSubscriptionError: false,
}

//Actions
export const getPlanRequest = data => ({
  type: GET_PLAN_REQUEST,
  data
})

export const getPlanSuccess = data => ({
  type: GET_PLAN_SUCCESS,
  data
})

export const getPlanFailure = error => ({
  type: GET_PLAN_FAILURE,
  error
})

export const getCustomerIdRequest = data => ({
  type: GET_CUSTOMERID_REQUEST,
  data
})

export const getCustomerIdSuccess = data => ({
  type: GET_CUSTOMERID_SUCCESS,
  data
})

export const getCustomerIdFailure = error => ({
  type: GET_CUSTOMERID_FAILURE,
  error
})

export const postSubscriptionRequest = data => ({
  type: POST_SUBSCRIPTION_REQUEST,
  data
})

export const postSubscriptionSuccess = data => ({
  type: POST_SUBSCRIPTION_SUCCESS,
  data
})

export const postSubscriptionFailure = error => ({
  type: POST_SUBSCRIPTION_FAILURE,
  error
})

//Reducers
export const subscriptionReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PLAN_REQUEST:
      return {
        ...state,
        requesting: true
      }

    case GET_PLAN_SUCCESS:
      return {
        ...state,
        getPlanSuccess: action.data,
        requesting: false
      }
    case GET_PLAN_FAILURE:
      return {
        ...state,
        getPlanFailure: action.error,
        requesting: false
      }

    case GET_CUSTOMERID_REQUEST:
      return {
        ...state,
        requesting: true
      }

    case GET_CUSTOMERID_SUCCESS:
      return {
        ...state,
        getCISuccess: action.data,
        requesting: false
      }
    case GET_CUSTOMERID_FAILURE:
      return {
        ...state,
        getCIFailure: action.error,
        requesting: false
      }

    case POST_SUBSCRIPTION_REQUEST:
      return {
        ...state,
        requesting: true
      }

    case POST_SUBSCRIPTION_SUCCESS:
      return {
        ...state,
        getSubscription: action.data,
        requesting: false
      }
    case POST_SUBSCRIPTION_FAILURE:
      return {
        ...state,
        getSubscriptionError: action.error,
        requesting: false
      }

    default:
      return state
  }
}

//Saga
async function getPlanAPI() {
  const URL = `${API_URL}/payment/get_plans/`
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

function* getFeeds() {
  try {
    const response = yield call(getPlanAPI)
    console.log('PLANE RESPONSE: ', response);
    yield put(getPlanSuccess(response.data.data))
  } catch (e) {
    console.log('PLANE ERROR: ', e);
    yield put(getPlanFailure(e))
  }
}

//Saga
async function getCustomerIdAPI() {
  const URL = `${API_URL}/payment/get_customer_id/`
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

function* getCustomerId() {
  try {
    const response = yield call(getCustomerIdAPI)
    console.log('GET CUSTOMER ID RESPONSE: ', response);
    yield put(getCustomerIdSuccess(response.data.data))
  } catch (e) {
    console.log('GET CUSTOMER ID ERROR: ', e);
    yield put(getCustomerIdFailure(e))
  }
}

//Saga
async function postSubscriptionAPI(data) {
  const URL = `${API_URL}/payment/create_subscription/`
  const token = await AsyncStorage.getItem('authToken')
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token  ${token}`
    },
    data
  }
  return XHR(URL, options)
}

function* postSubscription({ data }) {
  console.log("subscription data: ", data);
  try {
    const response = yield call(postSubscriptionAPI, data)
    console.log('SUBSCRIPTION RESPONSE: ', response);
    yield put(postSubscriptionSuccess(response.data.data))
  } catch (e) {
    console.log('SUBSCRIPTION ERROR: ', e);
    yield put(postSubscriptionFailure(e))
  }
}

export default all([
  takeLatest(GET_PLAN_REQUEST, getFeeds),
  takeLatest(GET_CUSTOMERID_REQUEST, getCustomerId),
  takeLatest(POST_SUBSCRIPTION_REQUEST, postSubscription),
])
