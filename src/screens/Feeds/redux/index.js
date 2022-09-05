import {all, call, put, takeLatest} from "redux-saga/effects"
import AsyncStorage from "@react-native-async-storage/async-storage"
import {showMessage} from "react-native-flash-message"

// config
import {APP_URL} from "../../../config/app"

// utils
import XHR from "src/utils/XHR"
// import { errorAlert } from "src/utils/alerts"

//Types
const FEEDS_REQUEST = "FEEDS_SCREEN/FEEDS_REQUEST"
const FEEDS_SUCCESS = "FEEDS_SCREEN/FEEDS_SUCCESS"
const FEEDS_FAILURE = "FEEDS_SCREEN/FEEDS_FAILURE"

const initialState = {
  requesting: false,
  feeds: false,
  feedError: false
}

//Actions
export const getFeedsRequest = data => ({
  type: FEEDS_REQUEST,
  data
})

export const getFeedsSuccess = data => ({
  type: FEEDS_SUCCESS,
  data
})

export const getFeedsFailure = error => ({
  type: FEEDS_FAILURE,
  error
})

//Reducers
export const feedsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FEEDS_REQUEST:
      return {
        ...state,
        requesting: true
      }

    case FEEDS_SUCCESS:
      return {
        ...state,
        feeds: action.data,
        requesting: false
      }
    case FEEDS_FAILURE:
      return {
        ...state,
        feedsError: action.error,
        requesting: false
      }

    default:
      return state
  }
}

//Saga
async function getFeedAPI(data) {
  const page = data
  const limit = 10
  const offset = 0
  const URL = `${APP_URL}/post/?page=${page}&limit=${limit}&offset=${offset}`
  const token = await AsyncStorage.getItem("authToken")
  const options = {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token  ${token}`
    }
  }

  return XHR(URL, options)
}

function* getFeeds({data}) {
  try {
    const response = yield call(getFeedAPI, data)
    console.log('FEEDS RESPONSE: ', response);
    yield put(getFeedsSuccess(response.data))
  } catch (e) {
    const {response} = e
    console.log('FEEDS ERROR: ', e);
    yield put(getFeedsFailure(e))
  }
}

export default all([
  takeLatest(FEEDS_REQUEST, getFeeds)
])
