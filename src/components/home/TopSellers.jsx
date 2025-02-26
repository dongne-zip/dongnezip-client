import { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const API = process.env.REACT_APP_API_SERVER;
axios.defaults.withCredentials = true;

export default function TopSellers() {
  const [topSellers, setTopSellers] = useState([]); // 판매왕 5명까지 저장
  const [topBuyers, setTopBuyers] = useState([]); // 구매왕 5명까지 저장

  useEffect(() => {
    axios
      .get(`${API}/item/topSeller`)
      .then((res) => setTopSellers(res.data.topSellers)) // 배열로 저장
      .catch((err) => console.error('판매왕 조회 오류:', err));

    axios
      .get(`${API}/item/topBuyer`)
      .then((res) => setTopBuyers(res.data.topBuyers)) // 배열로 저장
      .catch((err) => console.error('구매왕 조회 오류:', err));
  }, []);

  return (
    <RankingContainer>
      <h2>🏆 판매왕 & 구매왕 🏆</h2>
      <RankingList>
        {topSellers.length > 0 || topBuyers.length > 0 ? (
          topSellers.map((seller, index) => {
            const buyer = topBuyers[index]; // 판매자 순서에 맞게 구매자도 가져옴

            return (
              <Row key={index}>
                <RankingItem>
                  <img
                    src={
                      seller.profileImage ||
                      process.env.REACT_APP_PUBLIC_URL + '/assets/logo.png'
                    }
                    alt="판매왕 프로필"
                  />
                  <div>
                    <h3>
                      판매왕 {index + 1}: {seller.nickname}
                    </h3>
                    <p>판매 수: {seller.salesCount}건</p>
                  </div>
                </RankingItem>

                {buyer ? (
                  <RankingItem>
                    <img
                      src={
                        buyer.profileImage ||
                        process.env.REACT_APP_PUBLIC_URL + '/assets/logo.png'
                      }
                      alt="구매왕 프로필"
                    />
                    <div>
                      <h3>
                        구매왕 {index + 1}: {buyer.nickname}
                      </h3>
                      <p>구매 수: {buyer.purchaseCount}건</p>
                    </div>
                  </RankingItem>
                ) : (
                  <EmptyItem /> // 만약 구매왕이 없으면 빈 공간을 채움
                )}
              </Row>
            );
          })
        ) : (
          <NoData>판매왕 및 구매왕 정보 없음</NoData>
        )}
      </RankingList>
    </RankingContainer>
  );
}

/* 스타일 정의 추가 */
const RankingContainer = styled.div`
  margin-top: 40px;
  padding: 30px;
  background: #f5f5f5;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease-in-out;

  h2 {
    font-size: 1.5rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 20px;
  }
`;

/* 한 줄에 판매왕 & 구매왕을 정렬 */
const RankingList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  margin-top: 20px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 800px;
  gap: 20px;
`;

const RankingItem = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  background: #eaeaea;
  padding: 20px;
  border-radius: 12px;
  width: 48%;
  min-height: 120px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  transition:
    transform 0.2s ease-in-out,
    background 0.3s ease-in-out;
  position: relative;

  &:hover {
    transform: translateY(-5px);
    background: #dcdcdc;
  }

  img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 3px solid #ccc;
  }

  div {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  h3 {
    font-size: 1.4rem;
    font-weight: bold;
    color: #333;
    display: flex;
    align-items: center;
  }

  h3::before {
    content: '🏆';
    margin-right: 8px;
  }

  p {
    font-size: 1.1rem;
    color: #555;
    opacity: 0.9;
  }
`;

/* 구매왕이 없을 때 빈 공간을 채우는 스타일 */
const EmptyItem = styled.div`
  width: 48%;
`;

const NoData = styled.div`
  width: 100%;
  padding: 20px;
  text-align: center;
  background: #f0f0f0;
  border-radius: 12px;
  color: #777;
  font-size: 1.1rem;
  font-weight: bold;
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
`;
