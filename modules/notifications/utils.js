import { Platform, PermissionsAndroid, Alert, Linking } from "react-native"
import { getUniqueId, getAndroidId, getModel } from "react-native-device-info"
import { registerDeviceInfoAPI } from "./api"
import messaging from "@react-native-firebase/messaging"
import { check, request, PERMISSIONS } from "react-native-permissions"
/**
 * Request and generate Firebase Messaging token and store it in the DB via REST API
 * @param  {String} authToken Backend API authentication token
 * @param  {String} userID User Backend identifier
 * @return {Promise}
 */
const RemotePushController = async (authToken, userID) => {
  const registrationToken = await messaging().getToken()
  const androidId = await getAndroidId()
  const iosId = await getUniqueId()
  await registerDeviceInfoAPI(
    {
      user: userID,
      authToken: authToken,
      registration_id: registrationToken,
      type: Platform.OS,
      name: getModel(),
      active: true,
      device_id: Platform.OS === "android" ? androidId : iosId,
      cloud_message_type: "FCM"
    },
    authToken
  )
  if (Platform.OS === "android") {
    check(PERMISSIONS.ANDROID.POST_NOTIFICATIONS).then(async status => {
      if (
        status === PermissionsAndroid.RESULTS.DENIED ||
        status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
      ) {
        await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS)
      }
    })
  } else {
    const authorizationStatus = await messaging().requestPermission()

    if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
    } else if (
      authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL
    ) {
    } else {
      Alert.alert(
        "Notification Permission Denied",
        "To use this feature, you need to grant permission. Do you want to go to app settings?",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "OK",
            onPress: () => Linking.openURL("app-settings:")
          }
        ],
        { cancelable: false }
      )
    }
  }

  // }
}

export default RemotePushController
