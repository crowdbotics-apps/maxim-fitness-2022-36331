import { all, call, put, takeLatest } from 'redux-saga/effects';
import AsyncStorage from '@react-native-async-storage/async-storage';

// config
import { API_URL } from '../config/app';

// utils
import XHR from 'src/utils/XHR';
import moment from 'moment';

import { sortSessionBySets } from '../utils/common';
import { goBack } from '../navigation/NavigationService';

const ALL_SESSIONS_REQUEST = 'ProgramScreen/ALL_SESSIONS_REQUEST';
const ALL_SESSIONS_SUCCESS = 'ProgramScreen/ALL_SESSIONS_SUCCESS';
const WEEK_SESSIONS_SUCCESS = 'ProgramScreen/WEEK_SESSIONS_SUCCESS';

const TODAY_SESSIONS_REQUEST = 'ProgramScreen/TODAY_SESSIONS_REQUEST';
const TODAY_SESSIONS_SUCCESS = 'ProgramScreen/TODAY_SESSIONS_SUCCESS';

const REPS_WEIGHT_REQUEST = 'ProgramScreen/REPS_WEIGHT_REQUEST';
const REPS_WEIGHT_SUCCESS = 'ProgramScreen/REPS_WEIGHT_SUCCESS';

const PICK_SESSION = 'ProgramScreen/PICK_SESSION';

const SETS_DONE_REQUEST = 'ProgramScreen/SETS_DONE_REQUEST';
const SETS_DONE_SUCCESS = 'ProgramScreen/SETS_DONE_SUCCESS';

const SESSION_DONE_REQUEST = 'ProgramScreen/SESSION_DONE_REQUEST';
const SESSION_DONE_SUCCESS = 'ProgramScreen/SESSION_DONE_SUCCESS';

const WORKOUT_DONE_REQUEST = 'ProgramScreen/WORKOUT_DONE_REQUEST';
const WORKOUT_DONE_SUCCESS = 'ProgramScreen/WORKOUT_DONE_SUCCESS';

const EXERCISE_DONE_REQUEST = 'ProgramScreen/EXERCISE_DONE_REQUEST';
const EXERCISE_DONE_SUCCESS = 'ProgramScreen/EXERCISE_DONE_SUCCESS';

export const getAllSessionRequest = data => ({
  type: ALL_SESSIONS_REQUEST,
  data,
});

export const getAllSessionSuccess = data => ({
  type: ALL_SESSIONS_SUCCESS,
  data,
});

export const getWeekSessionSuccess = data => ({
  type: WEEK_SESSIONS_SUCCESS,
  data,
});

export const getDaySessionRequest = data => ({
  type: TODAY_SESSIONS_REQUEST,
  data,
});

export const getDaySessionSuccess = data => ({
  type: TODAY_SESSIONS_SUCCESS,
  data,
});

export const repsWeightRequest = (id, data, dd) => ({
  type: REPS_WEIGHT_REQUEST,
  id,
  data,
  dd,
});

export const repsWeightSuccess = data => ({
  type: REPS_WEIGHT_SUCCESS,
  data,
});

export const pickSession = (exerciseObj, selectedSession, nextWorkout) => ({
  type: PICK_SESSION,
  exerciseObj,
  selectedSession,
  nextWorkout,
});

export const setDoneRequest = (id, data) => ({
  type: SETS_DONE_REQUEST,
  id,
  data,
});

export const workoutDone = id => ({
  type: WORKOUT_DONE_REQUEST,
  id,
});
export const workoutDoneSuccess = data => ({
  type: WORKOUT_DONE_SUCCESS,
  data,
});

export const sessionDone = id => ({
  type: SESSION_DONE_REQUEST,
  id,
});
export const sessionDoneSuccess = data => ({
  type: SESSION_DONE_SUCCESS,
  data,
});

export const setDoneSuccess = data => ({
  type: SETS_DONE_SUCCESS,
  data,
});

export const exerciseDoneRequest = data => ({
  type: EXERCISE_DONE_REQUEST,
  data,
});

export const exerciseDoneSuccess = data => ({
  type: EXERCISE_DONE_SUCCESS,
  data,
});

const initialState = {
  requesting: false,
  getAllSessions: false,
  getWeekSessions: false,

  loader: false,
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
};

export const programReducer = (state = initialState, action) => {
  switch (action.type) {
    case ALL_SESSIONS_REQUEST:
      return {
        ...state,
        requesting: true,
      };

    case ALL_SESSIONS_SUCCESS:
      return {
        ...state,
        getAllSessions: action.data,
        requesting: false,
      };

    case WEEK_SESSIONS_SUCCESS:
      return {
        ...state,
        getWeekSessions: action.data,
        requesting: false,
      };

    case TODAY_SESSIONS_REQUEST:
      return {
        ...state,
        todayRequest: true,
      };

    case TODAY_SESSIONS_SUCCESS:
      return {
        ...state,
        todaySessions: action.data,
        todayRequest: false,
      };

    case REPS_WEIGHT_REQUEST:
      return {
        ...state,
        loader: true,
      };

    case REPS_WEIGHT_SUCCESS:
      return {
        ...state,
        repsWeight: action.data,
        loader: false,
      };

    case PICK_SESSION: {
      return {
        ...state,
        exerciseObj: action.exerciseObj,
        selectedSession: action.selectedSession,
        nextWorkout: action.nextWorkout,
      };
    }

    case SETS_DONE_REQUEST:
      return {
        ...state,
        setLoading: true,
      };

    case WORKOUT_DONE_SUCCESS:
      return {
        ...state,
        setDone: action.data,
        setLoading: false,
      };

    case SETS_DONE_SUCCESS:
      return {
        ...state,
        // setDone: action.data,
        setLoading: false,
      };

    case EXERCISE_DONE_REQUEST:
      return {
        ...state,
        exeLoading: true,
      };

    case EXERCISE_DONE_SUCCESS:
      return {
        ...state,
        exerciseDone: action.data,
        exeLoading: false,
      };

    default:
      return state;
  }
};

async function getWeekSessionAPI(data) {
  const token = await AsyncStorage.getItem('authToken');
  const URL = `${API_URL}/session/?date=${data}`;
  const options = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
    method: 'GET',
  };
  return XHR(URL, options);
}

async function getAllSessionAPI() {
  const token = await AsyncStorage.getItem('authToken');
  const URL = `${API_URL}/session/`;
  const options = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
    method: 'GET',
  };
  return XHR(URL, options);
}

function* getAllSessions({ data }) {
  try {
    if (data) {
      const response = yield call(getWeekSessionAPI, data);
      const query = sortSessionBySets(response?.data?.query);
      yield put(getWeekSessionSuccess({ ...response?.data, query }));
    } else {
      const response = yield call(getAllSessionAPI);
      const query = sortSessionBySets(response?.data?.query);
      yield put(getAllSessionSuccess({ ...response?.data, query }));
    }
  } catch (e) {
    yield put(getAllSessionSuccess(false));
  }
}

async function getTodaySessionAPI(data) {
  const token = await AsyncStorage.getItem('authToken');
  const URL = `${API_URL}/session/get_by_day/?day=${data}`;
  const options = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
    method: 'GET',
  };
  return XHR(URL, options);
}

function* getTodaySessions({ data }) {
  try {
    const response = yield call(getTodaySessionAPI, data);
    // const query = sortSessionBySets(response?.data?.query);
    yield put(getDaySessionSuccess(response.data));
  } catch (e) {
    yield put(getDaySessionSuccess(false));
  }
}

async function updateRepsAPI(id, data) {
  const token = await AsyncStorage.getItem('authToken');
  const URL = `${API_URL}/set/${id}/`;
  const options = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
    method: 'PATCH',
    data: { reps: data },
  };
  return XHR(URL, options);
}

async function updateWeightAPI(id, data) {
  const token = await AsyncStorage.getItem('authToken');
  const URL = `${API_URL}/set/${id}/`;
  const options = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
    method: 'PATCH',
    data: { weight: data },
  };
  return XHR(URL, options);
}

async function updateSetDoneAPI(id, data) {
  const token = await AsyncStorage.getItem('authToken');
  const URL = `${API_URL}/set/${id}/`;
  const options = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
    method: 'PATCH',
    data: { done: data },
  };
  return XHR(URL, options);
}

async function updateRepsWeightAPI(id) {
  const token = await AsyncStorage.getItem('authToken');
  const URL = `${API_URL}/set/${id}/`;
  const options = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
    method: 'PATCH',
  };
  return XHR(URL, options);
}

function* updateRepsWeight({ id, data, dd }) {
  try {
    if (dd === 'reps') {
      const response = yield call(updateRepsAPI, id, data);

      yield put(repsWeightSuccess(response.data));
    } else if (dd === 'weight') {
      const response = yield call(updateWeightAPI, id, data);

      yield put(repsWeightSuccess(response.data));
    } else if (dd === true) {
      const response = yield call(updateSetDoneAPI, id, data);

      yield put(repsWeightSuccess(response.data));
      const newDate = moment(new Date()).format('YYYY-MM-DD');
      yield put(getAllSessionRequest(newDate));
    } else {
      const response = yield call(updateRepsWeightAPI, id);
      yield put(repsWeightSuccess(response.data));
    }
  } catch (e) {
    yield put(repsWeightSuccess(false));
  }
}

async function setDoneAPI(id) {
  const token = await AsyncStorage.getItem('authToken');
  const URL = `${API_URL}/session/mark_set_done/`;
  const options = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
    method: 'POST',
    data: { id: id },
  };
  return XHR(URL, options);
}

function* setDoneAction({ id, data }) {
  try {
    const { activeSet, active, selectedSession } = data;
    const response = yield call(setDoneAPI, id);
    yield put(setDoneSuccess(response.data));
    selectedSession[active].sets[activeSet]['done'] = true;
    const isAllDOne = selectedSession[active]?.sets?.every(set => set.done);
    if (isAllDOne) {
      selectedSession[active]['done'] = true;
      yield put(workoutDone(selectedSession[active]?.id));
    }
    const [itemWorkoutUndone, nextWorkout] = selectedSession.filter(
      workoutItem => !workoutItem.done
    );

    yield put(pickSession(itemWorkoutUndone, selectedSession, nextWorkout));
    yield put(repsWeightRequest(id, null, null));
    const newDate = moment(new Date()).format('YYYY-MM-DD');
    yield put(getAllSessionRequest(newDate));
  } catch (e) {
    yield put(setDoneSuccess(false));
  }
}

async function workoutDoneAPI(id) {
  const token = await AsyncStorage.getItem('authToken');
  const URL = `${API_URL}/session/mark_workout_done/`;
  const options = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
    method: 'POST',
    data: { id: id },
  };
  return XHR(URL, options);
}

function* workoutDoneCompleted({ id }) {
  try {
    const response = yield call(workoutDoneAPI, id);
    yield put(workoutDoneSuccess(response.data));
    const newDate = moment(new Date()).format('YYYY-MM-DD');
    yield put(getAllSessionRequest(newDate));
  } catch (e) {
    yield put(workoutDoneSuccess(false));
  }
}

async function sessionDoneAPI(id) {
  const token = await AsyncStorage.getItem('authToken');
  const URL = `${API_URL}/session/mark_session_done/`;
  const options = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
    method: 'POST',
    data: { id: id },
  };
  return XHR(URL, options);
}

function* sessionDoneCompleted({ id }) {
  try {
    const response = yield call(sessionDoneAPI, id);
    yield put(sessionDoneSuccess(response.data));
    const newDate = moment(new Date()).format('YYYY-MM-DD');
    yield put(getAllSessionRequest(newDate));
    goBack();
  } catch (e) {
    yield put(sessionDoneSuccess(false));
  }
}
export default all([
  takeLatest(ALL_SESSIONS_REQUEST, getAllSessions),
  takeLatest(REPS_WEIGHT_REQUEST, updateRepsWeight),
  takeLatest(SETS_DONE_REQUEST, setDoneAction),
  takeLatest(TODAY_SESSIONS_REQUEST, getTodaySessions),
  takeLatest(WORKOUT_DONE_REQUEST, workoutDoneCompleted),
  takeLatest(SESSION_DONE_REQUEST, sessionDoneCompleted),
]);
