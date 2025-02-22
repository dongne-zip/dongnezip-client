import { configureStore } from '@reduxjs/toolkit';
import saleReducer from './modules/saleReducer';
// import authReducer from './modules/authReducer';
import { loginReducer } from './modules/loginReducer';

const store = configureStore({
  reducer: {
    sale: saleReducer,
    isLogin: loginReducer,
  },
});

export default store;
