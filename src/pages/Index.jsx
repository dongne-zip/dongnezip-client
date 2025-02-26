import * as S from '../styles/mixins';
import { styled } from 'styled-components';
import TopSellers from '../components/home/TopSellers';
const s3 = process.env.REACT_APP_S3;

export default function Index() {
  return (
    <S.MainLayout>
      <HeroContainer>
        <HeroSection>
          <LightBox>
            <img src={`${s3}/images/light.gif`} alt="전구" />
          </LightBox>
          <BannerWrapper>
            <img
              src={`${s3}/images/main-01.png`}
              alt="중고거래 배너 이미지(출처: 시사저널-조현경 디자이너)"
            />
          </BannerWrapper>
          {/* <Button>더 알아보기 →</Button> */}
        </HeroSection>
        <Sidebar>
          <SideItem variant="first">
            <h2>나눔!mpact</h2>
            <p>무료 나눔 1,000건 성사!</p>
          </SideItem>
          <SideItem variant="second">
            <h3>따뜻한 이야기</h3>
            <span>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim,
              laboriosam.
            </span>
          </SideItem>

          <SpeechBubbleWrapper
            bgUrl={`${s3}/images/speech-bubble.png`}
          ></SpeechBubbleWrapper>
        </Sidebar>
      </HeroContainer>

      <TopSellers />
    </S.MainLayout>
  );
}

const HeroContainer = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 20px;
  height: 500px;

  @media (max-width: 767px) {
    display: flex;
    flex-direction: column;
  }
`;

// ----------- 메인 배너 --------------
const HeroSection = styled.div`
  position: relative;
  background: url(${(props) => props.bgUrl}) center/cover no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-black);
  font-size: 2rem;
  max-width: 100%;
  height: 94%;
  border-radius: 40px;
  background-color: #daf3ff;
`;

const LightBox = styled.div`
  position: absolute;
  top: -4px;
  right: -8px;
  width: 90px;
  height: 90px;
  padding: 10px;
  border-radius: 20px;
  z-index: 50;
  background-color: var(--color-white);

  @media (max-width: 767px) {
    height: 80px;
    width: 80px;
  }
`;

// 메인 배너 이미지
const BannerWrapper = styled.div`
  position: relative;

  img {
    width: 100%;
    height: 100%;
  }
`;

// const Button = styled.button`
//   position: absolute;
//   background: black;
//   color: white;
//   border: none;
//   padding: 10px 20px;
//   cursor: pointer;
//   font-size: 1rem;
//   border-radius: 5px;
//   margin-top: 20px;
//   bottom: 250px;
//   left: 30px;
// `;

// ------------ 사이드 -----------------
const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background: white;
`;

const SideItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  width: 110%;
  padding: 10px;

  background-color: ${(props) =>
    props.variant === 'first' ? '#4d4d4d' : 'var(--color-white)'};
  color: ${(props) => (props.variant === 'first' ? 'white' : 'black')};
  border: ${(props) =>
    props.variant === 'first'
      ? 'none'
      : '1px solid var(--color-primary-light)'};

  @media (max-width: 767px) {
    width: auto;
    min-width: 150px;
    flex: 1;
  }
`;

const SpeechBubbleWrapper = styled.div`
  background: url(${(props) => props.bgUrl}) center/cover no-repeat;
  height: 200px;
  width: 140%;
  display: flex;
  padding: 30px;

  @media (max-width: 767px) {
    width: 156%;
    height: 150px;
    margin-left: -100px;
    justify-content: flex-start;
  }
`;
