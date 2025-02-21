import { Link } from 'react-router-dom';
import * as S from '../../styles/HeaderStyle';
import { useActiveNav } from '../../hooks/common/useActiveNav';
import { useState } from 'react';

const s3 = process.env.REACT_APP_S3;

export default function Header() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const toggleMobileNav = () => {
    setIsMobileNavOpen((prev) => !prev);
  };

  return (
    <S.Header>
      <Link to={'/'}>
        <S.Logo>
          <S.LogoImg src={`${s3}/logo.png`} alt="logo" />
          <S.LogoTitle>동네.zip</S.LogoTitle>
        </S.Logo>
      </Link>

      {/* PC Nav메뉴 */}
      <S.NavBar>
        <S.NavMenu to="/" $isActive={useActiveNav('/')}>
          홈
        </S.NavMenu>

        <S.NavMenu to="/purchase" $isActive={useActiveNav('/purchase')}>
          구매
        </S.NavMenu>

        <S.NavMenu to="/sales" $isActive={useActiveNav('/sales')}>
          판매
        </S.NavMenu>
      </S.NavBar>

      {/* 모바일 검색 아이콘 */}

      {/* 모바일 메뉴 아이콘 */}
      <S.MobileIcon onClick={toggleMobileNav}>
        <img src={`${s3}/icons/icon-mobile-menu.png`} alt="mobile-menu" />
      </S.MobileIcon>

      {/* 모바일 내비게이션 메뉴 */}
      <S.MobileNav $isOpen={isMobileNavOpen}>
        <S.MobileNavItem to="/" onClick={toggleMobileNav}>
          홈
        </S.MobileNavItem>
        <S.MobileNavItem to="/purchase" onClick={toggleMobileNav}>
          구매
        </S.MobileNavItem>
        <S.MobileNavItem to="/sales" onClick={toggleMobileNav}>
          판매
        </S.MobileNavItem>
      </S.MobileNav>

      {/* 유틸 아이콘 & 로그인 버튼 (PC에서만 표시) */}
      <S.UtilContainer>
        <S.Icon>
          <span className="material-symbols-outlined">notifications</span>
        </S.Icon>
        <S.Icon>
          <span className="material-symbols-outlined">dark_mode</span>
        </S.Icon>
        <Link to={'/login'}>
          <S.Button>로그인</S.Button>
        </Link>
      </S.UtilContainer>

      {/* 배경 오버레이 */}
      <S.Backdrop $isOpen={isMobileNavOpen} onClick={toggleMobileNav} />

      {/* 모바일 사이드바 */}
      <S.MobileNav $isOpen={isMobileNavOpen}>
        <S.CloseButton onClick={toggleMobileNav}>
          <img src={`${s3}/icons/icon-close.png`} alt="icon-close" />
        </S.CloseButton>
        <S.MobileNavItem to="/" onClick={toggleMobileNav}>
          홈
        </S.MobileNavItem>
        <S.MobileNavItem to="/purchase" onClick={toggleMobileNav}>
          구매
        </S.MobileNavItem>
        <S.MobileNavItem to="/sales" onClick={toggleMobileNav}>
          판매
        </S.MobileNavItem>
      </S.MobileNav>
    </S.Header>
  );
}
