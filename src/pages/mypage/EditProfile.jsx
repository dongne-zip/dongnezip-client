import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import * as S from '../../styles/mixins';
import styled from 'styled-components';

const API = process.env.REACT_APP_API_SERVER;
axios.defaults.withCredentials = true;

export default function EditProfile() {
  const user = useSelector((state) => state.isLogin.user);
  const isLoggedIn = useSelector((state) => state.isLogin.isLoggedIn);
  const navigate = useNavigate();
  console.log(isLoggedIn);
  console.log(user);

  const [nickname1, setNicknameState] = useState(user.nickname || '');
  const [nicknameChanged, setNicknameChanged] = useState(false);
  const [nicknameError, setNicknameError] = useState(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordCheck, setNewPasswordCheck] = useState('');

  const [isValidPassword, setIsValidPassword] = useState(null);

  // useEffect(() => {
  //   if (isLoggedIn) {
  //     axios
  //       .post(`${API}/user/changeInfo`, { user: user })
  //       .then((response) => {
  //         console.log('서버 응답', response);
  //       })
  //       .catch((error) => {
  //         console.error('서버 오류:', error);
  //       });
  //   }
  // }, [isLoggedIn, user]);
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
    // const storedUser = JSON.parse(localStorage.getItem('user'));
    // Send the update data to the server if there are any changes
    if (Object.keys(updateData).length > 0) {
      try {
        const response = await axios.patch(
          `${API}/user/changeInfo`,
          updateData,

          { withCredentials: true },
        );

        if (response.status === 200) {
          alert('회원정보가 성공적으로 업데이트되었습니다.');
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

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`${API}/user/deleteUser`);
      if (response.status === 200) {
        alert('회원 탈퇴 됐습니다.');
        navigate('/');
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('회원 탈퇴 실패:', error);
      alert('회원 탈퇴 실패. 다시 시도해주세요.');
    }
  };
  if (!isLoggedIn) {
    return <div>로그인 후에 이용할 수 있습니다.</div>;
  }

  return (
    <ExtendedMainLayout>
      <ProfileContainer>
        <H3>회원정보 수정</H3>

        <Label htmlFor="nickname">닉네임: </Label>
        <Input
          type="text"
          id="nickname"
          value={nickname1}
          placeholder={user.nickname}
          onChange={handleNicknameChange}
        />
        {nicknameError && <p style={{ color: 'red' }}>{nicknameError}</p>}
        <br />
        <>
          <Label htmlFor="currentPassword">현재 비밀번호:</Label>
          <Input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <br />
          <Label htmlFor="newPassword">새 비밀번호:</Label>
          <Input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <br />
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
        </>

        <Button
          onClick={handleProfileSubmit}
          disabled={!nicknameChanged && !newPassword}
        >
          수정
        </Button>
        <br />
        <button onClick={handleDelete}>회원탈퇴</button>
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
