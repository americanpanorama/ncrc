import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';

import reducers from './reducers';
import initialState from './initialState';

const logger = createLogger({
  collapsed: true,
  duration: true,
});

const store = applyMiddleware(thunk, logger)(createStore)(reducers, initialState);

export default store;
