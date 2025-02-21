import { styled } from 'styled-components';
import * as S from '../../styles/mixins';
import { seoulDistricts } from '../../data/dummyProduct';

const s3 = process.env.REACT_APP_S3;

export default function ProductCard({ product }) {
  // (TODO) API 명세서 수정되면 수정
  const regionName =
    seoulDistricts.find((region) => region.id === product.regionId)?.name ||
    '알 수 없음';

  return (
    <ItemContainer>
      <ItemImgWrapper>
        <img src={product.img} alt={product.title} />
      </ItemImgWrapper>
      <ItemDetailWrapper>
        <ItemTitle>
          <div>{product.title}</div>
          <S.IconMedium>
            <img src={`${s3}/icons/icon-heart.png`} alt="좋아요 아이콘" />
          </S.IconMedium>
        </ItemTitle>
        <ItemPrice>{product.price.toLocaleString()}원</ItemPrice>
        <ItemPurchasePlace>{regionName}</ItemPurchasePlace>
      </ItemDetailWrapper>
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

const ItemDetailWrapper = styled.div`
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
