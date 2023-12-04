import React, { useContext } from "react"
import { Provider as ReduxProvider } from 'react-redux'
import "react-native-gesture-handler"
import { theme } from '@options'
import FlashMessage from 'react-native-flash-message'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import { NativeBaseProvider } from 'native-base';
import Navigation from 'src/navigation'

import { store } from 'src/redux/store'

const App = () => {
  const persistor = persistStore(store);

  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NativeBaseProvider theme={theme}>
          <Navigation />
          <FlashMessage />
        </NativeBaseProvider>
      </PersistGate>
    </ReduxProvider>
  )
}

export default App
