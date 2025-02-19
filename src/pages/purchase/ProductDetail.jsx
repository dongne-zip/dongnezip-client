import * as S from '../../styles/mixins';
import { productList } from '../../data/dummyProduct';
import { useParams } from 'react-router-dom';

export default function ProductDetail() {
  const { id } = useParams();
  const product = productList.find((item) => item.id === Number(id));

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
    </S.MainLayout>
  );
}
