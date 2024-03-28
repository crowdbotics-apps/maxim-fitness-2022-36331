import { all, call, put, takeLatest } from "redux-saga/effects"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { showMessage } from "react-native-flash-message"

// config
import { API_URL } from "../config/app"

// utils
import XHR from "src/utils/XHR"
import { navigate } from "../navigation/NavigationService"
//actions
import { pickSession } from "./programServices";
const GET_EXERCISE_REQUEST = "AddExerciseScreen/GET_EXERCISE_REQUEST"

const GET_EXERCISE_SUCCESS = "AddExerciseScreen/GET_EXERCISE_SUCCESS"

const GET_EXERCISE_TYPE_REQUEST = "AddExerciseScreen/GET_EXERCISE_TYPE_REQUEST"
const GET_EXERCISE_TYPE_SUCCESS = "AddExerciseScreen/GET_EXERCISE_TYPE_SUCCESS"

const ADD_CUSTOM_EXERCISE = "AddExerciseScreen/ADD_CUSTOM_EXERCISE"
const GET_CUSTOM_EXERCISE_REQUEST =
  "AddExerciseScreen/GET_CUSTOM_EXERCISE_REQUEST"
const CUSTOM_WORKOUT_RESCHEDULE_REQUEST =
  "AddExerciseScreen/CUSTOM_WORKOUT_RESCHEDULE_REQUEST"

const POST_CUSTOM_EXERCISE_REQUEST =
  "AddExerciseScreen/POST_CUSTOM_EXERCISE_REQUEST"
const POST_CUSTOM_EXERCISE_SUCCESS =
  "AddExerciseScreen/POST_CUSTOM_EXERCISE_SUCCESS"
const GET_CUSTOM_EXERCISE_SUCCESS =
  "AddExerciseScreen/GET_CUSTOM_EXERCISE_SUCCESS"

export const getExerciseRequest = () => ({
  type: GET_EXERCISE_REQUEST
})
export const getCustomExerciseRequest = date => ({
  type: GET_CUSTOM_EXERCISE_REQUEST,
  date
})
export const customWorkoutRescheduleRequest = (id, date) => ({
  type: CUSTOM_WORKOUT_RESCHEDULE_REQUEST,
  id,
  date
})

export const getCustomExerciseSuccess = data => ({
  type: GET_CUSTOM_EXERCISE_SUCCESS,
  data
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

export const addCustomExercise = data => ({
  type: ADD_CUSTOM_EXERCISE,
  data
})

export const getExerciseTypeSuccess = data => ({
  type: GET_EXERCISE_TYPE_SUCCESS,
  data
})

export const postCustomExRequest = (data, start) => ({
  type: POST_CUSTOM_EXERCISE_REQUEST,
  data,
  start
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
  getCustomExState: false,
  customExercisesList: [],
  getCustomExerciseState: []
}

export const addExerciseReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_EXERCISE_REQUEST:
      return {
        ...state,
        requesting: true
      }

    case ADD_CUSTOM_EXERCISE:
      return {
        ...state,
        customExercisesList: action.data
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
    case GET_CUSTOM_EXERCISE_SUCCESS:
      return {
        ...state,
        getCustomExerciseState: action.data,
        cRequesting: false
      }
    case GET_CUSTOM_EXERCISE_REQUEST:
      return {
        ...state,
        requesting: true
      }
    case CUSTOM_WORKOUT_RESCHEDULE_REQUEST:
      return {
        ...state,
        requesting: true
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
  const URL = `${API_URL}/new_custom_workout/`
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

function* postCustomEx({ data, start }) {
  try {
    if (start) {
      const response = yield call(postCustomExAPI, data)
      yield put(postCustomExSuccess(response.data))
      yield put(pickSession(null, response?.data?.workouts, null))
      if (response?.data?.workouts) {
        navigate("ExerciseScreen", {
          item: response?.data,
        });
      }
      yield put(addCustomExercise([]))
    } else {
      const response = yield call(postCustomExAPI, data)
      yield put(postCustomExSuccess(response.data))
      navigate("FatLoseProgram")
      yield put(addCustomExercise([]))
    }
  } catch (e) {
    yield put(postCustomExSuccess(false))
  }
}

async function getCustomExerciseAPI(data) {
  const token = await AsyncStorage.getItem("authToken")
  const URL = `${API_URL}/new_custom_workout/?date=${data.date}`
  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`
    },
    method: "GET"
  }
  return XHR(URL, options)
}

function* getCustomExercise(data) {
  try {
    const response = yield call(getCustomExerciseAPI, data)
    yield put(getCustomExerciseSuccess(response.data))
  } catch (e) {
    yield put(getCustomExerciseSuccess(false))
  }
}
// <===================================> Reschedule Custom  start Workout <===================================>
async function rescheduleCustomWorkoutAPI(id, date) {
  const data = { "workout_id": id, "schedule_date": date }
  const token = await AsyncStorage.getItem("authToken")
  const URL = `${API_URL}/new_custom_workout/reschedule_workout/`
  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`
    },
    method: "POST",
    data
  }
  return XHR(URL, options)
}

function* rescheduleCustomWorkoutRequest({ id, date }) {
  try {
    const response = yield call(rescheduleCustomWorkoutAPI, id, date)
    showMessage({ message: response?.data?.success, type: "success" })
  } catch (e) {
    showMessage({ message: "Something went wrong", type: "danger" })

  }
}
// <===================================> Reschedule Custom  end Workout <===================================>



export default all([
  takeLatest(POST_CUSTOM_EXERCISE_REQUEST, postCustomEx),
  takeLatest(GET_EXERCISE_TYPE_REQUEST, getExerciseType),
  takeLatest(GET_EXERCISE_REQUEST, getExercise),
  takeLatest(GET_CUSTOM_EXERCISE_REQUEST, getCustomExercise),
  takeLatest(CUSTOM_WORKOUT_RESCHEDULE_REQUEST, rescheduleCustomWorkoutRequest)


])
