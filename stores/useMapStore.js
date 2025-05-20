import { defineStore } from 'pinia';

export const useMapStore = defineStore('map', {
  state: () => ({
    isTaiwanFaded: null
  }),
  actions: {
    setTaiwanFaded(value) {
      this.isTaiwanFaded = value;
    }
  }
});
