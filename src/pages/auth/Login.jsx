import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleLogin = (e) => {
    e.preventDefault();
    if (!id || !password) {
      alert('아이디 또는 비밀번호가 필수값입니다.');
      return;
    }
    // 간단한 검증 예시 (실제 서버와 연동 시 서버로 요청 보내야 함)
    if (id === 'sesac' && password === '1234') {
      alert('로그인 성공!');
      navigate('/mypage', { state: { userId: id } });
    } else {
      alert('아이디 또는 비밀번호가 틀렸습니다.');
    }
  };

  return (
    <div className="loginContainer">
      <h3>로그인</h3>
      <span>임시아이디, 비번: sesac, 1234</span>
      <form className="loginForm" onSubmit={handleLogin}>
        <label htmlFor="userId"> 아이디: </label>
        <input
          type="text"
          id="userId"
          value={id}
          onChange={(e) => setId(e.target.value)}
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
        {/* <Link to="/">비밀번호 찾기</Link> */}
        <br />
        <button type="submit">로그인</button>
        <br />
        <button>카카로 로그인하기</button>
        <br />
        <span>계정이 없나요?</span>
        <Link to="/join">회원가입</Link>
      </form>
    </div>
  );
}
