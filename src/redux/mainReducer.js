import {persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

// reducers
// import signup from 'screens/Signup/redux/reducer';
// import signin from 'screens/SignIn/redux/reducer';
import {signUpReducer} from '../ScreenRedux/signUpRedux'
import {loginReducer} from '../ScreenRedux/loginRedux' 

const appPersistConfig = {
  key: 'login',
  storage: AsyncStorage,
  timeout: null,
};

export default {
  login: persistReducer(appPersistConfig, loginReducer),
  signUpReducer
};
