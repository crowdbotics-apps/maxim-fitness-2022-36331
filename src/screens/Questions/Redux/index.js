import { all, call, put, takeLatest } from 'redux-saga/effects';
import AsyncStorage from '@react-native-async-storage/async-storage';
//URL
import { API_URL } from '../../../config/app';

//XHR
import XHR from '../../../utils/XHR';

// Action
import { profileData } from '../../../ScreenRedux/profileRedux'

const UPDATE_ANSWERS = 'Questions/redux/UPDATE_ANSWERS';
const RENDER_DATA = 'Questions/redux/RENDER_DATA';

const QUESTION_DATA_REQUEST = 'QuestionScreen/QUESTION_DATA_REQUEST';
const QUESTION_DATA_SUCCESS = 'QuestionScreen/QUESTION_DATA_SUCCESS';
const QUESTION_DATA_FAILURE = 'QuestionScreen/QUESTION_DATA_FAILURE';

export const renderTabs = () => ({
  type: RENDER_DATA
});

export const updateAnswer = data => ({
  type: UPDATE_ANSWERS,
  data,
});

export const submitQuestionRequest = (profile, data) => ({
  type: QUESTION_DATA_REQUEST,
  profile,
  data
});

export const submitQuestionSuccess = data => ({
  type: QUESTION_DATA_SUCCESS,
  data,
});

export const submitQuestionFailure = error => ({
  type: QUESTION_DATA_FAILURE,
  error,
});

const initialState = {
  answers: {},
  requesting: false,
  questionSuccess: false,
  questionError: false,
  renderTab: false,
};

//Reducers
export const questionReducer = (state = initialState, action) => {
  switch (action.type) {
    case RENDER_DATA:
      return {
        ...state,
        renderTab: true,
      };

    case UPDATE_ANSWERS:
      return {
        ...state,
        answers: action.data,
      };

    case QUESTION_DATA_REQUEST:
      return {
        ...state,
        requesting: true,
      };

    case QUESTION_DATA_SUCCESS:
      return {
        ...state,
        questionSuccess: action.data,
        requesting: false,
      };

    case QUESTION_DATA_FAILURE:
      return {
        ...state,
        questionError: action.data,
        requesting: false,
      };

    default:
      return state;
  }
};

async function profileDataAPI(profile, data) {
  const token = await AsyncStorage.getItem('authToken')
  const URL = `${API_URL}/profile/${profile.id}/`;
  const options = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
    method: 'PATCH',
    data,
  };
  return XHR(URL, options);
}

async function submitQuestionAPI(data) {
  const token = await AsyncStorage.getItem('authToken')
  const URL = `${API_URL}/form/set_program/`;
  const options = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
    method: 'POST',
    data,
  };
  return XHR(URL, options);
}

function* submitQuestion({ profile, data }) {
  try {
    const res = yield call(profileDataAPI, profile, data);
    console.log('Questions data res: ', res);
    if (res) {
      const response = yield call(submitQuestionAPI, data);
      if (response.status === 200) {
        yield put(profileData())
      }
    }
    yield put(submitQuestionSuccess(true));
  } catch (error) {
    console.log('Questions data error: ', error);
    yield put(submitQuestionSuccess(false));
  }
}
export default all([takeLatest(QUESTION_DATA_REQUEST, submitQuestion)]);
