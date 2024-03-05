import { all, call, put, takeLatest } from "redux-saga/effects"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { navigate } from "../navigation/NavigationService"

// config
import { API_URL } from "../config/app"

// utils
import XHR from "src/utils/XHR"
import moment from "moment"

import { sortSessionBySets } from "../utils/common"
import { goBack } from "../navigation/NavigationService"

const ALL_SESSIONS_REQUEST = "ProgramScreen/ALL_SESSIONS_REQUEST"
const ALL_SESSIONS_SUCCESS = "ProgramScreen/ALL_SESSIONS_SUCCESS"
const WEEK_SESSIONS_SUCCESS = "ProgramScreen/WEEK_SESSIONS_SUCCESS"

const TODAY_SESSIONS_REQUEST = "ProgramScreen/TODAY_SESSIONS_REQUEST"
const TODAY_SESSIONS_SUCCESS = "ProgramScreen/TODAY_SESSIONS_SUCCESS"

const REPS_WEIGHT_REQUEST = "ProgramScreen/REPS_WEIGHT_REQUEST"
const REPS_WEIGHT_SUCCESS = "ProgramScreen/REPS_WEIGHT_SUCCESS"
const REPS_CUSTOM_WEIGHT_REQUEST = "ProgramScreen/REPS_CUSTOM_WEIGHT_REQUEST"


const PICK_SESSION = "ProgramScreen/PICK_SESSION"

const SETS_DONE_REQUEST = "ProgramScreen/SETS_DONE_REQUEST"
const SETS_DONE_SUCCESS = "ProgramScreen/SETS_DONE_SUCCESS"

const SESSION_DONE_REQUEST = "ProgramScreen/SESSION_DONE_REQUEST"
const SESSION_DONE_SUCCESS = "ProgramScreen/SESSION_DONE_SUCCESS"

const WORKOUT_DONE_REQUEST = "ProgramScreen/WORKOUT_DONE_REQUEST"
const WORKOUT_DONE_SUCCESS = "ProgramScreen/WORKOUT_DONE_SUCCESS"

const EXERCISE_DONE_REQUEST = "ProgramScreen/EXERCISE_DONE_REQUEST"
const EXERCISE_DONE_SUCCESS = "ProgramScreen/EXERCISE_DONE_SUCCESS"

const SAVE_SWIPE_DATE = "ProgramScreen/SAVE_SWIPE_DATE"
const SWAP_EXERCISE = "ProgramScreen/SWAP_EXERCISE"
const SWAP_EXERCISE_ISTRUE = "ProgramScreen/SWAP_EXERCISE_ISTRUE"

const ALL_SWAP_EXERCISE = "ProgramScreen/ALL_SWAP_EXERCISE"
const ALL_SWAP_EXERCISE_SUCCESS = "ProgramScreen/ALL_SWAP_EXERCISE_SUCCESS"
const ALL_SWAP_EXERCISE_ERROR = "ProgramScreen/ALL_SWAP_EXERCISE_ERROR"

export const getAllSessionRequest = data => ({
  type: ALL_SESSIONS_REQUEST,
  data
})

export const getAllSessionSuccess = data => ({
  type: ALL_SESSIONS_SUCCESS,
  data
})

export const getWeekSessionSuccess = data => ({
  type: WEEK_SESSIONS_SUCCESS,
  data
})

export const getDaySessionRequest = (data, isTrue) => ({
  type: TODAY_SESSIONS_REQUEST,
  data,
  isTrue
})

export const getDaySessionSuccess = data => ({
  type: TODAY_SESSIONS_SUCCESS,
  data
})

export const repsWeightRequest = (id, data, dd, callBack) => ({
  type: REPS_WEIGHT_REQUEST,
  id,
  data,
  dd,
  callBack
})
export const repsCustomWeightRequest = (id, data, dd, callBack) => ({
  type: REPS_CUSTOM_WEIGHT_REQUEST,
  id,
  data,
  dd,
  callBack
})

export const repsWeightSuccess = data => ({
  type: REPS_WEIGHT_SUCCESS,
  data
})

export const repsCutsomWeightSuccess = data => ({
  type: REPS_WEIGHT_SUCCESS,
  data
})
export const pickSession = (exerciseObj, selectedSession, nextWorkout) => ({
  type: PICK_SESSION,
  exerciseObj,
  selectedSession,
  nextWorkout
})

export const setDoneRequest = (id, data) => ({
  type: SETS_DONE_REQUEST,
  id,
  data
})

export const workoutDone = id => ({
  type: WORKOUT_DONE_REQUEST,
  id
})
export const workoutDoneSuccess = data => ({
  type: WORKOUT_DONE_SUCCESS,
  data
})

export const sessionDone = (id, screenNavigation) => ({
  type: SESSION_DONE_REQUEST,
  id,
  screenNavigation
})
export const sessionDoneSuccess = data => ({
  type: SESSION_DONE_SUCCESS,
  data
})

export const setDoneSuccess = data => ({
  type: SETS_DONE_SUCCESS,
  data
})

export const exerciseDoneRequest = data => ({
  type: EXERCISE_DONE_REQUEST,
  data
})

export const exerciseDoneSuccess = data => ({
  type: EXERCISE_DONE_SUCCESS,
  data
})

export const saveSwipeDateAction = (weekDate, date, activeIndex) => ({
  type: SAVE_SWIPE_DATE,
  weekDate,
  date,
  activeIndex
})

export const swapExercises = (data, date_time) => ({
  type: SWAP_EXERCISE,
  data,
  date_time
})

export const swapExerciseisTrue = () => ({
  type: SWAP_EXERCISE_ISTRUE
})

export const allSwapExercise = exerciseId => ({
  type: ALL_SWAP_EXERCISE,
  exerciseId
})

export const allSwapExerciseSuccess = data => ({
  type: ALL_SWAP_EXERCISE_SUCCESS,
  payload: data
})

export const allSwapExerciseError = () => ({
  type: ALL_SWAP_EXERCISE_ERROR
})

const initialState = {
  requesting: false,
  getAllSessions: false,
  getWeekSessions: false,

  loader: false,
  loading: false,

  repsWeight: false,

  exerciseObj: false,
  selectedSession: false,
  nextWorkout: false,

  setLoading: false,
  setDone: false,
  exeLoading: false,
  exerciseDone: false,

  todayRequest: false,
  todaySessions: false,

  allExerciseSwapped: false
}

export const programReducer = (state = initialState, action) => {
  switch (action.type) {
    case ALL_SESSIONS_REQUEST:
      return {
        ...state,
        requesting: true
      }

    case ALL_SESSIONS_SUCCESS:
      return {
        ...state,
        getAllSessions: action.data,
        requesting: false
      }

    case WEEK_SESSIONS_SUCCESS:
      return {
        ...state,
        getWeekSessions: action.data,
        requesting: false
      }

    case TODAY_SESSIONS_REQUEST:
      return {
        ...state,
        todayRequest: true
      }

    case TODAY_SESSIONS_SUCCESS:
      return {
        ...state,
        todaySessions: action.data,
        todayRequest: false
      }

    case REPS_WEIGHT_REQUEST:
      return {
        ...state,
        loader: true
      }
    case REPS_CUSTOM_WEIGHT_REQUEST:
      return {
        ...state,
        loader: true
      }
    case ALL_SWAP_EXERCISE: {
      return {
        ...state,
        loading: true
      }
    }

    case ALL_SWAP_EXERCISE_SUCCESS: {
      return {
        ...state,
        allExerciseSwapped: action.payload,
        loading: false
      }
    }
    case ALL_SWAP_EXERCISE_ERROR: {
      return {
        ...state,
        loading: false
      }
    }

    case REPS_WEIGHT_SUCCESS:
      return {
        ...state,
        repsWeight: action.data,
        loader: false
      }

    case PICK_SESSION: {
      return {
        ...state,
        exerciseObj: action.exerciseObj,
        selectedSession: action.selectedSession,
        nextWorkout: action.nextWorkout
      }
    }

    case SETS_DONE_REQUEST:
      return {
        ...state,
        setLoading: true
      }

    case WORKOUT_DONE_SUCCESS:
      return {
        ...state,
        setDone: action.data,
        setLoading: false
      }

    case SETS_DONE_SUCCESS:
      return {
        ...state,
        // setDone: action.data,
        setLoading: false
      }

    default:
      return state
  }
}

async function getWeekSessionAPI(data) {
  const token = await AsyncStorage.getItem("authToken")
  const URL = `${API_URL}/session/?date=${data}`
  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`
    },
    method: "GET"
  }
  return XHR(URL, options)
}

async function getAllSessionAPI(data) {
  const token = await AsyncStorage.getItem("authToken")
  const URL_All = `${API_URL}/session/?all=true`
  const URL = `${API_URL}/session/`
  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`
    },
    method: "GET"
  }
  return XHR(data ? URL_All : URL, options)
}

function* getAllSessions({ data }) {
  try {
    if (data && data !== "all") {
      const response = yield call(getWeekSessionAPI, data)
      // const query = sortSessionBySets(response?.data?.query)
      const query = response?.data?.query
      yield put(getWeekSessionSuccess({ ...response?.data, query }))
    } else {
      const response = yield call(getAllSessionAPI, data)
      // const query = sortSessionBySets(response?.data?.query)
      const query = response?.data?.query
      yield put(getAllSessionSuccess({ ...response?.data, query }))
    }
  } catch (e) {
    yield put(getAllSessionSuccess(false))
  }
}

async function getTodaySessionAPI(data) {
  const token = await AsyncStorage.getItem("authToken")
  const URL = `${API_URL}/session/get_by_day/?day=${data}`
  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`
    },
    method: "GET"
  }
  return XHR(URL, options)
}

function* getTodaySessions({ data, isTrue }) {
  try {
    const response = yield call(getTodaySessionAPI, data)
    // const query = sortSessionBySets(response?.data?.query);
    yield put(getDaySessionSuccess(response.data))
    if (isTrue) {
      yield put(pickSession(null, response?.data?.workouts, null))
      navigate("ExerciseScreen", {
        workouts: response?.data?.workouts,
        item: response?.data
      })
    }
  } catch (e) {
    yield put(getDaySessionSuccess(false))
  }
}

async function updateRepsAPI(id, data) {
  const token = await AsyncStorage.getItem("authToken")
  const URL = `${API_URL}/set/${id}/`
  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`
    },
    method: "PATCH",
    data: { reps: data }
  }
  return XHR(URL, options)
}

async function updateWeightAPI(id, data) {
  const token = await AsyncStorage.getItem("authToken")
  const URL = `${API_URL}/set/${id}/`
  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`
    },
    method: "PATCH",
    data: { weight: data }
  }
  return XHR(URL, options)
}

async function updateSetDoneAPI(id, data) {
  const token = await AsyncStorage.getItem("authToken")
  const URL = `${API_URL}/set/${id}/`
  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`
    },
    method: "PATCH",
    data: { done: data }
  }
  return XHR(URL, options)
}

async function updateRepsWeightAPI(id) {
  const token = await AsyncStorage.getItem("authToken")
  const URL = `${API_URL}/set/${id}/`
  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`
    },
    method: "PATCH"
  }
  return XHR(URL, options)
}

function* updateRepsWeight({ id, data, dd, callBack }) {
  try {
    if (dd === "reps") {
      const response = yield call(updateRepsAPI, id, data)
      yield put(repsWeightSuccess(response.data))
    } else if (dd === "weight") {
      const response = yield call(updateWeightAPI, id, data)

      yield put(repsWeightSuccess(response.data))
    } else if (dd === true) {
      const response = yield call(updateSetDoneAPI, id, data)

      yield put(repsWeightSuccess(response.data))
      const newDate = moment(new Date()).format("YYYY-MM-DD")
      yield put(getAllSessionRequest(newDate))
    } else {
      const response = yield call(updateRepsWeightAPI, id)
      if (response?.data) {
        yield put(repsWeightSuccess(response?.data))
        if (callBack) {
          callBack(response?.data)
        }
      }
    }
  } catch (e) {
    yield put(repsWeightSuccess(false))
  }
}

// <==================================>
async function updateCustomRepsAPI(id) {
  const token = await AsyncStorage.getItem("authToken")
  const URL = `${API_URL}/custom_set/${id}/`

  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`
    },
    method: "PATCH"
  }
  return XHR(URL, options)
}

function* updateCustomRepsWeight({ id, data, dd, callBack }) {
  try {
    if (dd === "reps") {
      const response = yield call(updateRepsAPI, id, data)
      yield put(repsWeightSuccess(response.data))
    } else if (dd === "weight") {
      const response = yield call(updateWeightAPI, id, data)

      yield put(repsWeightSuccess(response.data))
    } else if (dd === true) {
      const response = yield call(updateSetDoneAPI, id, data)

      yield put(repsWeightSuccess(response.data))
      const newDate = moment(new Date()).format("YYYY-MM-DD")
      yield put(getAllSessionRequest(newDate))
    } else {
      const response = yield call(updateCustomRepsAPI, id)
      if (response?.data) {
        yield put(repsCutsomWeightSuccess(response?.data))
        if (callBack) {
          callBack(response?.data)
        }
      }
    }
  } catch (e) {

    yield put(repsCutsomWeightSuccess(false))
  }
}
// <==================================>
async function setDoneAPI(id) {
  const token = await AsyncStorage.getItem("authToken")
  const URL = `${API_URL}/session/mark_set_done/`
  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`
    },
    method: "POST",
    data: { id: id }
  }
  return XHR(URL, options)
}

function* setDoneAction({ id, data }) {
  try {
    const { activeSet, active, selectedSession, setTimmer } = data
    const response = yield call(setDoneAPI, id)
    yield put(setDoneSuccess(response.data))
    selectedSession[active].sets[activeSet]["done"] = true
    const isAllDOne = selectedSession[active]?.sets?.every(set => set.done)
    if (isAllDOne) {
      selectedSession[active]["done"] = true
      yield put(workoutDone(selectedSession[active]?.id))
    } else {
      setTimmer(true)
    }
    const [itemWorkoutUndone, nextWorkout] = selectedSession.filter(
      workoutItem => !workoutItem.done
    )

    yield put(pickSession(itemWorkoutUndone, selectedSession, nextWorkout))
    yield put(repsWeightRequest(id, null, null))
    const newDate = moment(new Date()).format("YYYY-MM-DD")
    yield put(getAllSessionRequest(newDate))
  } catch (e) {
    yield put(setDoneSuccess(false))
  }
}

async function workoutDoneAPI(id) {
  const token = await AsyncStorage.getItem("authToken")
  const URL = `${API_URL}/session/mark_workout_done/`
  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`
    },
    method: "POST",
    data: { id: id }
  }
  return XHR(URL, options)
}

function* workoutDoneCompleted({ id }) {
  try {
    const response = yield call(workoutDoneAPI, id)
    yield put(workoutDoneSuccess(response.data))
    const newDate = moment(new Date()).format("YYYY-MM-DD")
    yield put(getAllSessionRequest(newDate))
  } catch (e) {
    yield put(workoutDoneSuccess(false))
  }
}

async function sessionDoneAPI(id) {
  const token = await AsyncStorage.getItem("authToken")
  const URL = `${API_URL}/session/mark_session_done/`
  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`
    },
    method: "POST",
    data: { id: id }
  }
  return XHR(URL, options)
}

function* sessionDoneCompleted({ id, screenNavigation }) {
  try {
    const response = yield call(sessionDoneAPI, id)
    if (screenNavigation) {
      screenNavigation()
    }

    yield put(sessionDoneSuccess(response.data))
    const newDate = moment(new Date()).format("YYYY-MM-DD")
    yield put(getAllSessionRequest(newDate))
    // goBack();
  } catch (e) {
    yield put(sessionDoneSuccess(false))
  }
}

async function swapExercisesAPI(data) {
  const token = await AsyncStorage.getItem("authToken")
  const URL = `${API_URL}/session/swap_exercise/`
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

function* swapExercisesData({ data, date_time }) {
  try {
    const response = yield call(swapExercisesAPI, data)
    yield put(swapExerciseisTrue())

    const newDate = moment(date_time).format("YYYY-MM-DD")
    yield put(getDaySessionRequest(newDate, true))
  } catch (e) {
    yield put(swapExerciseisTrue())
  }
}

async function allSwapExerciseAPI(exerciseId) {
  const token = await AsyncStorage.getItem("authToken")
  const URL = `${API_URL}/session/list_exercises/?id=${exerciseId}`
  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`
    },
    method: "GET"
  }
  return XHR(URL, options)
}

function* allSwapExerciseData({ exerciseId }) {
  try {
    const response = yield call(allSwapExerciseAPI, exerciseId)
    yield put(allSwapExerciseSuccess(response.data))
  } catch (e) {
    yield put(allSwapExerciseError())
  }
}

export default all([
  takeLatest(ALL_SESSIONS_REQUEST, getAllSessions),
  takeLatest(REPS_WEIGHT_REQUEST, updateRepsWeight),
  takeLatest(REPS_CUSTOM_WEIGHT_REQUEST, updateCustomRepsWeight),
  takeLatest(SETS_DONE_REQUEST, setDoneAction),
  takeLatest(TODAY_SESSIONS_REQUEST, getTodaySessions),
  takeLatest(WORKOUT_DONE_REQUEST, workoutDoneCompleted),
  takeLatest(SESSION_DONE_REQUEST, sessionDoneCompleted),
  takeLatest(SWAP_EXERCISE, swapExercisesData),
  takeLatest(ALL_SWAP_EXERCISE, allSwapExerciseData)
])
