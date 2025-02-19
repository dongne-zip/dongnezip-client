import { useState, useEffect } from 'react';
// import PasswordChange from '../../components/auth/PasswordChange';
import { useNavigate } from 'react-router-dom';
import userList from '../../data/dummyUser';
export default function EditProfile() {
  const navigate = useNavigate();

  const [nickname, setNicknameState] = useState(userList.nickname);
  const [profilePath, setProfilePath] = useState(userList.profilePath);
  //   const [passwordChanged, setPasswordChanged] = useState(false); // 비밀번호 변경 여부 추적
  const [nicknameChanged, setNicknameChanged] = useState(false); // 닉네임 변경 여부 추적
  const [profileChanged, setProfileChanged] = useState(false); // 프로필 사진 변경 여부 추적
  // const [newPassword, setNewPassword] = useState(''); // 새 비밀번호 상태 추가

  useEffect(() => {
    // 닉네임 변경 여부 확인
    setNicknameChanged(nickname !== userList.nickname);
    setProfileChanged(profilePath !== userList.profilePath);
  }, [nickname, profilePath, userList.nickname, userList.profilePath]);

  //   // 비밀번호 변경 후, 변경 여부 업데이트
  //   const handlePasswordChange = (newPassword) => {
  //     setNewPassword(newPassword); // 새 비밀번호 상태 업데이트
  //     setPasswordChanged(true); // 비밀번호가 변경되었음을 알림
  //     alert('비밀번호가 변경되었습니다.');
  //   };

  const handleSubmit = () => {
    // 변경된 정보만 서버로 전송하거나 업데이트
    if (nicknameChanged) console.log(nicknameChanged);

    navigate('/mypage'); // 수정 후 마이페이지로 이동
  };

  return (
    <div>
      <h3>회원정보 수정</h3>
      <label htmlFor="profilePic">프로필 사진:</label>
      <span onChange={() => setProfilePath('newProfilePath')}>
        {userList.profilePath || '없음'}
      </span>
      <input type="file" accept="image/*" id="profilePic" />
      <br />
      <label htmlFor="nickname">닉네임: </label>
      <input
        type="text"
        id="nickname"
        value={userList.nickname}
        onChange={(e) => setNicknameState(e.target.value)} // 닉네임 상태 변경
      />
      <button type="button">중복확인</button> {/* 닉네임 중복 확인 */}
      <br />
      {/* 비밀번호 변경 */}
      {/* <PasswordChange onPasswordChange={handlePasswordChange} /> */}
      <br />
      <button
        onClick={handleSubmit}
        disabled={!nicknameChanged && !profileChanged}
      >
        회원정보 변경
      </button>
    </div>
  );
}
