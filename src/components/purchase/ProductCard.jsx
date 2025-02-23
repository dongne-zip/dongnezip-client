import { styled } from 'styled-components';
import * as S from '../../styles/mixins';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons'; // 빈 하트
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons'; // 채워진 하트

// import { seoulDistricts } from '../../data/dummyProduct';

const s3 = process.env.REACT_APP_S3;
const API = process.env.REACT_APP_API_SERVER;

export default function ProductCard({ product }) {
  const [liked, setLiked] = useState(product.isFavorite);
  const [likeCount, setLikeCount] = useState(product.favCount);
  const [loading, setLoading] = useState(false);

  // 지역명
  const regionName = product.Region
    ? `${product.Region.district}`
    : '알 수 없음';

  // 서버에서 좋아요 상태 가져오기
  const fetchLikedStatus = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/item/favorites/${product.id}`);
      // console.log('좋아요 상태 조회 응답:', res.data);

      if (res.status === 404) {
        // 좋아요가 없는 경우 기본값 설정
        setLiked(false);
        setLikeCount(0);
        return;
      }

      if (res.data.success) {
        setLiked(res.data.isFavorite);
        setLikeCount(res.data.favCount);
      }
    } catch (error) {
      // console.error('좋아요 상태 조회 오류:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!product.id) {
      console.warn('product.id가 없음:', product);
      return;
    }
    fetchLikedStatus();
  }, [product.id]);

  // 좋아요
  const handleLikeClick = async (e) => {
    e.preventDefault(); // 부모 요소 링크 이동 방지

    if (loading) return; // 중복 요청 방지
    setLoading(true);

    const newLikedState = !liked;

    // (todo) 콘솔 에러 수정하기

    try {
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
      // console.error('좋아요 상태 변경 중 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ItemContainer>
      <ItemImgWrapper>
        <img
          src={product.imgUrl || `${s3}/images/dummy/product-img.png`}
          alt={product.title}
        />
      </ItemImgWrapper>
      <ItemInfoWrapper>
        <ItemTitle>
          <div>{product.title}</div>
          <LikeButton onClick={handleLikeClick} disabled={loading}>
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
