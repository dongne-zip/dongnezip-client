import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as S from '../styles/mixins';
import { setChatRooms } from '../store/modules/chatReducer';
import styled from 'styled-components';

const API = process.env.REACT_APP_API_SERVER;

export default function ChatList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chatRooms = useSelector((state) => state.chat.chatRooms);
  const location = useLocation();

  const { productTitle, itemId } = location.state || {};
  console.log(itemId);
  // 사용자 인증 및 채팅방 목록 가져오기
  useEffect(() => {
    const token = localStorage.getItem('user');
    if (!token) {
      navigate('/login');
      return;
    }

    let decodeToken;
    try {
      decodeToken = JSON.parse(token);
      // decodeToken이 객체이고 id 속성이 있는지 확인
      if (!decodeToken || typeof decodeToken !== 'object' || !decodeToken.id) {
        throw new Error('유효하지 않은 토큰 형식입니다.');
      }
    } catch (err) {
      console.error('토큰 파싱 에러:', err);
      setError('사용자 인증에 실패했습니다.');
      navigate('/login');
      return;
    }
    const fetchChatRooms = async () => {
      try {
        if (!itemId) {
          setError('itemId가 제공되지 않았습니다.');
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${API}/chat/rooms/${decodeToken.id}/${itemId}`,
        );
        dispatch(setChatRooms(response.data.rooms));
        setLoading(false);
      } catch (err) {
        setError('채팅방 목록을 불러오는데 실패했습니다.');
        console.error(err);
      }
    };

    fetchChatRooms();
  }, [dispatch, navigate]);

  const handleRoomClick = (roomId) => {
    navigate(`/chat/${roomId}`);
  };

  if (loading) {
    return (
      <S.MainLayout>
        <div>Loading...</div>
      </S.MainLayout>
    );
  }

  if (error) {
    return (
      <S.MainLayout>
        <div>{error}</div>
      </S.MainLayout>
    );
  }

  return (
    <S.MainLayout>
      <h1>{productTitle}의 채팅내역</h1>
      <ChatRoomList>
        {chatRooms.length > 0 ? (
          chatRooms.map((room) => (
            <ChatRoomItem
              key={room.roomId || room.id}
              onClick={() => handleRoomClick(room.roomId || room.id)}
            >
              <RoomInfo>
                <RoomTitle>참여자: {room.guestNick}</RoomTitle>
              </RoomInfo>
            </ChatRoomItem>
          ))
        ) : (
          <p>참여중인 채팅방이 없습니다.</p>
        )}
      </ChatRoomList>
    </S.MainLayout>
  );
}

const ChatRoomList = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 20px 0;
`;

const ChatRoomItem = styled.div`
  padding: 15px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  &:hover {
    background-color: #f5f5f5;
  }
`;

const RoomInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const RoomTitle = styled.span`
  font-weight: bold;
`;
