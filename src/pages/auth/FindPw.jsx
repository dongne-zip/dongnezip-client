import axios from 'axios';
import { useState, useEffect } from 'react';
import * as S from '../../styles/mixins';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

export default function FindPw() {
  const API = process.env.REACT_APP_API_SERVER;
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [isValidPassword, setIsValidPassword] = useState(null);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerificationCodeVisible, setIsVerificationCodeVisible] =
    useState(false);

  // Password validation
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
    const token = localStorage.getItem('emailAuthToken');
    try {
      const response = await axios.post(`${API}/user/findPw`, {
        code: verificationCode,
        token,
        newPw: password,
      });
      if (response.status === 200) {
        alert('비밀번호 새로 설정 되었습니다');
        navigate('/login');
      }
    } catch (error) {
      console.log('findpw:', error);
      alert('비밀번호 변경에 실패했습니다.');
    }
  };

  const handleEmailVerification = async () => {
    try {
      const response = await axios.post(`${API}/user/sendCode`, { email });
      if (response.status === 200) {
        alert('인증번호가 이메일로 전송되었습니다!');
        localStorage.setItem('emailAuthToken', response.data.token);
        setIsVerificationCodeVisible(true);
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
    <ExtendedMainLayout>
      <FindPwContainer>
        <H3>비밀번호 찾기</H3>
        <FindPwForm>
          <Label htmlFor="email">이메일:</Label>
          <EmailInput>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <VerificationInput type="button" onClick={handleEmailVerification}>
              인증번호 받기
            </VerificationInput>
          </EmailInput>
          {isVerificationCodeVisible && (
            <>
              <Label htmlFor="validationCode">인증번호:</Label>
              <EmailInput>
                <Input
                  type="text"
                  id="validationCode"
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
            </>
          )}

          <Label htmlFor="password">새 비밀번호:</Label>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Label htmlFor="passwordCheck">새 비밀번호 확인:</Label>
          <Input
            type="password"
            id="passwordCheck"
            value={passwordCheck}
            onChange={(e) => setPasswordCheck(e.target.value)}
          />
          {password !== passwordCheck && passwordCheck.length > 0 && (
            <WarningText>비밀번호가 일치하지 않습니다</WarningText>
          )}
          {isValidPassword === false && password.length > 0 && (
            <WarningText>영문, 숫자, 특수문자(@!#$), 6~20자리</WarningText>
          )}

          <Button onClick={handleFindPw} disabled={!isFormValid}>
            변경
          </Button>
        </FindPwForm>
      </FindPwContainer>
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

const FindPwContainer = styled.div`
  width: 100%;
  max-width: 500px;
  padding: 2rem;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  @media (max-width: 767px) {
    max-width: 100%;
    padding: 1rem;
  }
`;

const H3 = styled.h3`
  text-align: center;
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #333;
  @media (max-width: 767px) {
    font-size: 24px;
  }
`;

const FindPwForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  padding: 16px;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 14px;
`;

const Input = styled.input`
  width: 80%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease-in-out;
  &:focus {
    border-color: #5a67d8;
    outline: none;
    background-color: #fff;
  }
  @media (max-width: 767px) {
    width: 100%;
    padding: 10px;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background-color: #5451ff;
  color: white;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  &:hover {
    background-color: #7e7dbe;
  }
  &:disabled {
    background-color: #ccc;
    color: #888;
    cursor: not-allowed;
    opacity: 0.7;
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
