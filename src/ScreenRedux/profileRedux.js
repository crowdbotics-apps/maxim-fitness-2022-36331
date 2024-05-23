import { all, call, put, takeLatest } from "redux-saga/effects"
import AsyncStorage from "@react-native-async-storage/async-storage"

import { showMessage } from "react-native-flash-message"
import { goBack, navigate } from "../navigation/NavigationService"

//Actions
import { setUserDetail } from "./loginRedux"

// config
import { API_URL } from "../config/app"

// utils
import XHR from "src/utils/XHR"
// import { errorAlert } from "src/utils/alerts"

//Types
const GET_PROFILE = "PROFILE_SCREEN/GET_PROFILE"
const GET_PROFILE_SUCCESS = "PROFILE_SCREEN/GET_PROFILE_SUCCESS"
const RESET_GET_PROFILE = "PROFILE_SCREEN/RESET_GET_PROFILE"

const EDIT_PROFILE = "PROFILE_SCREEN/EDIT_PROFILE"
const EDIT_PROFILE_SUCCESS = "PROFILE_SCREEN/EDIT_PROFILE_SUCCESS"

const FOLLOW_USER = "PROFILE_SCREEN/FOLLOW_USER"
const UNFOLLOW_USER = "PROFILE_SCREEN/UNFOLLOW_USER"

const REPORT_USER = "PROFILE_SCREEN/REPORT_USER"
const BLOCK_USER = "PROFILE_SCREEN/BLOCK_USER"

const ROUTE_DATA = "PROFILE_SCREEN/ROUTE_DATA"
const PROFILE_DATA_REQUEST = "PROFILE_SCREEN/PROFILE_DATA_REQUEST"
const PROFILE_DATA_SUCCESS = "PROFILE_SCREEN/PROFILE_DATA_SUCCESS"

const UPDATE_PROFILE_MEAL_REQUEST = "PROFILE_SCREEN/UPDATE_PROFILE_MEAL_REQUEST"
const UPDATE_PROFILE_MEAL_SUCCESS = "PROFILE_SCREEN/UPDATE_PROFILE_MEAL_SUCCESS"

const initialState = {
  requesting: false,
  profileData: false,
  routeDetail: false,
  editRequesting: false,
  request: false,
  profile: false,
  mealRequest: false
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

export const editProfile = (data, id, callBack) => ({
  type: EDIT_PROFILE,
  data,
  id,
  callBack
})

export const editProfileSuccess = data => ({
  type: EDIT_PROFILE_SUCCESS,
  data
})

export const resetProfile = () => ({
  type: RESET_GET_PROFILE
})

export const followUser = data => ({
  type: FOLLOW_USER,
  data
})

export const unFollowUser = data => ({
  type: UNFOLLOW_USER,
  data
})

export const routeData = data => ({
  type: ROUTE_DATA,
  data
})

export const blockUser = data => ({
  type: BLOCK_USER,
  data
})

export const reportUser = data => ({
  type: REPORT_USER,
  data
})

export const profileData = () => ({
  type: PROFILE_DATA_REQUEST
})

export const profileDataSuccess = data => ({
  type: PROFILE_DATA_SUCCESS,
  data
})

export const editProfileMeal = (data, id) => ({
  type: UPDATE_PROFILE_MEAL_REQUEST,
  data,
  id
})

export const editProfileMealSuccess = () => ({
  type: UPDATE_PROFILE_MEAL_SUCCESS
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

    case UPDATE_PROFILE_MEAL_REQUEST:
      return {
        ...state,
        mealRequest: true
      }
    case UPDATE_PROFILE_MEAL_SUCCESS:
      return {
        ...state,
        mealRequest: false
      }

    case PROFILE_DATA_REQUEST:
      return {
        ...state,
        request: true
      }

    case PROFILE_DATA_SUCCESS:
      return {
        ...state,
        request: false
      }

    default:
      return state
  }
}

//Saga
async function getProfileAPI(data) {
  const URL = `${API_URL}/profile/${data}/follower/`
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

function* getProfileData({ data }) {
  try {
    const response = yield call(getProfileAPI, data)

    yield put(getProfileSuccess(response.data))
  } catch (e) {
    const { response } = e
  } finally {
    yield put(resetProfile())
  }
}

async function followUserAPI(data) {
  const URL = `${API_URL}/follow/add_follow/`
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

function* followuserData({ data }) {
  try {
    const response = yield call(followUserAPI, data)
    // yield put(getProfileSuccess(response.data))
  } catch (e) {
    const { response } = e
  }
}

async function unfollowUserAPI(data) {
  const URL = `${API_URL}/follow/remove_follow/`
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

function* unfollowuserData({ data }) {
  try {
    const response = yield call(unfollowUserAPI, data)
    // yield put(getProfileSuccess(response.data))
  } catch (e) {
    const { response } = e
  }
}

async function updateProfile(data, id) {
  const URL = `${API_URL}/update-profile/${id}/`
  const token = await AsyncStorage.getItem("authToken")
  const options = {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
      Authorization: `Token  ${token}`
    },
    data
  }

  return XHR(URL, options)
}

function* updateUserData({ data, id, callBack }) {
  try {
    const response = yield call(updateProfile, data, id)
    showMessage({ message: "Profile updated successfully", type: "success" })
    yield put(setUserDetail(response.data))
    goBack()
    callBack(response.data)
  } catch (e) {
    const { response } = e
    showMessage({ message: "Something went wrong", type: "danger" })
  } finally {
    yield put(resetProfile())
  }
}

async function blockUserAPI(data) {
  const URL = `${API_URL}/block-user/`
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

function* blockUserData({ data }) {
  try {
    const response = yield call(blockUserAPI, data)
    showMessage({
      message: response.data?.id ? "Blocked user Successfully" : "Unblocked user Successfully",
      type: "success"
    })
    response.data?.id ? navigate("Feed") : navigate("SearchProfile")
  } catch (e) {
    const { response } = e
    showMessage({
      message: "Something went wrong",
      type: "success"
    })
  }
}

async function reportUserAPI(data) {
  const URL = `${API_URL}/report-user/`
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

function* reportUserData({ data }) {
  try {
    const response = yield call(reportUserAPI, data)
    showMessage({
      message: "Report user Successfully",
      type: "success"
    })
  } catch (e) {
    const { response } = e
  }
}

async function profileDataAPI() {
  const URL = `${API_URL}/profile/`
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

function* profileRequest() {
  try {
    const response = yield call(profileDataAPI)
    yield put(setUserDetail(response?.data[0]))
    yield put(profileDataSuccess(false))
  } catch (e) {
    const { response } = e
    yield put(profileDataSuccess(false))
  }
}

async function updateProfileMealAPI(data, id) {
  const URL = `${API_URL}/profile/${id}/`
  const token = await AsyncStorage.getItem("authToken")
  const options = {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      Authorization: `Token  ${token}`
    },
    data
  }

  return XHR(URL, options)
}

function* updateProfileMeal({ data, id }) {
  try {
    const response = yield call(updateProfileMealAPI, data, id)
    showMessage({ message: "Meal updated successfully", type: "success" })
    navigate("Custom")
    yield put(editProfileMealSuccess())
    yield put(profileData())
  } catch (e) {
    const { response } = e
    showMessage({ message: "Something went wrong", type: "danger" })
  } finally {
    yield put(editProfileMealSuccess())
  }
}

export default all([
  takeLatest(GET_PROFILE, getProfileData),
  takeLatest(FOLLOW_USER, followuserData),
  takeLatest(UNFOLLOW_USER, unfollowuserData),
  takeLatest(EDIT_PROFILE, updateUserData),
  takeLatest(BLOCK_USER, blockUserData),
  takeLatest(REPORT_USER, reportUserData),
  takeLatest(PROFILE_DATA_REQUEST, profileRequest),
  takeLatest(UPDATE_PROFILE_MEAL_REQUEST, updateProfileMeal)
])
