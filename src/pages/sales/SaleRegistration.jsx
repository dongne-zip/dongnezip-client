import { useDispatch, useSelector } from 'react-redux';
import {
  setCategory,
  setTitle,
  setCondition,
  setPrice,
  setDescription,
  setImage,
  validateForm,
  resetForm,
} from '../../store/saleSlice';
import { useRef } from 'react';
import KakaoMap from '../../components/sales/Map';
import { MapContextProvider } from '../../components/sales/MapContext';

export default function SaleRegistration() {
  const dispatch = useDispatch();
  const { category, title, condition, price, description, image, errors } =
    useSelector((state) => state.sale);

  const titleRef = useRef(null);
  const priceRef = useRef(null);
  const descriptionRef = useRef(null);

  const handleKeyPress = (e, nextRef) => {
    if (e.key === 'Enter' && nextRef) {
      e.preventDefault();
      nextRef.current.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(validateForm());
    if (Object.keys(errors).length > 0) return;
    console.log({ category, title, condition, price, description, image });
    alert('등록이 완료되었습니다!');
    dispatch(resetForm());
  };

  return (
    <>
      <h1>판매 글 쓰기</h1>
      <div>
        <h3>카테고리</h3>
        <select
          value={category}
          onChange={(e) => dispatch(setCategory(e.target.value))}
        >
          <option value="clothes">옷</option>
          <option value="electronics">전자제품</option>
          <option value="furniture">가구</option>
          <option value="books">책</option>
          <option value="others">기타</option>
        </select>
      </div>
      <form onSubmit={handleSubmit}>
        <label>
          제목:
          <input
            type="text"
            value={title}
            ref={titleRef}
            onChange={(e) => dispatch(setTitle(e.target.value))}
            onKeyPress={(e) => handleKeyPress(e, priceRef)}
          />
          {errors.title && <span style={{ color: 'red' }}>{errors.title}</span>}
        </label>
        <div>
          <h3>상품 상태</h3>
          {['새상품', '최상', '상', '중', '하'].map((cond) => (
            <button
              type="button"
              key={cond}
              onClick={() => dispatch(setCondition(cond))}
            >
              {cond}
            </button>
          ))}
        </div>
        <div>
          <h3>가격</h3>
          <input
            type="text"
            value={price}
            ref={priceRef}
            onChange={(e) => dispatch(setPrice(e.target.value))}
            onKeyPress={(e) => handleKeyPress(e, descriptionRef)}
          />
          원
          {errors.price && <span style={{ color: 'red' }}>{errors.price}</span>}
        </div>
        <div>
          <h3>상품 설명</h3>
          <textarea
            value={description}
            ref={descriptionRef}
            onChange={(e) => dispatch(setDescription(e.target.value))}
          ></textarea>
          {errors.description && (
            <span style={{ color: 'red' }}>{errors.description}</span>
          )}
        </div>
        <div>
          <h3>사진 업로드</h3>
          <input
            type="file"
            onChange={(e) => dispatch(setImage(e.target.files[0]))}
          />
          {image && <img src={URL.createObjectURL(image)} alt="사진" />}
        </div>
        <div>
          <h3>거래 희망 장소</h3>
          <MapContextProvider>
            <KakaoMap />
          </MapContextProvider>
        </div>
        <button type="submit">등록하기</button>
      </form>
    </>
  );
}
