import { Link } from 'react-router-dom';
import { styled } from 'styled-components';

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 1024px;
  padding: 10px;
  margin: 0 auto;
  align-items: center;

  @media (max-width: 767px) {
    padding: 10px 20px;
  }
`;

// ---------------서비스 로고 ---------------
export const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 180px;
  height: 40px;
  padding: 10px;
  margin: 10px;

  @media (max-width: 767px) {
    margin: 5px;
    padding: 0px;
  }
`;

export const LogoImg = styled.img`
  height: 3rem;
`;

export const LogoTitle = styled.h2`
  color: var(--color-text);

  @media (max-width: 767px) {
    display: none;
  }
`;

// --------------- NavMenu ---------------
export const NavBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  gap: 1rem;

  @media (max-width: 767px) {
    display: none;
  }
`;

export const NavMenu = styled(Link)`
  width: 68px;
  height: 26px;
  display: flex;
  justify-content: center;
  font-weight: ${(props) => (props.$isActive ? 'bold' : 'normal')};
  &:hover {
    font-weight: 700;
  }
`;

//-------- Utils (아이콘 & 로그인/마이페이지 버튼 ---------
export const UtilContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;

  @media (max-width: 767px) {
    display: none;
  }
`;

//--------------- Icons ---------------

export const Icon = styled.div`
  height: 24px;
  width: 24px;
`;

//--------------- Button ---------------
export const Button = styled.button`
  height: 32px;
  width: 90px;
  background-color: var(--color-primary);
  border-radius: 10px;
  color: var(--color-white);
`;

/* --------------- 반응형 (모바일) --------------- */
// 햄버거 메뉴
export const MobileIcon = styled.div`
  display: none;
  font-size: 2rem;
  cursor: pointer;

  @media (max-width: 767px) {
    display: block;
    width: 28px;
    height: 28px;
    color: var(--color-black);
  }
`;

// --------------- 모바일 사이드바 (네비게이션 메뉴) ---------------
export const MobileNav = styled.div`
  font-weight: 700;
  position: fixed;
  top: 0;
  right: 0;
  width: 280px;
  height: 100vh;
  background-color: white;
  box-shadow: rgba(0, 0, 0, 0.1);
  transform: ${(props) =>
    props.$isOpen ? 'translateX(0)' : 'translateX(100%)'};
  transition: transform 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  padding: 20px;
  z-index: 200;
`;

export const MobileNavItem = styled(Link)`
  padding: 15px;
  font-size: 1.2rem;
  color: black;
  text-decoration: none;
  &:hover {
    font-weight: bold;
  }
`;

// --------------- 닫기 버튼 ---------------
export const CloseButton = styled.button`
  align-self: flex-end;
  /* font-size: 2rem; */
  background: none;
  border: none;
  cursor: pointer;
  width: 44px;
  height: 44px;
`;

// --------------- 배경 오버레이 ---------------
export const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${(props) => (props.$isOpen ? 'block' : 'none')};
  z-index: 100;
`;
