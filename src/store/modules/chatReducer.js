// 액션 타입 상수 정의
const CHATROOM_DATA = './chat/CHATROOM_DATA';
const ADD_MESSAGE = './chat/ADD_MESSAGE';
const SET_ACTIVE_ROOM = './chat/SET_ACTIVE_ROOM';

// 채팅방 관련 액션 생성자

// 새로운 채팅방을 추가하거나 기존 채팅방을 확인하는 액션 생성자
// itemId, chatHost, chatGuest 정보를 받아서 payload에 담음
export const chat = ({ itemId, chatHost, chatGuest }) => ({
  type: CHATROOM_DATA,
  payload: { itemId, chatHost, chatGuest, messages: [], unreadCount: 0 },
});

// 특정 채팅방에 메시지를 추가하는 액션 생성자
// roomId(채팅방 식별자)와 추가할 message를 payload에 담음
export const addMessage = ({ roomId, message }) => ({
  type: ADD_MESSAGE,
  payload: { roomId, message },
});

// 현재 활성화된 채팅방의 ID를 설정하는 액션 생성자
export const setActiveRoom = (roomId) => ({
  type: SET_ACTIVE_ROOM,
  payload: roomId,
});

// 초기 상태 정의
const initialState = {
  chatRooms: [], // 여러 채팅방을 배열 형태로 관리
  activeRoomId: null, // 현재 활성화된 채팅방의 ID
};

// 리듀서 함수: 액션에 따라 상태(state)를 업데이트함
export default function chatReducer(state = initialState, action) {
  switch (action.type) {
    // 새로운 채팅방 데이터를 추가하는 액션 처리
    case CHATROOM_DATA: {
      // 동일한 채팅방이 이미 존재하는지 확인
      const existngRoom = state.chatRooms.find(
        (room) =>
          room.itemId === action.payload.itemId &&
          room.chatHost === action.payload.chatHost,
      );
      // 이미 존재하는 경우 상태를 그대로 반환
      if (existngRoom) {
        return state;
      }
      // 존재하지 않는 경우, 새로운 채팅방 정보를 추가하여 업데이트된 상태 반환
      return {
        ...state,
        chatRooms: [...state.chatRooms, action.payload],
      };
    }
    // 특정 채팅방에 메시지를 추가하는 액션 처리
    case ADD_MESSAGE:
      return {
        ...state,
        chatRooms: state.chatRooms.map(
          (room) =>
            // 해당 채팅방(itemId가 roomId와 일치하는 경우)에 새 메시지를 추가
            room.itemId === action.payload.roomId
              ? {
                  ...room,
                  messages: [...room.messages, action.payload.message],
                }
              : room, // 다른 채팅방은 그대로 유지
        ),
      };
    // 활성화된 채팅방을 설정하는 액션 처리
    case SET_ACTIVE_ROOM:
      return {
        ...state,
        activeRoomId: action.payload, // payload로 전달된 roomId를 활성 채팅방으로 설정
      };
    // 처리하지 않는 액션의 경우 기존 상태를 그대로 반환
    default:
      return state;
  }
}
