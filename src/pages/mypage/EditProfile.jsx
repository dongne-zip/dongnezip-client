import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

const API = process.env.REACT_APP_API_SERVER;

export default function EditProfile() {
  const user = useSelector((state) => state.isLogin.user);
  const isLoggedIn = useSelector((state) => state.isLogin.isLoggedIn);
  const navigate = useNavigate();

  const [nickname, setNicknameState] = useState('');
  const [profilePath, setProfilePath] = useState('');
  const [nicknameChanged, setNicknameChanged] = useState(false);
  const [profileChanged, setProfileChanged] = useState(false);
  const [file, setFile] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordCheck, setNewPasswordCheck] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [isValidPassword, setIsValidPassword] = useState(null);

  //닉네임 변경

  //비밀번호 변경
  const handlePasswordChange = () => {
    setShowPasswordInput(!showPasswordInput);
  };

  useEffect(() => {
    const passwordRegex = /^(?=.*[a-zA-Z0-9@!#$])[A-Za-z0-9@!#$]{6,20}$/;
    setIsValidPassword(
      newPassword !== '' ? passwordRegex.test(newPassword) : null,
    );
  }, [newPassword]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setProfileChanged(true); // 프로필 사진이 변경되었음을 추적
    }
  };

  const handleProfileSubmit = async () => {
    // S3로 파일 업로드 하기
    if (file) {
      const formData = new FormData();
      formData.append('profilePic', file);

      try {
        const response = await axios.post(`${API}/user/changeImg`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        setProfilePath(response.data.fileUrl); // 업로드 후, 파일 URL을 상태에 저장
        console.log('파일 업로드 성공: ', response.data.fileUrl);
      } catch (error) {
        console.error('파일 업로드 실패: ', error);
      }
    }
    navigate('/mypage');
  };

  // 비밀번호 확인 후 자동으로 변경
  useEffect(() => {
    if (newPassword === newPasswordCheck && isValidPassword) {
      // 비밀번호 변경 후 상태 업데이트

      alert('비밀번호 변경 완료!');
    } else {
      alert('비밀번호가 일치하지 않거나 유효하지 않습니다.');
    }
  }, [newPassword, newPasswordCheck, isValidPassword]);

  if (!isLoggedIn) {
    return <div>로그인 후에 이용할 수 있습니다.</div>;
  }

  return (
    <div>
      <h3>회원정보 수정</h3>

      <label htmlFor="profilePic">프로필 사진:</label>
      <img src={user.profilePath} alt="프로필 사진" />
      <input
        type="file"
        accept="image/*"
        id="profilePic"
        value={profilePath}
        onChange={handleFileChange}
      />
      <br />
      <label htmlFor="nickname">닉네임: </label>
      <input
        type="text"
        id="nickname"
        value={nickname}
        placeholder={user.nickname}
        onChange={(e) => {
          setNicknameState(e.target.value);
          setNicknameChanged(true); // 닉네임 변경 상태 추적
        }}
      />
      <button type="button">중복확인</button>
      <br />
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
        disabled={!nicknameChanged && !profileChanged} // 닉네임이나 프로필사진 변경 시 버튼 활성화
      >
        회원정보 변경
      </button>
    </div>
  );
}
