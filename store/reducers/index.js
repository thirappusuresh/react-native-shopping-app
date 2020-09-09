import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import productsReducer from "./products";
import cartReducer from "./cart";
import ordersReducer from "./orders";
import authReducer from "./auth";
import AsyncStorage from '@react-native-community/async-storage';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage
};

const rootReducer = combineReducers({
  products: productsReducer,
  cart: cartReducer,
  orders: ordersReducer,
  auth: authReducer
});

export default persistReducer(persistConfig, rootReducer);
