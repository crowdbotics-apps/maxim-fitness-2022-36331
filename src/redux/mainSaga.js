import {all} from 'redux-saga/effects'

// sagas
import SignIn from '../ScreenRedux/loginRedux'
import SignUp from '../ScreenRedux/signUpRedux'
import addPost from '../ScreenRedux/addPostRequest'
import feedSaga from '../ScreenRedux/feedRedux'
import ViewPost from '../ScreenRedux/viewPostRedux';
export function* mainSaga() {
  yield all([SignIn, SignUp, feedSaga, addPost, ViewPost]);
}
