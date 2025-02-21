import { configureStore } from '@reduxjs/toolkit';
import saleReducer from './modules/saleReducer';

const store = configureStore({
  reducer: {
    sale: saleReducer,
  },
});

export default store;


