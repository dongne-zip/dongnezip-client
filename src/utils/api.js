import axios from 'axios';

const API = process.env.REACT_APP_API_SERVER;
axios.defaults.withCredentials = true;

/*------------ 중고 거래 관련 ------------*/

// 전체 상품 조회
export const fetchProducts = async (params) => {
  const res = await axios.get(`${API}/item/item`, { params });
  if (res.data.success) {
    console.log('API 응답 데이터:', res.data.data);
    return res.data.data;
  }

  throw new Error('데이터를 가져오는 데 실패했습니다.');
};

// 상품 상세 조회
export const getItemDetail = async (id) => {
  try {
    const res = await axios.get(`${API}/item/${id}`);
    return res.data.data;
  } catch (error) {
    console.error('상품 상세 조회 실패:', error);
    throw error;
  }
};

// 상품 수정하기
export const updateItemDetail = async (id) => {
  try {
    const res = await axios.patch(`${API}/item/${id}`);
    return res.data.data;
  } catch (error) {
    console.error('상품 수정 실패:', error);
    throw error;
  }
};

// 상품 삭제하기
export const deleteItemDetail = async (id) => {
  try {
    const res = await axios.delete(`${API}/item/${id}`);
    return res.data.data;
  } catch (error) {
    console.error('상품 수정 실패:', error);
    throw error;
  }
};

/*------------ Auth 관련 ------------*/
