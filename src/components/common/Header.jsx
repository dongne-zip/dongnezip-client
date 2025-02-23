import { Link } from 'react-router-dom';
import * as S from '../../styles/HeaderStyle';
import { useActiveNav } from '../../hooks/common/useActiveNav';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';

const s3 = process.env.REACT_APP_S3;

export default function Header() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  // const [openDropDown, setOpenDropDown] = useState(null); //아코디언 메뉴
  const [hoveredMenu, setHoveredMenu] = useState(null);

  // Redux 로그인 여부 확인
  const isLoggedIn = useSelector((state) => state.isLogin.isLoggedIn);
  const userNickname = useSelector((state) => state.isLogin.user?.nickname);

  const toggleMobileNav = () => {
    setIsMobileNavOpen((prev) => !prev);
  };

  // const toggleDropdown = (menu) => {
  //   setOpenDropdown((prev) => (prev === menu ? null : menu));
  // };

  // 화면 크기가 767px 이상이면 자동으로 모바일 네비 닫기
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 767) {
        setIsMobileNavOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
        {['/', '/purchase', '/sales'].map((path, index) => (
          <S.NavMenu
            key={index}
            to={path}
            $isActive={useActiveNav(path)}
            $hoveredMenu={hoveredMenu}
            onMouseEnter={() => setHoveredMenu(path)}
            onMouseLeave={() => setHoveredMenu(null)}
          >
            {path === '/'
              ? '홈'
              : path === '/purchase'
                ? '중고거래'
                : '판매등록'}
          </S.NavMenu>
        ))}
      </S.NavBar>

      {/* 유틸 아이콘 & 로그인 버튼 (PC에서만 표시) */}
      <S.UtilContainer>
        <S.Icon>
          <span className="material-symbols-outlined">notifications</span>
        </S.Icon>
        <S.Icon>
          <span className="material-symbols-outlined">dark_mode</span>
        </S.Icon>

        {/* 로그인 여부에 따라 버튼 변경 */}
        {isLoggedIn ? (
          <Link to={'/mypage'}>
            <S.Button>
              {userNickname ? `${userNickname}님` : '마이페이지'}
            </S.Button>
          </Link>
        ) : (
          <Link to={'/login'}>
            <S.Button>로그인</S.Button>
          </Link>
        )}
      </S.UtilContainer>

      {/* ------------------------ 모바일 ------------------------ */}

      <S.MobileUtilContainer>
        {/* 모바일 검색 아이콘 (FontAwesome) */}
        <S.MobileIcon>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </S.MobileIcon>

        {/* 모바일 메뉴 아이콘 (Material Icon) */}
        <S.MobileIcon className="hamburger" onClick={toggleMobileNav}>
          <span className="material-symbols-outlined">lunch_dining</span>
        </S.MobileIcon>
      </S.MobileUtilContainer>

      {/* 배경 오버레이 */}
      <S.Backdrop $isOpen={isMobileNavOpen} onClick={toggleMobileNav} />

      {/* 모바일 사이드바 */}
      <S.MobileNav $isOpen={isMobileNavOpen}>
        <S.CloseButton onClick={toggleMobileNav}>
          <img src={`${s3}/icons/icon-close.png`} alt="icon-close" />
        </S.CloseButton>

        {/* 메뉴 리스트(상단) */}
        <S.MobileNavItems>
          <S.MobileNavItem to="/" onClick={toggleMobileNav}>
            홈
          </S.MobileNavItem>
          <S.MobileNavItem to="/purchase" onClick={toggleMobileNav}>
            중고거래
          </S.MobileNavItem>
          <S.MobileNavItem to="/sales" onClick={toggleMobileNav}>
            판매등록
          </S.MobileNavItem>

          <S.MobileNavExternal>
            <a
              href="https://github.com/dongne-zip"
              target="_blank"
              rel="noreferrer"
            >
              만든 사람들
            </a>
            <span className="material-symbols-outlined">arrow_outward</span>
          </S.MobileNavExternal>
        </S.MobileNavItems>

        {/* 로그인, 회원가입 버튼 (하단 고정) */}
        <S.AuthButtonWrapper>
          <S.LoginButton onClick={toggleMobileNav}>
            <Link to={'/login'}>로그인</Link>
          </S.LoginButton>

          <S.SignUpButton onClick={toggleMobileNav}>
            <Link to={'/join'}>회원가입</Link>
          </S.SignUpButton>
        </S.AuthButtonWrapper>
      </S.MobileNav>
    </S.Header>
  );
}
