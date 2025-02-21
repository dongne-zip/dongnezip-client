import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveMarkers } from '../../store/modules/mapReducer';

const Map = () => {
  const dispatch = useDispatch();
  const storedMarkers = useSelector((state) => state.map.markers);
  const [localMarkers, setLocalMarkers] = useState([]);

  useEffect(() => {
    setLocalMarkers(storedMarkers);
  }, [storedMarkers]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=7cf2cd1efa95313a520efbf5c739fb2e&libraries=services`;
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(() => {
        const mapContainer = document.getElementById('map');
        const mapOption = {
          center: new window.kakao.maps.LatLng(37.5665, 126.978),
          level: 3,
        };
        const map = new window.kakao.maps.Map(mapContainer, mapOption);

        localMarkers.forEach(({ lat, lng, info }) => {
          const marker = new window.kakao.maps.Marker({
            position: new window.kakao.maps.LatLng(lat, lng),
            map,
          });

          const infowindow = new window.kakao.maps.InfoWindow({
            content: `<div style='padding:5px;'>${info}</div>`,
          });

          window.kakao.maps.event.addListener(marker, 'click', () => {
            infowindow.open(map, marker);
          });
        });

        window.kakao.maps.event.addListener(map, 'click', (mouseEvent) => {
          if (localMarkers.length >= 2) {
            alert('최대 2개의 마커만 추가할 수 있습니다.');
            return;
          }
          const latlng = mouseEvent.latLng;
          const info = prompt('주소 상세 정보를 입력해주세요:');
          if (!info) return;

          const newMarker = {
            id: Date.now(),
            lat: latlng.getLat(),
            lng: latlng.getLng(),
            info,
          };
          setLocalMarkers((prev) => [...prev, newMarker]);
        });
      });
    };
    document.head.appendChild(script);
  }, [localMarkers]);

  const handleSave = () => {
    dispatch(saveMarkers(localMarkers));
    alert('저장되었습니다.');
  };

  return (
    <div>
      <div id="map" style={{ width: '100%', height: '400px' }}></div>
      <button onClick={handleSave} style={{ marginTop: '10px' }}>
        저장
      </button>
    </div>
  );
};

export default Map;
