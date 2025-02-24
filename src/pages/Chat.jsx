import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { useSelector } from 'react-redux';
// import { jwtDecode } from 'jwt-decode';
import { useParams } from 'react-router-dom';

// 소켓 서버에 연결 (자동 연결은 하지 않음)
const socket = io.connect('http://localhost:8080', { autoConnect: false });
const API = process.env.REACT_APP_API_SERVER;
export default function Chat() {
  // 소켓 연결 초기화 함수: 소켓이 연결되어 있지 않다면 연결 실행
  const initSocketConnect = () => {
    if (!socket.connected) socket.connect();
  };

  const { roomId: paramsRoomId } = useParams();

  // Redux store에서 채팅방 관련 데이터를 가져옴
  const { activeRoomId, chatRooms } = useSelector((state) => state.chat);
  const activeRoom = chatRooms.find((room) => room.itemId === activeRoomId);
  const chatHost = activeRoom?.chatHost;
  const chatGuest = activeRoom?.chatGuest;
  const roomId = activeRoomId || paramsRoomId;

  // 상태 변수 선언
  const [userId, setUserId] = useState(null); // 로그인한 사용자의 ID
  const [userNickname, setUserNickname] = useState(null);
  const [msgInput, setMsgInput] = useState(''); // 메시지 입력 상태
  const [imageInput, setImageInput] = useState(null); // 이미지 파일 입력 상태
  const [chatList, setChatList] = useState([]); // 채팅 메시지 목록

  // 채팅방 입장
  useEffect(() => {
    if (userId && roomId) {
      initSocketConnect();
      if (paramsRoomId) {
        socket.emit('joinRoom', roomId);
        socket.emit('checkNick', userNickname, roomId);
      }
    }
  }, [userId, roomId]);

  useEffect(() => {
    const token = localStorage.getItem('user');
    console.log(token);
    if (token) {
      try {
        const decodeToken = JSON.parse(token);
        setUserId(decodeToken.id);
        console.log('decode', decodeToken.id);
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  // 컴포넌트 마운트 시 사용자 토큰을 받아와서 userId 설정
  useEffect(() => {
    async function fetchUserToken() {
      try {
        const response = await axios.post(`${API}/user/token`, {
          withCredentials: true,
        });
        const token = response.data.nickname;
        // const decodeToken = jwtDecode(token);
        setUserNickname(token);
      } catch (err) {
        console.error('useridErr', err);
      }
    }

    fetchUserToken();
  }, []);

  console.log(userNickname);

  // 컴포넌트 마운트 시, 서버에서 기존 채팅 메시지 목록을 불러옴
  useEffect(() => {
    if (roomId) {
      fetch(`${API}/chat/${roomId}`)
        .then((response) => response.json())
        .then((data) => {
          console.log('불러온 메시지:', data);
          setChatList(data.message || []); // 데이터가 없을 경우 빈 배열 설정
        })
        .catch((err) => console.error('메시지 불러오기 실패:', err));
    }
  }, [roomId]);

  // 소켓 이벤트 핸들러 설정: notice와 message 이벤트 처리
  useEffect(() => {
    // notice 이벤트 처리 함수: 공지 메시지를 채팅 목록에 추가
    const noticeHandler = (notice) => {
      setChatList((prev) => [
        ...prev,
        { type: 'notice', senderId: 'notice', message: notice },
      ]);
    };
    socket.on('notice', noticeHandler);

    // message 이벤트 처리 함수: 실제 메시지를 채팅 목록에 추가
    const messageHandler = (data) => {
      const type = data.senderId === userId ? 'me' : 'other';
      setChatList((prev) => [
        ...prev,
        { type, sender: data.sender, message: data.message, name: data.nick },
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

    const formData = new FormData();
    formData.append('image', imageInput);
    formData.append('senderId', userId);
    formData.append('senderNick', userNickname);
    formData.append('roomId', roomId);
    formData.append('chatHost', chatHost);
    formData.append('chatGuest', chatGuest);

    if (imageInput) {
      let imageUrl = '';

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
        console.error('imageErr', err);
      }

      sendData = {
        roomId,
        senderId: userId,
        senderNick: userNickname,
        msg: imageUrl,
        type: 'image',
      };
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
        senderNick: userNickname,
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
      {/* 채팅 메시지 목록 출력 */}
      <section>
        {chatList.map((chat, key) => {
          if (chat.type === 'notice') {
            return (
              <div key={key} className="notice">
                {chat.message}
              </div>
            );
          } else if (chat.msgType === 'image') {
            return (
              <div
                key={key}
                className={`speech ${chat.senderNick === userNickname ? 'me' : 'other'}`}
              >
                {chat.senderNick !== userNickname && (
                  <span className="nickname">{chat.name || ''}</span>
                )}
                <img src={chat.message} alt="uploaded" />
              </div>
            );
          } else {
            return (
              <div
                key={key}
                className={`speech ${chat.senderNick === userNickname ? 'me' : 'other'}`}
              >
                {chat.senderNick !== userNickname && (
                  <span className="nickname">{chat.name || ''}</span>
                )}
                <span className="msg-box">{chat.message}</span>
              </div>
            );
          }
        })}
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
