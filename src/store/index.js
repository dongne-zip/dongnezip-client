import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './modules/authReducer';
import chatReducer from './modules/chatReducer';

const rootReducer = combineReducers({
  authReducer: authReducer,
  chatReducer: chatReducer,
});

export default rootReducer;
