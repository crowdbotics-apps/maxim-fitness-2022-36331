import { all, call, put, takeLatest } from 'redux-saga/effects';
import AsyncStorage from '@react-native-async-storage/async-storage';

// config
import { API_URL } from '../config/app';

// utils
import XHR from 'src/utils/XHR';

const ALL_SESSIONS_REQUEST = 'ProgramScreen/ALL_SESSIONS_REQUEST';
const ALL_SESSIONS_SUCCESS = 'ProgramScreen/ALL_SESSIONS_SUCCESS';
const REPS_WEIGHT_REQUEST = 'ProgramScreen/REPS_WEIGHT_REQUEST';
const REPS_WEIGHT_SUCCESS = 'ProgramScreen/REPS_WEIGHT_SUCCESS';
const PICK_SESSION = 'ProgramScreen/PICK_SESSION';

export const getAllSessionRequest = data => ({
  type: ALL_SESSIONS_REQUEST,
  data,
});

export const getAllSessionSuccess = data => ({
  type: ALL_SESSIONS_SUCCESS,
  data,
});

export const repsWeightRequest = (id, data, dd) => ({
  type: REPS_WEIGHT_REQUEST,
  id,
  data,
  dd
});

export const repsWeightSuccess = data => ({
  type: REPS_WEIGHT_SUCCESS,
  data,
});

export const pickSession = (exerciseObj, selectedSession, nextWorkout) => ({
  type: PICK_SESSION,
  exerciseObj,
  selectedSession,
  nextWorkout
})

const initialState = {
  requesting: false,
  getAllSessions: false,
  loader: false,
  repsWeight: false,

  exerciseObj: false,
  selectedSession: false,
  nextWorkout: false
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

    default:
      return state;
  }
};

async function getAllSessionAPI(data) {
  const token = await AsyncStorage.getItem('authToken')
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

function* getAllSessions({ data }) {
  try {
    const response = yield call(getAllSessionAPI, data);
    console.log('response allsession: ', response);
    yield put(getAllSessionSuccess(response.data));
  } catch (e) {
    console.log('eee:', e);
    yield put(getAllSessionSuccess(false));
  }
}

async function updateRepsAPI(id, data) {
  console.log('id, data, dd: ', id, data);
  const token = await AsyncStorage.getItem('authToken')
  const URL = `${API_URL}/set/${id}/`;
  const options = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
    method: 'PATCH',
    data: { reps: data }
  };
  return XHR(URL, options);
}

async function updateWeightAPI(id, data) {
  const token = await AsyncStorage.getItem('authToken')
  const URL = `${API_URL}/set/${id}/`;
  const options = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
    method: 'PATCH',
    data: { weight: data }
  };
  return XHR(URL, options);
}

async function updateRepsWeightAPI(id) {
  const token = await AsyncStorage.getItem('authToken')
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
      console.log('reps weight response: ', response);
      yield put(repsWeightSuccess(response.data));
    } else if (dd === 'weight') {
      const response = yield call(updateWeightAPI, id, data);
      console.log('reps weight response: ', response);
      yield put(repsWeightSuccess(response.data));
    } else {
      const response = yield call(updateRepsWeightAPI, id);
      console.log('reps weight response: ', response);
      yield put(repsWeightSuccess(response.data));
    }
  } catch (e) {
    console.log('reps weight error:', e);
    yield put(repsWeightSuccess(false));
  }
}

export default all([
  takeLatest(ALL_SESSIONS_REQUEST, getAllSessions),
  takeLatest(REPS_WEIGHT_REQUEST, updateRepsWeight),
]);
