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
import { deleteItemDetail } from '../../utils/api';
import ModalDelete from '../../components/purchase/ModalDelete';
import ModalAlert from '../../components/common/ModalAlert';

const s3 = process.env.REACT_APP_S3;
const API = process.env.REACT_APP_API_SERVER;

export default function ProductDetail() {
  // redux
  // const isLoggedIn = useSelector((state) => state.isLogin.isLoggedIn);

  const { id } = useParams();
  const dispatch = useDispatch();

  const [userId, setUserId] = useState(null);
  const [userNick, setUserNick] = useState(null);

  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); //삭제 확인
  const [isAlertOpen, setIsAlertOpen] = useState(false); //삭제 완료 알림
  const [isDropdown, setDropdown] = useState(false); //판매자 전용 드롭다운 메뉴(편집, 삭제 권한)
  const chatRooms = useSelector((state) => state.chat.chatRooms);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await axios.get(`${API}/item/${id}`);
        console.log('상품상세 조회', response.data.data);
        setProduct(response.data.data);
      } catch (err) {
        setError('상품 정보를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [id]);

  // ---------- 로그인된 사용자 정보 가져오기 ----------
  useEffect(() => {
    const token = localStorage.getItem('user');
    console.log(token);
    if (token) {
      try {
        const decodeToken = JSON.parse(token);

        setUserId(decodeToken.id);
        setUserNick(decodeToken.nickname);
        console.log(decodeToken);
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  // 로딩 애니메이션
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

    if (userId === product.userId) {
      navigate('/chat-list', {
        state: {
          productTitle: product.title,
          itemId: product.id,
        },
      });
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
        guestNick: userNick,
      });

      const roomId = response.data.roomId;

      // redux에 저장
      const chatPayload = {
        roomId,
        itemId: product.id,
        chatHost: product.userId,
        chatGuest: userId,
        guestNick: userNick,
      };

      dispatch(chat(chatPayload));
      dispatch(setActiveRoom(roomId.toString()));

      // 채팅방 이동
      navigate(`/chat/${roomId}`);
    } catch (err) {
      console.error(err);
    }
  };

  // ---------- 상품 등록한 사용자인지 확인 ----------
  const isOwner = userId === product?.userId;

  // 삭제 요청
  const handleDeleteProduct = async () => {
    try {
      await deleteItemDetail(id);
      setIsModalOpen(false);
      setIsAlertOpen(true);
    } catch (error) {
      console.error('삭제 실패');
    }
  };

  return (
    <S.MainLayout>
      <BreadcrumbContainer>
        <Breadcrumb onClick={() => navigate(-1)}>
          구매 &gt; {product.Category.category} &gt; {product.title}
        </Breadcrumb>

        {/* 판매자 본인만 볼수 있는 드롭다운 버튼 */}
        {isOwner && (
          <>
            <MoreButton onClick={() => setDropdown((prev) => !prev)}>
              <span className="material-symbols-outlined">more_vert</span>
            </MoreButton>

            {/* 드롭다운 메뉴 : 편집 & 삭제 버튼 표시 */}
            {isDropdown && (
              <DropdownMenu>
                <DropdownItem>
                  <button>
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                  <div>편집</div>
                </DropdownItem>

                <DropdownItem onClick={() => setIsModalOpen(true)}>
                  <button onClick={() => setIsModalOpen(true)}>
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                  <div>삭제</div>
                </DropdownItem>
              </DropdownMenu>
            )}
          </>
        )}
      </BreadcrumbContainer>

      {/* 모달창 (삭제) */}
      <ModalDelete
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDelete={handleDeleteProduct}
      />

      {/* 모달창 (삭제 완료 알림) */}
      <ModalAlert
        isOpen={isAlertOpen}
        content={'삭제가 완료되었습니다.'}
        onClose={() => setIsAlertOpen(false)}
        onNavigate={() => navigate('/purchase')}
      />

      <ProductInfoContainer>
        <ProductImgSection>
          <ItemImgWrapper>
            <img
              src={product.images[0] || `${s3}/images/dummy/product-img.png`}
              alt={product.title}
            />
          </ItemImgWrapper>
          <SellerInfoWrapper>
            <SellerProfile>
              <img
                src={
                  product.user.profileImg || `${s3}/images/dummy/user-img.png`
                }
                alt={`${product.user.nickname || '판매자'}님의 프로필 이미지`}
              />
            </SellerProfile>
            <SellerText>
              <SellerName>
                {product.user.nickname || '판매자 닉네임 식별 불가'}
              </SellerName>
              <SellerLocation>{product.Region.district}</SellerLocation>
            </SellerText>
          </SellerInfoWrapper>
        </ProductImgSection>

        {/* ----------- 상품 상세 정보 섹션 -----------*/}
        <ProductInfoSection>
          {/* 상품 상세 */}
          <ProductTitle>{product.title}</ProductTitle>
          <ProductPrice>{product.price.toLocaleString()} 원</ProductPrice>
          <ProductStatus>상품 상태 : {product.itemStatus}</ProductStatus>
          <ProductDescription>{product.detail}</ProductDescription>

          {/* 버튼 영역 */}
          <ButtonWrapper>
            <ChatButton onClick={handleChatData}>채팅하기</ChatButton>
            <FavoriteButton>찜하기</FavoriteButton>
          </ButtonWrapper>

          {/* 거래 상태 표시 (판매자 본인만 클릭 가능) */}
          {isOwner && (
            <TradeStatus>
              {product.isOnwer === 'false' ? (
                <TradeButton>판매중</TradeButton>
              ) : (
                <TradeButton>거래 완료</TradeButton>
              )}
            </TradeStatus>
          )}
          {/* 767이하 모바일에서는 판매자 정보가 상품 상세 정보 아래로 이동 */}
          <SellerInfoWrapperMobile>
            <h2>판매자 정보</h2>
            <div>
              <SellerProfile>
                <img
                  src={
                    product.user.profileImg || `${s3}/images/dummy/user-img.png`
                  }
                  alt={`${product.user.nickname || '판매자'}님의 프로필 이미지`}
                />
              </SellerProfile>
              <SellerText>
                <SellerName>
                  {product.user.nickname || '판매자 닉네임 식별 불가'}
                </SellerName>
                <SellerLocation>{product.Region.district}</SellerLocation>
              </SellerText>
            </div>
          </SellerInfoWrapperMobile>
        </ProductInfoSection>
      </ProductInfoContainer>

      {/* ----------- 거래 희망 장소 -----------*/}
      <ProductDetailContainer>
        {/* 거래 희망 장소 텍스트 */}
        <TradePlaceSection>
          <div>
            <h2> 거래 희망 장소 </h2>
          </div>
          <div>
            {product.map.address} {product.map.placeName}
          </div>
        </TradePlaceSection>
        {/* 지도 */}
        <MiniMap />
      </ProductDetailContainer>
    </S.MainLayout>
  );
}

/* -------------- 현재 페이지 위치 --------------*/
const BreadcrumbContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  position: relative;
`;

const MoreButton = styled.button`
  color: black;
`;
const Breadcrumb = styled.button`
  font-size: 14px;
  color: gray;
  margin-bottom: 20px;
`;

const DropdownMenu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  border: 1px solid var(--color-lightgray);
  position: absolute;
  top: 8px;
  right: 34px;
  background: var(--color-white);
  padding: 4px;
`;

const DropdownItem = styled.div`
  display: flex;
  flex-direction: row;
  color: gray;
  align-items: center;
  font-size: 14px;

  border-radius: 5px;
  padding: 4px;
  height: 24px;

  &:hover {
    background: #f4f6f8;
  }
  span {
    font-size: 12px;
  }
`;

/* -------------- 섹션 포함하는 컨테이너 --------------*/

const ProductInfoContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const ProductDetailContainer = styled.div`
  margin-top: 40px;
  padding: 20px;
  border-top: 1px solid var(--color-lightgray);

  @media (max-width: 767px) {
    border: none;
    margin-top: 0px;
  }
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

  @media (max-width: 767px) {
    display: none;
  }
`;

const SellerInfoWrapperMobile = styled.div`
  display: none;
  @media (max-width: 767px) {
    display: flex;
    flex-direction: column;
    border-top: 1px solid var(--color-lightgray);
    padding: 20px;
    margin-top: 20px;

    > div {
      display: flex;
      border: 1px solid var(--color-lightgray);
      padding: 20px;
      border-radius: 10px;
    }
  }
`;

const SellerProfile = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 4px;

  img {
    width: 100%;
    height: 100%;

    object-fit: cover; //div크기에 맞추고, 넘치는 부분은 잘라줌
    object-position: center; //이미지의 중심을 div 중앙에 배치
  }
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
  height: 200px;

  @media (max-width: 767px) {
    height: 100px;
    overflow-y: scroll;
  }
`;

/* 버튼 */
const ButtonWrapper = styled.div`
  display: flex;
  gap: 10px;
`;

const ButtonBase = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-size: 16px;
  padding: 10px 15px;
  border-radius: 5px;
`;

const ChatButton = styled(ButtonBase)`
  flex-grow: 1;
  background: #6c63ff;
  color: white;

  &:hover {
    background: #564fc4;
  }
`;

const FavoriteButton = styled(ButtonBase)`
  flex-grow: 1;
  background: white;
  border: 1px solid #ddd;

  &:hover {
    background: #f8f8f8;
  }
`;

/* 거래 상태 */
const TradeStatus = styled.div`
  display: flex;
  margin-top: 20px;
  font-size: 16px;
  color: gray;
  span {
    font-weight: bold;
  }
`;

const TradeButton = styled(ButtonBase)`
  border: 1px solid var(--color-lightgray);
  flex-grow: 1;

  &:hover {
    background: #f8f8f8;
  }
`;

/* -------------- 거래 희망 장소 --------------*/
const TradePlaceSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
`;
