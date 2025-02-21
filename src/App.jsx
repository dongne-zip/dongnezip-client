import { Route, Routes } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Index from './pages/mypage/Index';
import EditProfile from './pages/mypage/EditProfile';
import Header from './components/common/Header';
import Home from './pages/Index';
import Purchase from './pages/purchase/Index';
import ProductDetail from './pages/purchase/ProductDetail';
import Sales from './pages/sales/Index';
import NotFound from './pages/NotFound';
import { GlobalStyle } from './styles/GlobalStyle';
import SaleRegistration from './pages/sales/SaleRegister';

function App() {
  return (
    <>
      <GlobalStyle />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />

        {/* 구매 */}
        <Route path="/purchase" element={<Purchase />} />
        <Route
          path="/purchase/product-detail/:id"
          element={<ProductDetail />}
        />

        {/* 판매 */}
        <Route path="/item/sales" element={<Sales />} />
        <Route path="/item/additem" element={<SaleRegistration />} />

        {/* 마이페이지 관련 */}
        <Route path="/login" element={<Login />}></Route>
        <Route path="/join" element={<Register />}></Route>
        <Route path="/myPage" element={<Index />}></Route>
        <Route path="/changeInfo" element={<EditProfile />}></Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
