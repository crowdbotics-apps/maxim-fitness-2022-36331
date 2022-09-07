import axios from 'axios';

export const SERVICE_URL = 'https://brayden-christenson-33960.botics.co'; // your app back-end url

const httpClient = axios.create({
  baseURL: SERVICE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }
})

export const setAuthToken = token => {
  httpClient.defaults.headers.common.Authorization = `Token ${token}`;
}

export default httpClient;
