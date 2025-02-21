import { createSlice } from '@reduxjs/toolkit';

const initialState = {
const saleReducer = createSlice({
   categoryId: '',
  title: '',
  itemStatus: '',
  price: '',
  detail: '',
  imageUrl: '',
  errors: {},
  name: 'sale',
  initialState,
  reducers: {
    setCategoryId: (state, action) => {
      state.categoryId = action.payload;
 
};

    },
    setTitle: (state, action) => {
      state.title = action.payload;
    },

    setItemStatus: (state, action) => {
      state.itemStatus = action.payload;
    },
      
    setPrice: (state, action) => {
      state.price = action.payload;
    },

    setDetail: (state, action) => {
      state.detail = action.payload;
    },
    setImageUrl: (state, action) => {
      state.imageUrl = action.payload;

    },
    validateForm: (state) => {
      const newErrors = {};
      if (!state.title) newErrors.title = '입력해주세요';
      if (!state.price) newErrors.price = '입력해주세요';
      if (!state.detail) newErrors.detail = '입력해주세요';

      state.errors = newErrors;
    },
    resetForm: (state) => {
      Object.assign(state, initialState);
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
