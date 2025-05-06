// stores/mapViewStore.js
import { defineStore } from 'pinia';

export const useMapViewStore = defineStore('mapViewStore', {
  state: () => ({
    selectedArea: '壽豐鄉',
    selectedMarkerId: null,
    tempLocation: null,
    visibleLayers: {
      town: false,
      circles: false,
      polygons: false
    }
  }),

  getters: {
    showTown: (state) => state.visibleLayers.town,
    showCircles: (state) => state.visibleLayers.circles,
    showPolygons: (state) => state.visibleLayers.polygons
  },

  actions: {
    setSelectedArea(area) {
      this.selectedArea = area;
    },
    setSelectedMarker(id) {
      this.selectedMarkerId = id;
    },
    setTempLocation(location) {
      this.tempLocation = location;
    },
    setVisibleLayer(key, value) {
      if (key in this.visibleLayers) {
        this.visibleLayers[key] = value;
      }
    }
  }
});
