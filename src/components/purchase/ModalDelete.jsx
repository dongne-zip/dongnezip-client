import { styled } from 'styled-components';

export default function ModalDelete({ isOpen, onClose, onDelete }) {
  if (!isOpen) return null; //모달이 닫혀있으면 렌더링 x

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <p>
          정말 삭제하시겠어요? <br />
          복구가 불가능합니다 🥲
        </p>
        <Button onClick={onDelete}>삭제</Button>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          style={{ marginLeft: '10px', background: '#ddd', color: '#333' }}
        >
          닫기
        </Button>
      </ModalContent>
    </ModalOverlay>
  );
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  width: 300px;
`;

const Button = styled.button`
  margin-top: 10px;
  padding: 8px 12px;
  background: #6c63ff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;
