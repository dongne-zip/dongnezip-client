import { useDispatch, useSelector } from 'react-redux';
import { setEmail, setPassword } from '../../store/modules/userReducer';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../store/modules/authReducer';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 상태를 정확하게 가져옵니다
  const email = useSelector((state) => state.user.email);
  const password = useSelector((state) => state.user.password);
  const users = useSelector((state) => state.user.users); // users 데이터 가져오기

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('이메일 또는 비밀번호가 필수값입니다.');
      return;
    }

    const user = users.find(
      (user) => user.email === email && user.password === password,
    );

    if (user) {
      dispatch(login(user));
      alert('로그인 성공!');
      navigate('/myPage');
    } else {
      alert('이메일 또는 비밀번호가 틀렸습니다.');
    }
  };

  return (
    <div className="loginContainer">
      <h3>로그인</h3>
      <form className="loginForm" onSubmit={handleLogin}>
        <label htmlFor="email"> 이메일: </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => dispatch(setEmail(e.target.value))} // 이메일 입력 변경 시 상태 업데이트
        />
        <br />
        <label htmlFor="userPw">비밀번호:</label>
        <input
          type="password"
          id="userPw"
          value={password}
          onChange={(e) => dispatch(setPassword(e.target.value))} // 비밀번호 입력 변경 시 상태 업데이트
        />
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
