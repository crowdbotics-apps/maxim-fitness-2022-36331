import { all, call, put, takeLatest } from "redux-saga/effects"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { navigate } from "../navigation/NavigationService"
import { getFeedsRequest } from "./feedRedux"

// config
import { API_URL } from "../config/app"

// utils
import XHR from "src/utils/XHR"

//Types
const DELETE_ACCOUNT = "SETTING/DELETE_ACCOUNT"

const initialState = {
  requesting: false
}

//Actions
export const deleteAccount = data => ({
  type: DELETE_ACCOUNT,
  data
})

//Reducers
// export const addPostReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case ADD_POST:
//       return {
//         ...state,
//         requesting: true
//       }
//     case RESET:
//       return {
//         ...state,
//         requesting: false
//       }

//     default:
//       return state
//   }
// }

//Saga
async function deleteAccountAPI(data) {
  const URL = `${API_URL}/profile/${data}/`
  const token = await AsyncStorage.getItem("authToken")
  const options = {
    headers: {
      Accept: "application/json",
      Authorization: `Token  ${token}`
    },
    method: "DELETE"
  }

  return XHR(URL, options)
}

function* deleteAccountData({ data }) {
  try {
    const response = yield call(deleteAccountAPI, data)
    // yield put((getFeedsRequest(1)))
  } catch (e) {
    const { response } = e
  }
}

export default all([takeLatest(DELETE_ACCOUNT, deleteAccountData)])
