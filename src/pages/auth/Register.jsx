import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as S from '../../styles/mixins';
import styled from 'styled-components';
import axios from 'axios';

const API = process.env.REACT_APP_API_SERVER;
axios.defaults.withCredentials = true; // 모든 요청에 쿠키 포함

export default function Register() {
  const navigate = useNavigate();
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
    const nicknameRegex = /^[a-zA-Z0-9가-힣]{3,10}$/;
    setIsValidNickname(nickname !== '' ? nicknameRegex.test(nickname) : null);
  }, [nickname]);

  useEffect(() => {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$]).{6,20}$/;
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
        console.log('API', API);
        const response = await axios.post(`${API}/user/join`, {
          email: email,
          nickname: nickname,
          password: password,
          name: document.getElementById('userName').value,
        });

        if (response.status === 200) {
          alert('회원가입이 완료되었습니다!');
          navigate('/login');
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
      console.log('API', API);

      const response = await axios.post(`${API}/user/checkId`, {
        email: email,
      });
      console.log('response', response);
      if (response.data.result) {
        setIsEmailAvailable(true);
        alert(response.data.message);
      } else {
        alert('이미 존재하는 아이디입니다.');
        setIsEmailAvailable(false);
      }
    } catch (error) {
      console.error(error);
      alert('이메일 중복 확인 중 오류가 발생했습니다.');
    }
  };

  const handleEmailVerification = async () => {
    if (!isEmailAvailable) {
      alert('이메일 중복 확인을 먼저 해주세요.');
      return;
    }
    try {
      const response = await axios.post(`${API}/user/sendCode`, {
        email: email,
      });
      console.log('send code response: ', response);
      if (response.status === 200) {
        alert('인증번호가 이메일로 전송되었습니다!');
        localStorage.setItem('emailAuthToken', response.data.token);
        setIsCodeReceived(true);
      }
    } catch (error) {
      console.error(error);
      alert('이메일 전송 중 오류가 발생했습니다.');
    }
  };

  const handleCodeVerification = async () => {
    const token = localStorage.getItem('emailAuthToken');
    try {
      const response = await axios.post(`${API}/user/verifyCode`, {
        email: email,
        code: verificationCode,
        token: token,
      });
      console.log('verficationCODE:', response);
      console.log('result', response.data.result);
      if (response.data.result) {
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
      const response = await axios.post(`${API}/user/checkNick`, {
        nickname: nickname,
      });
      console.log('Response', response);
      if (response.data.result) {
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
        <H3>회원가입</H3>
        <RegisterForm className="registerForm" onSubmit={handleSubmit}>
          <Label htmlFor="email">이메일: </Label>
          <EmailInput>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <VerificationInput
              type="button"
              onClick={handleEmailCheck}
              disabled={!isValid}
            >
              중복 확인
            </VerificationInput>
          </EmailInput>
          <WarningText>
            {isValid === null
              ? ''
              : isValid
                ? ''
                : '[abc@def.com] 이메일 형태로 입력해주세요'}
          </WarningText>

          <VerificationInput
            type="button"
            onClick={handleCodeRequest}
            disabled={!isEmailAvailable}
          >
            인증번호 받기
          </VerificationInput>

          {isCodeReceived && (
            <>
              <Label htmlFor="verificationCode">인증번호:</Label>
              <EmailInput>
                <Input
                  type="text"
                  id="verificationCode"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="인증번호를 입력하세요"
                />
                <VerificationInput
                  type="button"
                  onClick={handleCodeVerification}
                >
                  인증번호 확인
                </VerificationInput>
              </EmailInput>

              {isCodeValid === false && <p>인증번호가 틀렸습니다.</p>}
            </>
          )}
          <br />

          <Label htmlFor="userName">이름: </Label>
          <Input type="text" id="userName" required />
          <br />

          <Label htmlFor="nickname">닉네임: </Label>
          <EmailInput>
            <Input
              type="text"
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
            <VerificationInput
              type="button"
              onClick={handleNicknameCheck}
              disabled={!nickname || !isValidNickname}
            >
              중복확인
            </VerificationInput>
          </EmailInput>
          <WarningText>
            {isValidNickname === null
              ? ''
              : isValidNickname
                ? ''
                : '한글, 영문, 숫자만 입력 가능, 3~10자리'}
          </WarningText>

          <Label htmlFor="password">비밀번호:</Label>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <Label htmlFor="passwordCheck">비밀번호 확인:</Label>
          <Input
            type="password"
            id="passwordCheck"
            value={passwordCheck}
            onChange={(e) => setPasswordCheck(e.target.value)}
          />
          {password !== passwordCheck && passwordCheck.length > 0 && (
            <WarningText>비밀번호가 일치하지 않습니다</WarningText>
          )}
          <WarningText>
            {isValidPassword === null
              ? ''
              : isValidPassword
                ? ''
                : '영문, 숫자, 특수문자(@!#$), 6~20자리'}
          </WarningText>
          <Button type="submit" disabled={!isFormValid}>
            회원가입
          </Button>
          <br />
          <Notice>
            이미 계정이 있나요?
            <Link to="/login" className="loginLink">
              로그인
            </Link>
          </Notice>
        </RegisterForm>
      </RegisterContainer>
    </ExtendedMainLayout>
  );
}
const ExtendedMainLayout = styled(S.MainLayout)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  @media (max-width: 767px) {
    padding: 0.5rem;
  }
`;

const RegisterContainer = styled.div`
  width: 100%;
  max-width: 500px;
  font-size: 14px;
  line-height: 1.5;
  padding: 2rem;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  @media (max-width: 767px) {
    padding: 1rem;
    max-width: 100%;
    box-shadow: none;
  }
`;

const H3 = styled.h3`
  text-align: center;
  @media (max-width: 767px) {
    font-size: 18px;
  }
`;

const RegisterForm = styled.form`
  margin: 0 auto;
  padding: 16px;
  width: 100%;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 4px;
`;

const Input = styled.input`
  width: 80%;
  padding: 10px;
  border: 1px solid #ccc;
  &:focus {
    border-color: #5a67d8;
    outline: none;
  }
  @media (max-width: 767px) {
    width: 100%;
    padding: 8px;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: #5451ff;
  color: white;
  cursor: pointer;
  &:hover {
    background-color: #7e7dbe;
  }
  &:disabled {
    background-color: #ccc;
    color: #888;
    cursor: not-allowed;
    opacity: 0.6;
  }
  @media (max-width: 767px) {
    padding: 8px;
  }
`;

const WarningText = styled.p`
  color: #e53e3e;
  font-size: 12px;
  margin-top: 4px;
  @media (max-width: 767px) {
    font-size: 10px;
  }
`;

const Notice = styled.div`
  text-align: center;
  margin-top: 10px;
  @media (max-width: 767px) {
    font-size: 14px;
  }
  & .loginLink {
    text-decoration: underline;
    color: #007bff;
    transition: color 0.3s ease;
  }

  .loginLink:hover {
    color: #0b0b0b;
  }
`;

const VerificationInput = styled.button`
  background-color: white;
  color: #007bff;
  border: 1px solid #007bff;
  padding: 8px 16px;
  font-size: 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #007bff;
    color: white;
  }
  &:disabled {
    background-color: #ccc;
    color: #888;
    cursor: not-allowed;
    opacity: 0.6;
  }
  @media (max-width: 767px) {
    padding: 6px 12px;
    font-size: 10px;
  }
`;

const EmailInput = styled.form`
  display: flex;
  @media (max-width: 767px) {
    flex-direction: column;
  }
`;
