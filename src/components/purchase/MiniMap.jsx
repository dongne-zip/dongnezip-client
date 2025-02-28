import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { setMarkers } from '../../store/modules/mapReducer';

const API = process.env.REACT_APP_API_SERVER;
axios.defaults.withCredentials = true;

export default function MiniMap() {
  const markers = useSelector((state) => state.map.markers);
  const dispatch = useDispatch();
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRefs = useRef([]);
  const { id } = useParams();

  // 특정 상품의 지도 데이터 불러오기
  const fetchMapData = async () => {
    try {
      console.log('itemId', id);
      const response = await axios.get(`${API}/item/${id}`);
      const item = response.data.data;

      if (item.map && item.map.latitude && item.map.longitude) {
        const newMarker = {
          lat: Number(item.map.latitude),
          lng: Number(item.map.longitude),
          placeName: item.map.placeName || '장소 이름 없음',
        };
        dispatch(setMarkers([newMarker]));
      } else {
        dispatch(setMarkers([]));
      }
    } catch (error) {
      console.error('맵 데이터를 불러오는 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    fetchMapData();
  }, [id]);

  useEffect(() => {
    const initMap = () => {
      let centerLat = 33.450701;
      let centerLng = 126.570667;
      if (markers.length > 0) {
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
        if (markers.length > 0) {
          const newCenter = new window.kakao.maps.LatLng(centerLat, centerLng);
          mapRef.current.setCenter(newCenter);
        }
      }

      markerRefs.current.forEach((marker) => marker.setMap(null));
      markerRefs.current = [];

      markers.forEach((data) => {
        const markerPosition = new window.kakao.maps.LatLng(data.lat, data.lng);
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
          map: mapRef.current,
        });
        markerRefs.current.push(marker);

        const content = `<div style="padding:5px; background:white; border:1px solid #ccc; border-radius:4px;">${data.placeName}</div>`;
        const infowindow = new window.kakao.maps.InfoWindow({
          content,
        });
        infowindow.open(mapRef.current, marker);
      });
    };

    if (!window.kakao) {
      const script = document.createElement('script');
      script.async = true;
      const appKey = process.env.REACT_APP_KAKAOMAP_APPKEY;
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`;
      document.head.appendChild(script);
      script.onload = () => {
        window.kakao.maps.load(initMap);
      };
    } else {
      window.kakao.maps.load(initMap);
    }
  }, [markers]);

  return (
    <div>
      <div
        ref={mapContainerRef}
        style={{ width: '100%', height: '400px' }}
      ></div>
    </div>
  );
}
