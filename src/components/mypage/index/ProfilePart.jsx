import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
// import userList from '../../../data/dummyUser';

export default function ProfilePart() {
  const user = useSelector((state) => state.isLogin.user);
  const isLoggedIn = useSelector((state) => state.isLogin.isLoggedIn);
  console.log('user', user);
  if (!isLoggedIn) {
    return <div>로그인 후에 이용할 수 있습니다.</div>;
  }
  return (
    <div>
      <img src={user.profileImg} alt="프로필 사진" />
      <p>{user.nickname}님, 반갑습니다</p>
      <Link to="/changeInfo">
        <button>회원정보 수정</button>
      </Link>
    </div>
  );
}
