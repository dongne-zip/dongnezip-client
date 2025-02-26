import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const API = process.env.REACT_APP_API_SERVER;
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

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;
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
  return (
    <div>
      <div>
        <h3>판매 물품</h3>
        <button onClick={soldItemsMore}>더보기</button>
        {soldItems && soldItems.length > 0 ? (
          <>
            <ItemList>
              {soldItems.slice(0, 4).map((item) => (
                <ItemContainer
                  key={item.id}
                  onClick={() => handleCardClick(item.id)}
                >
                  <ItemImgWrapper>
                    <img src={item.imgUrl} alt={item.title} />
                  </ItemImgWrapper>
                  <ItemInfoWrapper>
                    <ItemTitle>{item.title}</ItemTitle>
                    <ItemPrice>{item.price}원</ItemPrice>
                  </ItemInfoWrapper>
                </ItemContainer>
              ))}
            </ItemList>
          </>
        ) : (
          <p>판매한 물품이 없습니다.</p>
        )}
      </div>

      <div>
        <h3>구매 물품</h3>
        <button onClick={boughtItemsMore}>더보기</button>
        {boughtItems && boughtItems.length > 0 ? (
          <ItemList>
            {boughtItems.slice(0, 4).map((item) => (
              <ItemContainer
                key={item.id}
                onClick={() => handleCardClick(item.id)}
              >
                <ItemImgWrapper>
                  <img src={item.imgUrl} alt={item.title} />
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
      </div>

      <div>
        <TitleBtn>
          <h3>찜한 물품</h3>
          <button onClick={favItemsMore}>더보기</button>
        </TitleBtn>

        {favoriteItems && favoriteItems.length > 0 ? (
          <ItemList>
            {favoriteItems.slice(0, 4).map((item) => (
              <ItemContainer
                key={item.id}
                onClick={() => handleCardClick(item.id)}
              >
                <ItemImgWrapper>
                  <img src={item.imgUrl} alt={item.title} />
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
      </div>
    </div>
  );
}
const ItemList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 0;
  list-style: none;
`;
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
    width: 100px;
    height: 100px;
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

const TitleBtn = styled.div`
  display: 'flex';
  justify-content: 'space-between';
  align-items: 'center';
`;
