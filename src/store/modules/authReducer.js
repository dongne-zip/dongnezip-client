const LOGIN = 'auth/LOGIN';

export const login = (user) => ({
  type: LOGIN,
  payload: user.nickname,
});

const initialState = {
  nickname: null,
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        nickname: action.payload,
      };
    default:
      return state;
  }
}
