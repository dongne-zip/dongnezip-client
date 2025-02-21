import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as S from '../../styles/mixins';
import styled from 'styled-components';
import axios from 'axios';

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('이메일 또는 비밀번호가 필수값입니다.');
      return;
    }

    try {
      // 로그인 요청
      const response = await axios.post(
        'http://localhost:8080/api-server/user/login/local',
        { email, password },
        { withCredentials: true },
      );

      // 로그인 성공시 토큰 저장 및 페이지 이동
      // axios.defaults.headers.common['Authorization'] =
      //   `Bearer ${response.data.access_token}`;
      // alert('로그인 성공!');
      // navigate('/myPage');
      console.log(response);
      if (response.status === 200) {
        alert('로그인 성공!');
        navigate('/myPage');
      }
    } catch (error) {
      alert('이메일 또는 비밀번호가 틀렸습니다.');
    }
  };

  const handleKakaoLogin = () => {
    navigate('/login/kakao');
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
          <Notice>
            계정이 없나요?
            <Link to="/join" className="registerLink">
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
`;
const H3 = styled.h2`
  text-align: center;
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
`;
