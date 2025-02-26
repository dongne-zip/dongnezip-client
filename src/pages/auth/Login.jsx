import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as S from '../../styles/mixins';
import styled from 'styled-components';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../store/types';

const API = process.env.REACT_APP_API_SERVER;

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 새로고침 시 localStorage에서 user 정보를 가져와서 Redux 상태 초기화
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      dispatch(loginUser(user)); // Dispatch the user data to Redux
      navigate('/myPage'); // Redirect to myPage if already logged in
    }
  }, [dispatch, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('이메일 또는 비밀번호가 필수값입니다.');
      return;
    }

    try {
      // 로그인 요청
      const response = await axios.post(
        `${API}/user/login/local`,
        { email, password },
        { withCredentials: true },
      );
      if (response.status === 200) {
        const { user } = response.data;
        alert('로그인 성공!');
        localStorage.setItem('user', JSON.stringify(user));
        //localStorage.setItem('access_token', authToken);
        dispatch(loginUser(user)); // Dispatch the user data to Redux
        navigate('/'); // 로그인 후 홈으로 리다이렉트
      }
      console.log(response);
    } catch (error) {
      alert('이메일 또는 비밀번호가 틀렸습니다.');
    }
  };

  const handleKakaoLogin = () => {
    window.location.href = `${API}/user/login/kakao`;
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API}/user/login/google`;
  };

  return (
    <ExtendedMainLayout>
      <LoginContainer>
        <H3>로그인</H3>
        <LoginForm className="loginForm" onSubmit={handleLogin}>
          <Label htmlFor="email">이메일: </Label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <Label htmlFor="userPw">비밀번호:</Label>
          <Input
            type="password"
            id="userPw"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <LinkPw>
            <Link to="/findPw">비밀번호 찾기</Link>
          </LinkPw>
          <br />
          <Button type="submit" className="emailLogin">
            로그인
          </Button>
          <br />
          <br />
          {/* 카카오 로그인 버튼 */}
          <Button
            type="button"
            onClick={handleKakaoLogin}
            className="kakaoLogin"
          >
            카카오로 로그인하기
          </Button>
          <br />
          <br />
          <Button
            type="button"
            onClick={handleGoogleLogin}
            className="googleLogin"
          >
            구글 로그인하기
          </Button>
          <Notice>
            계정이 없나요?
            <Link to="/register" className="registerLink">
              회원가입
            </Link>
          </Notice>
        </LoginForm>
      </LoginContainer>
    </ExtendedMainLayout>
  );
}

const ExtendedMainLayout = styled(S.MainLayout)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  @media (max-width: 767px) {
    padding: 15px;
  }
`;

const LoginContainer = styled.div`
  width: 100%;
  max-width: 500px;
  font-size: 14px;
  line-height: 1.5;
  padding: 2rem;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 767px) {
    max-width: 100%;
    padding: 1rem;
  }
`;

const H3 = styled.h2`
  text-align: center;
  font-size: 24px;
  @media (max-width: 767px) {
    font-size: 20px;
  }
`;

const LoginForm = styled.form`
  margin: 0 auto;
  padding: 16px;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 4px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  &:focus {
    border-color: #5a67d8;
    outline: none;
  }
  @media (max-width: 767px) {
    padding: 8px;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &.emailLogin {
    background-color: #5451ff;
    color: white;
    &:hover {
      background-color: #7e7dbe;
    }
  }

  &.kakaoLogin {
    background-color: #fee502;
    color: black;
    &:hover {
      background-color: #ebe6b2;
    }
  }
  &.googleLogin {
    background-color: white;
    color: black;
    border: 1px solid black;
    &:hover {
      background-color: #fee;
    }
  }
  @media (max-width: 767px) {
    padding: 8px;
  }
`;

const Notice = styled.div`
  text-align: center;
  &.registerLink {
    text-decoration: underline;
    color: #007bff;
    transition: color 0.3s ease;
  }

  .registerLink:hover {
    color: #0b0b0b;
  }

  @media (max-width: 767px) {
    font-size: 14px;
  }
`;

const LinkPw = styled.div`
  display: flex;
  justify-content: flex-end;
`;
