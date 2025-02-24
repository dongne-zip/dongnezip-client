import axios from 'axios';
import { useState, useEffect } from 'react';

export default function FindPw() {
  const API = process.env.REACT_APP_API_SERVER;
  axios.defaults.withCredentials = true; // 모든 요청에 쿠키 포함

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [isValidPassword, setIsValidPassword] = useState(null);

  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  // Password validation function
  const validatePassword = (password) => {
    const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$]).{6,20}$/;
    setIsValidPassword(passwordPattern.test(password));
  };

  useEffect(() => {
    validatePassword(password);
  }, [password]);

  // Handle find password request
  const handleFindPw = async (e) => {
    e.preventDefault();
    if (!isEmailVerified || password !== passwordCheck || !isValidPassword) {
      alert('모든 정보를 올바르게 입력해주세요.');
      return;
    }

    try {
      const response = await axios.post(`${API}/user/findPw`, {
        email,
        password,
      });
      if (response.status === 200) {
        alert('비밀번호 새로 설정 완료');
      }
    } catch (error) {
      console.log('findpw:', error);
      alert('비밀번호 변경에 실패했습니다.');
    }
  };

  // Handle email verification request
  const handleEmailVerification = async () => {
    try {
      const response = await axios.post(`${API}/user/sendCode`, { email });
      if (response.status === 200) {
        alert('인증번호가 이메일로 전송되었습니다!');
        localStorage.setItem('emailAuthToken', response.data.token);
      }
    } catch (error) {
      console.error(error);
      alert('이메일 전송 중 오류가 발생했습니다.');
    }
  };

  // Handle code verification
  const handleCodeVerification = async () => {
    const token = localStorage.getItem('emailAuthToken');
    try {
      const response = await axios.post(`${API}/user/verifyCode`, {
        email: email,
        code: verificationCode,
        token: token,
      });
      if (response.status === 200) {
        setIsEmailVerified(true);
        alert('인증번호가 확인되었습니다.');
      } else {
        setIsEmailVerified(false);
        alert('인증번호가 틀렸습니다. 다시 시도해 주세요.');
      }
    } catch (error) {
      console.error(error);
      alert('인증번호 확인 중 오류가 발생했습니다.');
    }
  };

  const isFormValid =
    isEmailVerified && isValidPassword && password === passwordCheck;

  return (
    <>
      <h3>비밀번호 찾기</h3>
      <form className="findPwForm">
        <label htmlFor="email">이메일: </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="button" onClick={handleEmailVerification}>
          인증번호 받기
        </button>
        <br />
        <label htmlFor="validationCode">인증번호:</label>
        <input
          type="text"
          id="validationCode"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          placeholder="인증번호를 입력하세요"
        />
        <button type="button" onClick={handleCodeVerification}>
          인증번호 확인
        </button>
        <br />
        <label htmlFor="password">비밀번호:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <label htmlFor="passwordCheck">비밀번호 확인:</label>
        <input
          type="password"
          id="passwordCheck"
          value={passwordCheck}
          onChange={(e) => setPasswordCheck(e.target.value)}
        />
        {password !== passwordCheck && passwordCheck.length > 0 && (
          <p>비밀번호가 일치하지 않습니다</p>
        )}
        {isValidPassword === false && password.length > 0 && (
          <p>영문, 숫자, 특수문자(@!#$), 6~20자리</p>
        )}
        <br />
        <button onClick={handleFindPw} disabled={!isFormValid}>
          변경
        </button>
      </form>
    </>
  );
}
