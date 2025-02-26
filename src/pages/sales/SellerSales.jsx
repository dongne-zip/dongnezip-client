import { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import ProductCard from '../../components/purchase/ProductCard';

const s3 = process.env.REACT_APP_S3;
const API = process.env.REACT_APP_API_SERVER;
axios.defaults.withCredentials = true;

export default function SellerSales() {
  const [items, setItems] = useState([]);
  const [itemCount, setItemCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // 사용자 정보 상태 추가
  const [userId, setUserId] = useState(null);
  const [userNick, setUserNick] = useState('');

  // ---------- 로그인된 사용자 정보 가져오기 ----------
  useEffect(() => {
    const token = localStorage.getItem('user');
    if (token) {
      try {
        const decodeToken = JSON.parse(token);
        setUserId(decodeToken.id);
        setUserNick(decodeToken.nickname);
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  // userId가 설정된 후에 판매 내역 fetch
  useEffect(() => {
    if (!userId) return;
    const fetchSoldItems = async () => {
      try {
        const res = await axios.get(`${API}/user/soldItems`, {
          params: { page: 1, sellerId: userId },
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
  }, [userId]);

  if (loading) return <div>Loading...</div>;

  // 판매자 정보: 판매 내역이 있을 경우 첫 번째 상품에서 seller 정보를 추출,
  // 없으면 localStorage의 userNick과 기본값을 사용
  const product =
    items.length > 0
      ? items[0]
      : {
          user: {
            profileImg: '',
            nickname: userNick || '판매자 닉네임 식별 불가',
          },
          Region: {
            district: '',
          },
        };

  return (
    <Layout>
      <Header>
        <SellerInfoWrapper>
          <SellerProfile>
            <img
              src={product.user.profileImg || `${s3}/images/dummy/user-img.png`}
              alt={`${product.user.nickname || '판매자'}님의 프로필 이미지`}
            />
          </SellerProfile>
          <SellerText>
            <SellerName>
              {product.user.nickname || '판매자 닉네임 식별 불가'}
            </SellerName>
            <SellerLocation>{product.Region.district}</SellerLocation>
          </SellerText>
        </SellerInfoWrapper>
        {/* 767px 이하 모바일에서는 판매자 정보가 상품 상세 정보 아래로 이동 */}
        <SellerInfoWrapperMobile>
          <h2>판매자 정보</h2>
          <div>
            <SellerProfile>
              <img
                src={
                  product.user.profileImg || `${s3}/images/dummy/user-img.png`
                }
                alt={`${product.user.nickname || '판매자'}님의 프로필 이미지`}
              />
            </SellerProfile>
            <SellerText>
              <SellerName>
                {product.user.nickname || '판매자 닉네임 식별 불가'}
              </SellerName>
              <SellerLocation>{product.Region.district}</SellerLocation>
            </SellerText>
          </div>
        </SellerInfoWrapperMobile>
        <ItemInfo>
          <ItemName>판매 내역</ItemName>
          <ItemCount>총 판매 물품 ({itemCount}개)</ItemCount>
        </ItemInfo>
      </Header>

      <CardGrid>
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
      </CardGrid>
    </Layout>
  );
}

// ----------------------- Styled Components -----------------------
const Layout = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
`;

const Header = styled.div`
  margin-bottom: 30px;
`;

const SellerInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  margin-left: 20px;

  @media (max-width: 767px) {
    display: none;
  }
`;

const SellerInfoWrapperMobile = styled.div`
  display: none;
  @media (max-width: 767px) {
    display: flex;
    flex-direction: column;
    border-top: 1px solid var(--color-lightgray);
    padding: 20px;
    margin-top: 20px;

    > div {
      display: flex;
      border: 1px solid var(--color-lightgray);
      padding: 20px;
      border-radius: 10px;
    }
  }
`;

const SellerProfile = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 4px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
`;

const SellerText = styled.div`
  display: flex;
  flex-direction: column;
`;

const SellerName = styled.div`
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 4px;
`;

const SellerLocation = styled.div`
  font-size: 14px;
  color: gray;
`;

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const ItemName = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 6px;
`;

const ItemCount = styled.div`
  font-size: 14px;
  color: #666;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
`;
