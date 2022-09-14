import {all, call, put, takeLatest} from 'redux-saga/effects';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setUserDetail} from './loginRedux'
import {showMessage} from 'react-native-flash-message';

// config
import {API_URL} from '../config/app'

// utils
import XHR from 'src/utils/XHR';
// import { errorAlert } from "src/utils/alerts"

//Types
const GET_PROFILE = 'PROFILE_SCREEN/GET_PROFILE';
const GET_PROFILE_SUCCESS = 'PROFILE_SCREEN/GET_PROFILE_SUCCESS';
const RESET_GET_PROFILE = 'PROFILE_SCREEN/RESET_GET_PROFILE';

const EDIT_PROFILE = 'PROFILE_SCREEN/EDIT_PROFILE';
const EDIT_PROFILE_SUCCESS = 'PROFILE_SCREEN/EDIT_PROFILE_SUCCESS';

const FOLLOW_USER = 'PROFILE_SCREEN/FOLLOW_USER';
const UNFOLLOW_USER = 'PROFILE_SCREEN/UNFOLLOW_USER';

const ROUTE_DATA = 'PROFILE_SCREEN/ROUTE_DATA';


const initialState = {
  requesting: false,
  profileData: false,
  routeDetail: false,
  editRequesting: false,
}

//Actions
export const getProfile = data => ({
  type: GET_PROFILE,
  data
})

export const getProfileSuccess = data => ({
  type: GET_PROFILE_SUCCESS,
  data
})

export const editProfile = (data, id) => ({
    type: EDIT_PROFILE,
    data,
    id
  })
  
  export const editProfileSuccess = data => ({
    type: EDIT_PROFILE_SUCCESS,
    data
  })

export const resetProfile = ()=> ({
  type: RESET_GET_PROFILE,
})

export const followUser = (data)=> ({
  type: FOLLOW_USER,
  data
})

export const unFollowUser = (data)=> ({
  type: UNFOLLOW_USER,
  data
})

export const routeData = (data)=> ({
  type: ROUTE_DATA,
  data
})




//Reducers
export const profileReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PROFILE:
      return {
        ...state,
        requesting: true
      }

    case GET_PROFILE_SUCCESS:
      return {
        ...state,
        profileData: action.data,
        requesting: false
      }
    case RESET_GET_PROFILE:
      return {
        ...state,
        requesting: false,
        editRequesting: false
      }

      case ROUTE_DATA:
        return {
          ...state,
          routeDetail: action.data
        }
        case EDIT_PROFILE:
          return {
            ...state,
            editRequesting: true
          }
        

    default:
      return state
  }
}

//Saga
async function getProfileAPI(data) {
  const URL = `${API_URL}/profile/${data}/follower/`
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

function* getProfileData({data}) {
  try {
    const response = yield call(getProfileAPI, data)
    console.log('get profile success response----', response);
    yield put(getProfileSuccess(response.data))
  } catch (e) {
    const {response} = e
    console.log('get profile failure response0000', response);
  } finally {
    yield put(resetProfile())
  }
}

async function followUserAPI(data) {
  const URL = `${API_URL}/follow/add_follow/`
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

function* followuserData({data}) {
  try {
    const response = yield call(followUserAPI, data)
    console.log('follow user success response----', response);
    // yield put(getProfileSuccess(response.data))
  } catch (e) {
    const {response} = e
    console.log('follow user  failure response0000', response);
  }
}

async function unfollowUserAPI(data) {
  const URL = `${API_URL}/follow/remove_follow/`
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

function* unfollowuserData({data}) {
  try {
    const response = yield call(unfollowUserAPI, data)
    console.log('unfollow user success response----', response);
    // yield put(getProfileSuccess(response.data))
  } catch (e) {
    const {response} = e
    console.log('unfollow user  failure response0000', response);
  }
}


async function updateProfile(data, id) {
  const URL = `${API_URL}/update-profile/${id}/`
  const token = await AsyncStorage.getItem('authToken')
  const options = {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
      Authorization: `Token  ${token}`,
    },
    data
  }

  return XHR(URL, options)
}

function* updateUserData({data, id}) {
  try {
    const response = yield call(updateProfile, data, id)
    console.log('edit profile success response----', response);
    yield put(setUserDetail(response.data))
  } catch (e) {
    const {response} = e
    console.log('edit profile failure response0000', response);
  }
  finally{
    yield put(resetProfile())
  }
}

export default all([
  takeLatest(GET_PROFILE, getProfileData),
  takeLatest(FOLLOW_USER, followuserData),
  takeLatest(UNFOLLOW_USER, unfollowuserData),
  takeLatest(EDIT_PROFILE, updateUserData),

])
