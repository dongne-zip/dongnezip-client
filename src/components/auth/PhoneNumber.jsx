import { useState } from 'react';

export default function PhoneNumber({ setIsPhoneVerified }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerificationInput, setShowVerificationInput] = useState(false);

  const handlePhoneVerification = () => {
    if (phoneNumber) {
      setShowVerificationInput(true); // Show verification input after phone number is entered
      alert('핸드폰 인증이 완료되었습니다.');
    } else {
      alert('핸드폰 번호를 입력해주세요.');
    }
  };

  const handleVerification = () => {
    if (verificationCode) {
      setIsPhoneVerified(true);
      alert('인증 완료!');
    } else {
      alert('인증번호를 입력해주세요.');
    }
  };

  return (
    <div>
      <label htmlFor="phoneNumber">핸드폰번호:</label>
      <input
        type="number"
        id="phoneNumber"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <button type="button" onClick={handlePhoneVerification}>
        인증번호 받기
      </button>
      <br />

      {showVerificationInput && (
        <>
          <label htmlFor="verification">인증번호:</label>
          <input
            type="number"
            id="verification"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />
          <button type="button" onClick={handleVerification}>
            확인
          </button>
        </>
      )}
    </div>
  );
}
