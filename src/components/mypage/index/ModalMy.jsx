import styled from 'styled-components';

const ModalMy = ({ isOpen, content, onClose, onNavigate }) => {
  if (!isOpen) return null;

  return (
    <ModalBackdrop>
      <ModalContent>
        <ModalMessage>{content}</ModalMessage>
        <ModalButtons>
          <Button onClick={onNavigate}>예</Button>
          <Button onClick={onClose}>아니요</Button>
        </ModalButtons>
      </ModalContent>
    </ModalBackdrop>
  );
};

export default ModalMy;

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalContent = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  text-align: center;
`;

const ModalMessage = styled.p`
  font-size: 16px;
  margin-bottom: 20px;
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: space-evenly;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #5451ff;
  color: white;
  &:hover {
    background-color: #7e7dbe;
  }
`;
