import { persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage'

// reducers
import { signUpReducer } from '../ScreenRedux/signUpRedux'
import { loginReducer } from '../ScreenRedux/loginRedux'
import { addPostReducer } from '../ScreenRedux/addPostRequest'
import { postReducer } from '../ScreenRedux/viewPostRedux'
import { feedsReducer } from '../ScreenRedux/feedRedux'
import { subscriptionReducer } from '../ScreenRedux/subscriptionRedux'
import { programReducer } from '../ScreenRedux/programServices'
import { profileReducer } from '../ScreenRedux/profileRedux'
import { questionReducer } from '../screens/Questions/Redux'
import { customCalReducer } from '../ScreenRedux/customCalRedux'
import { userProfileReducer } from '../ScreenRedux/searchProfileRedux'
import { nutritionReducer } from '../ScreenRedux/nutritionRedux'
import { addExerciseReducer } from '../ScreenRedux/addExerciseRedux'

const appPersistConfig = {
  key: 'login',
  storage: AsyncStorage,
  timeout: null,
};

export default {
  login: persistReducer(appPersistConfig, loginReducer),
  signUpReducer,
  feedsReducer,
  addPostReducer,
  postReducer,
  subscriptionReducer,
  programReducer,
  profileReducer,
  questionReducer,
  customCalReducer,
  userProfileReducer,
  nutritionReducer,
  addExerciseReducer
};
