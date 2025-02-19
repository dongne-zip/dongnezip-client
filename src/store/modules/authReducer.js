import users from '../../data/dummyUser';

// 초기 상태
const initialState = {
  isLogin: false, // 로그인 여부
  user: {
    email: '',
    password: '',
  },
  users: users, // 더미 사용자 데이터
};

// 액션 타입
const LOGIN = 'LOGIN';
const LOGOUT = 'LOGOUT';
const UPDATE_USER = 'UPDATE_USER';

// 액션 생성자
export const login = (user) => ({
  type: LOGIN,
  payload: user,
});

export const logout = () => ({
  type: LOGOUT,
});

export const updateUser = (user) => ({
  type: UPDATE_USER,
  payload: user,
});

// 리듀서
const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return { ...state, isLogin: true, user: action.payload };
    case LOGOUT:
      return { ...state, isLogin: false, user: {} };
    case UPDATE_USER:
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

export default authReducer;
