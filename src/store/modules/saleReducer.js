import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  categoryId: '',
  title: '',
  itemStatus: '',
  price: '',
  detail: '',
  imageUrl: '',
  errors: {},
};

const saleReducer = createSlice({
  name: 'sale',
  initialState,
  reducers: {
    setCategoryId: (state, action) => {
      console.log('setCategoryId:', action.payload);
      state.categoryId = action.payload;
    },
    setTitle: (state, action) => {
      console.log('setTitle:', action.payload);
      state.title = action.payload;
    },
    setItemStatus: (state, action) => {
      console.log('setItemStatus:', action.payload);
      state.itemStatus = action.payload;
    },
    setPrice: (state, action) => {
      console.log('setPrice:', action.payload);
      state.price = action.payload;
    },
    setDetail: (state, action) => {
      console.log('setDetail:', action.payload);
      state.detail = action.payload;
    },
    setImageUrl: (state, action) => {
      console.log('setImageUrl:', action.payload);
      state.imageUrl = action.payload;
    },
    validateForm: (state) => {
      const newErrors = {};
      if (!state.title) newErrors.title = '상품명을 입력해주세요';
      if (!state.price) newErrors.price = '가격을 입력해주세요';
      if (!state.detail) newErrors.detail = '내용을 입력해주세요';
      console.log('validateForm errors:', newErrors);
      state.errors = newErrors;
    },
    resetForm: () => {
      console.log('resetForm triggered');
      return initialState;
    },
  },
});

export const {
  setCategoryId,
  setTitle,
  setItemStatus,
  setPrice,
  setDetail,
  setImageUrl,
  validateForm,
  resetForm,
} = saleReducer.actions;

export default saleReducer.reducer;
