import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { persistStore } from 'redux-persist';
import rootReducer from './reducers';

// logger
const middleware = [thunk, logger];

const store = createStore(rootReducer, applyMiddleware(...middleware));
const persistor = persistStore(store);

export { store, persistor };
