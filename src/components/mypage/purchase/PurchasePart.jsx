import styled from 'styled-components';

export default function PurchasePart() {
  return (
    <>
      <div>
        <H3>내가 구매한 중고템</H3>
        상품 card
      </div>
    </>
  );
}

const H3 = styled.h3`
  font-size: 18px;
  font-weight: bold;
  margin: 20px 0 10px;
`;
// .more-btn {
//   display: flex;
//   justify-content: flex-end;
//   margin-top: 10px;
// }

// .more-btn button {
//   background: none;
//   border: none;
//   color: #6a0dad;
//   cursor: pointer;
//   &:hover{
//     text-decoration: underline;
//   }
// }
