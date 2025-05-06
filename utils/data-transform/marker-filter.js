/**
 * 根據 filters 條件過濾 marker 資料
 * @param {Array} markerList - 原始 marker 陣列
 * @param {Array<string>} types - 顯示的 marker 類型（例：['地上式單口式']）
 * @param {Object} options - 額外條件設定
 * @param {boolean} [options.enableFlowFilter] - 是否啟用流量條件
 * @param {string|null} [options.flowType] - 流量條件（例：'above_1000'）
 * @param {boolean} [options.enableRepairFilter] - 是否只保留維修中
 * @returns {Array} - 符合條件的 marker 陣列
 */
export function applyFilters(markerList, types, options = {}) {
  if (!Array.isArray(markerList) || !Array.isArray(types)) return [];

  const {
    enableFlowFilter = false,
    flowType = null,
    enableRepairFilter = false
  } = options;

  return markerList.filter((marker) => {
    const typeMatch = types.includes(marker.type);

    let flowMatch = true;
    if (enableFlowFilter && flowType && marker.flow != null) {
      switch (flowType) {
        case 'above_1000':
          flowMatch = marker.flow > 1000;
          break;
        case '500_1000':
          flowMatch = marker.flow >= 500 && marker.flow <= 1000;
          break;
        case 'below_500':
          flowMatch = marker.flow < 500;
          break;
      }
    }

    let repairMatch = true;
    if (enableRepairFilter) {
      repairMatch = marker.repair === true;
    }

    return typeMatch && flowMatch && repairMatch;
  });
}
