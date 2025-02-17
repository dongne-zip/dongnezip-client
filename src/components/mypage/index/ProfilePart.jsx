import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function ProfilePart({ nickname: initialNickname }) {
  const [nickname, setNickname] = useState('');
  const location = useLocation();
  const { userId } = location.state || {};

  useEffect(() => {
    setNickname(initialNickname);
  }, [initialNickname]); // `initialNickname`이 바뀔 때마다 실행

  return (
    <div>
      <img src="" alt="프로필 사진" />
      <p>
        {userId}: {nickname}님, 반갑습니다
      </p>
      <Link to="/change">
        <button>회원정보 수정</button>
      </Link>
    </div>
  );
}
