// import * as S from '../../styles/mixins';
import { SEOUL_DISTRICTS, CATEGORY_LIST } from '../../data/constant';
// import { categoryId, seoulDistricts } from '../../data/dummyProduct';

export default function ContainerFilter({
  available,
  location,
  category,
  sortOption,
  setAvailable,
  setLocation,
  setCategory,
  setSortOption,
}) {
  return (
    <>
      <section>
        <h3>필터</h3>
        <label>
          <input
            type="checkbox"
            checked={available}
            onChange={() => setAvailable((prev) => !prev)}
          />
          거래 가능
        </label>
      </section>

      <section>
        <h4>위치</h4>
        <div>서울특별시</div>
        {SEOUL_DISTRICTS.map(({ id, name }) => (
          <label key={id}>
            <input
              type="radio"
              name="location"
              value={id}
              checked={location === Number(id)}
              onChange={(e) => setLocation(Number(e.target.value))}
            />
            {name}
          </label>
        ))}
      </section>

      <section>
        <h4>카테고리</h4>
        {CATEGORY_LIST.map(({ id, name }) => (
          <label key={id}>
            <input
              type="radio"
              name="category"
              value={id}
              checked={category === id}
              onChange={(e) => setCategory(Number(e.target.value))}
            />
            {name}
          </label>
        ))}
      </section>

      <section>
        <h4>정렬</h4>
        <label>
          <input
            type="radio"
            name="sort"
            value="latest"
            checked={sortOption === 'latest'}
            onChange={() => setSortOption('latest')}
          />
          최신순
        </label>
        <label>
          <input
            type="radio"
            name="sort"
            value="popular"
            checked={sortOption === 'popular'}
            onChange={() => setSortOption('popular')}
          />
          인기순
        </label>
      </section>
    </>
  );
}
