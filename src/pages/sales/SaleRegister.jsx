import { useDispatch, useSelector } from 'react-redux';
import {
  setCategoryId,
  setTitle,
  setItemStatus,
  setPrice,
  setDetail,
  validateForm,
  resetForm,
} from '../../store/modules/saleReducer';
import { useRef, useState } from 'react';
import axios from 'axios';
import Map from '../../components/sales/Map';
import * as S from '../../styles/mixins';
import styled from 'styled-components';


export default function SaleRegister() {
  const dispatch = useDispatch();
  const { categoryId, title, itemStatus, price, detail, errors } = useSelector(
    (state) => state.sale,
  );
  const storedMarkers = useSelector((state) => state.map.markers);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const titleRef = useRef(null);
  const priceRef = useRef(null);
  const detailRef = useRef(null);

  const handlePriceChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, '');

    if (value === '') {
      dispatch(setPrice(''));
      return;
    }

    let numericValue = parseInt(value, 10).toLocaleString();
    dispatch(setPrice(numericValue));
  };

  // Enter 키 입력 시 다음 입력란으로 이동
  const handleKeyPress = (e, nextRef) => {
    if (e.key === 'Enter' && nextRef) {
      e.preventDefault();
      nextRef.current.focus();
    }
  };

  // 파일 업로드 (최대 5개)
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (selectedFiles.length + files.length > 5) {
      alert('최대 5개의 이미지만 업로드할 수 있습니다.');
      return;
    }

    setSelectedFiles([...selectedFiles, ...files]);
  };

  // 상품 등록
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(validateForm());

    if (Object.keys(errors).length > 0) return;

    if (storedMarkers.length === 0) {
      alert('거래 희망 장소를 지도에서 선택해주세요.');
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append('imageUrls', file);
    });

    formData.append('categoryId', categoryId);
    formData.append('title', title);
    formData.append('itemStatus', itemStatus);
    formData.append('price', price.replace(/,/g, '')); // 콤마 제거 후 전송
    formData.append('detail', detail);
    formData.append('latitude', storedMarkers[0].lat);
    formData.append('longitude', storedMarkers[0].lng);
    formData.append('locationInfo', storedMarkers[0].info);

    try {
      const response = await axios.post('/item/additem', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data.success) {
        alert('등록이 완료되었습니다!');
        dispatch(resetForm());
        setSelectedFiles([]);
      } else {
        alert('등록 실패: ' + response.data.message);
      }
    } catch (error) {
      console.error('상품 등록 오류:', error);
      alert('상품 등록 중 문제가 발생했습니다.');
    }
  };

  return (
    <S.MainLayout>
      <H1>판매 글 쓰기</H1>
      <CenteredContainer>
        <RegisterContainer>
          <Category>
            <H3>카테고리</H3>
            <select
              value={categoryId}
              onChange={(e) => dispatch(setCategoryId(e.target.value))}
            >
              <option value="electronics">전자제품</option>
              <option value="clothes">남성/여성의류</option>
              <option value="digitals">디지털기기</option>
              <option value="accesssories">남성/여성잡화</option>
              <option value="furniture">가구/인테리어</option>
              <option value="livings">생활/주방</option>
              <option value="beauties">뷰티/미용</option>
              <option value="games">게임/취미</option>
              <option value="books">도서/문구</option>
              <option value="children">유아용</option>
              <option value="others">기타</option>
            </select>
          </Category>
          <form onSubmit={handleSubmit}>
            <H3>제목:</H3>
            <Input
              type="text"
              value={title}
              ref={titleRef}
              placeholder="상품명을 입력해주세요"
              onChange={(e) => dispatch(setTitle(e.target.value))}
              onKeyPress={(e) => handleKeyPress(e, priceRef)}
            />
            <div>
              <H3>상품 상태</H3>
              {['새상품', '최상', '상', '중', '하'].map((status) => (
                <button
                  type="button"
                  key={status}
                  onClick={() => dispatch(setItemStatus(status))}
                >
                  {status}
                </button>
              ))}
            </div>
            <div>
              <H3>가격</H3>
              <Input
                type="text"
                value={price}
                ref={priceRef}
                onChange={handlePriceChange}
                onKeyPress={(e) => handleKeyPress(e, detailRef)}
              />
              원
            </div>
            <div>
              <H3>상품 설명</H3>
              <Textarea
                value={detail}
                ref={detailRef}
                onChange={(e) => dispatch(setDetail(e.target.value))}
              ></Textarea>
              {errors.detail && (
                <span style={{ color: 'red' }}>{errors.detail}</span>
              )}
            </div>
            <div>
              <H3>사진 업로드 (최대 5개)</H3>
              <Input
                type="file"
                multiple
                onChange={handleFileChange}
                accept="image/*"
              />
              <ImagePreviewContainer>
                {selectedFiles.map((file, index) => (
                  <ImagePreview
                    key={index}
                    src={URL.createObjectURL(file)}
                    alt={`미리보기 ${index + 1}`}
                  />
                ))}
              </ImagePreviewContainer>
            </div>
            <div>
              <H3>거래 희망 장소📍</H3>
              <Map />
            </div>
            <button type="submit">등록하기</button>
          </form>
        </RegisterContainer>
      </CenteredContainer>
    </S.MainLayout>
  );
}

//------------------------------------------✅ 스타일 적용------------------------------------------
const H1 = styled.h1`
  font-size: 38px;
  font-weight: bold;
  margin-bottom: 20px;
  position: relative;

  &::after {
    content: '';
    display: block;
    width: 100%;
    height: 2px;
    background-color: #d9d9d9;
    margin-top: 10px;
  }
`;

const CenteredContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const RegisterContainer = styled.div`
  width: 900px;
  height: 1200px;
  background: white;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0px 4px 10px #00000019;
  margin: auto;
`;

const Category = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;

  select {
    width: 100%;
    padding: 8px 12px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: white;
    cursor: pointer;

    &:focus {
      border-color: #007bff;
      outline: none;
    }
  }
`;

const H3 = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
`;

const Input = styled.input`
  width: 600px;
  height: 50px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
`;
const Textarea = styled.textarea`
  width: 700px;
  height: 250px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  resize: none;
`;

const ImagePreviewContainer = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 10px;
`;

const ImagePreview = styled.img`
  width: 180px;
  height: 170px;
  border-radius: 5px;
  object-fit: cover;
`;
