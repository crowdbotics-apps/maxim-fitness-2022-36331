import React from 'react'
import { ThemeProvider } from 'react-native-elements'
import { theme } from '@options'
import { store } from 'src/redux/store'
import { Provider as ReduxProvider } from 'react-redux'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import FlashMessage from 'react-native-flash-message'
import Navigation from 'src/navigation'
const App = () => {
  const persistor = persistStore(store);
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <Navigation />
          <FlashMessage />
        </ThemeProvider>
      </PersistGate>
    </ReduxProvider>
  );
};
export default App;
