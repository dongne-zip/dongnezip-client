import { styled } from 'styled-components';
import * as S from '../../styles/mixins';
import { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons'; // 빈 하트
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons'; // 채워진 하트
import ModalLogin from './ModalLogin';
import { useNavigate } from 'react-router-dom';

const s3 = process.env.REACT_APP_S3;
const API = process.env.REACT_APP_API_SERVER;

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  const [liked, setLiked] = useState(product.isFavorite);
  const [likeCount, setLikeCount] = useState(product.favCount);
  const [loading, setLoading] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // 지역명
  const regionName = product.Region
    ? `${product.Region.district}`
    : '알 수 없음';

  // 상품 상세 페이지 이동 (모달이 열려있을 때는 이동 X)
  const handleCardClick = () => {
    if (!isLoginModalOpen) {
      navigate(`/purchase/product-detail/${product.id}`);
    }
  };

  // 좋아요 버튼
  const handleLikeClick = async (e) => {
    e.preventDefault(); // 부모 요소 링크 이동 방지

    if (loading) return; // 중복 요청 방지

    // 로그인 유저인지 확인
    try {
      setLoading(true);

      const loginRes = await axios.post(
        `${API}/user/token`,
        {},
        { withCredentials: true },
      );

      console.log('유저 있어???:', loginRes.data.id);

      if (!loginRes.data.id) {
        setIsLoginModalOpen(true);
        return;
      }

      const newLikedState = !liked;

      if (newLikedState) {
        // 좋아요 추가
        const res = await axios.post(`${API}/item/favorites`, {
          itemId: product.id,
        });

        if (!res.data.success) throw new Error(res.data.message);
      } else {
        // 좋아요 취소
        const res = await axios.delete(`${API}/item/favorites/${product.id}`);

        if (!res.data.success) throw new Error(res.data.message);
      }

      // 서버 요청 성공 시 상태 업데이트
      setLiked(newLikedState);
      setLikeCount((prev) => (newLikedState ? prev + 1 : prev - 1));
    } catch (error) {
      console.error('좋아요 처리 중 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ItemContainer onClick={handleCardClick}>
        <ItemImgWrapper>
          <img
            src={product.imgUrl || `${s3}/images/dummy/product-img.png`}
            alt={product.title}
          />
        </ItemImgWrapper>
        <ItemInfoWrapper>
          <ItemTitle>
            <div>{product.title}</div>
            <LikeButton
              onClick={(e) => {
                e.stopPropagation();
                handleLikeClick(e);
              }}
              disabled={loading}
            >
              <FontAwesomeIcon
                icon={liked ? solidHeart : regularHeart}
                style={{ color: liked ? 'red' : 'black' }}
              />
            </LikeButton>
            {loading ? null : <LikeCount liked={liked}>{likeCount}</LikeCount>}
          </ItemTitle>
          <ItemPrice>{product.price.toLocaleString()}원</ItemPrice>
          <ItemPurchasePlace>{regionName}</ItemPurchasePlace>
        </ItemInfoWrapper>
      </ItemContainer>

      {/* 로그인 모달창 */}
      <ModalLogin
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onNavigate={() => {
          setIsLoginModalOpen(false);
          navigate('/login', { replace: true });
        }}
      />
    </>
  );
}

// ---------------- 상품 카드 스타일 ------------------------
const ItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 200px;
  height: 260px;
  padding: 10px;
  margin-bottom: 40px;
  border-color: var(--color-lightgray);

  img {
    border-radius: 10px;
    object-fit: cover;
  }
`;

const ItemImgWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ItemInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 16px;
`;

const ItemTitle = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 5px;
`;

const ItemPrice = styled.div`
  display: flex;
  font-weight: 700;
  margin-bottom: 10px;
`;

const ItemPurchasePlace = styled.div`
  color: var(--color-lightgray);
  font-size: 0.9rem;
`;

// 좋아요
const LikeButton = styled(S.IconMedium)`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  svg {
    font-size: 24px;
    transition: transform 0.2s ease-in-out;
  }

  &:hover svg {
    transform: scale(1.1);
  }
`;

const LikeCount = styled.div`
  font-size: 18px;
  color: ${({ liked }) => (liked ? 'red' : 'black')};
`;
