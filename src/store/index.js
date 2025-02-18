import { combineReducers } from 'redux';
import authReducer from './reducers/authReducer';
import productReducer from './reducers/productReducer';
import chatReducer from './reducers/chatReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  product: productReducer,
  chat: chatReducer,
  // 전역 관리 state가 추가되면 여기에 추가
});

export default rootReducer;
