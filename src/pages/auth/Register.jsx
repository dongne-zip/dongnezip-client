import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as S from '../../styles/mixins';
import styled from 'styled-components';
// import axios from 'axios';

export default function Register() {
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(null);
  const [nickname, setNickname] = useState('');
  const [isValidNickname, setIsValidNickname] = useState(null);
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [isValidPassword, setIsValidPassword] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isCodeReceived, setIsCodeReceived] = useState(false);

  useEffect(() => {
    // Email Validation
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    setIsValid(email !== '' ? emailPattern.test(email) : null);
  }, [email]);

  useEffect(() => {
    // Nickname Validation
    const nicknameRegex = /^[a-zA-Z0-9가-힣]{4,20}$/;
    setIsValidNickname(nickname !== '' ? nicknameRegex.test(nickname) : null);
  }, [nickname]);

  useEffect(() => {
    // Password Validation
    const passwordRegex = /^(?=.*[a-zA-Z0-9@!#$])[A-Za-z0-9@!#$]{6,20}$/;
    setIsValidPassword(password !== '' ? passwordRegex.test(password) : null);
  }, [password]);

  useEffect(() => {
    // Form validity
    const isValidForm =
      email &&
      isValid &&
      nickname &&
      isValidNickname &&
      password &&
      password === passwordCheck &&
      isValidPassword;
    setIsFormValid(isValidForm);
  }, [
    email,
    isValid,
    nickname,
    isValidNickname,
    password,
    passwordCheck,
    isValidPassword,
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();

    //axios.post 서버로 보내는 코드 들어와야함

    if (isFormValid) {
      alert('회원가입이 완료되었습니다!');
    } else {
      alert('입력한 내용을 확인해주세요.');
    }
  };

  const handleEmailVerification = async () => {
    //email duplication 확인 API
    //const response = await axios.post(`/checkId`, {
    // email: email,
    // })
    setIsEmailVerified(true); // 확인되면 결론적으로 true 보내기
  };

  const handleCodeRequest = () => {
    setIsCodeReceived(true); // 인증번호 입력창 보여주기
  };

  return (
    <ExtendedMainLayout>
      <RegisterContainer>
        <h3>회원가입</h3>
        <form className="registerForm" onSubmit={handleSubmit}>
          {/* ID Input */}
          <label htmlFor="email">이메일: </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <p>
            {isValid === null
              ? ''
              : isValid
                ? '중복확인을 해주세요'
                : '[abc@def.com] 이메일 형태로 입력해주세요'}
          </p>
          <button type="button" onClick={handleEmailVerification}>
            중복확인
          </button>

          {isEmailVerified && !isCodeReceived && (
            <button type="button" onClick={handleCodeRequest}>
              인증번호 받기
            </button>
          )}

          {isCodeReceived && (
            <>
              <label htmlFor="verificationCode">인증번호:</label>
              <input
                type="text"
                id="verificationCode"
                placeholder="인증번호를 입력하세요"
              />
            </>
          )}
          <br />

          <label htmlFor="userName">이름: </label>
          <input type="text" id="userName" required />
          <br />

          <label htmlFor="nickname">닉네임: </label>
          <input
            type="text"
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <p>
            {isValidNickname === null
              ? ''
              : isValidNickname
                ? ''
                : '한글, 영문, 숫자만 입력 가능, 4~20자리'}
          </p>
          <button type="button">중복확인</button>
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
          <p>
            {isValidPassword === null
              ? ''
              : isValidPassword
                ? ''
                : '영문, 숫자, 특수문자(@!#$), 6~20자리'}
          </p>
          <button type="submit" disabled={!isFormValid}>
            회원가입
          </button>
          <br />
          <span>이미 계정이 있나요?</span>
          <Link to="/login">로그인</Link>
        </form>
      </RegisterContainer>
    </ExtendedMainLayout>
  );
}

const ExtendedMainLayout = styled(S.MainLayout)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const RegisterContainer = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;
