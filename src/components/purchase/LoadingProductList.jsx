import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function LoadingProductList({ count = 9 }) {
  return (
    <>
      {Array.from({ length: count }).map((i) => (
        <div key={i}>
          <Skeleton height={200} />
          <Skeleton height={20} style={{ margin: '10px 0' }} />
          <Skeleton width="60%" height={20} />
        </div>
      ))}
    </>
  );
}
