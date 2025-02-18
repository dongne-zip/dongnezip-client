import { useEffect, useState } from 'react';
import { useMap } from './MapContext';
import MiniMap from '../purchase/MiniMap';

export default function KakaoMap() {
  const { markers, setMarkers } = useMap();
  const [map, setMap] = useState(null);

  useEffect(() => {
    const waitForKakao = () => {
      if (window.kakao && window.kakao.maps) {
        initializeMap();
      } else {
        setTimeout(waitForKakao, 500);
      }
    };

    waitForKakao();
  }, []);

  const initializeMap = () => {
    const container = document.getElementById('map');
    const options = {
      center: new window.kakao.maps.LatLng(37.5665, 126.978),
      level: 3,
    };

    const newMap = new window.kakao.maps.Map(container, options);
    setMap(newMap);
    loadSavedMarkers(newMap);
  };

  useEffect(() => {
    if (!map) return;

    const handleClick = (mouseEvent) => {
      const latlng = mouseEvent.latLng;
      const name = prompt('장소명을 입력하세요:');
      if (!name) return;

      addMarker(latlng.getLat(), latlng.getLng(), name);
    };

    window.kakao.maps.event.addListener(map, 'click', handleClick);

    return () => {
      window.kakao.maps.event.removeListener(map, 'click', handleClick);
    };
  }, [map]);

  const addMarker = (lat, lng, name) => {
    if (!map) return;

    const position = new window.kakao.maps.LatLng(lat, lng);

    const marker = new window.kakao.maps.Marker({
      position,
      map,
    });

    const infowindow = new window.kakao.maps.InfoWindow({
      content: `
        <div style="padding:10px;">
          ${name}
          <br />
          <button onclick="(function(lat, lng) {
            ${removeMarker.toString()}(lat, lng);
          })(${lat}, ${lng})">삭제</button>
        </div>
      `,
    });

    window.kakao.maps.event.addListener(marker, 'click', () => {
      infowindow.open(map, marker);
    });

    const newMarker = { lat, lng, name, marker, infowindow };
    setMarkers((prevMarkers) => {
      const updatedMarkers = [...prevMarkers, newMarker];
      saveMarkers(updatedMarkers);
      return updatedMarkers;
    });
  };

  const removeMarker = (lat, lng) => {
    setMarkers((prevMarkers) => {
      const updatedMarkers = prevMarkers.filter(
        (marker) => marker.lat !== lat || marker.lng !== lng,
      );
      saveMarkers(updatedMarkers);
      return updatedMarkers;
    });
  };

  const saveMarkers = (markers) => {
    const markerData = markers.map((m) => ({
      lat: m.lat,
      lng: m.lng,
      name: m.name,
    }));
    localStorage.setItem('savedMarkers', JSON.stringify(markerData));
  };

  const loadSavedMarkers = () => {
    const savedMarkers = JSON.parse(localStorage.getItem('savedMarkers')) || [];
    savedMarkers.forEach(({ lat, lng, name }) => {
      addMarker(lat, lng, name);
    });
  };

  return (
    <div>
      <div id="map" style={{ width: '70%', height: '500px' }}></div>
      <MiniMap markers={markers} />
    </div>
  );
}
