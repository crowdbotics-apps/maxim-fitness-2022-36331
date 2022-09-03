import {all} from 'redux-saga/effects';

// sagas
// import signup from 'screens/Signup/redux/sagas';
// import signin from 'screens/SignIn/redux/sagas';
import SignIn from '../ScreenRedux/loginRedux';
import SignUp from '../ScreenRedux/signUpRedux';

export function* mainSaga() {
  yield all([SignIn, SignUp]);
}
