import { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import ProductCard from '../../components/purchase/ProductCard';

const API = process.env.REACT_APP_API_SERVER;

export default function SellerSales() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // 상품 목록 불러오기
  const fetchItems = async () => {
    try {
      const response = await axios.get(`${API}/item`);
      if (response.data.success) {
        setItems(response.data.data);
      } else {
        console.error('상품 조회 실패:', response.data.message);
      }
    } catch (error) {
      console.error('상품 목록 불러오기 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  if (loading) return <div>상품을 불러오는 중입니다...</div>;

  return (
    <Container>
      <h3>판매 물폼</h3>
      {items.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  padding: 20px;
`;
