import { all, call, put, takeLatest } from "redux-saga/effects"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { navigate } from "../navigation/NavigationService"
import { getFeedsRequest } from "./feedRedux"
import { showMessage } from "react-native-flash-message"

// config
import { API_URL } from "../config/app"

// utils
import XHR from "src/utils/XHR"

//Types
const ADD_POST = "SCREEN/ADDPOST"
const RESET = "SCREEN/ADDPOST/RESET"

const initialState = {
  requesting: false
}

//Actions
export const AddPostData = data => ({
  type: ADD_POST,
  data
})

export const reset = () => ({
  type: RESET
})

//Reducers
export const addPostReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_POST:
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
async function addPostAPI(data) {
  const URL = `${API_URL}/post/`
  const token = await AsyncStorage.getItem("authToken")
  const options = {
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
      Authorization: `Token  ${token}`
    },
    method: "POST",
    data
  }

  return XHR(URL, options)
}

function* AddPost({ data }) {
  try {
    const response = yield call(addPostAPI, data)
    navigate("BottomBar")
    yield put(reset())
    // yield put((getFeedsRequest(1)))
  } catch (e) {
    const { response } = e
    showMessage({ message: "Something went wrong", type: "danger" })
  } finally {
    yield put(reset())
  }
}

export default all([takeLatest(ADD_POST, AddPost)])
