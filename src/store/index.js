import { configureStore } from '@reduxjs/toolkit';
import saleReducer from './saleSlice';

const store = configureStore({
  reducer: {
    sale: saleReducer,
  },
});

export default store;
