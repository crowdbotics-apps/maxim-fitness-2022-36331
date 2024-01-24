import React, { useContext } from "react"
import { Provider as ReduxProvider } from "react-redux"
import { LogBox } from "react-native"
import "react-native-gesture-handler"
import { theme } from "@options"
import FlashMessage from "react-native-flash-message"
import messaging from "@react-native-firebase/messaging"
import { persistStore } from "redux-persist"
import { PersistGate } from "redux-persist/integration/react"
import { NativeBaseProvider } from "native-base"
import Navigation from "src/navigation"
import { PubNubProvider } from "pubnub-react"
import PubNub from "pubnub"
import { PUBNUB_PUBLISH_KEY, PUBNUB_SUBSCRIBE_KEY } from "@env"
import { MenuProvider } from "react-native-popup-menu"
import { navigate } from "./src/navigation/NavigationService"

LogBox.ignoreLogs(["Warning: ..."])
LogBox.ignoreAllLogs()

import { store } from "src/redux/store"

const pubnub = new PubNub({
  publishKey: PUBNUB_PUBLISH_KEY,
  subscribeKey: PUBNUB_SUBSCRIBE_KEY,
  userId: "myUniqueUUIDDD",
  restore: true
  // logVerbosity: true
})

const App = () => {
  const persistor = persistStore(store)

  // messaging().setBackgroundMessageHandler(async payload => {
  //   if (payload?.data?.post) {
  //   }
  // })

  messaging().onNotificationOpenedApp(remoteMessage => {
    if (remoteMessage?.data?.post) {
      navigate("ViewPost", remoteMessage?.data?.post)
    }
  })

  return (
    <PubNubProvider client={pubnub}>
      <ReduxProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NativeBaseProvider theme={theme}>
            <MenuProvider>
              <Navigation />
            </MenuProvider>
            <FlashMessage />
          </NativeBaseProvider>
        </PersistGate>
      </ReduxProvider>
    </PubNubProvider>
  )
}

export default App
