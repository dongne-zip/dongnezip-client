import { Route, Routes } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Index from './pages/mypage/Index';
import EditProfile from './pages/mypage/EditProfile';
import Header from './components/common/Header';
import Home from './pages/Index';
import Purchase from './pages/purchase/Index';
import NotFound from './pages/NotFound';
import { GlobalStyle } from './styles/GlobalStyle';
import { Provider } from 'react-redux';
import store from './store/index';
import SaleRegister from './pages/sales/Index';
import FindPw from './pages/auth/FindPw';
import ProductDetail from './pages/purchase/ProductDetail';
import SellerSales from './pages/sales/SellerSales';
import Chat from './pages/Chat';
// import Map from './components/sales/Map';

function App() {
  return (
    <>
      <Provider store={store}>
        <GlobalStyle />
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          {/* 구매페이지 */}
          <Route path="/purchase" element={<Purchase />} />
          {/* <Route path="/map" element={<Map />} /> */}
          <Route
            path="/purchase/product-detail/:id"
            element={<ProductDetail />}
          />
          <Route path="/chat/:roomId" element={<Chat />}></Route>

          {/* 판매페이지 관련 */}
          <Route path="/sales" element={<SaleRegister />} />
          <Route path="/sales/SellerSales/:id" element={<SellerSales />} />
          <Route path="/chat" element={<Chat />}></Route>

          {/* 마이페이지 관련 */}
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/mypage" element={<Index />}></Route>
          <Route path="/changeInfo" element={<EditProfile />}></Route>
          <Route path="/findPw" element={<FindPw />}></Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Provider>
    </>
  );
}

export default App;
