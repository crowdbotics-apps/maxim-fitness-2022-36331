import { all } from "redux-saga/effects"

// sagas
import SignIn from "../ScreenRedux/loginRedux"
import SignUp from "../ScreenRedux/signUpRedux"
import FeedRedux from "../screens/Feeds/redux"
import addPost from "../ScreenRedux/addPostRequest"
import ViewPost from "../ScreenRedux/viewPostRedux"

export function* mainSaga() {
  yield all([SignIn, SignUp, feedSaga, addPost, ViewPost])
}
