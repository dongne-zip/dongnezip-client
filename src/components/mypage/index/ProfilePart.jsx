import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useEffect } from 'react';
import axios from 'axios';
import { loginUser } from '../../../store/types';

const API = process.env.REACT_APP_API_SERVER;
axios.defaults.withCredentials = true;

export default function ProfilePart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.isLogin.user); // Redux 상태에서 user 가져오기
  const isLoggedIn = useSelector((state) => state.isLogin.isLoggedIn);

  // 새로고침 후 로그인 상태를 유지
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      dispatch(loginUser(storedUser)); // Redux 상태에 사용자 정보 저장
    } else {
      navigate('/login'); // 로그인되지 않으면 로그인 페이지로 리디렉션
    }
  }, [dispatch, navigate]);

  // 사용자의 정보가 변경되면 Redux 상태를 업데이트하여 최신 정보로 반영
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && !user) {
      dispatch(loginUser(storedUser)); // Redux에 사용자 정보 업데이트
    }
  }, [dispatch, user]);

  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      const response = await axios.post(`${API}/user/logout`);
      if (response.status === 200) {
        localStorage.removeItem('user'); // 로컬스토리지에서 사용자 정보 제거
        dispatch({ type: 'LOGOUT_USER' }); // Redux 상태에서 사용자 정보 제거
        navigate('/'); // 홈으로 리디렉션
      }
    } catch (error) {
      console.error('로그아웃 오류:', error);
      alert('로그아웃 중 문제가 발생했습니다. 다시 시도해주세요.');
    }
  };

  if (!isLoggedIn) {
    return <div>로그인 후에 이용할 수 있습니다.</div>;
  }

  return (
    <ProfilePartS>
      <ProfileImg src={user.profileImg} alt="프로필 사진" />
      <Desc>{user.nickname}님, 반갑습니다</Desc>
      <Link to="/changeInfo">
        <EditBtn>회원정보 수정</EditBtn>
      </Link>
      <button onClick={handleLogout}>LOGOUT</button>
    </ProfilePartS>
  );
}
const ProfilePartS = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background-color: #e0e0e0;
  border-radius: 8px;
`;

const ProfileImg = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: white;
`;

const Desc = styled.p`
  flex-grow: 1;
  font-size: 20px;
  margin: 5px 0;
`;

const EditBtn = styled.button`
  background-color: #6a0dad;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #5a0ca3;
  }
`;
