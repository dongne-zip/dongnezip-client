import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const API = process.env.REACT_APP_API_SERVER;
const S3 = process.env.REACT_APP_S3;
axios.defaults.withCredentials = true;

export default function MyPage() {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch user info from the server
  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(`${API}/user/mypage`, {});

      if (response.status === 200) {
        if (response.data.result === false) {
          setError(response.data.message);
        } else {
          setUserInfo(response.data);
        }
      } else {
        setError('서버 오류가 발생했습니다.');
      }
    } catch (err) {
      console.error(err);
      setError('서버에서 정보를 가져오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const handleCardClick = (id) => {
    navigate(`/purchase/product-detail/${id}`);
  };
  const soldItemsMore = () => {
    navigate('/soldItems');
  };
  const favItemsMore = () => {
    navigate('/LikeItems');
  };
  const boughtItemsMore = () => {
    navigate('/boughtItems');
  };
  const { soldItems, boughtItems, favoriteItems } = userInfo || {};
  console.log(userInfo);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Container>
      <Section>
        <SectionHeader>
          <h3>판매 물품</h3>
          <button onClick={soldItemsMore}>더보기</button>
        </SectionHeader>
        {soldItems && soldItems.length > 0 ? (
          <ItemList>
            {soldItems.slice(0, 4).map((item) => (
              <ItemContainer
                key={item.id}
                onClick={() => handleCardClick(item.id)}
              >
                <ItemImgWrapper>
                  <img
                    src={item.imageUrl || `${S3}/images/dummy/product-img.png`}
                    alt={item.title}
                  />
                </ItemImgWrapper>
                <ItemInfoWrapper>
                  <ItemTitle>{item.title}</ItemTitle>
                  <ItemPrice>{item.price}원</ItemPrice>
                </ItemInfoWrapper>
              </ItemContainer>
            ))}
          </ItemList>
        ) : (
          <p>판매한 물품이 없습니다.</p>
        )}
      </Section>

      <Section>
        <SectionHeader>
          <h3>구매 물품</h3>
          <button onClick={boughtItemsMore}>더보기</button>
        </SectionHeader>
        {boughtItems && boughtItems.length > 0 ? (
          <ItemList>
            {boughtItems.slice(0, 4).map((item) => (
              <ItemContainer
                key={item.id}
                onClick={() => handleCardClick(item.id)}
              >
                <ItemImgWrapper>
                  <img
                    src={item.imageUrl || `${S3}/images/dummy/product-img.png`}
                    alt={item.title}
                  />
                </ItemImgWrapper>
                <ItemInfoWrapper>
                  <ItemTitle>{item.title}</ItemTitle>
                  <ItemPrice>{item.price}원</ItemPrice>
                </ItemInfoWrapper>
              </ItemContainer>
            ))}
          </ItemList>
        ) : (
          <p>구매한 물품이 없습니다.</p>
        )}
      </Section>

      <Section>
        <SectionHeader>
          <h3>찜한 물품</h3>
          <button onClick={favItemsMore}>더보기</button>
        </SectionHeader>
        {favoriteItems && favoriteItems.length > 0 ? (
          <ItemList>
            {favoriteItems.slice(0, 4).map((item) => (
              <ItemContainer
                key={item.id}
                onClick={() => handleCardClick(item.id)}
              >
                <ItemImgWrapper>
                  <img
                    src={item.imageUrl || `${S3}/images/dummy/product-img.png`}
                    alt={item.title}
                  />
                </ItemImgWrapper>
                <ItemInfoWrapper>
                  <ItemTitle>{item.title}</ItemTitle>
                  <ItemPrice>{item.price}원</ItemPrice>
                </ItemInfoWrapper>
              </ItemContainer>
            ))}
          </ItemList>
        ) : (
          <p>찜한 물품이 없습니다.</p>
        )}
      </Section>
    </Container>
  );
}

const Container = styled.div`
  padding: 20px;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const Section = styled.div`
  margin-bottom: 40px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  button {
    font-size: 14px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;

    button {
      margin-top: 10px;
      font-size: 12px;
    }
  }
`;

const ItemList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 0;
  list-style: none;

  @media (max-width: 768px) {
    gap: 10px;
  }
`;

const ItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 200px;
  height: 260px;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
    transition: transform 0.2s ease;
  }

  img {
    border-radius: 8px;
    object-fit: cover;
    width: 100%;
    height: 150px;
  }

  @media (max-width: 768px) {
    width: 100%;
    height: auto;
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
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 5px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const ItemPrice = styled.div`
  font-weight: 700;
  font-size: 16px;
  margin-bottom: 10px;
`;

// const TitleBtn = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
// `;
