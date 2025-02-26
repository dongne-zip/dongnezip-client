import { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import ProductCard from '../../components/purchase/ProductCard';

const API = process.env.REACT_APP_API_SERVER;
axios.defaults.withCredentials = true;

export default function SellerSales() {
  const [items, setItems] = useState([]);
  const [itemCount, setItemCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSoldItems = async () => {
      try {
        const res = await axios.get(`${API}/user/soldItems`, {
          params: { page: 1 },
        });
        if (res.data.items) {
          setItems(res.data.items);
          setItemCount(res.data.totalItems);
        } else {
          console.error('판매 내역 로드 실패:', res.data.message);
        }
      } catch (error) {
        console.error('판매 내역 로드 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSoldItems();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <SLayout>
      <SHeader>
        <SSellerInfo>
          <SSellerName>판매 내역</SSellerName>
          <SSellerItemCount>총 판매 물품 ({itemCount}개)</SSellerItemCount>
        </SSellerInfo>
      </SHeader>

      <SCardGrid>
        {items.map((item) => (
          <ProductCard
            key={item.id}
            product={{
              ...item,
              Region: { district: '' },
              isFavorite: false,
              favCount: 0,
              imgUrl: item.images?.[0] || '',
            }}
          />
        ))}
      </SCardGrid>
    </SLayout>
  );
}

// ----------------------- Styled Components -----------------------
const SLayout = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
`;

const SHeader = styled.div`
  margin-bottom: 30px;
`;

const SSellerInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const SSellerName = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 6px;
`;

const SSellerItemCount = styled.div`
  font-size: 14px;
  color: #666;
`;

const SCardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
`;
