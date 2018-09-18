import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { feedReducer } from './feed/Feed';

const reducer = combineReducers({
  feed: feedReducer
});

const store = createStore(
  reducer,
  applyMiddleware(logger)
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'));
registerServiceWorker();
