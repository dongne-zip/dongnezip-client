import FavoritePart from '../../components/mypage/favorite/FavoritePart';
import ProfilePart from '../../components/mypage/index/ProfilePart';
import PurchasePart from '../../components/mypage/purchase/PurchasePart';
import SalePart from '../../components/mypage/sale/SalePart';

export default function Index() {
  return (
    <>
      <h3>마이페이지</h3>
      <div className="mypageContainer">
        <ProfilePart />
        <SalePart />
        <PurchasePart />
        <FavoritePart />
      </div>
    </>
  );
}
