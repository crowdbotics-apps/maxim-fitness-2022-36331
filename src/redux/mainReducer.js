import {persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

// reducers
// import signup from 'screens/Signup/redux/reducer';
// import signin from 'screens/SignIn/redux/reducer';

const appPersistConfig = {
  key: 'signin',
  storage: AsyncStorage,
  timeout: null,
};

export default {
  // signin: persistReducer(appPersistConfig, signin),
  // signup,
};
