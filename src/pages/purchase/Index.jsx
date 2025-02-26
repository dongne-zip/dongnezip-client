import { styled } from 'styled-components';
// import { Link } from 'react-router-dom';
import ContainerFilter from '../../components/purchase/ContainerFilter';
import ProductCard from '../../components/purchase/ProductCard';
// import { productList } from '../../data/dummyProduct';
import * as S from '../../styles/mixins';
import { useEffect, useState } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_SERVER;

export default function Index() {
  // ----------- 필터링 상태 -----------
  const [available, setAvailable] = useState(false); // 거래 가능 여부
  const [location, setLocation] = useState(0); // 선택된 지역 (서울 구단위)
  const [category, setCategory] = useState(0); // 선택된 상품 카테고리
  const [sortOption, setSortOption] = useState('latest'); // 정렬 옵션(최신순, 인기순;좋아요)
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    // 전체 상품 조회
    try {
      const res = await axios.get(`${API}/item/item`, {
        params: {
          categoryId: category !== 0 ? category : undefined,
          regionId: location !== 0 ? location : undefined,
          status: available ? 'available' : undefined,
          sortBy: sortOption,
        },
      });

      if (res.data.success) {
        // console.log('API 응답 데이터:', res.data.data);
        setProducts(res.data.data);
      } else {
        throw new Error('데이터를 가져오는 데 실패했습니다.');
      }
    } catch (err) {
      console.error('상품 목록 불러오는 중 오류 발생:', err);
      setError('상품을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category, location, available, sortOption]);

  // 필터링된 상품 목록
  const filteredProducts = products.filter((product) => {
    return (
      (!available || product.buyerId === null) && // 거래 가능 여부: buyerId가 null인지 확인
      (location === 0 || Number(product.Region.id) === Number(location)) && // 지역 필터
      (category === 0 || Number(product.Category.id) === Number(category)) // 카테고리 필터
    );
  });

  // 정렬 적용 (최신순/ 인기순)
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === 'latest') {
      return b.id - a.id;
    } else if (sortOption === 'popular') {
      return b.favCount - a.favCount; // 좋아요 개수 기준 정렬
    }
    return 0;
  });

  return (
    <S.MainLayout>
      {/* ----------- 필터 영역 -----------*/}
      <ContainerFilter
        available={available}
        setAvailable={setAvailable}
        location={location}
        setLocation={setLocation}
        category={category}
        setCategory={setCategory}
        sortOption={sortOption}
        setSortOption={setSortOption}
      />

      {/* ----------- 상품 목록 -----------*/}

      <ProductListContainer>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : sortedProducts.length > 0 ? (
          sortedProducts.map((product) => (
            <div key={product.id}>
              <ProductCard product={product} />
            </div>
          ))
        ) : (
          <p>상품이 없습니다</p>
        )}
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
