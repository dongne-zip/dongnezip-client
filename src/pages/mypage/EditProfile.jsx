import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EditProfile() {
  const navigate = useNavigate();

  const [nickname, setNicknameState] = useState('');
  const [profilePath, setProfilePath] = useState('');
  const [nicknameChanged, setNicknameChanged] = useState(false);
  const [profileChanged, setProfileChanged] = useState(false);
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setProfileChanged(true); // 프로필 사진이 변경되었음을 추적
    }
  };

  const handleSubmit = async () => {
    // S3로 파일 업로드 하기
    if (file) {
      const formData = new FormData();
      formData.append('profilePic', file);

      try {
        // S3에 파일을 업로드하는 API 요청
        const response = await axios.post('/changeImg', formData, {
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

  return (
    <div>
      <h3>회원정보 수정</h3>

      <label htmlFor="profilePic">프로필 사진:</label>
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
        onChange={(e) => {
          setNicknameState(e.target.value);
          setNicknameChanged(true); // 닉네임 변경 상태 추적
        }}
      />
      <button type="button">중복확인</button>
      <br />
      <button
        onClick={handleSubmit}
        disabled={!nicknameChanged && !profileChanged} // 닉네임이나 프로필사진 변경 시 버튼 활성화
      >
        회원정보 변경
      </button>
    </div>
  );
}
