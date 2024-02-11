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

const ADD_COMMENT = "FEEDS_SCREEN/ADD_COMMENT"
const ADD_COMMENT_SUCCESS = "FEEDS_SCREEN/ADD_COMMENT_SUCCESS"

const REPORT_REQUEST = "FEEDS_SCREEN/REPORT_REQUEST"
const REPORT_SUCCESS = "FEEDS_SCREEN/REPORT_SUCCESS"

const COMMENT_REPORT_REQUEST = "FEEDS_SCREEN/COMMENT_REPORT_REQUEST"
const COMMENT_DELETE_REQUEST = "FEEDS_SCREEN/COMMENT_DELETE_REQUEST"

const COMMENT_REPLY_DELETE_REQUEST = "FEEDS_SCREEN/COMMENT_REPLY_DELETE_REQUEST"

const POST_DELETE_REQUEST = "FEEDS_SCREEN/POST_DELETE_REQUEST"
const POST_DELETE_SUCCESS = "FEEDS_SCREEN/POST_DELETE_SUCCESS"

const initialState = {
  requesting: false,
  feeds: false,
  feedError: false,
  loading: false,
  likeSuccess: false,
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

export const addComment = (data, postData, callBack) => ({
  type: ADD_COMMENT,
  data,
  postData,
  callBack
})

export const addCommentSuccess = data => ({
  type: ADD_COMMENT_SUCCESS,
  data
})

export const postReportRequest = (data, callback) => ({
  type: REPORT_REQUEST,
  data,
  callback
})

export const postReportSuccess = () => ({
  type: REPORT_SUCCESS
})

export const postCommentReportRequest = (data, callback, isReply) => ({
  type: COMMENT_REPORT_REQUEST,
  data,
  callback,
  isReply
})

export const postCommentDelete = (data, callBack, isReply) => ({
  type: COMMENT_DELETE_REQUEST,
  data,
  callBack,
  isReply
})
export const postCommentReplyDelete = (id, callBack) => ({
  type: COMMENT_REPLY_DELETE_REQUEST,
  id,
  callBack
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
    case COMMENT_DELETE_REQUEST:
      return {
        ...state,
        requesting: true
      }

    case REPORT_REQUEST:
    case COMMENT_REPORT_REQUEST:
      return {
        ...state,
        loading: true
      }

    case REPORT_SUCCESS:
      return {
        ...state,
        loading: false,
        requesting: false
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
    case ADD_COMMENT_SUCCESS:
      return {
        ...state,
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
    yield put(postLikeSuccess(response))
    data.callBack(true)
  } catch (error) {
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

async function addCommentAPI(data) {
  const URL = `${API_URL}/post/${data.id}/add_comment/`
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

function* addCommentData({ data, postData, callBack }) {
  try {
    const response = yield call(addCommentAPI, data)
    postData.comments = [response.data, ...postData.comments]
    yield put(addCommentSuccess(response?.data))
    callBack(true, response?.data)
  } catch (e) {
    const { response } = e
  } finally {
    yield put(addCommentSuccess(""))
  }
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

async function postCommentReportAPI(data, isReply) {
  const token = await AsyncStorage.getItem("authToken")
  const replyURL = `${API_URL}/report-reply-comment/`
  const commentURL = `${API_URL}/report-comment/`
  const options = {
    headers: {
      Accept: "application/json",
      Authorization: `Token ${token}`
    },
    method: "POST",
    data
  }
  return XHR(isReply ? replyURL : commentURL, options)
}

function* postCommentReport({ data, callback, isReply }) {
  try {
    const response = yield call(postCommentReportAPI, data, isReply)
    if (callback) {
      callback()
    }
    if (response?.data?.is_report) {
      showMessage({
        message: `This ${isReply ? "reply" : "comment"} is already reported`,
        type: "danger"
      })
    } else {
      showMessage({ message: "Report successfully submitted", type: "success" })
    }

    yield put(postReportSuccess())
  } catch (error) {
    yield put(postReportSuccess())
    // yield put(postLikeFailure(error));
  }
}

async function commentDeleteAPI(data, isReply) {
  const token = await AsyncStorage.getItem("authToken")
  const repyURL = `${API_URL}/comment-reply/${data}/`
  const commentURL = `${API_URL}/comment/${data?.id}/`
  const options = {
    headers: {
      Accept: "application/json",
      Authorization: `Token ${token}`
    },
    method: "DELETE",
    data
  }
  return XHR(isReply ? repyURL : commentURL, options)
}

function* commentDelete({ data, callBack, isReply }) {
  try {
    const response = yield call(commentDeleteAPI, data, isReply)
    showMessage({
      message: `${isReply ? "Reply" : "Comment"} remove successfully`,
      type: "success"
    })
    callBack()
    yield put(postReportSuccess())
  } catch (error) {
    yield put(postReportSuccess())
  }
}

export default all([
  takeLatest(FEEDS_REQUEST, getFeeds),
  takeLatest(ADD_COMMENT, addCommentData),
  takeLatest(LIKE_REQUEST, postLike),
  takeLatest(REPORT_REQUEST, postReport),
  takeLatest(POST_DELETE_REQUEST, postDelete),
  takeLatest(COMMENT_REPORT_REQUEST, postCommentReport),
  takeLatest(COMMENT_DELETE_REQUEST, commentDelete)
])
