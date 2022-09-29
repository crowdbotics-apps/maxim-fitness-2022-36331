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
import questionRedux from '../screens/Questions/Redux'
import searchProfileRedux from '../ScreenRedux/searchProfileRedux'
import settingRedux from '../ScreenRedux/settingScreenRedux'
import nutritionRedux from '../ScreenRedux/nutritionRedux'
import addExerciseRedux from '../ScreenRedux/addExerciseRedux'
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
    customCalRedux,
    questionRedux,
    searchProfileRedux,
    settingRedux,
    nutritionRedux,
    addExerciseRedux
  ]);
}
