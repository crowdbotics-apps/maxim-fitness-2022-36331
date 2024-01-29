import React, { useEffect, useState } from "react"
import { Provider as ReduxProvider } from "react-redux"
import { LogBox, Appearance } from "react-native"
import "react-native-gesture-handler"
import { theme } from "@options"
import FlashMessage from "react-native-flash-message"
import { persistStore } from "redux-persist"
import { PersistGate } from "redux-persist/integration/react"
import { NativeBaseProvider } from "native-base"
import Navigation from "src/navigation"
import { MenuProvider } from "react-native-popup-menu"

LogBox.ignoreLogs(["Warning: ..."])
LogBox.ignoreAllLogs()

import { store } from "src/redux/store"

const App = () => {
  const [themes, setThemes] = useState(theme)

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setThemes(colorScheme)
    })

    return () => {
      subscription.remove()
    }
  }, [])

  const persistor = persistStore(store)

  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NativeBaseProvider theme={themes}>
          <MenuProvider>
            <Navigation />
          </MenuProvider>
          <FlashMessage />
        </NativeBaseProvider>
      </PersistGate>
    </ReduxProvider>
  )
}

export default App
