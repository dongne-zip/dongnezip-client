import { useDispatch, useSelector } from 'react-redux';
import {
  setCategoryId,
  setTitle,
  setItemStatus,
  setPrice,
  setDetail,
  resetForm,
} from '../../store/modules/saleReducer';
import { useRef, useState } from 'react';
import axios from 'axios';
import Map from '../../components/sales/Map';
import * as S from '../../styles/mixins';
import styled from 'styled-components';

const API = process.env.REACT_APP_API_SERVER;
axios.defaults.withCredentials = true; // 모든 요청에 쿠키 포함

export default function SaleRegister() {
  const dispatch = useDispatch();
  const { categoryId, title, itemStatus, price, detail } = useSelector(
    (state) => state.sale,
  );
  const storedMarkers = useSelector((state) => state.map.markers);

  const [localErrors, setLocalErrors] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
  const titleRef = useRef(null);
  const priceRef = useRef(null);
  const detailRef = useRef(null);

  const handlePriceChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/, '');

    if (value === '') {
      dispatch(setPrice(''));
      return;
    }

    let numericValue = parseInt(value, 10).toLocaleString();
    dispatch(setPrice(numericValue));
  };

  // Enter 키 입력 시 다음
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

  // 로컬에서 폼 검증 함수
  const validateForm = () => {
    const errors = {};
    if (!title.trim()) errors.title = '상품명을 입력해주세요';
    if (!price) errors.price = '가격을 입력해주세요';
    if (!detail.trim()) errors.detail = '내용을 입력해주세요';
    return errors;
  };

  // 상품 등록
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    setLocalErrors(errors);
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
    formData.append('price', price.replace(/,/g, ''));
    formData.append('detail', detail);
    formData.append('latitude', storedMarkers[0].lat);
    formData.append('longitude', storedMarkers[0].lng);
    formData.append('placeName', storedMarkers[0].placeName);

    try {
      const response = await axios.post(`${API}/item/additem`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        alert('등록이 완료되었습니다!');
        dispatch(resetForm());
        setSelectedFiles([]);
        setLocalErrors({});
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
              <option value="" disabled>
                선택
              </option>
              <option value="1">의류/미용</option>
              <option value="2">생활/주방</option>
              <option value="3">디지털</option>
              <option value="4">도서</option>
              <option value="5">취미</option>
              <option value="6">식품</option>
              <option value="7">삽니다</option>
              <option value="8">나눔</option>
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
              onKeyDown={(e) => handleKeyPress(e, priceRef)}
            />
            {localErrors.title && <ErrorText>{localErrors.title}</ErrorText>}
            <Section>
              <H3>상품 상태</H3>
              {['새상품', '최상', '상', '중', '하'].map((status) => (
                <StatusButton
                  type="button"
                  key={status}
                  active={itemStatus === status}
                  onClick={() => dispatch(setItemStatus(status))}
                >
                  {status}
                </StatusButton>
              ))}
            </Section>
            <Section>
              <H3>가격</H3>
              <Input
                type="text"
                value={price}
                ref={priceRef}
                onChange={handlePriceChange}
                onKeyDown={(e) => handleKeyPress(e, detailRef)}
              />
              원
              {localErrors.price && <ErrorText>{localErrors.price}</ErrorText>}
            </Section>
            <Section>
              <H3>상품 설명</H3>
              <Textarea
                value={detail}
                ref={detailRef}
                onChange={(e) => dispatch(setDetail(e.target.value))}
              ></Textarea>
              {localErrors.detail && (
                <ErrorText>{localErrors.detail}</ErrorText>
              )}
            </Section>
            <Section>
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
            </Section>
            <Section>
              <H3>거래 희망 장소📍</H3>
              <Map />
            </Section>
            <SubmitButton type="submit">등록하기</SubmitButton>
          </form>
        </RegisterContainer>
      </CenteredContainer>
    </S.MainLayout>
  );
}

//----------------------------------- Styled Components -----------------------------------

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

  @media (max-width: 767px) {
    font-size: 28px;
    margin-bottom: 16px;
  }
`;

const CenteredContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;

  @media (max-width: 767px) {
    padding: 0 16px;
  }
`;

const RegisterContainer = styled.div`
  width: 900px;
  background: white;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0px 4px 10px #00000019;
  margin: auto;

  @media (max-width: 767px) {
    width: 100%;
    padding: 16px;
    border-radius: 16px;
  }
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
      border-color: #6663ff;
      outline: none;
    }

    @media (max-width: 767px) {
      font-size: 14px;
      padding: 6px 10px;
    }
  }
`;

const H3 = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;

  @media (max-width: 767px) {
    font-size: 16px;
    margin-bottom: 8px;
  }
`;

const Input = styled.input`
  width: 600px;
  height: 50px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;

  @media (max-width: 767px) {
    width: 100%;
  }
`;

const Textarea = styled.textarea`
  width: 700px;
  height: 250px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  resize: none;

  @media (max-width: 767px) {
    width: 100%;
  }
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

  @media (max-width: 767px) {
    width: 100px;
    height: 100px;
  }
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const ErrorText = styled.span`
  color: red;
  font-size: 14px;
`;

const StatusButton = styled.button`
  min-height: 44px;
  padding: 10px 20px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: ${(props) => (props.active ? '#6663ff' : 'white')};
  color: ${(props) => (props.active ? 'white' : 'black')};
  cursor: pointer;
  margin-right: 10px;

  &:last-child {
    margin-right: 0;
  }

  @media (max-width: 767px) {
    font-size: 14px;
    padding: 8px 16px;
  }
`;

const SubmitButton = styled.button`
  min-height: 44px;
  width: 100%;
  background-color: #5451ff;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  margin-top: 20px;
  cursor: pointer;

  &:hover {
    background-color: #6663ff;
  }

  @media (max-width: 767px) {
    font-size: 16px;
    padding: 12px 0;
  }
`;
