import proj4 from 'proj4';

// 定義 EPSG 轉換：TWD97 (EPSG:3826) -> WGS84 (EPSG:4326)
proj4.defs([
  [
    'EPSG:3826', // TWD97 (TM2 台灣)
    '+proj=tmerc +lat_0=0 +lon_0=121 +k=0.9999 +x_0=250000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
  ],
  [
    'EPSG:4326', // WGS84
    '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs'
  ]
]);

/**
 * 將 TWD97 座標轉換為 WGS84 座標
 * @param {number} y - TWD97 Y 座標
 * @param {number} x - TWD97 X 座標
 * @returns {Object} WGS84 座標 { lat, lng }
 */
export const convert97ToWGS84 = (y, x) => {
  try {
    if (
      typeof y !== 'number' ||
      typeof x !== 'number' ||
      isNaN(y) ||
      isNaN(x)
    ) {
      throw new Error('Invalid TWD97 coordinates');
    }
    const [lng, lat] = proj4('EPSG:3826', 'EPSG:4326', [x, y]);
    return { lat, lng };
  } catch (error) {
    console.error('Coordinate conversion error:', error.message, 'input:', {
      y,
      x
    });
    return { lat: 0, lng: 0 }; // 返回默認值以防止應用崩潰
  }
};
