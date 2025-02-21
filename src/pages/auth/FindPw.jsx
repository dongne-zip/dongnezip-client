export default function FindPw() {
  return (
    <>
      <h3>비밀번호 찾기</h3>
      <form className="findPwForm">
        <label htmlFor="email">이메일: </label>
        <input type="email" id="email" />
        <button>비밀번호 찾기</button>
        <br />
        <label htmlFor="validationCode">인증번호:</label>
        <input type="text" id="validationCode" />
        <br />
        <label htmlFor="newPw">새 비밀번호:</label>
        <input type="password" id="newPw" />
        <br />
        <label htmlFor="newPwCheck">새 비밀번호 확인:</label>
        <input type="password" id="newPwCheck" />
        <br />
      </form>
    </>
  );
}
