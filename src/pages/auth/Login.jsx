import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as S from '../../styles/mixins';
import styled from 'styled-components';
import userList from '../../data/dummyUser';

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('이메일 또는 비밀번호가 필수값입니다.');
      return;
    }

    const user = userList.find(
      (user) => user.email === email && user.password === password,
    );

    //axios.post
    if (user) {
      alert('로그인 성공!');
      navigate('/myPage');
    } else {
      alert('이메일 또는 비밀번호가 틀렸습니다.');
    }
  };

  return (
    <ExtendedMainLayout>
      <LoginContainer>
        <h3>로그인</h3>
        <form className="loginForm" onSubmit={handleLogin}>
          <label htmlFor="email">이메일: </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <label htmlFor="userPw">비밀번호:</label>
          <input
            type="password"
            id="userPw"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <button type="submit">로그인</button>
          <br />
          <button>카카로 로그인하기</button>
          <br />
          <span>계정이 없나요?</span>
          <Link to="/join">회원가입</Link>
        </form>
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
  max-width: 400px;
  padding: 2rem;
  background-color: #5552ff3d;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;
