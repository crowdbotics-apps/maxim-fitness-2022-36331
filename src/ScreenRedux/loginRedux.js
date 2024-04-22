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

//Types
const LOGIN = "SCREEN/LOGIN"
const VERIFICATION = "SCREEN/VERIFICATION"
const FACEBOOK_LOGIN = "SCREEN/FACEBOOK_LOGIN"
const GOOGLE_LOGIN = "SCREEN/GOOGLE_LOGIN"
const APPLE_LOGIN = "SCREEN/APPLE_LOGIN"
const SET_ACCESS_TOKEN = "SCREEN/SET_ACCESS_TOKEN"
const SET_USER_DETAIL = "SCREEN/SET_USER_DETAIL"
const SUBSCRIPTION_DATA = "SCREEN/SUBSCRIPTION_DATA"
const LOGOUT_USER = "SCREEN/LOGOUT_USER"

const FORGOT_PASSWORD = "SCREEN/FORGOT_PASSWORD"
const FORGOT_PASSWORD_CONFIRM = "SCREEN/FORGOT_PASSWORD_CONFIRM"

const RESET = "SCREEN/RESET"

const initialState = {
  requesting: false,
  userDetail: false,
  accessToken: false,
  googleRequesting: false,
  faceBookRequesting: false,
  subscriptionData: false,
  forgotRequest: false,
  appleRequesting: false,
  verifyRequesting: false
}

//Actions
export const loginUser = data => ({
  type: LOGIN,
  data
})
export const verificationRequest = () => ({
  type: VERIFICATION,
})

export const facebookLoginUser = data => ({
  type: FACEBOOK_LOGIN,
  data
})

export const googleLoginUser = data => ({
  type: GOOGLE_LOGIN,
  data
})

export const appleLoginUser = data => ({
  type: APPLE_LOGIN,
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

export const forgetPassWord = data => ({
  type: FORGOT_PASSWORD,
  data
})

export const forgetPassWordConfirm = data => ({
  type: FORGOT_PASSWORD_CONFIRM,
  data
})

//Reducers
export const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        requesting: true
      }
    case VERIFICATION:
      return {
        ...state,
        verifyRequesting: true
      }
    case GOOGLE_LOGIN:
      return {
        ...state,
        googleRequesting: true
      }
    case APPLE_LOGIN:
      return {
        ...state,
        appleRequesting: true
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

    case FORGOT_PASSWORD:
    case FORGOT_PASSWORD_CONFIRM:
      return {
        ...state,
        forgotRequest: true
      }

    case RESET:
      return {
        ...state,
        requesting: false,
        googleRequesting: false,
        faceBookRequesting: false,
        forgotRequest: false,
        appleRequesting: false,
        verifyRequesting: false
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
    showMessage({
      message: e.code === 'ERR_NETWORK' ? 'Network Error' : "Unable to log in with provided credentials.",
      type: "danger"
    })
    const { response } = e
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
      message: "Something want wrong",
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

function appleLoginAPI(data) {
  const URL = `${API_URL}/login/apple/`
  const options = {
    method: "POST",
    data
  }

  return XHR(URL, options)
}

function* appleLogin({ data }) {
  try {
    const res = yield call(appleLoginAPI, data)
    AsyncStorage.setItem("authToken", res.data.key)
    yield put(setAccessToken(res.data.key))
    yield put(setUserDetail(res.data.user_detail))
    RemotePushController(res.data.key, res?.data?.user_detail?.id)
    showMessage({
      message: "Apple login successfully",
      type: "success"
    })
  } catch (e) {
    const { response } = e
    showMessage({
      message: "Something went wrong",
      type: "danger"
    })
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

async function forgetPassWordAPI(data) {
  const URL = `${API_URL}/forgot-password/`
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    data
  }
  return XHR(URL, options)
}

function* forgetPassWordRequest({ data }) {
  try {
    const res = yield call(forgetPassWordAPI, data)
    navigate("SetForgetPassword")
    showMessage({
      message: "Token has been sent on your email.",
      type: "success"
    })
    yield put(reset())
  } catch (e) {
    const { response } = e
    showMessage({
      message: "Email does not exist.",
      type: "danger"
    })
  } finally {
    yield put(reset())
  }
}

async function forgetPassWordConfirmAPI(data) {
  const URL = `${API_URL}/forgot-password/confirm/`
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    data
  }
  return XHR(URL, options)
}

function* forgetPassWordConfirmRequest({ data }) {
  try {
    const res = yield call(forgetPassWordConfirmAPI, data)
    navigate("SignIn")
    showMessage({
      message: "New password successfully reset.",
      type: "success"
    })
    yield put(reset())
  } catch (e) {
    const { response } = e
    showMessage({
      message: "Invalid token.",
      type: "danger"
    })
  } finally {
    yield put(reset())
  }
}

//verification api
async function verificationAPI() {
  const URL = `${API_URL}/verify_subscription_status/`
  const token = await AsyncStorage.getItem("authToken")
  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`
    },
    method: "GET",
  }

  return XHR(URL, options)
}
function* verification() {
  try {
    const res = yield call(verificationAPI)
  } catch (e) {
    showMessage({
      message: "Something went wrong while user subscription's verification.",
      type: "danger"
    })
  } finally {
    yield put(reset())
  }
}

export default all([
  takeLatest(LOGIN, login),
  takeLatest(VERIFICATION, verification),
  takeLatest(FACEBOOK_LOGIN, facebookLogin),
  takeLatest(GOOGLE_LOGIN, googleLogin),
  takeLatest(APPLE_LOGIN, appleLogin),
  takeLatest(LOGOUT_USER, logoutUser),
  takeLatest(FORGOT_PASSWORD, forgetPassWordRequest),
  takeLatest(FORGOT_PASSWORD_CONFIRM, forgetPassWordConfirmRequest),
])
