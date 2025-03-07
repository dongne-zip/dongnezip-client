import { styled } from 'styled-components';
import ContainerFilter from '../../components/purchase/ContainerFilter';
import ProductCard from '../../components/purchase/ProductCard';
import * as S from '../../styles/mixins';
import { useEffect, useState } from 'react';
import { fetchProducts } from '../../utils/api';
import LoadingProductList from '../../components/purchase/LoadingProductList';

export default function Index() {
  // ----------- 필터링 상태 -----------
  const [filterState, setFilterState] = useState({
    available: false, // 거래 가능 여부
    location: 0, // 선택된 지역(서울 구단위)
    category: 0, // 선택된 상품 카테고리
    sortOption: 'latest', //정렬 옵션(최신순, 인기순;좋아요)
  });

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 필터 상태 업데이트
  const updateFilter = (key, value) => {
    setFilterState((prev) => ({ ...prev, [key]: value }));
  };

  const getProducts = async () => {
    setLoading(true);
    setError(null);

    // 전체 상품 조회
    try {
      const data = await fetchProducts({
        categoryId:
          filterState.category !== 0 ? filterState.category : undefined,
        regionId: filterState.location !== 0 ? filterState.location : undefined,
        status: filterState.available ? 'available' : undefined,
        sortBy: filterState.sortOption,
      });
      setProducts(data);
    } catch (err) {
      console.error('상품 목록 불러오는 중 오류 발생:', err);
      setError('상품을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, [filterState]);

  // 필터링된 상품 목록
  const filteredProducts = products.filter((product) => {
    return (
      (!filterState.available || product.buyerId === null) && // 거래 가능 여부: buyerId가 null인지 확인
      (filterState.location === 0 ||
        Number(product.Region?.id) === Number(filterState.location)) && // 지역 필터
      (filterState.category === 0 ||
        Number(product.Category.id) === Number(filterState.category)) // 카테고리 필터
    );
  });

  // 정렬 적용 (최신순/ 인기순)
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (filterState.sortOption === 'latest') {
      return b.id - a.id;
    } else if (filterState.sortOption === 'popular') {
      return b.favCount - a.favCount; // 좋아요 개수 기준 정렬
    }
    return 0;
  });

  // 전체 상품 랜더링
  const renderProductList = () => {
    if (loading) return <LoadingProductList />;
    if (error) return <p>{error}</p>;
    if (sortedProducts.length > 0) {
      return sortedProducts.map((product) => (
        <div key={product.id}>
          <ProductCard product={product} />
        </div>
      ));
    }
    return <p>조회된 상품이 없습니다.</p>;
  };

  return (
    <PurchaseLayout>
      <ContainerFilter filterState={filterState} updateFilter={updateFilter} />
      <ProductListContainer>{renderProductList()}</ProductListContainer>
    </PurchaseLayout>
  );
}

// ----------------  전체 레이아웃 ----------------
const PurchaseLayout = styled(S.MainLayout)`
  display: grid;
  grid-template-columns: 1fr 3fr;
  gap: 20px;
`;

// ----------------  상품 목록 그리드 ----------------
const ProductListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  justify-content: center;

  @media (max-width: 767px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;
