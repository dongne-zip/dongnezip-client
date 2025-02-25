import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  categoryId: '',
  title: '',
  itemStatus: '',
  price: '',
  detail: '',
  imageUrls: [], // 다중 이미지 업로드를 위해 배열로 관리
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
    setImageUrls: (state, action) => {
      console.log('setImageUrls:', action.payload);
      state.imageUrls = action.payload;
    },
    validateForm: (state) => {
      const newErrors = {};
      if (!state.title.trim()) newErrors.title = '상품명을 입력해주세요';
      if (!state.price) newErrors.price = '가격을 입력해주세요';
      if (!state.detail.trim()) newErrors.detail = '내용을 입력해주세요';
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
  setImageUrls,
  validateForm,
  resetForm,
} = saleReducer.actions;
export default saleReducer.reducer;
