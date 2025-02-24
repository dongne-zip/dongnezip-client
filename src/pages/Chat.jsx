import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { useParams } from 'react-router-dom';

// 소켓 서버에 연결 (자동 연결은 하지 않음)
const socket = io.connect('http://localhost:8080', { autoConnect: false });
const API = process.env.REACT_APP_API_SERVER;
export default function Chat() {
  // 소켓 연결 초기화 함수: 소켓이 연결되어 있지 않다면 연결 실행
  const initSocketConnect = () => {
    if (!socket.connected) socket.connect();
  };

  const { ParamsRoomId: paramsRoomId } = useParams;

  // Redux store에서 채팅방 관련 데이터를 가져옴
  const chatRoomData = useSelector((state) => state.chat.chatRooms);
  const chatHost = chatRoomData.chatHost;
  // const chatGuest = chatRoomData.chatGuest;
  const itemId = chatRoomData.itemId;
  const roomId = useSelector((state) => state.chat.activeRoomId);

  // 채팅방 데이터 디버깅용 로그
  console.log(chatHost);
  console.log(itemId);

  // 상태 변수 선언
  const [userId, setUserId] = useState(null); // 로그인한 사용자의 ID
  const [msgInput, setMsgInput] = useState(''); // 메시지 입력 상태
  const [imageInput, setImageInput] = useState(null); // 이미지 파일 입력 상태
  const [chatList, setChatList] = useState([]); // 채팅 메시지 목록

  // 채팅방 입장
  useEffect(() => {
    initSocketConnect();
    if (paramsRoomId) {
      socket.emit('joinRoom', roomId);
      socket.emit('checkNick', userId, roomId);
    }
  }, []);

  // 컴포넌트 마운트 시 사용자 토큰을 받아와서 userId 설정
  useEffect(() => {
    async function fetchUserToken(loginData) {
      try {
        // 사용자 로그인 API 호출 (loginData는 필요에 따라 전달)
        const response = await axios.post(
          'https://localhost:8080/api-server/user/login/local',
          loginData,
          {
            withCredentials: true,
          },
        );
        // 응답 받은 토큰 디코딩
        const token = response.data.token;
        const decodeToken = jwtDecode(token);
        setUserId(decodeToken.userId);
      } catch (err) {
        console.error(err);
      }
    }
    fetchUserToken();
  }, []);

  // 컴포넌트 마운트 시, 서버에서 기존 채팅 메시지 목록을 불러옴
  useEffect(() => {
    fetch(`${API}/chat/${roomId}`)
      .then((response) => {
        // 응답을 JSON으로 변환
        return response.json();
      })
      .then((data) => {
        console.log('response', data);
        // 불러온 메시지 데이터를 상태에 저장
        setChatList(data.message);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  // 소켓 이벤트 핸들러 설정: notice와 message 이벤트 처리
  useEffect(() => {
    // notice 이벤트 처리 함수: 공지 메시지를 채팅 목록에 추가
    const noticeHandler = (notice) => {
      setChatList((prev) => [
        ...prev,
        { type: 'notice', senderId: 'notice', content: notice },
      ]);
    };
    socket.on('notice', noticeHandler);

    // message 이벤트 처리 함수: 실제 메시지를 채팅 목록에 추가
    const messageHandler = (data) => {
      const type = data.senderId === userId ? 'me' : 'other';
      setChatList((prev) => [
        ...prev,
        { type, sender: data.sender, content: data.message, name: data.nick },
      ]);
    };
    socket.on('message', messageHandler);

    // 클린업 함수: 컴포넌트 언마운트 혹은 userId 변경 시 이벤트 핸들러 제거
    return () => {
      socket.off('notice', noticeHandler);
      socket.off('message', messageHandler);
    };
  }, [userId]);

  // 이미지 파일 선택 핸들러: 선택한 파일을 상태에 저장
  const handleImage = (e) => {
    setImageInput(e.target.files[0]);
  };

  // 메시지 전송 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지

    let sendData = {};

    if (imageInput) {
      let imageUrl = '';

      // FormData 객체를 생성하여 이미지, 방 번호, 송신자 ID를 추가
      const formData = new FormData();
      formData.append('image', imageInput);
      formData.append('senderId', userId);
      formData.append('roomId', roomId);

      // 이미지 업로드를 위해 axios를 사용하여 서버에 전송
      try {
        const response = await axios.post(
          'http://localhost:8080/api-server/chat/image',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );
        imageUrl = response.data.imageUrl;
      } catch (err) {
        console.error(err);
      }

      sendData = {
        roomId,
        senderId: userId,
        msg: imageUrl,
        type: 'image',
      };
      console.log('senddata', sendData);
      // 소켓을 통해 'send' 이벤트로 메시지 전송
      socket.emit('send', sendData);
      // 메시지 입력 및 이미지 상태 초기화
      setMsgInput('');
      setImageInput('');
    } else {
      // 메시지 입력이 공백일 경우 함수 종료
      if (msgInput.trim() === '') return setMsgInput('');

      // 전송할 데이터 객체 생성 (여기서는 이미지 URL을 메시지로 전송)
      sendData = {
        roomId,
        senderId: userId,
        msg: msgInput,
        type: 'text',
      };

      // 소켓을 통해 'send' 이벤트로 메시지 전송
      socket.emit('send', sendData);
      // 메시지 입력 및 이미지 상태 초기화
      setMsgInput('');
      setImageInput('');
    }
  };

  return (
    <>
      {console.log()}
      {/* 채팅 메시지 목록 출력 */}
      <section>
        {chatList.map((chat, key) =>
          // notice 타입의 메시지인 경우
          chat.type === 'notice' ? (
            <div key={key} className="notice">
              {chat.content}
            </div>
          ) : (
            // 일반 메시지인 경우: 송신자가 'other'인 경우에만 닉네임 표시
            <div key={key} className={`speech ${chat.type}`}>
              {chat.type == 'other' && (
                <span className="nickname">{chat.name}</span>
              )}
              <span className="msg-box">{chat.content}</span>
            </div>
          ),
        )}
      </section>
      <div></div>
      {/* 메시지 전송 폼 */}
      <form onSubmit={handleSubmit}>
        <input type="file" name="image" id="image" onChange={handleImage} />
        <br />
        <input
          type="text"
          placeholder="asdf"
          value={msgInput}
          onChange={(e) => {
            setMsgInput(e.target.value);
          }}
        />
        <button>전송</button>
      </form>
    </>
  );
}
