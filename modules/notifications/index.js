import React, { useEffect, useContext } from "react"
import { SafeAreaView } from "react-native"
import Notifications from "./flatlist"

const PushNotifications = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Notifications />
    </SafeAreaView>
  )
}

export default {
  title: "Push Notifications",
  navigator: PushNotifications
}
