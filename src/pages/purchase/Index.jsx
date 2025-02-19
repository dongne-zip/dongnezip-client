import { styled } from 'styled-components';
import ProductCard from '../../components/purchase/ProductCard';
import { productList } from '../../data/dummyProduct';
import * as S from '../../styles/mixins';
import { Link } from 'react-router-dom';

export default function Index() {
  return (
    <S.MainLayout>
      <h1>여기는 구매 페이지!</h1>
      <ProductListContainer>
        {productList.map((product) => (
          <Link key={product.id} to={`/purchase/product-detail/${product.id}`}>
            <ProductCard product={product} />
          </Link>
        ))}
      </ProductListContainer>
    </S.MainLayout>
  );
}

// 상품 목록 그리드
const ProductListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  justify-content: center;

  @media (max-width: 767px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;
