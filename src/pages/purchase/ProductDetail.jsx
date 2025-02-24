import { useNavigate, useParams } from 'react-router-dom';
import { styled } from 'styled-components';
import * as S from '../../styles/mixins';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useDispatch, useSelector } from 'react-redux';
import { chat, setActiveRoom } from '../../store/modules/chatReducer';
// import { jwtDecode } from 'jwt-decode';
// import { io } from 'socket.io-client';
import MiniMap from '../../components/purchase/MiniMap';

const s3 = process.env.REACT_APP_S3;
const API = process.env.REACT_APP_API_SERVER;

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chatRooms = useSelector((state) => state.chat.chatRooms);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await axios.get(`${API}/item/${id}`);
        setProduct(response.data.data);
      } catch (err) {
        setError('상품 정보를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [id]);

  useEffect(() => {
    const token = localStorage.getItem('user');
    console.log(token);
    if (token) {
      try {
        const decodeToken = JSON.parse(token);
        setUserId(decodeToken.id);
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  console.log('userid', userId);
  if (loading) {
    return (
      <S.MainLayout>
        <DotLottieReact
          src="https://lottie.host/31cbdf7f-72b9-4a9c-ac6d-c8e70c89cf34/eJQATUqvmn.lottie"
          loop
          autoplay
        />
      </S.MainLayout>
    );
  }

  if (error || !product) {
    return (
      <S.MainLayout>
        <h1>상품을 찾을 수 없습니다 🥲</h1>
      </S.MainLayout>
    );
  }

  if (loading) {
    return (
      <S.MainLayout>
        <DotLottieReact
          src="https://lottie.host/31cbdf7f-72b9-4a9c-ac6d-c8e70c89cf34/eJQATUqvmn.lottie"
          loop
          autoplay
        />
      </S.MainLayout>
    );
  }

  if (error || !product) {
    return (
      <S.MainLayout>
        <h1>상품을 찾을 수 없습니다 🥲</h1>
      </S.MainLayout>
    );
  }

  // chatRoom 데이터 전달, 채팅방 생성
  const handleChatData = async () => {
    // 사용자 인증
    if (!userId) {
      navigate('/login');
      return;
    }

    const existingRoom = chatRooms.find(
      (room) =>
        room.itemId === product.id &&
        room.chatHost === product.chatHost &&
        room.chatGuest === userId,
    );

    if (existingRoom) {
      navigate(`/chat/${existingRoom.roomId || existingRoom.id}`);
      return;
    }

    try {
      // 채팅방 생성
      const response = await axios.post(`${API}/chat/chatroom/create`, {
        itemId: product.id,
        chatHost: product.userId,
        chatGuest: userId,
      });

      const roomId = response.data.roomId;

      // redux에 저장
      const chatPayload = {
        roomId,
        itemId: product.id,
        chatHost: product.userId,
        chatGuest: userId,
      };

      dispatch(chat(chatPayload));
      dispatch(setActiveRoom(roomId));

      // 채팅방 이동
      navigate(`/chat/${roomId}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <S.MainLayout>
      <Breadcrumb>
        구매 &gt; {product.Category.category} &gt; {product.title}
      </Breadcrumb>

      <Container>
        <ProductImgSection>
          <ItemImgWrapper>
            <img
              src={product.imgUrls || `${s3}/images/dummy/product-img.png`}
              alt={product.title}
            />
          </ItemImgWrapper>
          <SellerInfoWrapper>
            <SellerProfile />
            <SellerText>
              <SellerName>판매자 {product.userId}</SellerName>
              <SellerLocation>{product.Region.district}</SellerLocation>
            </SellerText>
          </SellerInfoWrapper>
        </ProductImgSection>
        {/* 상품 상세 정보 섹션 */}
        <ProductInfoSection>
          <ProductTitle>{product.title}</ProductTitle>
          <ProductPrice>{product.price.toLocaleString()} 원</ProductPrice>
          <ProductStatus>상품 상태 : {product.itemStatus}</ProductStatus>

          <ProductDescription>{product.detail}</ProductDescription>

          {/* 버튼 영역 */}
          <ButtonWrapper>
            <ChatButton onClick={handleChatData}>채팅하기</ChatButton>
            <FavoriteButton>찜하기</FavoriteButton>
          </ButtonWrapper>

          {/* 거래 상태 표시 */}
          <TradeStatus>
            거래상태 <span>(판매중 / 완료)</span>
          </TradeStatus>
        </ProductInfoSection>

        <MiniMap />
      </Container>
    </S.MainLayout>
  );
}

/* -------------- 현재 페이지 위치 --------------*/
const Breadcrumb = styled.div`
  font-size: 14px;
  color: gray;
  margin-bottom: 20px;
`;

/* -------------- 섹션 포함하는 컨테이너 --------------*/

const Container = styled.div`
  display: flex;
  gap: 40px;
`;

/* -------------- 상품 이미지 및 판매자 정보 섹션 --------------*/
const ProductImgSection = styled.div`
  flex: 1;
`;

const ItemImgWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 430px;
    height: 430px;
    border-radius: 10px;
  }
`;

const SellerInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  margin-left: 20px;
`;

const SellerProfile = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #ddd;
  margin-right: 10px;
`;

const SellerText = styled.div`
  display: flex;
  flex-direction: column;
`;

const SellerName = styled.div`
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 4px;
`;

const SellerLocation = styled.div`
  font-size: 14px;
  color: gray;
`;

/* -------------- 상품 상세 정보 섹션 --------------*/
const ProductInfoSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ProductTitle = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const ProductPrice = styled.div`
  font-size: 22px;
  font-weight: bold;
  background: #f5f5f5;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
`;

const ProductStatus = styled.div`
  font-size: 16px;
  color: #666;
  margin-bottom: 20px;
`;

const ProductDescription = styled.div`
  font-size: 16px;
  color: #444;
  line-height: 1.5;
  margin-bottom: 20px;
`;

/* 버튼 */
const ButtonWrapper = styled.div`
  display: flex;
  gap: 10px;
`;

const ChatButton = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  background: #6c63ff;
  color: white;
  font-size: 16px;
  padding: 10px 15px;
  border-radius: 5px;
  border: none;
  cursor: pointer;

  &:hover {
    background: #564fc4;
  }
`;

const FavoriteButton = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  background: white;
  border: 1px solid #ddd;
  font-size: 16px;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background: #f8f8f8;
  }
`;

/* 거래 상태 */
const TradeStatus = styled.div`
  margin-top: 20px;
  font-size: 16px;
  color: gray;
  span {
    font-weight: bold;
  }
`;
