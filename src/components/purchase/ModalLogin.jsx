import { styled } from 'styled-components';

export default function ModalLogin({ isOpen, onClose, onNavigate }) {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <p>로그인 후 사용해 주세요.</p>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate();
          }}
        >
          로그인하기
        </Button>
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
