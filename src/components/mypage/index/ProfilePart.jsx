import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import userList from '../../../data/dummyUser';

export default function ProfilePart() {
  const nickname = useSelector((state) => state.authReducer.nickname);

  console.log('user', nickname);

  return (
    <div>
      <img src={userList.profilePath} alt="프로필 사진" />
      <p>{nickname}님, 반갑습니다</p>
      <Link to="/changeInfo">
        <button>회원정보 수정</button>
      </Link>
    </div>
  );
}
