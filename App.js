import React from 'react';
import {ThemeProvider} from 'react-native-elements';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {theme} from '@options';
import {store} from 'src/redux/store';
import {Provider as ReduxProvider} from 'react-redux';
import {persistStore} from 'redux-persist';
import {PersistGate} from 'redux-persist/integration/react';
import Navigation from 'navigation';
const App = () => {
  const persistor = persistStore(store);
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <ReduxProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider theme={theme}>
            <Navigation />
          </ThemeProvider>
        </PersistGate>
      </ReduxProvider>
    </GestureHandlerRootView>
  );
};
export default App;