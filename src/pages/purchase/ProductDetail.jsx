import * as S from '../../styles/mixins';
import { productList } from '../../data/dummyProduct';
import { useParams } from 'react-router-dom';
import { styled } from 'styled-components';
// import { io } from 'socket.io-client';
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useEffect } from 'react';
// import axios from 'axios';

// const API = process.env.REACT_APP_API_SERVER || 'http://localhost:5000';

export default function ProductDetail() {
  const { id } = useParams();

  const product = productList.find((item) => item.id === Number(id));

  // const [product, setProduct] = useState(null);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  // useEffect(() => {
  //   const fetchProductDetail = async () => {
  //     try {
  //       const response = await axios.get(`${API}/item/item/${id}`);
  //       setProduct(response.data.data);
  //     } catch (err) {
  //       setError('상품 정보를 불러오는 중 오류가 발생했습니다.');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchProductDetail();
  // }, [id]);

  if (!product) {
    return (
      <S.MainLayout>
        <h1>상품을 찾을 수 없습니다 🥲</h1>
      </S.MainLayout>
    );
  }

  return (
    <S.MainLayout>
      <h1>{product.title} 상세 페이지</h1>
      <div>
        <ItemImgWrapper>
          <img src={product.img} alt={product.title} />
        </ItemImgWrapper>
        <div>판매자 프로필 사진</div>
        <div>판매자명</div>
        <div>도봉구</div>
      </div>
      <div>
        <div>상품명</div>
        <div>가격</div>
        <div>상품 상태 : {}</div>
      </div>
      <div>상품설명{}</div>
      <button>채팅하기</button>
      <button>찜하기</button>
      <div>거래상태{}</div>
    </S.MainLayout>
  );
}

const ItemImgWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 430px;
    height: 430px;
    border-radius: 10px;
  }
`;
