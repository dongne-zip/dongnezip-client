import { Route, Routes } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Index from './pages/mypage/Index';
import EditProfile from './pages/mypage/EditProfile';
import Header from './components/common/Header';
import Home from './pages/Index';
import Purchase from './pages/purchase/Index';
import Sales from './pages/sales/Index';
import NotFound from './pages/NotFound';
import { GlobalStyle } from './styles/GlobalStyle';

function App() {
  return (
    <>
      <GlobalStyle />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/purchase" element={<Purchase />} />
        <Route path="/sales" element={<Sales />} />

        {/* 마이페이지 관련 */}
        <Route path="/login" element={<Login />}></Route>
        <Route path="/join" element={<Register />}></Route>
        <Route path="/myPage" element={<Index />}></Route>
        <Route path="/change" element={<EditProfile />}></Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
