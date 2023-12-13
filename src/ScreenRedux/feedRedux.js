import { all, call, put, takeLatest } from "redux-saga/effects"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { showMessage } from "react-native-flash-message"

// config
import { API_URL } from "../config/app"

// utils
import XHR from "src/utils/XHR"

//Types
const FEEDS_REQUEST = "FEEDS_SCREEN/FEEDS_REQUEST"
const FEEDS_SUCCESS = "FEEDS_SCREEN/FEEDS_SUCCESS"
const FEEDS_FAILURE = "FEEDS_SCREEN/FEEDS_FAILURE"

const LIKE_REQUEST = "FEEDS_SCREEN/LIKE_REQUEST"
const LIKE_SUCCESS = "FEEDS_SCREEN/LIKE_SUCCESS"
const LIKE_FAILURE = "FEEDS_SCREEN/LIKE_FAILURE"

const REPORT_REQUEST = "FEEDS_SCREEN/REPORT_REQUEST"
const REPORT_SUCCESS = "FEEDS_SCREEN/REPORT_SUCCESS"

const POST_DELETE_REQUEST = "FEEDS_SCREEN/POST_DELETE_REQUEST"
const POST_DELETE_SUCCESS = "FEEDS_SCREEN/POST_DELETE_SUCCESS"

const initialState = {
  requesting: false,
  feeds: false,
  feedError: false,
  loading: false,
  likeSuccess: false,
  feedError: false,
  loading: false
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

export const postLikeRequest = data => ({
  type: LIKE_REQUEST,
  data
})

export const postLikeSuccess = data => ({
  type: LIKE_SUCCESS,
  data
})

export const postLikeFailure = error => ({
  type: LIKE_FAILURE,
  error
})

export const postReportRequest = (data, callback) => ({
  type: REPORT_REQUEST,
  data,
  callback
})

export const postReportSuccess = () => ({
  type: REPORT_SUCCESS
})

export const postDeleteRequest = id => ({
  type: POST_DELETE_REQUEST,
  id
})

//Reducers
export const feedsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FEEDS_REQUEST:
      return {
        ...state,
        requesting: true
      }

    case REPORT_REQUEST:
      return {
        ...state,
        loading: true
      }

    case REPORT_SUCCESS:
      return {
        ...state,
        loading: false
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

    case LIKE_REQUEST:
      return {
        ...state,
        loading: true
      }

    case LIKE_SUCCESS:
      return {
        ...state,
        likeSuccess: action.data,
        loading: false
      }
    case LIKE_FAILURE:
      return {
        ...state,
        likeError: action.error,
        loading: false
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
  const URL = `${API_URL}/post/?page=${page}&limit=${limit}&offset=${offset}`
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

function* getFeeds({ data }) {
  try {
    const response = yield call(getFeedAPI, data)
    yield put(getFeedsSuccess(response.data))
  } catch (e) {
    const { response } = e
    yield put(getFeedsFailure(e))
  }
}

async function postLikeAPI(feedId) {
  const token = await AsyncStorage.getItem("authToken")
  const URL = `${API_URL}/post/${feedId}/add_like/`
  const options = {
    headers: {
      Accept: "application/json",
      Authorization: `Token ${token}`
    },
    method: "POST"
  }
  return XHR(URL, options)
}

function* postLike({ data }) {
  let feedId = data.feedId
  try {
    const response = yield call(postLikeAPI, feedId)
    console.log("Like RESPONSE: ", response)
    yield put(postLikeSuccess(response))
    data.callBack(true)
  } catch (error) {
    console.log("Like Error: ", error)
    yield put(postLikeFailure(error))
  }
}

async function postReportAPI(data) {
  const token = await AsyncStorage.getItem("authToken")
  const URL = `${API_URL}/report-post/`
  const options = {
    headers: {
      Accept: "application/json",
      Authorization: `Token ${token}`
    },
    method: "POST",
    data
  }
  return XHR(URL, options)
}

function* postReport({ data, callback }) {
  try {
    const response = yield call(postReportAPI, data)
    if (callback) {
      callback()
    }
    if (response?.data?.is_report) {
      showMessage({ message: "This post is already reported", type: "danger" })
    } else {
      showMessage({ message: "Report successfully submitted", type: "success" })
    }

    yield put(postReportSuccess())
  } catch (error) {
    yield put(postReportSuccess())
    // yield put(postLikeFailure(error));
  }
}

async function postDeleteAPI(id) {
  const token = await AsyncStorage.getItem("authToken")
  const URL = `${API_URL}/post/${id}/`
  const options = {
    headers: {
      Accept: "application/json",
      Authorization: `Token ${token}`
    },
    method: "DELETE"
  }
  return XHR(URL, options)
}

function* postDelete({ id }) {
  try {
    const response = yield call(postDeleteAPI, id)
    showMessage({ message: "Post remove successfully", type: "success" })
    yield put(getFeedsRequest(1))
    // callback();
  } catch (error) {
    // yield put(postReportSuccess());
    // yield put(postLikeFailure(error));
  }
}

export default all([
  takeLatest(FEEDS_REQUEST, getFeeds),
  takeLatest(LIKE_REQUEST, postLike),
  takeLatest(REPORT_REQUEST, postReport),
  takeLatest(POST_DELETE_REQUEST, postDelete)
])
