import axios from 'axios'
// config
import { API_URL } from '../config/app'
// import { showMessage } from 'react-native-flash-message';

function parseJSON(response) {
  if (response.status === 204 || response.status === 205) {
    return null;
  }
  return response.json ? response.json() : response;
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  error.status = response.status;
  throw error;
}
// const handleTokenExpiry = async () => {
//   try {
//     await AsyncStorage.clear();
//     showMessage({
//       message: 'Session expired. Please login again',
//       type: 'danger',
//     });
//   } catch (err) {
//     console.log(err)
//   }
// };


export default (url, options) => axios(url, options).then(checkStatus).then(parseJSON)
// .catch(async (err) => {
//   if (err.response && err.response.status === 401) {
//     await handleTokenExpiry();
//   }
//   throw err;
// });
