import React from 'react';
import { ThemeProvider } from 'react-native-elements';
import { theme } from '@options';
import { store } from 'src/redux/store';
import { Provider as ReduxProvider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import FlashMessage from 'react-native-flash-message';
import Navigation from 'src/navigation';
import PubNub from 'pubnub';
import { PubNubProvider } from 'pubnub-react';
import { PUBNUB_PUBLISH_KEY, PUBNUB_SUBSCRIBE_KEY } from '@env';

const App = () => {
  const pubnub = new PubNub({
    publishKey: PUBNUB_PUBLISH_KEY,
    subscribeKey: PUBNUB_SUBSCRIBE_KEY,
    uuid: 'myUniqueUUIDDD',
  });

  const persistor = persistStore(store);
  return (
    <PubNubProvider client={pubnub}>
      <ReduxProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider theme={theme}>
            <Navigation />
            <FlashMessage />
          </ThemeProvider>
        </PersistGate>
      </ReduxProvider>
    </PubNubProvider>
  );
};
export default App;
