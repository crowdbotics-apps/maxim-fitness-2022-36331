import { all, call, put, takeLatest } from 'redux-saga/effects';
import AsyncStorage from '@react-native-async-storage/async-storage';

// config
import { API_URL } from '../config/app';

// utils
import XHR from 'src/utils/XHR';

const ALLSESSIONS_REQUEST = 'ProgramScreen/ALLSESSIONS_REQUEST';
const ALLSESSIONSSUCCESS = 'ProgramScreen/ALLSESSIONSSUCCESS';

export const getAllSessionRequest = data => ({
  type: ALLSESSIONS_REQUEST,
  data,
});

export const getAllSessionSuccess = data => ({
  type: ALLSESSIONSSUCCESS,
  data,
});

const initialState = {
  requesting: false,
  getAllSessions: false,
};

export const programReducer = (state = initialState, action) => {
  switch (action.type) {
    case ALLSESSIONS_REQUEST:
      return {
        ...state,
        requesting: true,
      };

    case ALLSESSIONSSUCCESS:
      return {
        ...state,
        getAllSessions: action.data,
        requesting: false,
      };

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

export default all([takeLatest(ALLSESSIONS_REQUEST, getAllSessions)]);
