import { styled } from 'styled-components';

export default function ModalAlert({ isOpen, content, onClose, onNavigate }) {
  if (!isOpen) return null; //모달이 닫혀있으면 렌더링 x

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <p>{content}</p>

        <Button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
            onNavigate();
          }}
          style={{ marginLeft: '10px', background: '#ddd', color: '#333' }}
        >
          확인
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
