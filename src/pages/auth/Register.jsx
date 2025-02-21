import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as S from '../../styles/mixins';
import styled from 'styled-components';
import axios from 'axios';

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
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeValid, setIsCodeValid] = useState(null);
  const [isEmailAvailable, setIsEmailAvailable] = useState(false);

  useEffect(() => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    setIsValid(email !== '' ? emailPattern.test(email) : null);
  }, [email]);

  useEffect(() => {
    const nicknameRegex = /^[a-zA-Z0-9가-힣]{4,20}$/;
    setIsValidNickname(nickname !== '' ? nicknameRegex.test(nickname) : null);
  }, [nickname]);

  useEffect(() => {
    const passwordRegex = /^(?=.*[a-zA-Z0-9@!#$])[A-Za-z0-9@!#$]{6,20}$/;
    setIsValidPassword(password !== '' ? passwordRegex.test(password) : null);
  }, [password]);

  useEffect(() => {
    // Form validity
    const isValidForm =
      email &&
      isEmailAvailable &&
      isValid &&
      nickname &&
      isValidNickname &&
      password &&
      password === passwordCheck &&
      isValidPassword &&
      isEmailVerified &&
      isCodeValid;
    setIsFormValid(isValidForm);
  }, [
    email,
    isValid,
    isEmailAvailable,
    nickname,
    isValidNickname,
    password,
    passwordCheck,
    isValidPassword,
    isEmailVerified,
    isCodeValid,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isFormValid) {
      try {
        const response = await axios.post('/join', {
          email: email,
          nickname: nickname,
          password: password,
          name: document.getElementById('userName').value,
        });

        if (response.status === 200) {
          alert('회원가입이 완료되었습니다!');
        }
      } catch (error) {
        console.error(error);
        alert('회원가입 중 오류가 발생했습니다.');
      }
    } else {
      alert('입력한 내용을 확인해주세요.');
    }
  };
  // 이메일 중복 확인
  const handleEmailCheck = async () => {
    try {
      const response = await axios.post('/checkId', { email: email });
      if (response.status === 200) {
        if (response.data.isAvailable) {
          setIsEmailAvailable(true);
          alert('사용 가능한 이메일입니다.');
        } else {
          setIsEmailAvailable(false);
          alert('이미 등록된 이메일입니다.');
        }
      }
    } catch (error) {
      console.error(error);
      alert('이메일 중복 확인 중 오류가 발생했습니다.');
    }
  };

  const handleEmailVerification = async () => {
    try {
      const response = await axios.post('/sendCode', {
        email: email,
      });
      if (response.status === 200) {
        alert('인증번호가 이메일로 전송되었습니다!');
        setIsCodeReceived(true);
      }
    } catch (error) {
      console.error(error);
      alert('이메일 전송 중 오류가 발생했습니다.');
    }
  };

  const handleCodeVerification = async () => {
    try {
      const response = await axios.post('/verifyCode', {
        email: email,
        code: verificationCode,
      });
      if (response.status === 200 && response.data.isValid) {
        setIsCodeValid(true);
        setIsEmailVerified(true);
        alert('인증번호가 확인되었습니다.');
      } else {
        setIsCodeValid(false);
        alert('인증번호가 틀렸습니다. 다시 시도해 주세요.');
      }
    } catch (error) {
      console.error(error);
      alert('인증번호 확인 중 오류가 발생했습니다.');
    }
  };

  const handleNicknameCheck = async () => {
    try {
      const response = await axios.post('/checkNick', {
        nickname: nickname,
      });
      if (response.status === 200) {
        alert('사용 가능한 닉네임입니다.');
      }
    } catch (error) {
      console.error(error);
      alert('닉네임 중복 확인 중 오류가 발생했습니다.');
    }
  };

  const handleCodeRequest = () => {
    if (!isEmailVerified) {
      handleEmailVerification();
    } else {
      setIsCodeReceived(true);
    }
  };

  return (
    <ExtendedMainLayout>
      <RegisterContainer>
        <h3>회원가입</h3>
        <form className="registerForm" onSubmit={handleSubmit}>
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
                ? ''
                : '[abc@def.com] 이메일 형태로 입력해주세요'}
          </p>
          <button type="button" onClick={handleEmailCheck} disabled={!isValid}>
            중복 확인
          </button>

          <button
            type="button"
            onClick={handleCodeRequest}
            disabled={!isEmailAvailable}
          >
            인증번호 받기
          </button>

          {isCodeReceived && (
            <>
              <label htmlFor="verificationCode">인증번호:</label>
              <input
                type="text"
                id="verificationCode"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="인증번호를 입력하세요"
              />
              <button type="button" onClick={handleCodeVerification}>
                인증번호 확인
              </button>
              {isCodeValid === false && <p>인증번호가 틀렸습니다.</p>}
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
          <button type="button" onClick={handleNicknameCheck}>
            중복확인
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
