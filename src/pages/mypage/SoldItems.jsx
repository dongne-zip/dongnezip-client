import axios from 'axios';
import { useState, useEffect } from 'react';

const API = process.env.REACT_APP_API_SERVER;
axios.defaults.withCredentials = true;

export default function SoldItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h3>판매 물품</h3>
      {items.length > 0 ? (
        <div>
          {items.map((item) => (
            <div key={item.id}>
              <img src={item.imageUrl} alt={item.title} />

              <div>{item.title}</div>
              <div>{item.price}원</div>
            </div>
          ))}
        </div>
      ) : (
        <p>판매한 물품이 없습니다.</p>
      )}

      {/* Pagination controls */}
      <div>
        {page > 1 && (
          <button onClick={() => handlePageChange(page - 1)}>이전</button>
        )}

        {/* Page numbers */}
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            style={{ fontWeight: page === index + 1 ? 'bold' : 'normal' }}
          >
            {index + 1}
          </button>
        ))}

        {page < totalPages && (
          <button onClick={() => handlePageChange(page + 1)}>다음</button>
        )}
      </div>
    </div>
  );
}
