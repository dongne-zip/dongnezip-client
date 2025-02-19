import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../store/modules/authReducer';
import PasswordChange from '../../components/auth/PasswordChange';
import { useNavigate } from 'react-router-dom';

export default function EditProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.authReducer.user); // 로그인된 사용자 정보

  const [nickname, setNicknameState] = useState(user.nickname);
  const [profilePath, setProfilePath] = useState(user.profilePath);
  const [passwordChanged, setPasswordChanged] = useState(false); // 비밀번호 변경 여부 추적
  const [nicknameChanged, setNicknameChanged] = useState(false); // 닉네임 변경 여부 추적
  const [profileChanged, setProfileChanged] = useState(false); // 프로필 사진 변경 여부 추적
  const [newPassword, setNewPassword] = useState(''); // 새 비밀번호 상태 추가

  useEffect(() => {
    // 닉네임 변경 여부 확인
    setNicknameChanged(nickname !== user.nickname);
    // 프로필 사진 변경 여부 확인 (프로필 사진은 다른 방식으로 처리할 수 있음)
    setProfileChanged(profilePath !== user.profilePath);
  }, [nickname, profilePath, user.nickname, user.profilePath]);

  // 비밀번호 변경 후, 변경 여부 업데이트
  const handlePasswordChange = (newPassword) => {
    setNewPassword(newPassword); // 새 비밀번호 상태 업데이트
    setPasswordChanged(true); // 비밀번호가 변경되었음을 알림
    alert('비밀번호가 변경되었습니다.');
  };

  const handleSubmit = () => {
    // 변경된 정보만 서버로 전송하거나 업데이트
    const updatedUser = { ...user };

    if (nicknameChanged) updatedUser.nickname = nickname;
    if (profileChanged) updatedUser.profilePath = profilePath;
    if (passwordChanged) {
      updatedUser.password = newPassword; // 새 비밀번호 설정
    }

    dispatch(updateUser(updatedUser)); // redux에 업데이트된 사용자 정보 저장
    navigate('/mypage'); // 수정 후 마이페이지로 이동
  };

  return (
    <div>
      <h3>회원정보 수정</h3>
      <label htmlFor="profilePic">프로필 사진:</label>
      <span>{user.profilePath || '없음'}</span>
      <button type="button" onClick={() => setProfilePath('newProfilePath')}>
        프로필 사진 변경
      </button>
      <br />
      <label htmlFor="nickname">닉네임: </label>
      <input
        type="text"
        id="nickname"
        value={nickname}
        onChange={(e) => setNicknameState(e.target.value)} // 닉네임 상태 변경
      />
      <button type="button">중복확인</button> {/* 닉네임 중복 확인 */}
      <br />
      {/* 비밀번호 변경 */}
      <PasswordChange onPasswordChange={handlePasswordChange} />
      <br />
      <button
        onClick={handleSubmit}
        disabled={!nicknameChanged && !profileChanged && !passwordChanged}
      >
        회원정보 변경
      </button>
    </div>
  );
}
