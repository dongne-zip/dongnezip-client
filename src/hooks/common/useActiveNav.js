/**
 * 현재 내비게이션 메뉴 활성 상태 확인 custom hook
 * @param {string} path - 활성화 여부 확인 경로
 * @returns {boolean} - 현재 경로와 일치하면 true 반환
 */

import { useLocation } from 'react-router-dom';

export const useActiveNav = (path) => {
  const location = useLocation();
  return location.pathname === path;
};
