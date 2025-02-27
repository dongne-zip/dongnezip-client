import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

const API = process.env.REACT_APP_API_SERVER;
const API2 = process.env.REACT_APP_API;

// 소켓 서버에 연결 (자동 연결은 하지 않음)
const socket = io.connect(API2, { autoConnect: false });

export default function Chat() {
  const navigate = useNavigate();
  const { roomId: paramsRoomId } = useParams();
  // Redux store에서 채팅방 관련 데이터를 가져옴
  const { activeRoomId, chatRooms } = useSelector((state) => state.chat);
  console.log('chatroom', chatRooms);
  const roomId = activeRoomId || paramsRoomId;
  console.log('roomId', roomId);
  const activeRoomIdNum = parseInt(roomId, 10);
  const activeRoom = chatRooms.find((room) => room.roomId === activeRoomIdNum);
  console.log('activeroom', activeRoom);
  const chatHost = activeRoom?.chatHost;
  console.log('host', chatHost);
  const chatGuest = activeRoom?.chatGuest;
  console.log('guest', chatGuest);

  // 상태 변수 선언
  const [userId, setUserId] = useState(null); // 로그인한 사용자의 ID
  const [userNickname, setUserNickname] = useState(null);
  const [msgInput, setMsgInput] = useState(''); // 메시지 입력 상태
  const [imageInput, setImageInput] = useState(null); // 이미지 파일 입력 상태
  const [chatList, setChatList] = useState([]); // 채팅 메시지 목록
  const [isLoading, setIsLoading] = useState(true);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const chatSectionRef = useRef(null);

  // 컴포넌트 마운트 시 사용자 토큰을 받아와서 userId 설정
  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await axios.post(`${API}/user/token`, {
          withCredentials: true,
        });
        console.log('API 응답:', response.data);
        const nickname = response.data.nickname;
        setUserNickname(nickname);
        console.log('userNickname 설정:', nickname);
        setIsLoading(false);
        console.log('isLoading false로 변경');

        const token = localStorage.getItem('user');
        if (token) {
          console.log('로컬 스토리지에서 토큰 확인:', token);
          const decodeToken = JSON.parse(token);
          setUserId(decodeToken.id);
          console.log('userId 설정:', decodeToken.id);
        }
      } catch (err) {
        console.error('useridErr', err);
      }
    }

    fetchUserData();
  }, []);

  // 채팅방 입장
  useEffect(() => {
    const initSocketConnect = () => {
      if (!socket.connected) {
        socket.connect();
      }
    };

    if (!isLoading && roomId && userNickname) {
      console.log('채팅방 입장 useEffect 실행:', {
        isLoading,
        roomId,
        userNickname,
        paramsRoomId,
      });

      const handleConnect = () => {
        console.log('Socket connected successfully');
        setIsSocketConnected(true);
        if (paramsRoomId) {
          console.log('방 참여 요청:', roomId);
          socket.emit('joinRoom', userNickname, roomId);
          console.log('Joined room:', roomId);
          // socket.emit('checkNick', userNickname, roomId);
        }
      };

      const handleConnectError = (error) => {
        console.error('Socket connection error:', error);
        setIsSocketConnected(false); // 연결 실패 상태 반영
        alert('소켓 연결에 실패했습니다. 네트워크를 확인해주세요.');
      };

      socket.on('connect', handleConnect);
      socket.on('connect_error', handleConnectError);

      if (socket.connected) {
        console.log('소켓이 이미 연결됨');
        handleConnect();
      } else {
        initSocketConnect();
      }

      return () => {
        socket.off('connect', handleConnect);
        socket.off('connect_error', handleConnectError);
      };
    }
  }, [isLoading, roomId, userNickname]);

  // 컴포넌트 마운트 시, 서버에서 기존 채팅 메시지 목록을 불러옴
  useEffect(() => {
    if (roomId) {
      fetch(`${API}/chat/${roomId}`)
        .then((response) => response.json())
        .then((data) => {
          console.log('data', data);

          const chatData = data.message.map((msg) => ({
            ...msg,
            type: msg.senderId === userId ? 'me' : 'other',
            name: msg.senderNick,
            msgType: msg.msgType || 'text',
          }));
          setChatList(chatData);
          console.log('userid1', userId);
          console.log('data.senderid', data.message[userId + 1].senderId);
        })
        .catch((err) => console.error('메시지 불러오기 실패:', err));
    }
  }, [roomId, userId]);

  useEffect(() => {
    const noticeHandler = (notice) => {
      console.log('notice received:', notice); // 로그 추가
      setChatList((prev) => [
        ...prev,
        { type: 'notice', senderId: 'notice', message: notice },
      ]);
    };
    socket.on('notice', noticeHandler);

    return () => {
      socket.off('notice', noticeHandler);
    };
  }, [userId, roomId]);

  // 소켓 이벤트 핸들러 설정: message 이벤트 처리
  useEffect(() => {
    // message 이벤트 처리 함수: 실제 메시지를 채팅 목록에 추가
    const messageHandler = (data) => {
      console.log('Message received:', data); // 수신 확인용 로그
      console.log('senderid', data.senderId);
      console.log('userid', userId);
      const type = data.senderId === userId ? 'me' : 'other';
      setChatList((prev) => [
        ...prev,
        {
          type,
          senderId: data.senderId,
          message: data.message,
          name: data.senderNick,
          msgType: data.type,
        },
      ]);
    };
    socket.on('message', messageHandler);

    // 클린업 함수: 컴포넌트 언마운트 혹은 userId 변경 시 이벤트 핸들러 제거
    return () => {
      socket.off('message', messageHandler);
    };
  }, [userId]);

  useEffect(() => {
    setTimeout(() => {
      if (chatSectionRef.current) {
        chatSectionRef.current.scrollTop = chatSectionRef.current.scrollHeight;
      }
    }, 100);
  }, [chatList, imagePreview]);

  // 이미지 파일 선택 핸들러: 선택한 파일을 상태에 저장
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 이미지 파일만 허용 (accept 속성도 추가되어 있으므로 브라우저 차원에서 제한)
      if (file.type.startsWith('image/')) {
        setImageInput(file);
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl); /* 추가됨 */
      } else {
        alert('이미지 파일만 선택할 수 있습니다.');
        e.target.value = null; // 파일 선택 초기화 /* 추가됨 */
      }
    }
  };

  const handleCancelImage = () => {
    setImageInput(null); /* 추가됨 */
    setImagePreview(null);
  };

  // 메시지 전송 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지

    let sendData = {};

    if (imageInput) {
      const formData = new FormData();
      formData.append('image', imageInput);
      formData.append('senderId', userId);
      formData.append('senderNick', userNickname);
      formData.append('roomId', roomId);
      formData.append('chatHost', chatHost);
      formData.append('chatGuest', chatGuest);

      // 이미지 업로드를 위해 axios를 사용하여 서버에 전송
      try {
        const response = await axios.post(`${API}/chat/image`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        const imageUrl = response.data.imageUrl;

        sendData = {
          roomId,
          senderId: userId,
          senderNick: userNickname,
          msg: imageUrl,
          type: 'image',
        };
      } catch (err) {
        console.error('imageErr', err);
        return;
      }
    } else if (msgInput.trim() !== '') {
      // 전송할 데이터 객체 생성 (여기서는 이미지 URL을 메시지로 전송)
      sendData = {
        roomId,
        senderId: userId,
        senderNick: userNickname,
        msg: msgInput,
        type: 'text',
      };
    } else {
      return;
    }
    // 소켓을 통해 'send' 이벤트로 메시지 전송
    socket.emit('send', sendData);
    // 메시지 입력 및 이미지 상태 초기화
    setMsgInput('');
    setImageInput(null);
    setImagePreview(null);
  };

  const handleCompleteTransaction = async () => {
    if (window.confirm('정말로 거래를 완료하시겠습니까?')) {
      try {
        // 1. 거래 완료 요청
        const response = await axios.post(`${API}/item/complete`, {
          itemId: activeRoom.itemId,
          buyerId: chatGuest,
        });

        if (response.data.success) {
          alert('거래가 완료되었습니다');

          // 2. 채팅방 삭제 요청
          try {
            const deleteResponse = await axios.delete(
              `${API}/chat/room/${roomId}`,
            );
            if (deleteResponse.data.success) {
              alert('채팅방이 삭제되었습니다');
              // 선택적: 다른 페이지로 이동 (예: 채팅방 목록)
              navigate('/purchase'); // 원하는 경로로 변경
            } else {
              alert('채팅방 삭제에 실패하였습니다');
            }
          } catch (deleteErr) {
            console.error('Chat room delete error', deleteErr);
            alert('채팅방 삭제 중 오류가 발생했습니다');
          }
        } else {
          alert('거래 완료에 실패하였습니다. 다시 시도해주세요');
        }
      } catch (err) {
        console.error('CompleteTransaction error', err);
        alert('거래 완료 중 오류가 발생했습니다');
      }
    }
  };

  if (isLoading) {
    return <div>data loading...</div>;
  }
  if (!isSocketConnected) {
    return <div>소켓 연결 중...</div>;
  }

  return (
    <Container>
      <ChatSection ref={chatSectionRef}>
        {chatList.map((chat, key) => {
          if (chat.type === 'notice') {
            return <Notice key={key}>{chat.message}</Notice>;
          } else if (chat.msgType === 'image') {
            return (
              <Speech key={key} sender={chat.type}>
                {chat.type === 'other' && (
                  <Nickname>{chat.name || ''}</Nickname>
                )}
                <ImageMsg src={chat.message} alt="uploaded" />
              </Speech>
            );
          } else {
            return (
              <Speech key={key} sender={chat.type}>
                {chat.type === 'other' && (
                  <Nickname>{chat.name || ''}</Nickname>
                )}
                <MsgBox>{chat.message}</MsgBox>
              </Speech>
            );
          }
        })}
      </ChatSection>
      {imagePreview && <PreviewImage src={imagePreview} alt="미리보기" />}
      <FormContainer onSubmit={handleSubmit}>
        <FileLabel htmlFor="image">📷</FileLabel>
        <FileInput
          type="file"
          name="image"
          id="image"
          accept="image/*"
          onChange={handleImage}
        />
        {imagePreview && (
          <CancelButton onClick={handleCancelImage}>❌</CancelButton>
        )}

        <InputText
          type="text"
          placeholder="메시지를 입력하세요..."
          value={msgInput}
          onChange={(e) => setMsgInput(e.target.value)}
        />
        {console.log(userId)}
        {console.log(chatHost)}
        {userId === chatHost && (
          <CompleteButton type="button" onClick={handleCompleteTransaction}>
            거래 완료
          </CompleteButton>
        )}
        <SendButton type="submit">전송</SendButton>
      </FormContainer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 91.5vh;
  background-color: #e3f3fa;
  overflow: hidden;
`;

const ChatSection = styled.section`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #e3f3fa;
`;

const Notice = styled.div`
  text-align: center;
  color: #888;
  font-size: 0.9em;
  margin: 10px 0;
`;

// 메시지 박스의 정렬을 props.sender에 따라 변경합니다.
// chat.type이 'me'이면 왼쪽 정렬, 'other'이면 오른쪽 정렬합니다.
const Speech = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 70%;
  margin: 8px 0;
  padding: 10px;
  border-radius: 15px;
  background-color: ${(props) =>
    props.sender === 'me' ? '#fbfcd4' : '#ffffff'};
  align-self: ${(props) => (props.sender === 'me' ? 'flex-end' : 'flex-start')};
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const Nickname = styled.span`
  font-size: 0.8em;
  color: #555;
  margin-bottom: 5px;
`;

const MsgBox = styled.span`
  font-size: 1em;
  color: #333;
`;

const ImageMsg = styled.img`
  max-width: 30vh;
  max-height: 30vh;
  object-fit: contain;
  height: auto;
  border-radius: 10px;
`;

const PreviewImage = styled.img`
  max-height: 30vh; /* 최대 세로 길이 제한 */
  max-width: 100%; /* 부모 너비를 넘지 않도록 제한 */
  object-fit: contain; /* 이미지 비율 유지 */
  display: block; /* 불필요한 inline spacing 제거 */
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #e3f3fa;
  align-self: flex-start;
`;

const FormContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #eee;
`;

const FileInput = styled.input`
  display: none;
`;

const FileLabel = styled.label`
  cursor: pointer;
  background-color: #ddd;
  padding: 8px;
  border-radius: 50%;
  margin-right: 8px;
`;

const CancelButton = styled.button`
  background-color: #ff6961;
  color: #fff;
  border: none;
  border-radius: 50%;
  padding: 8px;
  margin-right: 8px;
  cursor: pointer;
`; /* 추가됨 */

const InputText = styled.input`
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #ccc;
  border-radius: 20px;
  outline: none;
`;

const SendButton = styled.button`
  padding: 10px 15px;
  background-color: var(--color-primary);
  border: none;
  color: #fff;
  border-radius: 20px;
  cursor: pointer;
  margin-left: 8px;
  &:hover {
    background-color: #45a09b;
  }
`;

const CompleteButton = styled.button`
  padding: 10px 15px;
  background-color: #007bff;
  border: none;
  color: #fff;
  border-radius: 20px;
  cursor: pointer;
  margin-left: 8px;
  &:hover {
    background-color: #0056b3;
  }
`;
