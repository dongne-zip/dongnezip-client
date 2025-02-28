import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as S from '../../styles/mixins';
import styled from 'styled-components';
import axios from 'axios';

const API = process.env.REACT_APP_API_SERVER;
axios.defaults.withCredentials = true; // 모든 요청에 쿠키 포함

export default function SellerSales() {
  const { sellerId } = useParams();
  const navigate = useNavigate(); // useNavigate 훅 추가
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchSoldItems = async (page) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.get(`${API}/item/soldItems`, {
        params: { sellerId, page },
      });

      if (data.success) {
        setItems(data.items);
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);
      } else {
        setError(data.message || '데이터를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      setError('서버 오류 발생');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sellerId) {
      fetchSoldItems(currentPage);
    }
  }, [sellerId, currentPage]);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  // 카드 클릭 시 ProductDetail 페이지로 이동하는 핸들러
  const handleCardClick = (id) => {
    navigate(`/purchase/product-detail/${id}`);
  };

  return (
    <S.MainLayout>
      <SellerSalesLayout>
        <h2>판매자 판매물품 조회</h2>
        {loading && <p>로딩 중...</p>}
        {error && <ErrorText>{error}</ErrorText>}

        {!loading && !error && items.length > 0 && (
          <>
            <CardContainer>
              {items.map((item) => (
                <Card key={item.id} onClick={() => handleCardClick(item.id)}>
                  <CardImageWrapper>
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.title} />
                    ) : (
                      <img src="/images/no-image.png" alt="noImage" />
                    )}
                  </CardImageWrapper>
                  <CardContent>
                    <h3>{item.title}</h3>
                    <p>{item.price.toLocaleString()} 원</p>
                  </CardContent>
                </Card>
              ))}
            </CardContainer>
            <PaginationWrapper>
              <button onClick={handlePrevPage} disabled={currentPage === 1}>
                이전
              </button>
              <span>
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                다음
              </button>
            </PaginationWrapper>
          </>
        )}
      </SellerSalesLayout>
    </S.MainLayout>
  );
}

//-------------------Styled-components--------------------
const SellerSalesLayout = styled.div`
  padding: 20px;
  min-height: 60vh;
`;

const ErrorText = styled.p`
  color: red;
`;

const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
  margin-top: 20px;
`;

const Card = styled.div`
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  cursor: pointer;

  &:hover {
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
`;

const CardImageWrapper = styled.div`
  width: 100%;
  height: 160px;
  overflow: hidden;
  background: #f8f8f8;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CardContent = styled.div`
  padding: 8px;

  h3 {
    font-size: 16px;
    margin-bottom: 4px;
  }

  p {
    color: #666;
    font-size: 14px;
  }
`;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;

  button {
    margin: 0 8px;
    padding: 4px 8px;
    cursor: pointer;
  }
`;
