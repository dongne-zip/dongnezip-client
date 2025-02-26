import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useEffect } from 'react';
import axios from 'axios';
import { loginUser, logoutUser } from '../../../store/types';

const API = process.env.REACT_APP_API_SERVER;
axios.defaults.withCredentials = true;

export default function ProfilePart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.isLogin.user); // Redux 상태에서 user 가져오기
  const isLoggedIn = useSelector((state) => state.isLogin.isLoggedIn);
  console.log(user);
  // 새로고침 후 로그인 상태를 유지
  const checkLoginStatus = async () => {
    try {
      const response = await axios.post(`${API}/user/token`);

      if (response.data.result) {
        const userData = {
          id: response.data.id,
          nickname: response.data.nickname,
          profileImg: response.data.profileImg,
        };
        dispatch(loginUser(userData)); // Redux 상태 업데이트
        localStorage.setItem('user', JSON.stringify(userData)); //  localStorage에도 저장
        console.log('userData', userData);
      } else {
        throw new Error('로그인되지 않음');
      }
    } catch (error) {
      console.error('로그인 상태 확인 실패:', error);
      dispatch(logoutUser()); // Redux에서 로그아웃 처리
      localStorage.removeItem('user'); // localStorage에서도 제거
      navigate('/login'); // 로그인 페이지로 이동
    }
  };
  useEffect(() => {
    checkLoginStatus();
  }, []);

  // 사용자의 정보가 변경되면 Redux 상태를 업데이트하여 최신 정보로 반영
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    console.log(storedUser);
    if (storedUser && !user) {
      dispatch(loginUser(storedUser)); // Redux에 사용자 정보 업데이트
    }
  }, [dispatch, user]);
  // 새로고침 후 로그인 상태 유지

  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      // 1. 백엔드 로그아웃 요청 (로컬 로그아웃)
      const response = await axios.post(
        `${API}/user/logout`,
        {},
        { withCredentials: true },
      );

      // 2. 백엔드에서 받은 카카오 로그아웃 URL이 있다면 이동
      if (response.data.kakaoLogoutUrl) {
        window.location.href = response.data.kakaoLogoutUrl;
      } else {
        // 백엔드에서 로그아웃 URL을 제공하지 않으면 메인 페이지로 이동
        window.location.href = '/';
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
      <LogoutBtn onClick={handleLogout}>LOGOUT</LogoutBtn>
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
  flex-direction: row;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding: 16px;
  }
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

  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
  }
`;

const Desc = styled.p`
  flex-grow: 1;
  font-size: 20px;
  margin: 5px 0;
  word-wrap: break-word;

  @media (max-width: 768px) {
    font-size: 18px;
  }
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

  @media (max-width: 768px) {
    width: 100%;
    padding: 10px;
  }
`;

const LogoutBtn = styled.button`
  background-color: #fdf0ef;
  color: black;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #d32f2f;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 10px;
  }
`;
