import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './modules/authReducer';

const rootReducer = combineReducers({
  authReducer: authReducer,
});

export default rootReducer;
