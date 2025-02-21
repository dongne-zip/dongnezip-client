import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './store';
import { Provider } from 'react-redux';
import saleReducer from './store/modules/saleReducer';
import mapReducer from './store/modules/mapReducer';

const root = ReactDOM.createRoot(document.getElementById('root'));
const store = configureStore({
  reducer: { rootReducer, sale: saleReducer, map: mapReducer },
});

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
);
