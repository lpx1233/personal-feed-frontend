import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { feedReducer } from './feed/Feed';
import { loadMoreEpic, refreshEpic, setTopStoriesEpic } from './feed/Feed';
import { fetchTopStoriesEpic, fetchItemsByIdsEpic } from './services/backend';

const rootEpic = combineEpics(
  // backend
  fetchTopStoriesEpic,
  fetchItemsByIdsEpic,
  // Feed
  refreshEpic,
  loadMoreEpic,
  setTopStoriesEpic,
);
const rootReducer = combineReducers({
  feed: feedReducer
});
const epicMiddleware = createEpicMiddleware();
export const store = createStore(
  rootReducer,
  applyMiddleware(logger, epicMiddleware)
);
epicMiddleware.run(rootEpic);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'));
registerServiceWorker();