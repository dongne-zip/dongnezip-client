import { Route, Routes } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Index from './pages/mypage/Index';
import EditProfile from './pages/mypage/EditProfile';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/join" element={<Register />}></Route>
        <Route path="/myPage" element={<Index />}></Route>
        <Route path="/change" element={<EditProfile />}></Route>
      </Routes>
    </div>
  );
}

export default App;
