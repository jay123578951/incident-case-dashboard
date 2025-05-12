// stores/useMapStore.js
import { defineStore } from 'pinia';
import { shallowRef, ref } from 'vue';

export const useMapStore = defineStore('map', () => {
  const map = shallowRef(null);      // ✅ 用 shallowRef 避免過度追蹤 Leaflet 實例
  const isMapReady = ref(false);

  return {
    map,
    isMapReady
  };
});