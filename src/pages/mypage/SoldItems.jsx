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

  // Function to load more items (next page)
  const soldItemsMore = () => {
    if (page < totalPages) {
      setPage(page + 1);
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
              <img src={item.images[0]} alt={item.title} />
              <div>{item.title}</div>
              <div>{item.price}원</div>
            </div>
          ))}
        </div>
      ) : (
        <p>판매한 물품이 없습니다.</p>
      )}

      {page < totalPages && <button onClick={soldItemsMore}>더보기</button>}
    </div>
  );
}
