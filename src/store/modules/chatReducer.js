// 액션 타입 상수 정의
// 각 액션을 구분하기 위한 고유한 문자열을 정의합니다.
const CHATROOM_DATA = './chat/CHATROOM_DATA';
const ADD_MESSAGE = './chat/ADD_MESSAGE';
const SET_ACTIVE_ROOM = './chat/SET_ACTIVE_ROOM';
const SET_CHAT_ROOMS = './chat/SET_CHAT_ROOMS'; // 전체 채팅방 목록을 설정하기 위한 액션

// 액션 생성자 (Action Creators)
// 새로운 채팅방 데이터를 생성하기 위한 액션 생성자입니다.
export const chat = ({ roomId, itemId, chatHost, chatGuest, guestNick }) => ({
  type: CHATROOM_DATA,
  payload: {
    roomId, // 채팅방 고유 아이디
    itemId, // 관련 상품 또는 아이템 아이디
    chatHost, // 채팅을 주최한 사용자
    chatGuest, // 채팅에 참여한 게스트 사용자
    guestNick, // 게스트의 닉네임
    messages: [], // 초기 메시지 목록 (빈 배열)
    unreadCount: 0, // 읽지 않은 메시지 수 초기값
  },
});

// 메시지 추가 액션 생성자
// 특정 채팅방에 새 메시지를 추가할 때 사용하는 액션입니다.
export const addMessage = ({ roomId, message, senderId }) => ({
  type: ADD_MESSAGE,
  payload: { roomId, message, senderId },
});

// 활성화된 채팅방 설정 액션 생성자
// 사용자가 현재 보고 있는 채팅방을 지정합니다.
export const setActiveRoom = (roomId) => ({
  type: SET_ACTIVE_ROOM,
  payload: roomId,
});

// 전체 채팅방 목록을 설정하는 새로운 액션 생성자
// 서버나 로컬 저장소에서 받아온 채팅방 목록으로 상태를 초기화할 때 사용됩니다.
export const setChatRooms = (rooms) => ({
  type: SET_CHAT_ROOMS,
  payload: rooms,
});

// 초기 상태 정의
// chatReducer가 관리할 상태의 초기값을 정의합니다.
const initialState = {
  // chatRooms: 각 채팅방의 정보 배열 [{roomId, itemId, chatHost, chatGuest, messages, unreadCount}]
  chatRooms: [],
  activeRoomId: null, // 현재 활성화된 채팅방 아이디 (없을 경우 null)
};

// chatReducer: 상태(state)와 액션(action)에 따라 상태를 업데이트하는 리듀서 함수
export default function chatReducer(state = initialState, action) {
  switch (action.type) {
    // 새로운 채팅방 데이터를 추가하는 액션 처리
    case CHATROOM_DATA: {
      // 이미 존재하는 채팅방인지 확인 (itemId, chatHost, chatGuest가 모두 동일한 경우)
      const existngRoom = state.chatRooms.find(
        (room) =>
          room.itemId === action.payload.itemId &&
          room.chatHost === action.payload.chatHost &&
          room.chatGuest === action.payload.chatGuest,
      );
      // 기존에 같은 채팅방이 있다면 상태 변경 없이 그대로 반환
      if (existngRoom) {
        return state;
      }
      // 새로운 채팅방을 추가하여 상태 업데이트
      return {
        ...state,
        chatRooms: [...state.chatRooms, action.payload],
      };
    }

    // 메시지를 추가하는 액션 처리
    case ADD_MESSAGE: {
      return {
        ...state,
        chatRooms: state.chatRooms.map((room) => {
          // 해당 메시지를 추가할 채팅방 찾기
          if (room.roomId === action.payload.roomId) {
            // 현재 활성화된 채팅방인지 확인
            const isActive = state.activeRoomId === action.payload.roomId;
            return {
              ...room,
              // 기존 메시지 배열에 새 메시지 추가
              messages: [...room.messages, action.payload.message],
              // 채팅방이 활성화 상태가 아니라면 읽지 않은 메시지 카운트 증가
              unreadCount: isActive ? room.unreadCount : room.unreadCount + 1,
            };
          }
          return room;
        }),
      };
    }

    // 활성화된 채팅방을 설정하는 액션 처리
    case SET_ACTIVE_ROOM: {
      return {
        ...state,
        activeRoomId: action.payload, // 활성화된 채팅방 아이디 업데이트
        // 활성화된 채팅방의 읽지 않은 메시지 카운트를 초기화 (0으로 설정)
        chatRooms: state.chatRooms.map((room) =>
          room.roomId === action.payload ? { ...room, unreadCount: 0 } : room,
        ),
      };
    }

    // 전체 채팅방 목록을 설정하는 액션 처리
    case SET_CHAT_ROOMS: {
      return {
        ...state,
        // payload로 전달된 각 채팅방 데이터를 보완하여 채팅방 목록을 업데이트
        chatRooms: action.payload.map((room) => ({
          ...room,
          messages: room.messages || [], // 메시지 배열이 없으면 빈 배열로 초기화
          unreadCount: room.unreadCount || 0, // 읽지 않은 메시지 수가 없으면 0으로 초기화
        })),
      };
    }

    // 해당되지 않는 액션일 경우 현재 상태를 그대로 반환
    default:
      return state;
  }
}
