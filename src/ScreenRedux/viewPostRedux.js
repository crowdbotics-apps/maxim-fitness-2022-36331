import { all, call, put, takeLatest } from "redux-saga/effects"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { showMessage } from "react-native-flash-message"

// config
import { API_URL } from "../config/app"

// utils
import XHR from "src/utils/XHR"
import { navigate } from "../navigation/NavigationService"
// import { errorAlert } from "src/utils/alerts"

//Types
const VIEW_POST = "FEEDS_SCREEN/VIEW_POST"
const VIEW_POST_SUCCESS = "FEEDS_SCREEN/VIEW_POST_SUCCESS"
const RESET_VIEW_POST = "FEEDS_SCREEN/RESET_VIEW_POST"

const REPLY_COMMENT = "FEEDS_SCREEN/REPLY_COMMENT"
const LIKE_COMMENT = "FEEDS_SCREEN/LIKE_COMMENT"

const initialState = {
  requesting: false,
  postData: false
}

//Actions
export const getPost = (data, isTrue) => ({
  type: VIEW_POST,
  data,
  isTrue
})

export const getPostSuccess = data => ({
  type: VIEW_POST_SUCCESS,
  data
})

export const resetViewPost = error => ({
  type: RESET_VIEW_POST,
  error
})

export const replyComment = (data, subCommentData, callBack) => ({
  type: REPLY_COMMENT,
  data,
  subCommentData,
  callBack
})

export const likeComment = data => ({
  type: LIKE_COMMENT,
  data
})

//Reducers
export const postReducer = (state = initialState, action) => {
  switch (action.type) {
    case VIEW_POST:
      return {
        ...state,
        requesting: true
      }

    case VIEW_POST_SUCCESS:
      return {
        ...state,
        postData: action.data,
        requesting: false
      }
    case RESET_VIEW_POST:
      return {
        ...state,
        requesting: false
      }

    default:
      return state
  }
}

//Saga
async function getPostAPI(data) {
  const URL = `${API_URL}/post/${data}/`
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

function* getPostData({ data, isTrue }) {
  try {
    const response = yield call(getPostAPI, data)
    yield put(getPostSuccess(response.data))
    if (isTrue) {
      navigate("ViewPost", response.data)
    }
  } catch (e) {
    const { response } = e
    yield put(resetViewPost())
  }
}

async function replyCommentAPI(data) {
  const URL = `${API_URL}/comment-reply/`
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

function* replyCommentData({ data, subCommentData, callBack }) {
  try {
    const response = yield call(replyCommentAPI, data)
    subCommentData.subComment = subCommentData?.subComment?.length
      ? [...subCommentData.subComment, response.data]
      : [response.data]
    callBack(true)
    // setSubCommentData(response.data)
  } catch (e) {
    const { response } = e
  } finally {
    yield put(resetViewPost())
  }
}

async function likeCommentAPI(data) {
  const URL = `${API_URL}/comment-like/`
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

function* likeCommentData({ data }) {
  try {
    const response = yield call(likeCommentAPI, data)
  } catch (e) {
    const { response } = e
  }
}

export default all([
  takeLatest(VIEW_POST, getPostData),
  takeLatest(REPLY_COMMENT, replyCommentData),
  takeLatest(LIKE_COMMENT, likeCommentData)
])
