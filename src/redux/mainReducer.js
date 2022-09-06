import {persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

// reducers
import {signUpReducer} from '../ScreenRedux/signUpRedux'
import {loginReducer} from '../ScreenRedux/loginRedux'
import {addPostReducer} from '../ScreenRedux/addPostRequest'
import {feedsReducer} from '../ScreenRedux/feedRedux';

const appPersistConfig = {
  key: 'login',
  storage: AsyncStorage,
  timeout: null,
};

export default {
  login: persistReducer(appPersistConfig, loginReducer),
  signUpReducer,
  feedsReducer,
  addPostReducer
};
