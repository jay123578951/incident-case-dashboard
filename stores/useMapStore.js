// stores/useMapStore.js
import { defineStore } from 'pinia';

export const useMapStore = defineStore('map', {
  state: () => ({
    activeMap: 'taiwan', // or 'park'
  }),
  actions: {
    setActiveMap(name) {
      this.activeMap = name; // 'taiwan' 或 'park'
    }
  }
});