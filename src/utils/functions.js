import moment from "moment"
import { Platform, PermissionsAndroid } from "react-native"
import { request, PERMISSIONS, RESULTS } from "react-native-permissions"

export const getMessageTime = dateString => {
  const messageDate = moment(new Date(dateString))
  return messageDate.format("DD/MM/YYYY") + " - " + messageDate.format("H:mm")
}

export const letterCapitalize = str => {
  return str?.replace(/\b\w/g, function (char) {
    return char.toUpperCase()
  })
}
export const calculatePostTime = item => {
  const today = new Date()
  const endDate = new Date(item && item.created_at)

  const timeDifference = today.getTime() - endDate.getTime()
  const seconds = Math.floor(timeDifference / 1000)
  const minutes = Math.floor(timeDifference / (1000 * 60))
  const hours = Math.floor(timeDifference / (1000 * 60 * 60))
  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24))
  const months = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 30))
  const years = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 30 * 12))

  if (years > 0) {
    return years + " y"
  }
  if (months > 0) {
    return months + " m"
  }
  if (days > 0) {
    return days + " d"
  }
  if (hours > 0) {
    return hours + " h"
  }
  if (minutes > 0) {
    return minutes + " min"
  }
  if (seconds > 0) {
    return seconds + " s"
  }

  // If no significant time has passed, you might want to display "Just now" or similar
  return "Just now"
}

export const checkAndRequestMicrophonePermission = async () => {
  try {
    if (Platform.OS === "android") {
      const permissionStatus = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
      )

      if (permissionStatus === PermissionsAndroid.RESULTS.GRANTED) {
        // Microphone permission already granted
        return true
      } else {
        // Request microphone permission
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
        )

        if (result === PermissionsAndroid.RESULTS.GRANTED) {
          // Microphone permission granted
          return true
        } else {
          // Microphone permission denied
          return false
        }
      }
    } else if (Platform.OS === "ios") {
      const permissionStatus = await request(PERMISSIONS.IOS.MICROPHONE)

      if (permissionStatus === RESULTS.GRANTED) {
        // Microphone permission granted
        return true
      } else {
        // Microphone permission denied
        return false
      }
    }
  } catch (error) {
    console.error("Error checking or requesting microphone permission:", error)
    return false
  }
}