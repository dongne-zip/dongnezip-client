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
  width: 90px;
  height: 26px;
  display: flex;
  justify-content: center;
  font-weight: 700;
  color: ${(props) =>
    props.$hoveredMenu && props.$hoveredMenu !== props.to
      ? 'gray' // Hover하지 않은 메뉴는 회색
      : 'black'}; // Hover한 메뉴는 검은색 유지

  &:hover {
    color: black; // Hover한 메뉴는 유지
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

// 모바일 버튼 상자
export const AuthButtonWrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  gap: 10px;
  background: white;
  padding: 15px 20px;
  border-top: 1px solid #ddd;
  margin-top: 20px;
`;

// 모바일 버튼 공통 스타일
const MobileButton = styled.button`
  height: 48px;
  flex-grow: 1;
  min-width: 140px;
  padding: 8px 12px;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  text-align: center;
`;

// 모바일 로그인 버튼
export const LoginButton = styled(MobileButton)`
  background: #f4f6f8;
  color: var(--color-primary);

  &:hover {
    color: var(--color-primary);
    border: none;
    border: 1px solid var(--color-primary);
  }
`;

// 모바일 회원가입 버튼
export const SignUpButton = styled(MobileButton)`
  background: var(--color-primary);
  color: white;
  border: none;

  &:hover {
    background: var(--color-primary-dark);
  }
`;

/* --------------- 반응형 (모바일) --------------- */

export const MobileUtilContainer = styled.div`
  display: none;

  @media (max-width: 767px) {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
    width: 100%;
    padding-right: 15px;
  }
`;
// 모바일 아이콘 (검색, 햄버거 메뉴)
export const MobileIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${(props) => (props.isLarge ? '40px' : '36px')};
  height: ${(props) => (props.isLarge ? '40px' : '36px')};
  cursor: pointer;

  svg,
  span {
    font-size: 24px; // 아이콘 크기 통일
    line-height: 1;
    vertical-align: middle;
  }

  // 햄버거 메뉴만 크기만 조정
  &.hamburger {
    width: 40px;
    height: 40px;

    span {
      font-size: 34px;
    }
  }
`;

// --------------- 모바일 사이드바 (네비게이션 메뉴) ---------------
export const MobileNav = styled.div`
  font-weight: 700;
  position: fixed;
  top: 0;
  right: 0;
  width: 70%;
  height: 100%;
  background-color: white;
  transform: ${(props) =>
    props.$isOpen ? 'translateX(0)' : 'translateX(100%)'};
  transition: transform 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  padding: 20px;
  z-index: 100;
  justify-content: space-between;
  padding-bottom: 70px;
`;

export const MobileNavItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 0;
  flex-grow: 1;
  overflow-y: auto;
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

export const MobileNavExternal = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  font-size: 1.2rem;
  /* text-decoration: none; */
  span {
    color: var(--color-gray);
  }
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
