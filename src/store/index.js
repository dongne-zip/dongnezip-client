import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './modules/userReducer';
import authReducer from './modules/authReducer';

const rootReducer = combineReducers({
  user: userReducer,
  authReducer: authReducer,
});

export default rootReducer;
