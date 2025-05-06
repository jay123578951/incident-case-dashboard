import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

export default defineNuxtPlugin((nuxtApp) => {
  if (typeof window !== 'undefined') {
    // 使用动态导入
    import('leaflet').then((L) => {
      import('leaflet.markercluster').then((MarkerClusterGroup) => {
        nuxtApp.provide('leaflet', {
          L: L.default,
          MarkerClusterGroup: MarkerClusterGroup.default
        });
      });
    });
  }
});
