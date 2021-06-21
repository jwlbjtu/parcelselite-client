import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import i18nReducer from './i18n/intlSlice';
import userReducer from './user/userSlice';
import billingReducer from './billing/billingSlice';
import orderReducer from './orders/ordersSlice';
import shipmentsReducer from './shipments/shipmentSlice';
import settingsReducer from './settings/settingSlice';
import addressesReducer from './settings/addressSlice';
import carriersReducer from './settings/carriersSlice';

const rootReducer = combineReducers({
  i18n: i18nReducer,
  currentUser: userReducer,
  billing: billingReducer,
  orders: orderReducer,
  shipments: shipmentsReducer,
  carriers: carriersReducer,
  addresses: addressesReducer,
  settings: settingsReducer
});

const persistConfig = {
  key: 'parcelselit-client',
  storage,
  whitelist: ['currentUser', 'settings', 'addresses', 'carriers', 'orders']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer
});

export const persistor = persistStore(store);
