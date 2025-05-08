import { defineStore } from 'pinia';

export const useScrollStore = defineStore('scroll', {
  state: () => ({
    target: null
  }),
  actions: {
    scrollTo(sectionName) {
      this.target = sectionName;
    },
    clear() {
      this.target = null;
    }
  }
});
