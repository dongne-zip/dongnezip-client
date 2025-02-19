// import * as S from '../../styles/mixins';
import { categoryId, seoulDistricts } from '../../data/dummyProduct';

export default function ContainerFilter() {
  return (
    <>
      <section>
        <h3>필터</h3>
        <label>
          <input type="checkbox" />
          거래 가능
        </label>
      </section>

      <section>
        <h4>위치</h4>
        <div>서울특별시</div>
        {seoulDistricts.map((district) => (
          <label key={district}>
            <input type="radio" />
            {district}
          </label>
        ))}
      </section>

      <section>
        <h4>카테고리</h4>
        {categoryId.map((category) => (
          <label key={category}>
            <input type="radio" />
            {category.categoryId}
          </label>
        ))}
      </section>

      <section>
        <h4>정렬</h4>
        {categoryId.map((category) => (
          <label key={category}>
            <input type="radio" />
            {categoryId.value}
          </label>
        ))}
      </section>
    </>
  );
}
