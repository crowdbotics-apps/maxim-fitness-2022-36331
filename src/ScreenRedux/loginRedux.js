import { all, call, put, takeLatest } from 'redux-saga/effects';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigate } from '../navigation/NavigationService';
import { showMessage } from 'react-native-flash-message';

// config
import { API_URL } from '../config/app';

// utils
import XHR from 'src/utils/XHR';
// import { errorAlert } from "src/utils/alerts"

//Types
const LOGIN = 'SCREEN/LOGIN';
const FACEBOOK_LOGIN = 'SCREEN/FACEBOOK_LOGIN';
const GOOGLE_LOGIN = 'SCREEN/GOOGLE_LOGIN';
const SET_ACCESS_TOKEN = 'SCREEN/SET_ACCESS_TOKEN';
const SET_USER_DETAIL = 'SCREEN/SET_USER_DETAIL';
const RESET = 'SCREEN/RESET';

const initialState = {
  requesting: false,
  userDetail: false,
  accessToken: false,
  googleRequesting: false,
  faceBookRequesting: false,
}

//Actions
export const loginUser = data => ({
  type: LOGIN,
  data
})

export const facebookLoginUser = data => ({
  type: FACEBOOK_LOGIN,
  data
})

export const googleLoginUser = data => ({
  type: GOOGLE_LOGIN,
  data
})

export const setAccessToken = accessToken => ({
  type: SET_ACCESS_TOKEN,
  accessToken
})

export const setUserDetail = data => ({
  type: SET_USER_DETAIL,
  data
})

export const reset = () => ({
  type: RESET
})

//Reducers
export const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        requesting: true
      }
    case GOOGLE_LOGIN:
      return {
        ...state,
        googleRequesting: true
      }

    case FACEBOOK_LOGIN:
      return {
        ...state,
        faceBookRequesting: true
      }
    case SET_ACCESS_TOKEN:
      return {
        ...state,
        accessToken: action.accessToken,
        requesting: false
      }
    case SET_USER_DETAIL:
      return {
        ...state,
        userDetail: action.data,
        requesting: false
      }

    case RESET:
      return {
        ...state,
        requesting: false,
        googleRequesting: false,
        faceBookRequesting: false
      }

    default:
      return state
  }
}

//Saga
function loginAPI(data) {
  const URL = `${API_URL}/login/`
  const options = {
    method: 'POST',
    data
  }

  return XHR(URL, options)
}

function* login({ data }) {
  try {
    const response = yield call(loginAPI, data)
    AsyncStorage.setItem('authToken', response.data.token)
    yield put(setUserDetail(response.data.user))
    yield put(setAccessToken(response.data.token))
    // if(response?.data?.subscription === false){
    //   navigate('Subscription')
    // }
    // else{
    //   yield put(setAccessToken(response.data.token))
    //   showMessage({
    //     message: 'Login successfully',
    //     type: 'success',
    //   })
    // }
  } catch (e) {
    const { response } = e
    console.log('error response---', response);
    showMessage({
      message: 'Unable to log in with provided credentials.',
      type: 'danger',
    })
  } finally {
    yield put(reset())
  }
}

function facebookLoginAPI(data) {
  const URL = `${API_URL}/login/facebook/`
  const options = {
    method: 'POST',
    data
  }
  return XHR(URL, options)
}

function* facebookLogin({ data }) {
  try {
    const res = yield call(facebookLoginAPI, data)
    console.log('facebook login success response0000', res);
    AsyncStorage.setItem('authToken', res.data.key)
    yield put(setAccessToken(res.data.key))
    yield put(setUserDetail(res.data.user_detail))
    showMessage({
      message: 'Facebook login successfully',
      type: 'success',
    })
  } catch (e) {
    const { response } = e
    console.log('facebook login error response----', response);
    yield put(reset())
    showMessage({
      message: 'Something want wronge',
      type: 'danger',
    })
  }
}

function googleLoginAPI(data) {
  console.log('accessToken----- in saga', data);
  const URL = `${API_URL}/login/google/`
  const options = {
    method: 'POST',
    data
  }

  return XHR(URL, options)
}

function* googleLogin({ data }) {
  console.log('google data inn saga0000', data);
  try {
    const res = yield call(googleLoginAPI, data)
    console.log('google login successs response----', res);
    AsyncStorage.setItem('authToken', res.data.key)

    yield put(setAccessToken(res.data.key))
    yield put(setUserDetail(res.data.user_detail))
    showMessage({
      message: 'Google login successfully',
      type: 'success',
    })
  } catch (e) {
    const { response } = e
    console.log('google login error response---', response);
  } finally {
    yield put(reset())
  }
}

export default all([
  takeLatest(LOGIN, login),
  takeLatest(FACEBOOK_LOGIN, facebookLogin),
  takeLatest(GOOGLE_LOGIN, googleLogin)
])
