/* 가이드 
1. redux와 직접적인 관련 없는 전역적으로 사용되는 정적인 데이터 저장
2. 카테고리, 에러 메시지 등 여러 곳에서 재사용되는 값 (API URL은 .env)
3. UI 관련 고정된 문자열, 상수 값, 네비게이션 메뉴 등 관리
4. 새로 추가하는 경우 주석을 달아주세요 😆
*/

// src/data/constants.js
export const CATEGORY_LIST = [
  { id: 0, name: '전체' },
  { id: 1, name: '의류/미용' },
  { id: 2, name: '생활/주방' },
  { id: 3, name: '디지털' },
  { id: 4, name: '도서' },
  { id: 5, name: '취미' },
  { id: 6, name: '식품' },
  { id: 7, name: '삽니다' },
  { id: 8, name: '나눔' },
];

export const SEOUL_DISTRICTS = [
  { id: 0, name: '전체' },
  { id: 1, name: '강남구' },
  { id: 2, name: '강동구' },
  { id: 3, name: '강북구' },
  { id: 4, name: '강서구' },
  { id: 5, name: '관악구' },
  { id: 6, name: '광진구' },
  { id: 7, name: '구로구' },
  { id: 8, name: '금천구' },
  { id: 9, name: '노원구' },
  { id: 10, name: '도봉구' },
  { id: 11, name: '동대문구' },
  { id: 12, name: '동작구' },
  { id: 13, name: '마포구' },
  { id: 14, name: '서대문구' },
  { id: 15, name: '서초구' },
  { id: 16, name: '성동구' },
  { id: 17, name: '성북구' },
  { id: 18, name: '송파구' },
  { id: 19, name: '양천구' },
  { id: 20, name: '영등포구' },
  { id: 21, name: '용산구' },
  { id: 22, name: '은평구' },
  { id: 23, name: '종로구' },
  { id: 24, name: '중구' },
  { id: 25, name: '중랑구' },
];

// ------------ 반응형 UI breakpoint 값 ------------
