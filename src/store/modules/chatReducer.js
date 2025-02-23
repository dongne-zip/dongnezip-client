const CHATROOM_DATA = './chat/CHATROOM_DATA';

export const chat = ({ itemId, chatHost, chatGuest }) => ({
  type: CHATROOM_DATA,
  payload: { itemId, chatHost, chatGuest },
});

const initialState = {
  chatRoom: [],
};

export default function chatReducer(state = initialState, action) {
  switch (action.type) {
    case CHATROOM_DATA:
      return {
        ...state,
        chatRoom: action.payload,
      };
    default:
      return state;
  }
}
