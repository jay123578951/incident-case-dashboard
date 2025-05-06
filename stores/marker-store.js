// stores/markerStore.js
import { defineStore } from 'pinia';
import axios from 'axios';
import {
  convertToGeoJSON,
  isGeoJSON,
  getFeatures,
  extractMarkerData
} from '@/utils/data-transform/geo-json';
import { transformFireHydrantData } from '@/utils/data-transform/marker';
import { convert97ToWGS84 } from '@/utils/data-transform/coordinate-converter';

export const useMarkerStore = defineStore('markerStore', {
  state: () => ({
    original: [], // 原始轉換後資料
    geoJSON: null, // GeoJSON 格式
    loading: false,
    error: null,
    progress: 0
  }),

  getters: {
    asGeoJSON(state) {
      return state.geoJSON || convertToGeoJSON(state.original);
    }
  },

  actions: {
    /**
     * 載入消防栓資料（含快取與轉換）
     */
    async fetch(source = '/json/Fire-Hydrant.json') {
      if (this.original.length > 0) return;
      this.loading = true;
      this.error = null;
      this.progress = 0;

      try {
        let data = null;
        const cached = localStorage.getItem('fireHydrantData');

        if (cached) {
          try {
            data = JSON.parse(cached);
          } catch (e) {
            console.warn('無法解析快取資料，已清除');
            localStorage.removeItem('fireHydrantData');
          }
        }

        if (!data) {
          const res = await axios.get(source, { timeout: 10000 });
          data = res.data;
          if (typeof data !== 'object') throw new Error('無效資料格式');
          try {
            localStorage.setItem('fireHydrantData', JSON.stringify(data));
          } catch (e) {
            console.warn('快取失敗:', e.message);
          }
        }

        const total = Object.keys(data).reduce(
          (sum, k) => sum + (data[k]?.length || 0),
          0
        );
        let processed = 0;

        const markers = transformFireHydrantData(data, (y, x) => {
          processed++;
          this.progress = Math.round((processed / total) * 100);
          return convert97ToWGS84(y, x);
        });

        if (!markers.length) throw new Error('轉換結果為空');
        this.original = markers;
        this.geoJSON = convertToGeoJSON(markers);
      } catch (err) {
        this.error = `載入失敗：${err.message}`;
      } finally {
        this.loading = false;
        this.progress = 100;
      }
    },

    /**
     * 手動更新資料
     */
    update(data, options = {}) {
      if (!data || (Array.isArray(data) && data.length === 0)) {
        this.error = '無效資料';
        return;
      }

      const { filter, transform } = options;
      let markers = data;

      try {
        if (isGeoJSON(data)) {
          markers = getFeatures(data).map(extractMarkerData);
        }

        if (filter) markers = markers.filter(filter);
        if (transform) markers = markers.map(transform);

        this.original = markers;
        this.geoJSON = convertToGeoJSON(markers, options);
      } catch (err) {
        this.error = `更新失敗：${err.message}`;
      }
    }
  }
});
