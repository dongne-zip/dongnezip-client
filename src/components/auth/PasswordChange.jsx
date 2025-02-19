import { useState, useEffect } from 'react';

export default function PasswordChange({ onPasswordChange }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordCheck, setNewPasswordCheck] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [isValidPassword, setIsValidPassword] = useState(null);

  const handlePasswordChange = () => {
    setShowPasswordInput(!showPasswordInput);
  };

  useEffect(() => {
    const passwordRegex = /^(?=.*[a-zA-Z0-9@!#$])[A-Za-z0-9@!#$]{6,20}$/;
    setIsValidPassword(
      newPassword !== '' ? passwordRegex.test(newPassword) : null,
    );
  }, [newPassword]);

  // 비밀번호 변경 처리
  const handleSubmit = () => {
    if (newPassword === newPasswordCheck && isValidPassword) {
      // 비밀번호 변경 후 상태 업데이트 (예시로 사용자 정보 업데이트)
      onPasswordChange(newPassword);
      alert('비밀번호 변경 완료!');
    } else {
      alert('비밀번호가 일치하지 않거나 유효하지 않습니다.');
    }
  };

  return (
    <>
      <label htmlFor="passwordChange">비밀번호:</label>
      <button type="button" id="buttonChange" onClick={handlePasswordChange}>
        비밀번호 변경
      </button>
      <br />
      {showPasswordInput && (
        <>
          <label htmlFor="currentPassword">현재 비밀번호:</label>
          <input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <br />
          <label htmlFor="newPassword">새 비밀번호:</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <br />
          <label htmlFor="newPasswordCheck">새 비밀번호 확인:</label>
          <input
            type="password"
            id="newPasswordCheck"
            value={newPasswordCheck}
            onChange={(e) => setNewPasswordCheck(e.target.value)}
          />
          {newPassword !== newPasswordCheck && newPasswordCheck.length > 0 && (
            <p style={{ color: 'red' }}>비밀번호가 일치하지 않습니다</p>
          )}
          <p>
            {isValidPassword === null
              ? ''
              : isValidPassword
                ? ''
                : '영문, 숫자, 특수문자(@!#$), 6~20자리'}
          </p>
          <button type="button" onClick={handleSubmit}>
            변경
          </button>
        </>
      )}
    </>
  );
}
