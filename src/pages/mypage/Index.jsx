import styled from 'styled-components';
// import FavoritePart from '../../components/mypage/favorite/FavoritePart';
import ProfilePart from '../../components/mypage/index/ProfilePart';
// import PurchasePart from '../../components/mypage/purchase/PurchasePart';
// import SalePart from '../../components/mypage/sale/SalePart';
import * as S from '../../styles/mixins';
import MyPage from './Purchases';

export default function Index() {
  return (
    <ExtendedMain>
      <h3>마이페이지</h3>
      <Container>
        <ProfilePart />
        <MyPage />
      </Container>
    </ExtendedMain>
  );
}
const ExtendedMain = styled(S.MainLayout)`
  background-color: #f5f5f5;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;
