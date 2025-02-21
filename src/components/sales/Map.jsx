import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import {
  addMarker,
  removeMarker,
  saveMarkers,
} from '../../store/modules/mapReducer';

const Map = () => {
  const dispatch = useDispatch();
  const markers = useSelector((state) => state.map.markers);

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

        markers.forEach(({ id, lat, lng, info }) => {
          const marker = new window.kakao.maps.Marker({
            position: new window.kakao.maps.LatLng(lat, lng),
            map,
          });

          const infowindow = new window.kakao.maps.InfoWindow({
            content: `<div style='padding:5px;'>${info} <button id='remove-${id}'>삭제</button></div>`,
          });

          window.kakao.maps.event.addListener(marker, 'click', () => {
            infowindow.open(map, marker);
          });

          // 마커 삭제 버튼
          setTimeout(() => {
            const removeButton = document.getElementById(`remove-${id}`);
            if (removeButton) {
              removeButton.onclick = () => {
                dispatch(removeMarker(id));
                marker.setMap(null);
              };
            }
          }, 100);
        });

        // 지도 클릭 시 마커 추가
        window.kakao.maps.event.addListener(
          map,
          'click',
          async (mouseEvent) => {
            if (markers.length >= 2) {
              alert('최대 2개의 마커만 추가할 수 있습니다.');
              return;
            }
            const latlng = mouseEvent.latLng;
            const info = prompt('주소 상세 정보를 입력해주세요:');
            if (!info) return;

            try {
              // Kakao API로 주소
              const res = await axios.get(
                `/api/map/get-address?lat=${latlng.getLat()}&lng=${latlng.getLng()}`,
              );
              const { province, district, address, roadAddress } = res.data;

              // DB에 저장
              const saveRes = await axios.post('/api/map/save-location', {
                latitude: latlng.getLat(),
                longitude: latlng.getLng(),
                province,
                district,
                address,
                roadAddress,
                info,
              });

              if (saveRes.data.success) {
                const newMarker = {
                  id: saveRes.data.id, // DB에서 생성된 ID
                  lat: latlng.getLat(),
                  lng: latlng.getLng(),
                  info,
                };
                dispatch(addMarker(newMarker));
              } else {
                alert('위치 저장 실패');
              }
            } catch (error) {
              console.error('위치 저장 오류:', error);
              alert('위치 정보를 가져오거나 저장하는 데 실패했습니다.');
            }
          },
        );
      });
    };
    document.head.appendChild(script);
  }, [dispatch, markers]);

  const handleSave = () => {
    dispatch(saveMarkers(markers));
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
