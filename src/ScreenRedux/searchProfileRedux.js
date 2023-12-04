import { all, call, put, takeLatest } from 'redux-saga/effects';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setUserDetail } from './loginRedux'
import { showMessage } from 'react-native-flash-message';

// config
import { API_URL } from '../config/app'

// utils
import XHR from 'src/utils/XHR';
// import { errorAlert } from "src/utils/alerts"

//Types
const GET_USER = 'SEARCH_SCREEN/GET_USER';
const GET_USER_SUCCESS = 'SEARCH_SCREEN/GET_USER_SUCCESS';
const GET_USER_RESET = 'SEARCH_SCREEN/GET_USER_RESET';
const CHAT_USER_DATA = 'SEARCH_SCREEN/CHAT_USER_DATA'

const initialState = {
  requesting: false,
  profileUserData: false,
  chatUserData: false
}

//Actions
export const getUserProfile = data => ({
  type: GET_USER,
  data
})

export const getUserProfileSuccess = data => ({
  type: GET_USER_SUCCESS,
  data
})

export const resetUserProfile = () => ({
  type: GET_USER_RESET,
})

export const userChat = (data) => ({
  type: CHAT_USER_DATA,
  data
})
//Reducers
export const userProfileReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_USER:
      return {
        ...state,
        requesting: true
      }

    case GET_USER_SUCCESS:
      return {
        ...state,
        profileUserData: action.data,
        requesting: false
      }
    case GET_USER_RESET:
      return {
        ...state,
        requesting: false,
      }
      case CHAT_USER_DATA:
      return {
        ...state,
        chatUserData: action.data,
      }   

    default:
      return state
  }
}

//Saga
async function getUserProfileAPI(data) {
  const URL = `${API_URL}/user-search/?search=${data}`
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

function* getProfileData({ data }) {
  try {
    const response = yield call(getUserProfileAPI, data)
    console.log('get profile user success response----', response);
    yield put(getUserProfileSuccess(response.data))
  } catch (e) {
    const { response } = e
    console.log('get profile user  failure response0000', response);
  } finally {
    yield put(resetUserProfile())
  }
}

export default all([takeLatest(GET_USER, getProfileData)])
