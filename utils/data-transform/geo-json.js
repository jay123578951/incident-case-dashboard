/**
 * 檢查是否為 GeoJSON 格式
 * @param {Object|Array} data - 要檢查的資料
 * @returns {boolean}
 */
export function isGeoJSON(data) {
  return data?.type === 'FeatureCollection';
}

/**
 * 從資料中提取 features
 * @param {Object|Array} data - 原始資料
 * @returns {Array}
 */
export function getFeatures(data) {
  return isGeoJSON(data) ? data.features : data;
}

/**
 * 從 GeoJSON feature 中提取標記資料
 * @param {Object} feature - GeoJSON feature
 * @returns {Object}
 */
export function extractMarkerData(feature) {
  if (feature?.type === 'Feature') {
    return {
      id: feature.properties.id,
      lat: feature.geometry.coordinates[1],
      lng: feature.geometry.coordinates[0],
      ...feature.properties
    };
  }
  return feature;
}

/**
 * 將一般 JSON 轉換為 GeoJSON
 * @param {Array} data - 原始資料
 * @param {Object} options - 轉換選項
 * @param {Function} options.coordinates - 自定義座標提取函數
 * @param {Function} options.properties - 自定義屬性提取函數
 * @returns {Object} GeoJSON 格式的資料
 */
export function convertToGeoJSON(data, options = {}) {
  const {
    coordinates = (item) => [item.lng, item.lat],
    properties = (item) => ({
      ...item
    }),
    geometryType = 'Point' // 預設為 Point，但也可傳 LineString 或 Polygon
  } = options;

  return {
    type: 'FeatureCollection',
    features: data.map((item) => ({
      type: 'Feature',
      geometry: {
        type: geometryType,
        coordinates: coordinates(item)
      },
      properties: properties(item)
    }))
  };
}

/**
 * 將 Leaflet 的 marker 轉換為 GeoJSON
 * @param {Array} markers - Leaflet 的 marker 陣列
 * @returns {Object} GeoJSON 格式的資料
 */
export function convertMarkersToGeoJSON(markers) {
  return {
    type: 'FeatureCollection',
    features: markers
      .map((marker) => {
        const latlng = marker._latlng;

        // 檢查經緯度是否存在
        if (
          !latlng ||
          typeof latlng.lng !== 'number' ||
          typeof latlng.lat !== 'number'
        ) {
          console.warn('無效的經緯度:', marker);
          return null;
        }

        return {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [latlng.lng, latlng.lat]
          },
          properties: marker.options
        };
      })
      .filter(Boolean) // 移除無效的標記
  };
}
