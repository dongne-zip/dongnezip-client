import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const MiniMap = () => {
  const markers = useSelector((state) => state.map.markers);
  const [selectedInfo, setSelectedInfo] = useState(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=7cf2cd1efa95313a520efbf5c739fb2e&libraries=services`;
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(() => {
        const mapContainer = document.getElementById('miniMap');
        const mapOption = {
          center: new window.kakao.maps.LatLng(37.5665, 126.978),
          level: 3,
        };
        const map = new window.kakao.maps.Map(mapContainer, mapOption);

        markers.forEach(({ lat, lng, info }) => {
          const marker = new window.kakao.maps.Marker({
            position: new window.kakao.maps.LatLng(lat, lng),
            map,
          });

          const infowindow = new window.kakao.maps.InfoWindow({
            content: `<div style='padding:5px;'>${info}</div>`,
          });

          window.kakao.maps.event.addListener(marker, 'click', () => {
            infowindow.open(map, marker);
            setSelectedInfo(info);
          });
        });
      });
    };
    document.head.appendChild(script);
  }, [markers]);

  return (
    <div>
      <div id="miniMap" style={{ width: '100%', height: '300px' }}></div>
      {selectedInfo && (
        <div
          style={{
            marginTop: '10px',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '5px',
          }}
        >
          <strong>주소 상세 정보:</strong> {selectedInfo}
        </div>
      )}
    </div>
  );
};

export default MiniMap;
