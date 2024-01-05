import { all, call, put, takeLatest } from "redux-saga/effects"
import AsyncStorage from "@react-native-async-storage/async-storage"

// config
import { API_URL } from "../config/app"

// utils
import XHR from "src/utils/XHR"
// import { errorAlert } from "src/utils/alerts"

//Types
const GET_USER = "SEARCH_SCREEN/GET_USER"
const GET_USER_SUCCESS = "SEARCH_SCREEN/GET_USER_SUCCESS"
const GET_USER_RESET = "SEARCH_SCREEN/GET_USER_RESET"
const CHAT_USER_DATA = "SEARCH_SCREEN/CHAT_USER_DATA"

const initialState = {
  requesting: false,
  profileUserData: [],
  chatUserData: false
}

//Actions
export const getUserProfile = (data, nextPage, setNextPage) => ({
  type: GET_USER,
  data,
  nextPage,
  setNextPage
})

export const getUserProfileSuccess = (data, nextPage) => ({
  type: GET_USER_SUCCESS,
  data,
  nextPage
})

export const resetUserProfile = () => ({
  type: GET_USER_RESET
})

export const userChat = data => ({
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
        profileUserData:
          action.nextPage === 1
            ? action.data.results
            : [...state.profileUserData, ...action.data.results],
        requesting: false
      }
    case GET_USER_RESET:
      return {
        ...state,
        requesting: false
      }
    case CHAT_USER_DATA:
      return {
        ...state,
        chatUserData: action.data
      }

    default:
      return state
  }
}

//Saga
async function getUserProfileAPI(data, page) {
  const URL = `${API_URL}/user-search/?search=${data}&page=${page ? page : 1}`
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

function* getProfileData({ data, nextPage, setNextPage }) {
  try {
    const response = yield call(getUserProfileAPI, data, nextPage)
    yield put(getUserProfileSuccess(response.data, nextPage))
    setNextPage(
      response?.data.next
        ? response?.data.next?.split("?page=")[1].split("&")[0]
        : response?.data.next
    )
  } catch (e) {
    const { response } = e
    yield put(resetUserProfile())
  }
}

export default all([takeLatest(GET_USER, getProfileData)])
