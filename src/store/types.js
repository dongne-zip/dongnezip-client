// 액션 타입 관리
export const loginUser = (user) => ({
  type: 'LOGIN_USER',
  payload: user,
});

export const logoutUser = () => ({
  type: 'LOGOUT_USER',
});
export const updateUser = (user) => ({
  type: 'UPDATE_USER',
  payload: user,
});
