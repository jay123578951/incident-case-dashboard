/**
 * 獲取上一個月份
 * @param {string|number} month - 當前月份
 * @returns {number} 上一個月份
 */
export const getPreviousMonth = (month) => {
  const currentMonth = parseInt(month);
  if (isNaN(currentMonth) || currentMonth < 1 || currentMonth > 12) {
    throw new Error('Invalid month value');
  }
  return currentMonth === 1 ? 12 : currentMonth - 1;
};

/**
 * 計算比較符號
 * @param {Object} item - 包含 thisMonth 和 lastMonth 的對象
 * @returns {string} '+' 或 '-'
 */
export const getComparisonSign = (item) => {
  const thisMonth = parseInt(item.thisMonth);
  const lastMonth = parseInt(item.lastMonth);
  if (isNaN(thisMonth) || isNaN(lastMonth)) {
    throw new Error('Invalid month values');
  }
  return thisMonth > lastMonth ? '+' : '-';
};

/**
 * 計算百分比差異（保留小數點後兩位）
 * @param {Object} item - 包含 thisMonth 和 lastMonth 的對象
 * @returns {string} 百分比差異的絕對值
 */
export const getComparisonPercentage = (item) => {
  const thisMonth = parseFloat(item.thisMonth);
  const lastMonth = parseFloat(item.lastMonth);
  if (isNaN(thisMonth) || isNaN(lastMonth)) {
    throw new Error('Invalid month values');
  }
  if (lastMonth === 0) {
    return thisMonth === 0 ? '0.00' : '100.00';
  }
  const percent = Math.abs((thisMonth - lastMonth) / lastMonth * 100);
  return percent.toFixed(2);
};

/**
 * 計算實際差異數量
 * @param {Object} item - 包含 thisMonth 和 lastMonth 的對象
 * @returns {string} 帶有符號的實際差異數量
 */
export const getComparisonDifference = (item) => {
  const thisMonth = parseInt(item.thisMonth);
  const lastMonth = parseInt(item.lastMonth);
  if (isNaN(thisMonth) || isNaN(lastMonth)) {
    throw new Error('Invalid month values');
  }
  const difference = thisMonth - lastMonth;
  return `${difference >= 0 ? '+' : ''}${difference}`;
};

/**
 * 計算寬度百分比
 * @param {Object} item - 包含 thisMonth 和 lastMonth 的對象
 * @returns {Object} 包含兩個月份的寬度百分比
 */
export const calculateWidthPercentages = (item) => {
  const thisMonth = parseInt(item.thisMonth);
  const lastMonth = parseInt(item.lastMonth);
  if (isNaN(thisMonth) || isNaN(lastMonth)) {
    throw new Error('Invalid month values');
  }

  // 找出最大值作為基準
  const maxValue = Math.max(thisMonth, lastMonth);
  
  // 計算百分比，最小保持 20% 的寬度，並四捨五入到整數
  const thisMonthPercentage = Math.round(Math.max(20, (thisMonth / maxValue) * 100));
  const lastMonthPercentage = Math.round(Math.max(20, (lastMonth / maxValue) * 100));

  return {
    thisMonthPercentage,
    lastMonthPercentage
  };
};

/**
 * 計算年度比較差異
 * @param {string} currentValue - 當前年度值
 * @param {string} lastValue - 上一年度值
 * @returns {Object} 包含差異值和符號
 */
export const calculateAnnualDifference = (currentValue, lastValue) => {
  const current = parseInt(currentValue);
  const last = parseInt(lastValue);
  if (isNaN(current) || isNaN(last)) {
    throw new Error('Invalid values');
  }

  const difference = current - last;
  return {
    value: Math.abs(difference),
    sign: difference >= 0 ? '+' : '-'
  };
};

/**
 * 計算年度比較百分比
 * @param {string} currentValue - 當前年度值
 * @param {string} lastValue - 上一年度值
 * @returns {number} 百分比差異
 */
export const calculateAnnualPercentage = (currentValue, lastValue) => {
  const current = parseInt(currentValue);
  const last = parseInt(lastValue);
  if (isNaN(current) || isNaN(last)) {
    throw new Error('Invalid values');
  }

  if (last === 0) return 0;
  return Math.round((Math.abs(current - last) / last) * 100);
}; 