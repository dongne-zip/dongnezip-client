import { createContext, useContext, useState } from 'react';

const MapContext = createContext();

export const MapContextProvider = ({ children }) => {
  const [markers, setMarkers] = useState([]);

  return (
    <MapContext.Provider value={{ markers, setMarkers }}>
      {children}
    </MapContext.Provider>
  );
};

export const useMap = () => useContext(MapContext);
