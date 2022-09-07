import {all, call, put, takeLatest} from 'redux-saga/effects';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showMessage} from 'react-native-flash-message';

// config
import {API_URL} from '../config/app'

// utils
import XHR from 'src/utils/XHR';
// import { errorAlert } from "src/utils/alerts"

//Types
const VIEW_POST = 'FEEDS_SCREEN/VIEW_POST';
const VIEW_POST_SUCCESS = 'FEEDS_SCREEN/VIEW_POST_SUCCESS';
const RESET_VIEW_POST = 'FEEDS_SCREEN/RESET_VIEW_POST';

const ADD_COMMENT = 'FEEDS_SCREEN/ADD_COMMENT';
const ADD_COMMENT_SUCCESS = 'FEEDS_SCREEN/ADD_COMMENT_SUCCESS';

const REPLY_COMMENT = 'FEEDS_SCREEN/REPLY_COMMENT';
const LIKE_COMMENT = 'FEEDS_SCREEN/LIKE_COMMENT';

const initialState = {
  requesting: false,
  postData: false,
}

//Actions
export const getPost = data => ({
  type: VIEW_POST,
  data
})

export const getPostSuccess = data => ({
  type: VIEW_POST_SUCCESS,
  data
})

export const resetViewPost = error => ({
  type: RESET_VIEW_POST,
  error
})

export const addComment = (data, setNewCommentData) => ({
  type: ADD_COMMENT,
  data,
  setNewCommentData
})

export const addCommentSuccess = data => ({
  type: ADD_COMMENT_SUCCESS,
  data
})

export const replyComment = data => ({
  type: REPLY_COMMENT,
  data
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

function* getPostData({data}) {
  try {
    const response = yield call(getPostAPI, data)
    console.log('get feeds success response----', response);
    yield put(getPostSuccess(response.data))
  } catch (e) {
    const {response} = e
    console.log('get post failure response0000', response);
  } finally {
    yield put(resetViewPost())
  }
}

async function addCommentAPI(data) {
  const URL = `${API_URL}/post/${data.id}/add_comment/`
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

function* addCommentData({data, setNewCommentData}) {
  try {
    const response = yield call(addCommentAPI, data)
    setNewCommentData(response.data)
  } catch (e) {
    const {response} = e
  } finally {
    yield put(resetViewPost())
  }
}

async function replyCommentAPI(data) {
  const URL = `${API_URL}/comment-reply/`
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

function* replyCommentData({data}) {
  console.log('reply comment data-----', data);
  try {
    const response = yield call(replyCommentAPI, data)
    console.log('reply comment success response----', response);
    // yield put(getPostSuccess(response.data))
  } catch (e) {
    const {response} = e
    console.log('reply comment failure response----', response);
  } finally {
    yield put(resetViewPost())
  }
}

async function likeCommentAPI(data) {
  const URL = `${API_URL}/comment-like/`
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

function* likeCommentData({data}) {
  try {
    const response = yield call(likeCommentAPI, data)
    console.log('like comment success response-----', response);
  } catch (e) {
    const {response} = e
    console.log('like comment failure response----', response);
  }
}

export default all([
  takeLatest(VIEW_POST, getPostData),
  takeLatest(ADD_COMMENT, addCommentData),
  takeLatest(REPLY_COMMENT, replyCommentData),
  takeLatest(LIKE_COMMENT, likeCommentData),
])
