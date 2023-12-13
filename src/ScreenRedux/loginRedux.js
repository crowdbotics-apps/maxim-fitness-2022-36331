import { all, call, put, takeLatest } from "redux-saga/effects"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { navigate } from "../navigation/NavigationService"
import { showMessage } from "react-native-flash-message"
import { newSubScription } from "./subscriptionRedux"
import RemotePushController from "../../modules/notifications/utils"
import messaging from "@react-native-firebase/messaging"

// config
import { API_URL } from "../config/app"

// utils
import XHR from "src/utils/XHR"
// import { errorAlert } from "src/utils/alerts"

//Types
const LOGIN = "SCREEN/LOGIN"
const FACEBOOK_LOGIN = "SCREEN/FACEBOOK_LOGIN"
const GOOGLE_LOGIN = "SCREEN/GOOGLE_LOGIN"
const SET_ACCESS_TOKEN = "SCREEN/SET_ACCESS_TOKEN"
const SET_USER_DETAIL = "SCREEN/SET_USER_DETAIL"
const SUBSCRIPTION_DATA = "SCREEN/SUBSCRIPTION_DATA"
const LOGOUT_USER = "SCREEN/LOGOUT_USER"

const RESET = "SCREEN/RESET"

const initialState = {
  requesting: false,
  userDetail: false,
  accessToken: false,
  googleRequesting: false,
  faceBookRequesting: false,
  subscriptionData: false
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

export const subscriptionData = data => ({
  type: SUBSCRIPTION_DATA,
  data
})

export const reset = () => ({
  type: RESET
})

export const logOutActiveUser = token => ({
  type: LOGOUT_USER,
  token
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

    case SUBSCRIPTION_DATA:
      return {
        ...state,
        subscriptionData: action.data
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
    method: "POST",
    data
  }

  return XHR(URL, options)
}

function* login({ data }) {
  try {
    const response = yield call(loginAPI, data)
    AsyncStorage.setItem("authToken", response.data.token)
    yield put(setAccessToken(response.data.token))
    yield put(setUserDetail(response.data.user))
    RemotePushController(response.data.token, response.data.user?.id)
    // navigate("Feed")
    // if(response?.data?.subscription){
    //   yield put(newSubScription(response?.data?.subscription?.data[0]))
    // }
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
    console.log("error response---", response)
    showMessage({
      message: "Unable to log in with provided credentials.",
      type: "danger"
    })
  } finally {
    yield put(reset())
  }
}

function facebookLoginAPI(data) {
  const URL = `${API_URL}/login/facebook/`
  const options = {
    method: "POST",
    data
  }
  return XHR(URL, options)
}

function* facebookLogin({ data }) {
  try {
    const res = yield call(facebookLoginAPI, data)
    AsyncStorage.setItem("authToken", res.data.key)

    yield put(setAccessToken(res.data.key))
    yield put(setUserDetail(res.data.user_detail))
    RemotePushController(res.data.key, res?.data?.user_detail?.id)
    showMessage({
      message: "Facebook login successfully",
      type: "success"
    })
  } catch (e) {
    const { response } = e
    yield put(reset())
    showMessage({
      message: "Something want wronge",
      type: "danger"
    })
  }
}

function googleLoginAPI(data) {
  const URL = `${API_URL}/login/google/`
  const options = {
    method: "POST",
    data
  }

  return XHR(URL, options)
}

function* googleLogin({ data }) {
  try {
    const res = yield call(googleLoginAPI, data)

    AsyncStorage.setItem("authToken", res.data.key)
    yield put(setAccessToken(res.data.key))
    yield put(setUserDetail(res.data.user_detail))
    RemotePushController(res.data.key, res?.data?.user_detail?.id)
    showMessage({
      message: "Google login successfully",
      type: "success"
    })
  } catch (e) {
    const { response } = e
  } finally {
    yield put(reset())
  }
}

async function logoutAPI(token) {
  const registrationToken = await messaging().getToken()
  const URL = `${API_URL}/logout/`
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`
    },
    data: { registration_id: registrationToken }
  }
  return XHR(URL, options)
}

function* logoutUser({ token }) {
  try {
    const res = yield call(logoutAPI, token)
  } catch (e) {
    const { response } = e
  }
}
export default all([
  takeLatest(LOGIN, login),
  takeLatest(FACEBOOK_LOGIN, facebookLogin),
  takeLatest(GOOGLE_LOGIN, googleLogin),
  takeLatest(LOGOUT_USER, logoutUser)
])
