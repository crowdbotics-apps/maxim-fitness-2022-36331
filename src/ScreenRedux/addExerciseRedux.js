import { all, call, put, takeLatest } from "redux-saga/effects"
import AsyncStorage from "@react-native-async-storage/async-storage"

// config
import { API_URL } from "../config/app"

// utils
import XHR from "src/utils/XHR"
import { navigate } from "../navigation/NavigationService"

const GET_EXERCISE_REQUEST = "AddExerciseScreen/GET_EXERCISE_REQUEST"
const GET_EXERCISE_SUCCESS = "AddExerciseScreen/GET_EXERCISE_SUCCESS"

const GET_EXERCISE_TYPE_REQUEST = "AddExerciseScreen/GET_EXERCISE_TYPE_REQUEST"
const GET_EXERCISE_TYPE_SUCCESS = "AddExerciseScreen/GET_EXERCISE_TYPE_SUCCESS"

const POST_CUSTOM_EXERCISE_REQUEST =
  "AddExerciseScreen/POST_CUSTOM_EXERCISE_REQUEST"
const POST_CUSTOM_EXERCISE_SUCCESS =
  "AddExerciseScreen/POST_CUSTOM_EXERCISE_SUCCESS"

export const getExerciseRequest = () => ({
  type: GET_EXERCISE_REQUEST
})

export const getExerciseSuccess = data => ({
  type: GET_EXERCISE_SUCCESS,
  data
})

export const getExerciseTypeRequest = (data, search) => ({
  type: GET_EXERCISE_TYPE_REQUEST,
  data,
  search
})

export const getExerciseTypeSuccess = data => ({
  type: GET_EXERCISE_TYPE_SUCCESS,
  data
})

export const postCustomExRequest = data => ({
  type: POST_CUSTOM_EXERCISE_REQUEST,
  data
})

export const postCustomExSuccess = data => ({
  type: POST_CUSTOM_EXERCISE_SUCCESS,
  data
})

const initialState = {
  requesting: false,
  getExerciseState: false,

  request: false,
  getExerciseType: false,

  cRequesting: false,
  getCustomExState: false
}

export const addExerciseReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_EXERCISE_REQUEST:
      return {
        ...state,
        requesting: true
      }

    case GET_EXERCISE_SUCCESS:
      return {
        ...state,
        getExerciseState: action.data,
        requesting: false
      }

    case GET_EXERCISE_TYPE_REQUEST:
      return {
        ...state,
        request: true
      }

    case GET_EXERCISE_TYPE_SUCCESS:
      return {
        ...state,
        getExerciseType: action.data,
        request: false
      }

    case POST_CUSTOM_EXERCISE_REQUEST:
      return {
        ...state,
        cRequesting: true
      }

    case POST_CUSTOM_EXERCISE_SUCCESS:
      return {
        ...state,
        getCustomExState: action.data,
        cRequesting: false
      }

    default:
      return state
  }
}

async function getExerciseAPI() {
  const token = await AsyncStorage.getItem("authToken")
  const URL = `${API_URL}/exercise-type/`
  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`
    },
    method: "GET"
  }
  return XHR(URL, options)
}

function* getExercise() {
  try {
    const response = yield call(getExerciseAPI)
    yield put(getExerciseSuccess(response.data))
  } catch (e) {
    yield put(getExerciseSuccess(false))
  }
}

async function getExerciseTypeAPI(data, search) {
  const token = await AsyncStorage.getItem("authToken")
  const URL = `${API_URL}/exercise/?exercise_type=${data}&search=${search}`
  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`
    },
    method: "GET"
  }
  return XHR(URL, options)
}

function* getExerciseType({ data, search }) {
  try {
    const response = yield call(getExerciseTypeAPI, data, search)
    yield put(getExerciseTypeSuccess(response.data))
  } catch (e) {
    yield put(getExerciseTypeSuccess(false))
  }
}

async function postCustomExAPI(data) {
  const token = await AsyncStorage.getItem("authToken")
  const URL = `${API_URL}/session/create_custom_workout/`
  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`
    },
    method: "POST",
    data: data
  }
  return XHR(URL, options)
}

function* postCustomEx({ data }) {
  try {
    const response = yield call(postCustomExAPI, data)
    yield put(postCustomExSuccess(response.data))
    navigate("FatLoseProgram")
  } catch (e) {
    yield put(postCustomExSuccess(false))
  }
}

export default all([
  takeLatest(POST_CUSTOM_EXERCISE_REQUEST, postCustomEx),
  takeLatest(GET_EXERCISE_TYPE_REQUEST, getExerciseType),
  takeLatest(GET_EXERCISE_REQUEST, getExercise)
])
