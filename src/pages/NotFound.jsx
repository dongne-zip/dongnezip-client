import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Container>
      <NotFoundLayout>
        <TextBox>
          <h1>앗! 페이지를 찾을 수 없어요</h1>
          <p>요청하신 페이지를 찾을 수 없습니다.</p>
          <p>대신 아래 페이지를 확인해 보세요.</p>
          <ButtonGroup>
            <button onClick={() => navigate('/')}>홈페이지</button>
            <button onClick={() => navigate('/purchase')}>
              상품 구경하러가기
            </button>
            <button onClick={() => navigate('/sales')}>판매 등록하기</button>
          </ButtonGroup>
        </TextBox>
        <AnimationBox>
          <DotLottieReact
            src="https://lottie.host/c36f482a-c374-49f6-a0cf-bd306ea151ae/r8AIcSKLKW.lottie"
            loop
            autoplay
          />
        </AnimationBox>
      </NotFoundLayout>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;

  margin-top: -50px;
  @media (max-width: 767px) {
    margin-top: -20px;
  }
`;

const NotFoundLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  align-items: center;
  max-width: 1024px; //헤더와 동일
  width: 100%;
  height: calc(100vh - 80px);

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
    text-align: center;
  }
`;

const TextBox = styled.div`
  max-width: 500px;
  padding: 20px;
  margin-left: 20px;

  h1 {
    font-size: 32px;
    color: var(--color-primary);
  }

  p {
    font-size: 18px;
    color: #333;
    margin: 10px 0;
  }

  @media (max-width: 767px) {
    max-width: 100%;
    order: 2;
  }
`;

const ButtonGroup = styled.div`
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  @media (max-width: 767px) {
    justify-content: center;
    align-items: center;
  }

  button {
    padding: 10px 15px;
    border: none;
    background: #f0f0f0;
    border-radius: 20px;

    font-size: 14px;
    transition: background 0.2s;

    &:hover {
      background: #e0e0e0;
    }
  }
`;

const AnimationBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  & > div {
    width: 100%;
    max-width: 600px;
    height: auto;
  }

  @media (max-width: 767px) {
    width: 100%;
    order: 1;
  }
`;
