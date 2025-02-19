import { styled } from 'styled-components';
import { Link } from 'react-router-dom';
import ContainerFilter from '../../components/purchase/ContainerFilter';
import ProductCard from '../../components/purchase/ProductCard';
import { productList } from '../../data/dummyProduct';
import * as S from '../../styles/mixins';
import { useState } from 'react';

export default function Index() {
  // ----------- 필터링 상태 -----------
  const [available, setAvailable] = useState(false); // 거래 가능 여부
  const [location, setLocation] = useState(''); // 선택된 지역 (서울 구단위)
  const [category, setCategory] = useState(0); // 선택된 상품 카테고리
  const [sortOption, setSortOption] = useState('latest'); // 정렬 옵션(최신순, 인기순;좋아요)

  // 필터링된 상품 목록
  const filteredProducts = productList.filter((product) => {
    return (
      (!available || product.status === '거래 가능') &&
      (!location || product.regionId === location) &&
      (category === 0 || product.categoryId === category)
    );
  });

  // 정렬 적용 (최신순/ 인기순)
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === 'latest') {
      return b.id - a.id;
    } else if (sortOption === 'popular') {
      return b.likes - a.likes; // 좋아요 개수 기준 정렬
    }
    return 0;
  });

  return (
    <S.MainLayout>
      {/* ----------- 필터 영역 -----------*/}
      <ContainerFilter
        availabe={available}
        setAvailable={setAvailable}
        location={location}
        setLocation={setLocation}
        category={category}
        setCategory={setCategory}
        sortOption={sortOption}
        setSortOption={setSortOption}
      />

      {/* ----------- 상품 목록 -----------*/}
      {/* <ProductListContainer>
        {productList.map((product) => (
          <Link key={product.id} to={`/purchase/product-detail/${product.id}`}>
            <ProductCard product={product} />
          </Link>
        ))}
      </ProductListContainer> */}

      <ProductListContainer>
        {sortedProducts.map((product) => (
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
