import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

export default function SellerSales() {
  const { sellerId } = useParams();
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 판매물품 조회 API 호출
  const fetchSoldItems = async (page) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(
        `/api-server/soldItems?sellerId=${sellerId}&page=${page}`,
      );
      const data = await response.json();

      if (response.ok && data.success) {
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

  return (
    <SellerSalesLayout>
      <h2>판매자 판매물품 조회</h2>
      {loading && <p>로딩 중...</p>}
      {error && <ErrorText>{error}</ErrorText>}

      {!loading && !error && items.length > 0 && (
        <>
          <CardContainer>
            {items.map((item) => (
              <Card key={item.id}>
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
  );
}

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
