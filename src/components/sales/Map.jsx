import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setMarkers } from '../../store/modules/mapReducer';

export default function Map() {
  const dispatch = useDispatch();
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const infoWindowRef = useRef(null);

  const [markerCoords, setMarkerCoords] = useState(null);
  const [placeName, setPlaceName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 로컬에 저장된 마커 (인포윈도우 표시용)
  const savedMarkerDataRef = useRef(null);

  useEffect(() => {
    const initializeMap = (lat, lng) => {
      const container = mapContainerRef.current;
      const options = {
        center: new window.kakao.maps.LatLng(lat, lng),
        level: 3,
      };
      mapRef.current = new window.kakao.maps.Map(container, options);

      window.kakao.maps.event.addListener(
        mapRef.current,
        'click',
        function (mouseEvent) {
          const latlng = mouseEvent.latLng;
          if (markerRef.current) {
            markerRef.current.setPosition(latlng);
          } else {
            markerRef.current = new window.kakao.maps.Marker({
              position: latlng,
              map: mapRef.current,
            });
            // 마커 클릭 시 인포윈도우 표시
            window.kakao.maps.event.addListener(
              markerRef.current,
              'click',
              handleMarkerClick,
            );
          }
          setMarkerCoords({ lat: latlng.getLat(), lng: latlng.getLng() });
          setIsModalOpen(true);
        },
      );
    };

    const loadMapWithGeolocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            initializeMap(latitude, longitude);
          },
          (error) => {
            console.error('Geolocation error:', error);
            initializeMap(37.5665, 126.978);
          },
        );
      } else {
        console.error('Geolocation을 지원하지 않습니다.');
        initializeMap(37.5665, 126.978);
      }
    };

    const loadKakaoMapScript = () => {
      const script = document.createElement('script');
      const appKey = process.env.REACT_APP_KAKAOMAP_APPKEY;
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`;
      script.async = true;
      document.head.appendChild(script);
      script.onload = () => {
        window.kakao.maps.load(() => {
          loadMapWithGeolocation();
        });
      };
    };

    if (!window.kakao) {
      loadKakaoMapScript();
    } else {
      loadMapWithGeolocation();
    }
  }, []);

  // 마커 클릭 시, 저장된 장소 이름(placeName)을 인포윈도우로 표시
  const handleMarkerClick = () => {
    const info = savedMarkerDataRef.current
      ? savedMarkerDataRef.current.placeName
      : '장소 이름이 없습니다.';
    const content = `<div style="padding:5px;">
      ${info}<br/>
      <button id="deleteMarkerButton" style="padding:5px 10px; cursor:pointer;">삭제</button>
    </div>`;
    if (infoWindowRef.current) {
      infoWindowRef.current.close();
    }
    infoWindowRef.current = new window.kakao.maps.InfoWindow({ content });
    infoWindowRef.current.open(mapRef.current, markerRef.current);

    setTimeout(() => {
      const btn = document.getElementById('deleteMarkerButton');
      if (btn) {
        btn.addEventListener('click', handleDeleteMarker);
      }
    }, 0);
  };

  // 삭제 버튼 클릭 시 마커와 인포윈도우 삭제, redux 업데이트
  const handleDeleteMarker = () => {
    if (markerRef.current) {
      markerRef.current.setMap(null);
      markerRef.current = null;
    }
    if (infoWindowRef.current) {
      infoWindowRef.current.close();
      infoWindowRef.current = null;
    }
    setMarkerCoords(null);
    savedMarkerDataRef.current = null;
    setPlaceName('');
    dispatch(setMarkers([]));
  };

  // 모달에서 장소 이름 입력 후 저장 시 redux에 데이터를 업데이트
  const handleModalSubmit = () => {
    if (!markerCoords) return;
    const newData = { lat: markerCoords.lat, lng: markerCoords.lng, placeName };
    savedMarkerDataRef.current = newData;
    dispatch(setMarkers([newData]));

    const content = `<div style="padding:5px;">
      ${placeName}<br/>
      <button id="deleteMarkerButton" style="padding:5px 10px; cursor:pointer;">삭제</button>
    </div>`;
    if (infoWindowRef.current) {
      infoWindowRef.current.close();
    }
    infoWindowRef.current = new window.kakao.maps.InfoWindow({ content });
    infoWindowRef.current.open(mapRef.current, markerRef.current);

    setTimeout(() => {
      const btn = document.getElementById('deleteMarkerButton');
      if (btn) {
        btn.addEventListener('click', handleDeleteMarker);
      }
    }, 0);

    setIsModalOpen(false);
    setPlaceName('');
  };

  const handleCancel = () => {
    setPlaceName('');
    setIsModalOpen(false);
    // 수정 시 취소하면 기존 마커는 유지하되 모달만 닫습니다.
  };

  return (
    <div>
      <MapContainer ref={mapContainerRef}></MapContainer>
      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <h3>장소 이름 입력</h3>
            <Input
              type="text"
              value={placeName}
              onChange={(e) => setPlaceName(e.target.value)}
              placeholder="장소 이름을 입력하세요"
              required
            />
            <ButtonContainer>
              <Button onClick={handleModalSubmit}>저장</Button>
              <Button onClick={handleCancel} style={{ marginLeft: '10px' }}>
                취소
              </Button>
            </ButtonContainer>
          </ModalContent>
        </ModalOverlay>
      )}
    </div>
  );
}

// -----------------------styled-components---------------------
import styled from 'styled-components';

export const MapContainer = styled.div`
  width: 100%;
  height: 400px;
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  width: 90%;
  max-width: 400px;
  text-align: center;
`;

export const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin: 10px 0;
  box-sizing: border-box;
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

export const Button = styled.button`
  padding: 8px 16px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;
