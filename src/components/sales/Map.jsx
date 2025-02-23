import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveMarkers } from '../../store/modules/mapReducer';

const Map = () => {
  const dispatch = useDispatch();
  const storedMarkers = useSelector((state) => state.map.markers);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      initializeMap();
    } else {
      const script = document.createElement('script');
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=7cf2cd1efa95313a520efbf5c739fb2e&libraries=services`;
      script.async = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    }
  }, []);

  const initializeMap = () => {
    window.kakao.maps.load(() => {
      const mapContainer = document.getElementById('map');
      const mapOption = {
        center: new window.kakao.maps.LatLng(37.5665, 126.978),
        level: 3,
      };
      const newMap = new window.kakao.maps.Map(mapContainer, mapOption);
      setMap(newMap);

      // 기존 마커 불러오기
      storedMarkers.forEach(({ lat, lng, info }) =>
        addMarker(newMap, lat, lng, info)
      );
    });
  };

  const addMarker = (mapInstance, lat, lng, info) => {
    if (markers.length >= 2) {
      alert('최대 2개의 마커만 추가할 수 있습니다.');
      return;
    }

    const markerPosition = new window.kakao.maps.LatLng(lat, lng);
    const marker = new window.kakao.maps.Marker({
      position: markerPosition,
      map: mapInstance,
    });

    const infowindow = new window.kakao.maps.InfoWindow({
      content: `<div style='padding:5px;'>${info}</div>`,
    });

    window.kakao.maps.event.addListener(marker, 'click', () => {
      infowindow.open(mapInstance, marker);
      setTimeout(() => infowindow.close(), 3000); // 3초 후 자동 닫힘
    });

    setMarkers((prev) => [...prev, { id: Date.now(), lat, lng, info, marker }]);
  };

  const handleMapClick = (mouseEvent) => {
    if (markers.length >= 2) {
      alert('최대 2개의 마커만 추가할 수 있습니다.');
      return;
    }

    const latlng = mouseEvent.latLng;
    const info = prompt('주소 상세 정보를 입력해주세요:');
    if (!info) return;

    addMarker(map, latlng.getLat(), latlng.getLng(), info);
  };

  useEffect(() => {
    if (map) {
      window.kakao.maps.event.addListener(map, 'click', handleMapClick);
    }
  }, [map, markers]);

  const handleSave = () => {
    const savedMarkers = markers.map(({ lat, lng, info }) => ({
      lat,
      lng,
      info,
    }));
    dispatch(saveMarkers(savedMarkers));
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
