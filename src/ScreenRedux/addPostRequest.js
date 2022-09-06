import {all, call, put, takeLatest} from "redux-saga/effects"
import AsyncStorage from "@react-native-async-storage/async-storage"

// config
import {API_URL} from "src/config/app"

// utils
import XHR from "src/utils/XHR"

//Types
const ADD_POST = "SCREEN/ADDPOST"
const RESET = "SCREEN/ADDPOST/RESET"

const initialState = {
  requesting: false,
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
    method: "POST",
    'Content-Type': 'multipart/form-data',
    'Authorization': `Token  ${token}`,
    data
  }

  return XHR(URL, options)
}

function* AddPost({data}) {
  try {
    const response = yield call(addPostAPI, data)
    console.log('add success response', response)
  } catch (e) {
    const {response} = e
    console.log('add post failure response---', response);
  }
  finally {
    yield put(reset())
  }
}

export default all([
  takeLatest(ADD_POST, AddPost),
])
