import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import * as S from '../../styles/mixins';
import styled from 'styled-components';
import { updateUser } from '../../store/types';
import { loginUser, logoutUser } from '../../store/types';
import ModalAlert from '../../components/common/ModalAlert';

const API = process.env.REACT_APP_API_SERVER;
axios.defaults.withCredentials = true;

export default function EditProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.isLogin.user);
  const isLoggedIn = useSelector((state) => state.isLogin.isLoggedIn);

  const [nickname1, setNicknameState] = useState(user.nickname);
  const [nicknameChanged, setNicknameChanged] = useState(false);
  const [nicknameError, setNicknameError] = useState(null);
  const [updatedNickname, setUpdatedNickname] = useState(nickname1); // 변경된 닉네임 상태

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordCheck, setNewPasswordCheck] = useState('');

  const [isValidPassword, setIsValidPassword] = useState(null);

  const [profileData, setProfileData] = useState({ ...user, profileImg: '' }); // 프로필 데이터
  const [previewImage, setPreviewImage] = useState(null); // 미리보기 이미지 상태

  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  // const [deleteConfirmed, setDeleteConfirmed] = useState(false); // To

  // 새로고침 후 로그인 상태를 유지
  const checkLoginStatus = async () => {
    try {
      const response = await axios.post(`${API}/user/token`);

      if (response.data.result) {
        const userData = {
          id: response.data.id,
          nickname: response.data.nickname,
          profileImg: response.data.profileImg,
        };
        dispatch(loginUser(userData)); // Redux 상태 업데이트
        localStorage.setItem('user', JSON.stringify(userData)); //  localStorage에도 저장
        console.log('userData', userData);
      } else {
        throw new Error('로그인되지 않음');
      }
    } catch (error) {
      console.error('로그인 상태 확인 실패:', error);
      dispatch(logoutUser()); // Redux에서 로그아웃 처리
      localStorage.removeItem('user'); // localStorage에서도 제거
      navigate('/login'); // 로그인 페이지로 이동
    }
  };
  useEffect(() => {
    checkLoginStatus();
  }, []);

  useEffect(() => {
    if (nicknameChanged && !nicknameError) {
      setUpdatedNickname(nickname1); // 닉네임 변경 시 화면 업데이트
    }
  }, [nicknameChanged, nickname1, nicknameError]);

  const handleNicknameChange = (e) => {
    const newNickname = e.target.value;
    setNicknameState(newNickname);

    const nicknameRegex = /^[a-zA-Z0-9가-힣]{3,10}$/;
    if (nicknameRegex.test(newNickname)) {
      setNicknameError(null);
      setNicknameChanged(true);
    } else {
      setNicknameError('닉네임은 3~10자, 영문, 숫자, 한글만 가능합니다.');
      setNicknameChanged(false);
    }
  };

  useEffect(() => {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$]).{6,20}$/;
    setIsValidPassword(
      newPassword !== '' ? passwordRegex.test(newPassword) : null,
    );
  }, [newPassword]);

  // 프로필 이미지 수정
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setProfileData({
        ...profileData,
        profileImg: file,
      });
    }
  };

  const handleProfileSubmit = async () => {
    const updateData = new FormData();

    // 닉네임이 변경되었고 오류가 없다면
    if (nicknameChanged && nickname1 && !nicknameError) {
      updateData.append('nickname', nickname1);
    }

    // 비밀번호 변경이 유효한 경우
    if (
      newPassword === newPasswordCheck &&
      isValidPassword &&
      currentPassword
    ) {
      updateData.append('oldPw', currentPassword);
      updateData.append('newPw', newPassword);
    }

    // 프로필 이미지가 변경되었으면
    if (profileData.profileImg && profileData.profileImg !== user.profileImg) {
      updateData.append('profileImg', profileData.profileImg);
    }

    // 변경된 데이터가 있다면
    if (
      updateData.has('nickname') ||
      updateData.has('oldPw') ||
      updateData.has('newPw') ||
      updateData.has('profileImg')
    ) {
      try {
        const response = await axios.patch(
          `${API}/user/changeInfo`,
          updateData,
          {
            withCredentials: true,
            headers: { 'Content-Type': 'multipart/form-data' },
          },
        );
        console.log(response);
        if (response.data.result) {
          alert('회원정보가 성공적으로 업데이트되었습니다.');
          setUpdatedNickname(nickname1); // 닉네임이 수정되면 상태 업데이트
          if (updateData.has('nickname')) {
            setUpdatedNickname(nickname1);
            console.log('nickkk', nickname1);
            const updatedUser = { ...user, nickname: nickname1 };
            dispatch(updateUser(updatedUser)); // Redux 상태 업데이트

            localStorage.setItem('user', JSON.stringify(updatedUser)); // localStorag
          }
          if (updateData.has('profileImg')) {
            const updatedProfileImgUser = {
              ...user,
              profileImg: response.data.profileImg,
            };
            dispatch(updateUser(updatedProfileImgUser)); // Redux 상태 업데이트
            localStorage.setItem('user', JSON.stringify(updatedProfileImgUser));
          }
          navigate('/mypage');
        } else {
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
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Handle the user deletion request
  const handleDeleteUser = async () => {
    try {
      // Send the deletion request
      const response = await axios.delete(`${API}/user/deleteUser`, {});

      if (response.data.result) {
        alert('회원탈퇴가 완료되었습니다.');

        // Log out and navigate to login page
        localStorage.removeItem('user');
        dispatch(logoutUser()); // You can dispatch logout if you are using Redux
        navigate('/login');
      } else {
        alert('회원탈퇴 실패. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('회원탈퇴 중 오류 발생:', error);
      alert('회원탈퇴에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // This is where the modal is triggered, only proceed with deletion if confirmed
  const handleConfirmDelete = () => {
    handleDeleteUser(); // Proceed with user deletion if confirmed
    handleCloseModal(); // Close the modal after confirming
  };

  if (!isLoggedIn) {
    return <div>로그인 후에 이용할 수 있습니다.</div>;
  }

  return (
    <ExtendedMainLayout>
      <ProfileContainer>
        <H3>회원정보 수정</H3>

        {/* 선택된 이미지 미리보기 */}
        {previewImage && (
          <PreviewImage src={previewImage} alt="프로필 이미지 미리보기" />
        )}

        {/* 프로필 사진 수정 */}
        <Label htmlFor="profilePic">프로필 이미지: </Label>
        <input
          type="file"
          accept="image/*"
          id="profilePic"
          onChange={handleFileChange}
        />

        {/* 닉네임 입력 */}
        <Label htmlFor="nickname">닉네임: </Label>
        <Input
          type="text"
          id="nickname"
          value={nickname1}
          placeholder={updatedNickname || user.nickname} // 변경된 닉네임을 화면에 표시
          onChange={handleNicknameChange}
        />
        {nicknameError && <p style={{ color: 'red' }}>{nicknameError}</p>}

        {/* 비밀번호 수정 폼 */}
        <Label htmlFor="currentPassword">현재 비밀번호:</Label>
        <Input
          type="password"
          id="currentPassword"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
        <Label htmlFor="newPassword">새 비밀번호:</Label>
        <Input
          type="password"
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <Label htmlFor="newPasswordCheck">새 비밀번호 확인:</Label>
        <Input
          type="password"
          id="newPasswordCheck"
          value={newPasswordCheck}
          onChange={(e) => setNewPasswordCheck(e.target.value)}
        />
        {newPassword !== newPasswordCheck && newPasswordCheck.length > 0 && (
          <ErrorText>비밀번호가 일치하지 않습니다</ErrorText>
        )}
        <p>
          {isValidPassword === null
            ? ''
            : isValidPassword
              ? ''
              : '영문, 숫자, 특수문자(@!#$), 6~20자리'}
        </p>

        {/* 수정 버튼 */}
        <Button
          onClick={handleProfileSubmit}
          disabled={!nicknameChanged && !newPassword && !profileData.profileImg}
        >
          수정
        </Button>
        {/* <DeleteButton onClick={handleDeleteUser}>회원 탈퇴</DeleteButton> */}
        <DeleteButton onClick={handleOpenModal}>회원 탈퇴</DeleteButton>
        <ModalAlert
          isOpen={isModalOpen}
          content="정말 회원 탈퇴를 하시겠습니까?"
          onClose={handleCloseModal}
          onNavigate={handleConfirmDelete} // Call handleConfirmDelete on confirmation
        />
      </ProfileContainer>
    </ExtendedMainLayout>
  );
}

const ExtendedMainLayout = styled(S.MainLayout)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  @media (max-width: 767px) {
    padding: 15px;
  }
`;

const ProfileContainer = styled.div`
  width: 100%;
  max-width: 500px;
  font-size: 14px;
  line-height: 1.5;
  padding: 2rem;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  @media (max-width: 767px) {
    max-width: 100%;
    padding: 1rem;
  }
`;

const H3 = styled.h2`
  text-align: center;
  font-size: 24px;
  @media (max-width: 767px) {
    font-size: 20px;
  }
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 4px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  &:focus {
    border-color: #5a67d8;
    outline: none;
  }
  @media (max-width: 767px) {
    padding: 8px;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #5451ff;
  color: white;
  &:hover {
    background-color: #7e7dbe;
  }
  @media (max-width: 767px) {
    padding: 8px;
  }
`;

const ErrorText = styled.p`
  color: red;
  font-size: 12px;
  margin: 0;
`;

const PreviewImage = styled.img`
  margin-top: 10px;
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
  border: 1px solid #ccc;
`;
const DeleteButton = styled.button`
  width: 100%;
  padding: 10px;
  margin-top: 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #ff4d4f; /* 탈퇴 버튼은 빨간색으로 강조 */
  color: white;
  font-weight: bold;
  &:hover {
    background-color: #ff7875; /* 마우스 오버 시 색상 변화 */
  }
  &:focus {
    outline: none;
  }
  @media (max-width: 767px) {
    padding: 8px;
  }
`;
