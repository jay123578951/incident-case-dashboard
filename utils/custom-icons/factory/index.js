import { createFireHydrantIcon } from './fireHydrant';
import { createTempMarkerIcon } from './tempMarker';

/**
 * 共用 icon 工廠
 * @param {string} category - 類別名稱（例如 'FIRE_HYDRANT'）
 * @param {Object} props - 額外資料屬性
 * @returns {L.Icon|null}
 */
export function createMapIcon(category, props = {}) {
  switch (category) {
    case 'FIRE_HYDRANT':
      return createFireHydrantIcon(props);
    case 'WATER_WELL':
      return createWaterWellIcon(props);
    case 'DISASTER_POINT':
      return createDisasterPointIcon(props);
    case 'TEMP_MARKER':
      return createTempMarkerIcon();
    default:
      console.warn(`[iconFactory] 不支援的類別: ${category}`);
      return null;
  }
}
