import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

const API = process.env.REACT_APP_API_SERVER;

export default function EditProfile() {
  const user = useSelector((state) => state.isLogin.user);
  const isLoggedIn = useSelector((state) => state.isLogin.isLoggedIn);
  const navigate = useNavigate();
  console.log(isLoggedIn);

  const [nickname1, setNicknameState] = useState(user.nickname || '');
  const [nicknameChanged, setNicknameChanged] = useState(false);
  const [nicknameError, setNicknameError] = useState(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordCheck, setNewPasswordCheck] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [isValidPassword, setIsValidPassword] = useState(null);

  const handleNicknameChange = (e) => {
    const newNickname = e.target.value;
    setNicknameState(newNickname);

    const nicknameRegex = /^[a-zA-Z0-9가-힣]{4,20}$/;
    if (nicknameRegex.test(newNickname)) {
      setNicknameError(null);
      setNicknameChanged(true); // Nickname has been changed
      console.log(newNickname);
    } else {
      setNicknameError('닉네임은 4~20자, 영문, 숫자, 한글만 가능합니다.');
      setNicknameChanged(false);
    }
  };

  // Password change logic
  const handlePasswordChange = () => {
    setShowPasswordInput(!showPasswordInput);
  };

  useEffect(() => {
    const passwordRegex = /^(?=.*[a-zA-Z0-9@!#$])[A-Za-z0-9@!#$]{6,20}$/;
    setIsValidPassword(
      newPassword !== '' ? passwordRegex.test(newPassword) : null,
    );
  }, [newPassword]);

  const handleProfileSubmit = async () => {
    const updateData = {};

    // If nickname has changed, include it in the update data
    if (nicknameChanged && nickname1 && !nicknameError) {
      updateData.nickname = nickname1;
    }

    // If password has been changed, include it in the update data
    if (
      newPassword === newPasswordCheck &&
      isValidPassword &&
      currentPassword
    ) {
      updateData.oldPwd = currentPassword; // Ensure it's named correctly (oldPwd)
      updateData.newPwd = newPassword; // Ensure it's newPassword and not newPasswordCheck
    }

    console.log('서버 보내는 데이터: ', updateData);

    // Send the update data to the server if there are any changes
    if (Object.keys(updateData).length > 0) {
      try {
        const response = await axios.patch(
          `${API}/user/changeInfo`,
          updateData,
        );

        // Check if the response is successful and handle accordingly
        if (response.status === 200) {
          alert('회원정보가 성공적으로 업데이트되었습니다.');
          navigate('/mypage');
        } else {
          // Server returned a non-200 status code, handle the message properly
          alert(response.data.message);
        }
      } catch (error) {
        console.error('회원정보 업데이트 실패:', error);
        alert('회원정보 업데이트 실패. 다시 시도해주세요.');
      }
    } else {
      alert('변경 사항이 없습니다.');
    }
  };

  if (!isLoggedIn) {
    return <div>로그인 후에 이용할 수 있습니다.</div>;
  }

  return (
    <div>
      <h3>회원정보 수정</h3>

      <label htmlFor="nickname">닉네임: </label>
      <input
        type="text"
        id="nickname"
        value={nickname1}
        placeholder={user.nickname}
        onChange={handleNicknameChange}
      />
      {nicknameError && <p style={{ color: 'red' }}>{nicknameError}</p>}
      <br />

      <label htmlFor="passwordChange">비밀번호:</label>
      <button type="button" onClick={handlePasswordChange}>
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
            required
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
        </>
      )}

      <button
        onClick={handleProfileSubmit}
        disabled={!nicknameChanged && !newPassword}
      >
        수정
      </button>
    </div>
  );
}
