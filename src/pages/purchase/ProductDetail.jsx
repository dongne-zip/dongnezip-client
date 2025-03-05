import { useNavigate, useParams } from 'react-router-dom';
import { styled } from 'styled-components';
import * as S from '../../styles/mixins';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useDispatch, useSelector } from 'react-redux';
import { chat, setActiveRoom } from '../../store/modules/chatReducer';
import MiniMap from '../../components/purchase/MiniMap';
import { deleteItemDetail } from '../../utils/api';
import ModalDelete from '../../components/purchase/ModalDelete';
import ModalAlert from '../../components/common/ModalAlert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons'; // 빈 하트
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons'; // 채워진 하트
import ModalLogin from '../../components/purchase/ModalLogin';

const s3 = process.env.REACT_APP_S3;
const API = process.env.REACT_APP_API_SERVER;

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userId, setUserId] = useState(null);
  const [userNick, setUserNick] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // 삭제 확인
  const [isAlertOpen, setIsAlertOpen] = useState(false); // 삭제 완료 알림
  const [isDropdown, setDropdown] = useState(false); // 판매자 전용 드롭다운 (편집, 삭제 권한)
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const chatRooms = useSelector((state) => state.chat.chatRooms);

  // 상품 상세 정보 조회
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

  // 로그인된 사용자 정보 가져오기
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

  // 초기 좋아요 상태 설정
  useEffect(() => {
    if (product) {
      setLiked(product.isFavorite);
      setLikeCount(product.favCount);
    }
  }, [product]);

  // 로딩 애니메이션 처리
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

  // 채팅방 생성 및 이동 처리
  const handleChatData = async () => {
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
      const response = await axios.post(`${API}/chat/chatroom/create`, {
        itemId: product.id,
        chatHost: product.userId,
        chatGuest: userId,
        guestNick: userNick,
      });

      const roomId = response.data.roomId;

      const chatPayload = {
        roomId,
        itemId: product.id,
        chatHost: product.userId,
        chatGuest: userId,
        guestNick: userNick,
      };

      dispatch(chat(chatPayload));
      dispatch(setActiveRoom(roomId.toString()));
      navigate(`/chat/${roomId}`);
    } catch (err) {
      console.error(err);
    }
  };

  // 판매자 프로필 클릭 시 이동
  const handleSellerClick = () => {
    navigate(`/seller/${product.userId}`);
  };

  // 현재 사용자가 상품 등록자인지 여부
  const isOwner = userId === product?.userId;

  // 상품 삭제 요청
  const handleDeleteProduct = async () => {
    try {
      await deleteItemDetail(id);
      setIsModalOpen(false);
      setIsAlertOpen(true);
    } catch (error) {
      console.error('삭제 실패');
    }
  };

  // 좋아요 버튼 클릭 처리
  const handleLikeClick = async (e) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);
      const loginRes = await axios.post(
        `${API}/user/token`,
        {},
        { withCredentials: true },
      );

      if (!loginRes.data.id) {
        setIsLoginModalOpen(true);
        return;
      }

      const newLikedState = !liked;

      if (newLikedState) {
        const res = await axios.post(`${API}/item/favorites`, {
          itemId: product.id,
        });
        if (!res.data.success) throw new Error(res.data.message);
      } else {
        const res = await axios.delete(`${API}/item/favorites/${product.id}`);
        if (!res.data.success) throw new Error(res.data.message);
      }

      setLiked(newLikedState);
      setLikeCount((prev) => (newLikedState ? prev + 1 : prev - 1));
    } catch (error) {
      console.error('좋아요 처리 중 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <S.MainLayout>
      <BreadcrumbContainer>
        <Breadcrumb onClick={() => navigate(-1)}>
          구매 &gt; {product.Category.category} &gt; {product.title}
        </Breadcrumb>

        {/* 판매자 본인일 경우 드롭다운 메뉴 표시 */}
        {isOwner && (
          <>
            <MoreButton onClick={() => setDropdown((prev) => !prev)}>
              <span className="material-symbols-outlined">more_vert</span>
            </MoreButton>
            {isDropdown && (
              <DropdownMenu>
                <DropdownItem onClick={() => navigate(`/salechange/${id}`)}>
                  <button>
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                  <div>편집</div>
                </DropdownItem>
                <DropdownItem onClick={() => setIsModalOpen(true)}>
                  <button>
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                  <div>삭제</div>
                </DropdownItem>
              </DropdownMenu>
            )}
          </>
        )}
      </BreadcrumbContainer>

      {/* 삭제 모달 */}
      <ModalDelete
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDelete={handleDeleteProduct}
      />

      {/* 삭제 완료 알림 모달 */}
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
            <SellerProfile onClick={handleSellerClick}>
              <img
                src={
                  product.user.profileImg || `${s3}/images/dummy/user-img.png`
                }
                alt={`${product.user.nickname || '판매자'}님의 프로필 이미지`}
              />
            </SellerProfile>
            <SellerText>
              <SellerName onClick={handleSellerClick}>
                {product.user.nickname || '판매자 닉네임 식별 불가'}
              </SellerName>
              <SellerLocation>{product.Region.district}</SellerLocation>
            </SellerText>
          </SellerInfoWrapper>
        </ProductImgSection>

        {/* 상품 상세 정보 */}
        <ProductInfoSection>
          <ProductTitle>{product.title}</ProductTitle>
          <ProductPrice>{product.price.toLocaleString()} 원</ProductPrice>
          <ProductStatus>상품 상태 : {product.itemStatus}</ProductStatus>
          <ProductDescription>{product.detail}</ProductDescription>
          <ButtonWrapper>
            <ChatButton onClick={handleChatData}>채팅하기</ChatButton>
            <FavoriteButton onClick={handleLikeClick} disabled={loading}>
              <span>찜하기</span>
              <FontAwesomeIcon
                icon={liked ? solidHeart : regularHeart}
                style={{ color: liked ? 'red' : 'black' }}
              />
              {likeCount}
            </FavoriteButton>
          </ButtonWrapper>
          <TradeStatus>
            {!product.buyerId ? (
              <span>📢&nbsp;&nbsp;판매중</span>
            ) : (
              <span>✅&nbsp;&nbsp;거래 완료</span>
            )}
          </TradeStatus>

          {/* 모바일용 판매자 정보 */}
          <SellerInfoWrapperMobile>
            <h2>판매자 정보</h2>
            <div>
              <SellerProfile onClick={handleSellerClick}>
                <img
                  src={
                    product.user.profileImg || `${s3}/images/dummy/user-img.png`
                  }
                  alt={`${product.user.nickname || '판매자'}님의 프로필 이미지`}
                />
              </SellerProfile>
              <SellerText>
                <SellerName onClick={handleSellerClick}>
                  {product.user.nickname || '판매자 닉네임 식별 불가'}
                </SellerName>
                <SellerLocation>{product.Region.district}</SellerLocation>
              </SellerText>
            </div>
          </SellerInfoWrapperMobile>
        </ProductInfoSection>
      </ProductInfoContainer>

      {/* 거래 희망 장소 섹션 */}
      <ProductDetailContainer>
        <TradePlaceSection>
          <div>
            <h2> 거래 희망 장소 </h2>
          </div>
          <div>
            {product.map.address} {product.map.placeName}
          </div>
        </TradePlaceSection>
        <MiniMap id={id} />
      </ProductDetailContainer>

      <ModalLogin
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onNavigate={() => {
          setIsLoginModalOpen(false);
          navigate('/login', { replace: true });
        }}
      />
    </S.MainLayout>
  );
}

/* -------------------- Styled Components -------------------- */

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
    object-fit: cover;
    object-position: center;
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

const TradeStatus = styled.div`
  display: flex;
  margin-top: 20px;
  font-size: 18px;
  color: var(--color-primary);
  border: 1px solid var(--color-lightgray);
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  padding: 10px;

  span {
    font-weight: bold;
  }
`;

const TradePlaceSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
`;
