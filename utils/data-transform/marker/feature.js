import { generatePopupHTML } from './popup';

/**
 * 將 GeoJSON Feature（已標準化的 marker）轉換為 Leaflet Marker 實例
 *
 * @param {Object} feature - GeoJSON Feature，格式為 { geometry, properties }
 * @param {Function} [iconFactory] - 傳回 Leaflet icon 的函數 (可根據 props.type 等自訂)
 * @returns {L.Marker|null}
 */
export function createMarkerFromFeature(feature, iconFactory) {
  if (!feature || !feature.geometry || !feature.properties) {
    console.warn('[createMarkerFromFeature] 無效的 feature:', feature);
    return null;
  }

  const { coordinates } = feature.geometry;
  const props = feature.properties;

  if (!Array.isArray(coordinates) || coordinates.length < 2) {
    console.warn('[createMarkerFromFeature] 無效座標:', coordinates);
    return null;
  }

  const latlng = [coordinates[1], coordinates[0]];

  const marker = L.marker(latlng, {
    id: props.id,
    icon: iconFactory ? iconFactory(props) : undefined,
    type: props.type
  });

  marker.feature = feature;

  // ✅ 使用 generatePopupHTML() 來產生完整 HTML popup 內容
  const popupHTML = generatePopupHTML(props);
  marker.bindPopup(popupHTML);

  return marker;
}
