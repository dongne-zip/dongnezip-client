import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const API = process.env.REACT_APP_API_SERVER;
const S3 = process.env.REACT_APP_S3;
axios.defaults.withCredentials = true;

export default function SoldItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  // Fetch sold items from the server
  const fetchSoldItems = async (page) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/user/soldItems?page=${page}`);
      console.log('resp:::', response);

      if (response.data.message) {
        setError(response.data.message);
        return;
      }

      setItems((prevItems) => [...prevItems, ...response.data.items]);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error('Error fetching sold items:', err);
      setError('서버에서 정보를 가져오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSoldItems(page);
  }, [page]);

  const handlePageChange = (newPage) => {
    if (newPage !== page && newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
      setItems([]); // Optionally clear previous items when loading new page
    }
  };
  const handleCardClick = (id) => {
    navigate(`/purchase/product-detail/${id}`);
  };
  if (loading) return <LoadingText>로딩 중...</LoadingText>;
  if (error) return <ErrorText>{error}</ErrorText>;

  return (
    <Container>
      <h3>판매 물품</h3>
      {items.length > 0 ? (
        <ItemsList>
          {items.map((item) => (
            <ItemContainer
              key={item.id}
              onClick={() => handleCardClick(item.id)}
            >
              <Item key={item.id}>
                <ItemImage
                  src={item.imageUrl || `${S3}/images/dummy/product-img.png`}
                  alt={item.title}
                />
                <ItemInfo>
                  <div>{item.title}</div>
                  <div>{item.price}원</div>
                </ItemInfo>
              </Item>
            </ItemContainer>
          ))}
        </ItemsList>
      ) : (
        <NoItemsText>판매한 물품이 없습니다.</NoItemsText>
      )}

      {/* Pagination controls */}
      <Pagination>
        {page > 1 && (
          <PageButton onClick={() => handlePageChange(page - 1)}>
            이전
          </PageButton>
        )}

        {/* Page numbers */}
        {[...Array(totalPages)].map((_, index) => (
          <PageButton
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            active={page === index + 1}
          >
            {index + 1}
          </PageButton>
        ))}

        {page < totalPages && (
          <PageButton onClick={() => handlePageChange(page + 1)}>
            다음
          </PageButton>
        )}
      </Pagination>
    </Container>
  );
}

// Styled Components

const Container = styled.div`
  padding: 20px;
`;

const LoadingText = styled.div`
  text-align: center;
  font-size: 16px;
`;

const ErrorText = styled.div`
  text-align: center;
  font-size: 16px;
  color: red;
`;

const ItemsList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 2 columns for larger screens */
  gap: 20px;
  margin-top: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr; /* 1 column for mobile screens */
  }
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 8px;
`;

const ItemImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  margin-right: 20px;
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const NoItemsText = styled.p`
  text-align: center;
  font-size: 16px;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const PageButton = styled.button`
  padding: 5px 10px;
  margin: 0 5px;
  border: none;
  background-color: ${(props) => (props.active ? '#007bff' : '#f0f0f0')};
  cursor: pointer;
  font-size: 16px;
  border-radius: 5px;
  color: ${(props) => (props.active ? 'white' : 'black')};
  font-weight: ${(props) => (props.active ? 'bold' : 'normal')};

  &:hover {
    background-color: #ddd;
  }

  &:disabled {
    background-color: #e0e0e0;
    cursor: not-allowed;
  }
`;
const ItemContainer = styled.div`
  cursor: pointer;
`;
