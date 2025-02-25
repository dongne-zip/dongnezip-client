import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  markers: [],
};

const mapReducer = createSlice({
  name: 'map',
  initialState,
  reducers: {
    addMarker: (state, action) => {
      if (state.markers.length >= 2) return;
      state.markers.push(action.payload);
    },
    removeMarker: (state, action) => {
      state.markers = state.markers.filter(
        (marker) => marker.id !== action.payload,
      );
    },
    setMarkers: (state, action) => {
      state.markers = action.payload;
    },
    clearMarkers: (state) => {
      state.markers = [];
    },
  },
});

export const { addMarker, removeMarker, setMarkers, clearMarkers } =
  mapReducer.actions;
export default mapReducer.reducer;
