import { defineStore } from 'pinia';

export const useFilterStore = defineStore('filterStore', {
  state: () => ({
    // 使用者勾選的所有篩選條件（包含類型、流量、維修等）
    hydrantFilters: ['地上式單口式', '地下式單口式']
  }),

  getters: {
    /**
     * 從 hydrantFilters 中過濾出 marker 類型（用於控制哪些群組顯示）
     */
    getActiveTypes: (state) => {
      const KNOWN_TYPES = ['地上式單口式', '地下式單口式'];
      return state.hydrantFilters.filter((f) => KNOWN_TYPES.includes(f));
    },

    /**
     * 把所有條件分類成：
     * - types: 類型（供 cluster 使用）
     * - flow: 流量條件（如 above_1000）
     * - repair: 是否要篩選正在維修的 marker
     */
    getFilterGroups: (state) => {
      const KNOWN_TYPES = ['地上式單口式', '地下式單口式'];
      const FLOW_OPTIONS = ['above_1000', '500_1000', 'below_500'];

      return {
        types: state.hydrantFilters.filter((f) => KNOWN_TYPES.includes(f)),
        flow:
          state.hydrantFilters.find((f) => FLOW_OPTIONS.includes(f)) || null,
        repair: state.hydrantFilters.includes('repair')
      };
    }
  },

  actions: {
    toggleHydrantFilter(type) {
      const i = this.hydrantFilters.indexOf(type);
      if (i === -1) this.hydrantFilters.push(type);
      else this.hydrantFilters.splice(i, 1);
    },
    setHydrantFilters(list) {
      this.hydrantFilters = list;
    }
  }
});
