import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(null);
  const [nickname, setNickname] = useState('');
  const [isValidNickname, setIsValidNickname] = useState(null);
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [isValidPassword, setIsValidPassword] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    //email Validation
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    setIsValid(email !== '' ? emailPattern.test(email) : null);
  }, [email]);

  useEffect(() => {
    // Nickname Validation (Korean, English, and numbers, 4-20 characters)
    const nicknameRegex = /^[a-zA-Z0-9가-힣]{4,20}$/;
    setIsValidNickname(nickname !== '' ? nicknameRegex.test(nickname) : null);
  }, [nickname]);

  useEffect(() => {
    // Password Validation (Korean, English, numbers, and special characters (@!#$), 6-20 characters)
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
      isValidPassword &&
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
    if (isFormValid) {
      alert('회원가입이 완료되었습니다!');
    } else {
      alert('입력한 내용을 확인해주세요.');
    }
  };

  return (
    <div className="registerContainer">
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
        <button type="button">중복확인</button>
        <button>인증번호 받기</button>
        <br />
        {/* name Input */}
        <label htmlFor="userName">이름: </label>
        <input type="text" id="userName" required />
        <br />
        {/* Nickname Input */}
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

        {/* Password Input */}
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
    </div>
  );
}
