import { convert97ToWGS84 } from '../coordinate-converter';

/**
 * 將消防栓原始數據轉換為標準化的標記格式
 * @param {Object} data - 原始消防栓數據，格式為 { area: [{消防栓編號, 座標97x, 座標97y, ...}, ...] }
 * @param {Function} [convert97ToWGS84Fn=convert97ToWGS84] - 坐標轉換函數，默認為內置的 convert97ToWGS84
 * @returns {Array} 標準化的標記數組
 */
export const transformFireHydrantData = (
  data,
  convert97ToWGS84Fn = convert97ToWGS84
) => {
  if (!data || typeof data !== 'object') {
    console.error('Invalid input data: data must be a non-empty object');
    return [];
  }

  try {
    return Object.entries(data).flatMap(([area, hydrants]) => {
      if (!Array.isArray(hydrants)) {
        console.warn(
          `Invalid hydrants data for area ${area}: expected an array`
        );
        return [];
      }

      // 檢查資料格式
      return hydrants
        .map((hydrant) => {
          if (!hydrant || typeof hydrant !== 'object') {
            console.warn('Invalid hydrant data: expected an object');
            return null;
          }

          // 座標轉換
          const { lat, lng } = convert97ToWGS84Fn(
            hydrant.座標97y,
            hydrant.座標97x
          );

          return {
            id: hydrant.消防栓編號 || 'unknown',
            name: hydrant.消防栓編號 || 'unknown',
            lat,
            lng,
            address: hydrant.裝置地址 || '未知地址',
            image: '/images/example/fire-hydrant.jpg',
            radius: hydrant.消防栓口徑 || 0,
            type: hydrant.類型 || '未知類型',
            diameter: hydrant.消防栓口徑 || '未知口徑',
            pipeDiameter: hydrant.連接管口徑 || '未知管徑',
            managementUnit: hydrant.管理單位 || '未知單位',
            elevation: hydrant.座標97z || 0
          };
        })
        .filter((marker) => marker !== null); // 過濾轉換失敗
    });
  } catch (error) {
    console.error('Error transforming fire hydrant data:', error.message);
    return [];
  }
};
