import users from '../../data/dummyUser';
// 초기 상태
// 초기 상태 예시
const initialState = {
  email: '',
  password: '',
  username: '',
  profilePath: '',
  nickname: '',
  users: users, // 더미 사용자 데이터
};

// 액션 타입
const SET_EMAIL = 'SET_EMAIL';
const SET_PASSWORD = 'SET_PASSWORD';
const SET_NICKNAME = 'SET_NICKNAME';
const SET_PROFILE_PATH = 'SET_PROFILE_PATH';
const SET_USERNAME = 'SET_USERNAME';

// 액션 생성자
export const setEmail = (email) => {
  return { type: SET_EMAIL, payload: email };
};
export const setPassword = (password) => {
  return {
    type: SET_PASSWORD,
    payload: password,
  };
};
export const setNickname = (nickname) => {
  return {
    type: SET_NICKNAME,
    payload: nickname,
  };
};
export const setProfilePath = (profilePath) => {
  return {
    type: SET_PROFILE_PATH,
    payload: profilePath,
  };
};
export const setUsername = (username) => {
  return {
    type: SET_USERNAME,
    payload: username,
  };
};

// 리듀서
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_EMAIL:
      return { ...state, email: action.payload };
    case SET_PASSWORD:
      return { ...state, password: action.payload };
    case SET_NICKNAME:
      return { ...state, nickname: action.payload };
    case SET_PROFILE_PATH:
      return { ...state, profilePath: action.payload };
    case SET_USERNAME:
      return { ...state, username: action.payload };
    default:
      return state;
  }
};

export default userReducer;
