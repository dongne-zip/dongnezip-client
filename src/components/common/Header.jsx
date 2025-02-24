import { Link, useLocation } from 'react-router-dom';
import * as S from '../../styles/HeaderStyle';
import { useActiveNav } from '../../hooks/common/useActiveNav';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const s3 = process.env.REACT_APP_S3;

axios.defaults.withCredentials = true; // 모든 요청에 쿠키 포함

export default function Header() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const API = process.env.REACT_APP_API_SERVER;
  const location = useLocation(); // 현재 경로 감지

  // 경로 변경 시마다 사용자 정보를 새로 요청 (로그인 후, 마이페이지 이동 시 업데이트)
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.post(`${API}/user/token`);
        // 서버에서 반환하는 값이 { result: true, nickname: '사용자이름' }인 경우
        if (response.data.result) {
          setUserInfo({ nickname: response.data.nickname });
          setIsLoggedIn(true);
        } else {
          setUserInfo(null);
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('사용자 정보를 불러오지 못했습니다.', error);
        setUserInfo(null);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, [API, location]); // location이 바뀔 때마다 재호출

  const toggleMobileNav = () => {
    setIsMobileNavOpen((prev) => !prev);
  };

  // 화면 크기가 767px 이상이면 모바일 네비를 닫습니다.
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

      {/* 유틸 아이콘 & 로그인 버튼 (PC) */}
      <S.UtilContainer>
        <S.Icon>
          <span className="material-symbols-outlined">notifications</span>
        </S.Icon>
        <S.Icon>
          <span className="material-symbols-outlined">dark_mode</span>
        </S.Icon>

        {/* 로딩 상태일 때는 버튼을 숨기거나, 로딩 스피너를 표시 */}
        {isLoading ? null : isLoggedIn ? (
          <Link to={'/mypage'}>
            <S.Button>
              {userInfo?.nickname ? `${userInfo.nickname}님` : '마이페이지'}
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
        <S.MobileIcon>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </S.MobileIcon>

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
          {isLoading ? null : !isLoggedIn ? (
            <>
              <S.LoginButton onClick={toggleMobileNav}>
                <Link to={'/login'}>로그인</Link>
              </S.LoginButton>
              <S.SignUpButton onClick={toggleMobileNav}>
                <Link to={'/join'}>회원가입</Link>
              </S.SignUpButton>
            </>
          ) : (
            <S.LoginButton onClick={toggleMobileNav}>
              <Link to={'/mypage'}>마이페이지</Link>
            </S.LoginButton>
          )}
        </S.AuthButtonWrapper>
      </S.MobileNav>
    </S.Header>
  );
}
