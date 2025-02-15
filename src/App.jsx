import { Route, Routes } from 'react-router-dom';
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
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
