import React, { useContext } from "react"
import { Provider as ReduxProvider } from 'react-redux'
import "react-native-gesture-handler"
import { theme } from '@options'
import FlashMessage from 'react-native-flash-message'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import { NativeBaseProvider } from 'native-base'
import Navigation from 'src/navigation'

import PubNub from 'pubnub';
import { PubNubProvider } from 'pubnub-react';
// import { PUBNUB_PUBLISH_KEY, PUBNUB_SUBSCRIBE_KEY } from '@env';

import { store } from 'src/redux/store'

const App = () => {
  const persistor = persistStore(store);

  // const pubnub = new PubNub({
  //   publishKey: PUBNUB_PUBLISH_KEY,
  //   subscribeKey: PUBNUB_SUBSCRIBE_KEY,
  //   uuid: 'myUniqueUUIDDD',
  // });

  return (
    // <PubNubProvider client={pubnub}>
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NativeBaseProvider theme={theme}>
          <Navigation />
          <FlashMessage />
        </NativeBaseProvider>
      </PersistGate>
    </ReduxProvider>
    // </PubNubProvider>
  )
}

export default App
