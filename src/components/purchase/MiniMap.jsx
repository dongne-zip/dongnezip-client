import { useEffect, useRef } from 'react';
// import { useSelector } from 'react-redux';
// import axios from 'axios';
import { styled } from 'styled-components';

export default function MiniMap({ lat, lng, placeName }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!lat || !lng) return;

    const loadMap = () => {
      const container = containerRef.current;
      const options = {
        center: new window.kakao.maps.LatLng(lat, lng),
        level: 3,
      };
      const map = new window.kakao.maps.Map(container, options);

      const markerPosition = new window.kakao.maps.LatLng(lat, lng);
      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
        map: map,
      });

      // 정보창에 장소 이름 표시 (placeName이 있을 경우)
      if (placeName) {
        const infowindow = new window.kakao.maps.InfoWindow({
          content: `<div style="padding:5px;">${placeName}</div>`,
        });
        infowindow.open(map, marker);
      }
    };

    if (!window.kakao) {
      const script = document.createElement('script');
      const appKey = process.env.REACT_APP_KAKAOMAP_APPKEY;
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`;
      script.async = true;
      document.head.appendChild(script);
      script.onload = () => {
        window.kakao.maps.load(loadMap);
      };
    } else {
      window.kakao.maps.load(loadMap);
    }
  }, [lat, lng, placeName]);

  return <Container ref={containerRef} />;
}

const Container = styled.div`
  width: 100%;
  height: 300px;
  border-radius: 8px;
  overflow: hidden;
`;
