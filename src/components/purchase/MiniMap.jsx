import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { setMarkers } from '../../store/modules/mapReducer';

const API = process.env.REACT_APP_API_SERVER;
axios.defaults.withCredentials = true; // 모든 요청에 쿠키 포함

export default function MiniMap() {
  const markers = useSelector((state) => state.map.markers);
  const dispatch = useDispatch();
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRefs = useRef([]);

  //아이템의 맵 정보
  const fetchMapData = async () => {
    try {
      const response = await axios.get(`${API}/item/addItem`);
      const items = response.data.map;

      const newMarkers = items.map((item) => ({
        lat: item.latitude,
        lng: item.longitude,
        placeName: item.placeName || '장소 이름 없음',
      }));

      dispatch(setMarkers(newMarkers));
    } catch (error) {
      console.error('맵 데이터를 불러오는 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    fetchMapData();
  }, []);

  useEffect(() => {
    const initMap = () => {
      let centerLat = 33.450701;
      let centerLng = 126.570667;
      if (markers && markers.length > 0) {
        centerLat = markers[0].lat;
        centerLng = markers[0].lng;
      }

      if (!mapRef.current) {
        const options = {
          center: new window.kakao.maps.LatLng(centerLat, centerLng),
          level: 3,
        };
        mapRef.current = new window.kakao.maps.Map(
          mapContainerRef.current,
          options,
        );
      } else {
        if (markers && markers.length > 0) {
          const newCenter = new window.kakao.maps.LatLng(centerLat, centerLng);
          mapRef.current.setCenter(newCenter);
        }
      }

      markerRefs.current.forEach((marker) => marker.setMap(null));
      markerRefs.current = [];

      if (markers && markers.length > 0) {
        markers.forEach((data) => {
          const markerPosition = new window.kakao.maps.LatLng(
            data.lat,
            data.lng,
          );
          const marker = new window.kakao.maps.Marker({
            position: markerPosition,
            map: mapRef.current,
          });
          markerRefs.current.push(marker);

          const content = `<div style="padding:5px;">${data.placeName}</div>`;
          const infowindow = new window.kakao.maps.InfoWindow({
            content,
          });
          infowindow.open(mapRef.current, marker);
        });
      }
    };

    if (!window.kakao) {
      const script = document.createElement('script');
      script.async = true;
      script.src =
        '//dapi.kakao.com/v2/maps/sdk.js?appkey=7cf2cd1efa95313a520efbf5c739fb2e&autoload=false';
      document.head.appendChild(script);
      script.onload = () => {
        window.kakao.maps.load(initMap);
      };
    } else {
      window.kakao.maps.load(initMap);
    }
  }, [markers]); // markers가 변경될 때마다 지도 내 마커 업데이트

  return (
    <div>
      <div
        ref={mapContainerRef}
        style={{ width: '100%', height: '400px' }}
      ></div>
    </div>
  );
}
