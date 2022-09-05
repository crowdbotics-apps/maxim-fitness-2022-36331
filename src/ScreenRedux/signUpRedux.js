import {all, call, put, takeLatest} from "redux-saga/effects"
// import AsyncStorage from "@react-native-community/async-storage"
import {showMessage} from "react-native-flash-message"
import {navigate} from "../navigation/NavigationService"

// config
import {APP_URL} from "../config/app"

// utils
import XHR from "src/utils/XHR"
import {NavigationContainer} from "@react-navigation/native"

//Types
const SIGN_UP = "SCREEN/SIGNUP"
const RESET = "SCREEN/RESET"

const initialState = {
  requesting: false,
}

//Actions
export const signUpUser = data => ({
  type: SIGN_UP,
  data
})

export const reset = () => ({
  type: RESET
})

//Reducers
export const signUpReducer = (state = initialState, action) => {
  switch (action.type) {
    case SIGN_UP:
      return {
        ...state,
        requesting: true
      }
    case RESET:
      return {
        ...state,
        requesting: false
      }

    default:
      return state
  }
}

//Saga
function SignUpAPI(data) {
  const URL = `${APP_URL}/signup/`
  const options = {
    method: "POST",
    data
  }

  return XHR(URL, options)
}

function* SignUp({data}) {
  try {
    const response = yield call(SignUpAPI, data)
    navigate('SignIn')
    console.log('signUp Success response', response)
    //   AsyncStorage.setItem("authToken", response.data.token)

    //   yield put(setAccessToken(response.data.token))
    //   yield put(setUserDetail(response.data.user))

    //   showMessage({
    //     message: "Login successfully",
    //     type: "success"
    //   })
  } catch (e) {
    const {response} = e
    console.log('registration error response', response);
    showMessage({
      message: response && response.data.email[0],
      type: "danger"
    })
  }
  finally {
    yield put(reset())
  }
}

export default all([
  takeLatest(SIGN_UP, SignUp),
])
