import { Platform } from "react-native"
import { API_URL } from "../../src/config/app"
import AsyncStorage from "@react-native-async-storage/async-storage"

// const global = getGlobalOptions();
// Change your BASE_URL in `options/options.js` to edit this value
const BASE_URL = API_URL

export const registerDeviceInfoAPI = async (data, authToken) => {
  const iosUrl = `${BASE_URL}/user_fcm_device_add/`
  const androidUrl = `${BASE_URL}/user_fcm_device_add/`
  const response = await fetch(
    Platform.OS === "android" ? androidUrl : iosUrl,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: "token " + authToken
      },
      method: "POST",
      body: JSON.stringify(data)
    }
  )

  const res = await response.json()
  return res
}

export const fetchNotifications = async page => {
  const authToken = await AsyncStorage.getItem("authToken")
  const response = await fetch(`${BASE_URL}/notification/?page=${page}`, {
    method: "GET",
    headers: {
      Authorization: "token " + authToken
    }
  })
  const res = await response.json()
  return res
}
