import {all} from 'redux-saga/effects';

// sagas
import SignIn from '../ScreenRedux/loginRedux';
import SignUp from '../ScreenRedux/signUpRedux';
import addPost from '../ScreenRedux/addPostRequest';

export function* mainSaga() {
  yield all([SignIn, SignUp, addPost]);
}
