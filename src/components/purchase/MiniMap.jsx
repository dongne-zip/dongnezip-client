import { useEffect, useState } from 'react';
import axios from 'axios';

const MiniMap = () => {
  const [markers, setMarkers] = useState([]);
  const [selectedInfo, setSelectedInfo] = useState(null);

  useEffect(() => {
    const fetchMarkers = async () => {
      try {
        const response = await axios.get('/api/map/get-markers');
        if (response.data.success) {
          setMarkers(response.data.markers);
        }
      } catch (error) {
        console.error('마커 데이터를 가져오는 중 오류 발생:', error);
      }
    };

    fetchMarkers();

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
