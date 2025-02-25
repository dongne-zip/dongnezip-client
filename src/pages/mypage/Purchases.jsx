import axios from 'axios';
import { useState, useEffect } from 'react';

const API = process.env.REACT_APP_API_SERVER;
axios.defaults.withCredentials = true;

export default function MyPage() {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const { soldItems, boughtItems, favoriteItems } = userInfo || {};
  console.log(userInfo);
  return (
    <div>
      <div>
        <h3>판매 물품</h3>
        {soldItems && soldItems.length > 0 ? (
          <ul>
            {soldItems.map((item) => (
              <li key={item.id}>
                <h4>{item.title}</h4>
                <p>가격: {item.price}원</p>
                <img
                  src={item.ItemImages[0]?.imageUrl || 'fallback_image_url'}
                  alt={item.title}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p>판매한 물품이 없습니다.</p>
        )}
      </div>

      <div>
        <h3>구매 물품</h3>
        <button>더보기</button>
        {boughtItems && boughtItems.length > 0 ? (
          <ul>
            {boughtItems.map((item) => (
              <li key={item.id}>
                <h4>{item.title}</h4>
                <p>가격: {item.price}원</p>
                <img
                  src={item.ItemImages[0]?.imageUrl || 'fallback_image_url'}
                  alt={item.title}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p>구매한 물품이 없습니다.</p>
        )}
      </div>

      <div>
        <h3>찜한 물품</h3>
        <button>더보기</button>
        {favoriteItems && favoriteItems.length > 0 ? (
          <ul>
            {favoriteItems.map((item) => (
              <li key={item.id}>
                <h4>{item.title}</h4>
                <p>가격: {item.price}원</p>
                <img
                  src={item.ItemImages[0]?.imageUrl || 'fallback_image_url'}
                  alt={item.title}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p>찜한 물품이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
