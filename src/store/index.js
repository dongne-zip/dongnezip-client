import { configureStore } from '@reduxjs/toolkit';
import saleReducer from './modules/saleReducer';
// import authReducer from './modules/authReducer';
import { loginReducer } from './modules/loginReducer';
import mapReducer from './modules/mapReducer';

const store = configureStore({
  reducer: {
    sale: saleReducer,
    isLogin: loginReducer,
    map: mapReducer,
  },
});

export default store;
