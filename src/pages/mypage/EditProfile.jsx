import { useState } from 'react';
import PhoneNumber from '../../components/auth/PhoneNumber';

export default function EditProfile() {
  const [nickname, setNickname] = useState('');

  return (
    <>
      <div>
        <h3>회원정보 수정</h3>
        <label htmlFor="nickname">닉네임: </label>
        <input
          type="text"
          id="nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <PhoneNumber />
      </div>
    </>
  );
}
