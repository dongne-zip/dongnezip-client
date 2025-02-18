import { useEffect, useState } from 'react';

const MiniMap = ({ markers = [] }) => {
  // 기본값을 빈 배열로 설정
  const [selectedMarker, setSelectedMarker] = useState(null);

  useEffect(() => {
    if (!window.kakao || !window.kakao.maps || markers.length === 0) return;

    window.kakao.maps.load(() => {
      const container = document.getElementById('mini-map');
      if (!container) return;

      const options = {
        center: new window.kakao.maps.LatLng(markers[0].lat, markers[0].lng),
        level: 4,
      };

      const miniMap = new window.kakao.maps.Map(container, options);

      // 마커 추가
      markers.forEach((marker) => {
        const kakaoMarker = new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(marker.lat, marker.lng),
          map: miniMap,
        });

        // 마커 클릭 시 정보 표시
        const infowindow = new window.kakao.maps.InfoWindow({
          content: `<div style="padding:5px;">${marker.name}</div>`,
        });

        window.kakao.maps.event.addListener(kakaoMarker, 'click', () => {
          infowindow.open(miniMap, kakaoMarker);
          setSelectedMarker(marker); // 선택된 마커 정보 업데이트
        });
      });

      // 지도 범위 자동 조정
      if (markers.length > 1) {
        const bounds = new window.kakao.maps.LatLngBounds();
        markers.forEach((marker) => {
          bounds.extend(new window.kakao.maps.LatLng(marker.lat, marker.lng));
        });
        miniMap.setBounds(bounds);
      }
    });
  }, [markers]);

  return (
    <div>
      <div
        id="mini-map"
        style={{
          width: '50%',
          height: '250px',
          borderRadius: '10px',
          cursor: 'pointer',
        }}
      ></div>

      {/* 선택한 마커 정보 표시 */}
      {selectedMarker && (
        <div
          style={{
            marginTop: '10px',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '10px',
            background: '#f9f9f9',
          }}
        >
          <h3>📍 선택한 마커 정보</h3>
          <p>
            <strong>장소명:</strong> {selectedMarker.name}
          </p>
        </div>
      )}
    </div>
  );
};

export default MiniMap;
