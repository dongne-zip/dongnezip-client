import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  category: '',
  title: '',
  condition: '',
  price: '',
  description: '',
  image: null,
  errors: {},
};

const saleReducer = createSlice({
  name: 'sale',
  initialState,
  reducers: {
    setCategory: (state, action) => {
      state.category = action.payload;
    },
    setTitle: (state, action) => {
      state.title = action.payload;
    },
    setCondition: (state, action) => {
      state.condition = action.payload;
    },
    setPrice: (state, action) => {
      state.price = action.payload;
    },
    setDescription: (state, action) => {
      state.description = action.payload;
    },
    setImage: (state, action) => {
      state.image = action.payload;
    },
    validateForm: (state) => {
      const newErrors = {};
      if (!state.title) newErrors.title = '입력해주세요';
      if (!state.price) newErrors.price = '입력해주세요';
      if (!state.description) newErrors.description = '입력해주세요';
      state.errors = newErrors;
    },
    resetForm: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setCategory,
  setTitle,
  setCondition,
  setPrice,
  setDescription,
  setImage,
  validateForm,
  resetForm,
} = saleReducer.actions;
export default saleReducer.reducer;
