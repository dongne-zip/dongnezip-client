// actions.js
// export const loginUser = (user) => ({
//   type: 'LOGIN_USER',
//   payload: user,
// });

// export const logoutUser = () => ({
//   type: 'LOGOUT_USER',
// });

// authReducer.js
const initialState = {
  isLoggedIn: false,
  user: null,
};

export const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN_USER':
      return {
        ...state,
        isLoggedIn: true,
        user: action.payload,
      };
    case 'LOGOUT_USER':
      return {
        ...state,
        isLoggedIn: false,
        user: null,
      };
    case 'UPDATE_USER': // 사용자 정보 업데이트 처리
      return { ...state, user: action.payload };
    default:
      return state;
  }
};
