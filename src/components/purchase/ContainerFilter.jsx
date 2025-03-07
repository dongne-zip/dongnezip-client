// import * as S from '../../styles/mixins';
import { styled } from 'styled-components';
import { SEOUL_DISTRICTS, CATEGORY_LIST } from '../../data/constant';
import { useState } from 'react';

export default function ContainerFilter({ filterState, updateFilter }) {
  const [expanded, setExpanded] = useState(false); //더보기 상태

  return (
    <FilterLayout>
      <StatusWrapper>
        <h3>필터</h3>
        <label>
          <input
            type="checkbox"
            checked={filterState.available}
            onChange={() => updateFilter('available', !filterState.available)}
          />{' '}
          거래 가능
        </label>
      </StatusWrapper>

      <FilterContainer>
        <h4>위치</h4>
        <div>서울특별시</div>
        <ScrollableLocation expanded={expanded}>
          {SEOUL_DISTRICTS.map(({ id, name }) => (
            <label key={id}>
              <input
                type="radio"
                name="location"
                value={id}
                checked={filterState.location === Number(id)}
                onChange={(e) =>
                  updateFilter('location', Number(e.target.value))
                }
              />{' '}
              {name}
            </label>
          ))}
        </ScrollableLocation>
        <ToggleExpandButton onClick={() => setExpanded(!expanded)}>
          {expanded ? '접기' : '더보기'}
        </ToggleExpandButton>
      </FilterContainer>

      <FilterContainer>
        <h4>카테고리</h4>

        {CATEGORY_LIST.map(({ id, name }) => (
          <label key={id}>
            <input
              type="radio"
              name="category"
              value={id}
              checked={filterState.category === id}
              onChange={(e) => updateFilter('category', Number(e.target.value))}
            />{' '}
            {name}
          </label>
        ))}
      </FilterContainer>

      <FilterContainer>
        <h4>정렬</h4>
        <label>
          <input
            type="radio"
            name="sort"
            value="latest"
            checked={filterState.sortOption === 'latest'}
            onChange={() => updateFilter('sortOption', 'latest')}
          />{' '}
          최신순
        </label>
        <label>
          <input
            type="radio"
            name="sort"
            value="popular"
            checked={filterState.sortOption === 'popular'}
            onChange={() => updateFilter('sortOption', 'popular')}
          />{' '}
          인기순
        </label>
      </FilterContainer>
    </FilterLayout>
  );
}

// ---------------- 필터 전체 ------------------------
const FilterLayout = styled.div`
  display: flex;
  flex-direction: column;
`;

//
const StatusWrapper = styled.section`
  margin-bottom: 20px;
`;

// ------- 각 필터(위치, 상품 카테고리)를 감싸는 컨테이너 --------
const FilterContainer = styled.section`
  display: flex;
  flex-direction: column;
  border-top: 1px solid #f3f4f7;
  margin-bottom: 1rem;

  .location {
    height: 100px;
    overflow-y: scroll;
  }
`;

//
const ScrollableLocation = styled.div`
  display: flex;
  flex-direction: column;
  max-height: ${({ expanded }) => (expanded ? '200px' : '120px')};
  overflow-y: ${({ expanded }) => (expanded ? 'scroll' : 'hidden')};
  padding-right: 5px;
  transition: max-height 0.3s ease-in-out;

  /* 스크롤바 스타일 조정 (크롬, 엣지, 사파리) */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-track {
    background-color: #f3f4f7;
  }
`;

// 더보기/접기 토글
const ToggleExpandButton = styled.button`
  background: none;
  color: var(--color-primary);
  font-size: 14px;
  text-align: left;
  margin-top: 10px;

  &:hover {
    text-decoration: underline;
  }
`;
