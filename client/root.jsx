// Root.jsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './src/features/store.jsx';
import App from './src/App.jsx';
import './src/index.css';
import Chakra from './src/theme/useTheme.jsx';
import GlobalProvider from './src/context/GlobalProvider.jsx';

const Root = () => {
  return (
    <Provider store={store}>
      <GlobalProvider>
        <Chakra>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Chakra>
      </GlobalProvider>
    </Provider>
  );
};

export default Root;
