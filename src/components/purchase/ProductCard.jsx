import { styled } from 'styled-components';
import * as S from '../../styles/mixins';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons'; // 빈 하트
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons'; // 채워진 하트

// import { seoulDistricts } from '../../data/dummyProduct';

// const s3 = process.env.REACT_APP_S3;
const API = process.env.REACT_APP_API_SERVER;

export default function ProductCard({ product }) {
  const [liked, setLiked] = useState(product.isLiked || false);
  const [likeCount, setLikeCount] = useState(product.likes || 0);

  // 지역명
  const regionName = product.region
    ? `${product.region.province} ${product.region.district}`
    : '알 수 없음';

  useEffect(() => {
    console.log('Liked 상태 변경됨:', liked);
  }, [liked]);

  // 좋아요
  const handleLikeClick = async (e) => {
    e.preventDefault(); // 부모 요소 링크 이동 방지

    console.log('API 서버 주소:', API);
    console.log('상품 id:', product.id);
    console.log('좋아요 요청 데이터:', { itemId: product.id });

    try {
      const res = await axios.post(`${API}/item/favorites`, {
        itemId: product.id,
      });

      console.log('서버 응답 데이터:', res.data);
      console.log('서버 응답 상태코드:', res.status);
      console.log('res.message:', res.message);

      if (res.data.success) {
        alert(res.data.message);

        setLiked((prev) => {
          const newLikedState = !prev;
          console.log('좋아요 상태 변경됨:', newLikedState);
          setLikeCount((prevCount) =>
            newLikedState ? prevCount + 1 : prevCount - 1,
          );
          return newLikedState;
        });
      }
    } catch (error) {
      // (todo) 상태 코드 기반으로 수정하기
      console.error('좋아요 추가 중 오류 발생:', error);

      if (error.response) {
        console.error('서버 응답 코드:', error.response.status);
        console.error('서버 응답 데이터:', error.response.data);
        console.error('서버 응답 상태 텍스트:', error.response.statusText);
      } else if (error.request) {
        console.error('요청은 전송되었지만 응답을 받지 못함:', error.request);
      } else {
        console.error('요청 설정 중 오류 발생:', error.message);
      }
    }
  };

  return (
    <ItemContainer>
      <ItemImgWrapper>
        <img src={product.imgUrl} alt={product.title} />
      </ItemImgWrapper>
      <ItemInfoWrapper>
        <ItemTitle>
          <div>{product.title}</div>
          <LikeButton onClick={handleLikeClick}>
            <FontAwesomeIcon
              icon={liked ? solidHeart : regularHeart}
              style={{ color: liked ? 'red' : 'black' }}
            />
          </LikeButton>
          <div>{likeCount}</div>
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
