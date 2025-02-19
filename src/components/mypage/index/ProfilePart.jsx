import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function ProfilePart() {
  const isLogin = useSelector((state) => state.authReducer.isLogin);
  const user = useSelector((state) => state.authReducer.user);
  console.log('login', isLogin);

  console.log('user', user);
  if (!isLogin) {
    return <p>로그인을 해주세요</p>;
  }
  return (
    <div>
      <img src={user.profilePath} alt="프로필 사진" />
      <p>{user.nickname}님, 반갑습니다</p>
      <Link to="/change">
        <button>회원정보 수정</button>
      </Link>
    </div>
  );
}
