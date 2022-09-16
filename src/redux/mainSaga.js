import { all } from 'redux-saga/effects'

// sagas
import SignIn from '../ScreenRedux/loginRedux'
import SignUp from '../ScreenRedux/signUpRedux'
import addPost from '../ScreenRedux/addPostRequest'
import feedSaga from '../ScreenRedux/feedRedux'
import ViewPost from '../ScreenRedux/viewPostRedux'
import subscriptionSaga from '../ScreenRedux/subscriptionRedux'
import programSaga from '../ScreenRedux/programServices'
import profileSaga from '../ScreenRedux/profileRedux'
import customCalRedux from '../ScreenRedux/customCalRedux'
export function* mainSaga() {
  yield all([
    SignIn,
    SignUp,
    feedSaga,
    addPost,
    ViewPost,
    subscriptionSaga,
    programSaga,
    profileSaga,
    customCalRedux
  ]);
}
