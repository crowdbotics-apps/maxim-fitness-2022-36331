import { all, call, put, takeLatest } from 'redux-saga/effects';
import AsyncStorage from '@react-native-async-storage/async-storage';

// config
import { API_URL } from '../config/app';

// utils
import XHR from 'src/utils/XHR';

//Types
const FEEDS_REQUEST = 'FEEDS_SCREEN/FEEDS_REQUEST';
const FEEDS_SUCCESS = 'FEEDS_SCREEN/FEEDS_SUCCESS';
const FEEDS_FAILURE = 'FEEDS_SCREEN/FEEDS_FAILURE';

const LIKE_REQUEST = 'FEEDS_SCREEN/LIKE_REQUEST';
const LIKE_SUCCESS = 'FEEDS_SCREEN/LIKE_SUCCESS';
const LIKE_FAILURE = 'FEEDS_SCREEN/LIKE_FAILURE';

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

function* getFeeds({ data }) {
  try {
    const response = yield call(getFeedAPI, data)
    console.log('FEEDS RESPONSE: ', response);
    yield put(getFeedsSuccess(response.data))
  } catch (e) {
    const { response } = e
    console.log('FEEDS ERROR: ', e);
    yield put(getFeedsFailure(e))
  }
}

async function postLikeAPI(feedId) {
  const token = await AsyncStorage.getItem('authToken')
  const URL = `${API_URL}/post/${feedId}/add_like/`;
  const options = {
    headers: {
      Accept: 'application/json',
      Authorization: `Token ${token}`,
    },
    method: 'POST'
  };
  return XHR(URL, options);
}

function* postLike({ data }) {
  let feedId = data.feedId;
  try {
    const response = yield call(postLikeAPI, feedId);
    console.log('Like RESPONSE: ', response);
    yield put(postLikeSuccess(response));
    data.callBack(true);
  } catch (error) {
    console.log('Like Error: ', error);
    yield put(postLikeFailure(error));
  }
}

export default all([takeLatest(FEEDS_REQUEST, getFeeds), takeLatest(LIKE_REQUEST, postLike)])
