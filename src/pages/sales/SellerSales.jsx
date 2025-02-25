import { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // 라우트 파라미터 (sellerId) 사용
import ProductCard from '../../components/purchase/ProductCard'; // 판매 물품 카드 컴포넌트

const API = process.env.REACT_APP_API_SERVER;

export default function SellerSales() {
  const { sellerId } = useParams();
  const [seller, setSeller] = useState(null);
  const [items, setItems] = useState([]);
  const [itemCount, setItemCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        const res = await axios.get(`${API}/user/${sellerId}/sales`);
        if (res.data.success) {
          setSeller(res.data.data.seller);
          setItems(res.data.data.items);
          setItemCount(res.data.data.itemCount);
        } else {
          console.error('판매자 정보 로드 실패:', res.data.message);
        }
      } catch (error) {
        console.error('판매자 정보 로드 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    if (sellerId) {
      fetchSellerData();
    }
  }, [sellerId]);

  if (loading) return <div>Loading...</div>;

  return (
    <SLayout>
      <SHeader>
        <SProfileWrapper>
          <SProfileImg
            src={
              seller && seller.profileImg
                ? seller.profileImg
                : 'https://via.placeholder.com/80/cccccc?text=No+Image'
            }
            alt="판매자 프로필"
          />
          <SSellerInfo>
            <SSellerName>{seller?.nickname || '판매자명'}</SSellerName>
            <SSellerItemCount>판매 물품 ({itemCount}개)</SSellerItemCount>
          </SSellerInfo>
        </SProfileWrapper>
      </SHeader>

      <SCardGrid>
        {items.map((item) => {
          // ProductCard에서 필요로 하는 형태로 변환
          return (
            <ProductCard
              key={item.id}
              product={{
                ...item,
                // region.district 등은 item.Region?.district에 존재
                Region: { district: item.Region?.district || '' },
                // 좋아요 여부, 좋아요 수, 대표 이미지 등
                isFavorite: false, // 임시 (필요 시 별도 로직)
                favCount: item.favCount ? parseInt(item.favCount, 10) : 0,
                imgUrl: item.images?.[0] || '',
              }}
            />
          );
        })}
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

const SProfileWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const SProfileImg = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 20px;
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
