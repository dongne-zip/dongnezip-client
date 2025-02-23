import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useState } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_SERVER;

export default function ProfilePart() {
  const user = useSelector((state) => state.isLogin.user);
  const isLoggedIn = useSelector((state) => state.isLogin.isLoggedIn);
  const [profileData, setProfileData] = useState(user);

  // 로그인 상태일 때만 프로필 정보 요청
  // useEffect(() => {
  //   if (isLoggedIn) {
  //     // 서버로부터 유저 정보를 가져오는 API 호출
  //     const fetchUserData = async () => {
  //       try {
  //         const response = await axios.get(`${API}/user/mypage`, {
  //           withCredentials: true,
  //         });
  //         if (response.status === 200) {
  //           setProfileData(response.data.user); // 유저 데이터 업데이트
  //           console.log(response.data.user);
  //         }
  //       } catch (error) {
  //         console.error('유저 정보를 가져오는 데 실패했습니다.', error);
  //       }
  //     };
  //     fetchUserData();
  //   }
  // }, [isLoggedIn]);
  const handleFileChange = async () => {
    // S3로 파일 업로드 하기
    if (profileData) {
      const formData = new FormData();
      formData.append('profilePic', profileData);

      try {
        const response = await axios.post(`${API}/user/changeImg`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        });

        setProfileData(response.data.fileUrl); // 업로드 후, 파일 URL을 상태에 저장
        console.log('파일 업로드 성공: ', response.data.fileUrl);
      } catch (error) {
        console.error('파일 업로드 실패: ', error);
      }
    }
  };

  if (!isLoggedIn) {
    return <div>로그인 후에 이용할 수 있습니다.</div>;
  }

  return (
    <ProfilePartS>
      <ProfileImg src={profileData?.profileImg} alt="프로필 사진" />
      <img src={user.profilePath} alt="프로필 사진" />
      <input
        type="file"
        accept="image/*"
        id="profilePic"
        value={user.profilePath}
        onChange={handleFileChange}
      />
      <Desc>{profileData?.nickname}님, 반갑습니다</Desc>
      <Link to="/changeInfo">
        <EditBtn>회원정보 수정</EditBtn>
      </Link>
    </ProfilePartS>
  );
}

const ProfilePartS = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background-color: #e0e0e0;
  border-radius: 8px;
`;

const ProfileImg = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: white;
`;

const Desc = styled.p`
  flex-grow: 1;
  font-size: 20px;
  margin: 5px 0;
`;

const EditBtn = styled.button`
  background-color: #6a0dad;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #5a0ca3;
  }
`;
