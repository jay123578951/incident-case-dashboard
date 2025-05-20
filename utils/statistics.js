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
 * 獲取上一個年份
 * @param {string|number} year - 當前年份
 * @returns {number} 上一個年份
 */
export const getPreviousYear = (year) => {
  const currentYear = parseInt(year);
  if (isNaN(currentYear) || currentYear < 1) {
    throw new Error('Invalid month value');
  }
  return currentYear - 1;
};

/**
 * 計算比較符號
 * @param {Object} item - 包含 current 和 last 的對象
 * @returns {string} '+' 或 '-'
 */
export const getComparisonSign = (current, last) => {
  const currentNum = parseInt(current);
  const lastNum = parseInt(last);
  if (isNaN(currentNum) || isNaN(lastNum)) {
    throw new Error('Invalid month values');
  }
  return currentNum > lastNum ? '+' : '-';
};

/**
 * 計算百分比差異（保留小數點後兩位）
 * @param {Object} item - 包含 current 和 last 的對象
 * @returns {string} 百分比差異的絕對值
 */
export const getComparisonPercentage = (current, last) => {
  const currentNum = parseFloat(current);
  const lastNum = parseFloat(last);
  if (isNaN(currentNum) || isNaN(lastNum)) {
    throw new Error('Invalid month values');
  }
  if (lastNum === 0) {
    return currentNum === 0 ? '0.00' : '100.00';
  }
  const percent = Math.abs(((currentNum - lastNum) / lastNum) * 100);
  return percent.toFixed(2);
};

/**
 * 計算實際差異數量
 * @param {Object} item - 包含 current 和 last 的對象
 * @returns {string} 帶有符號的實際差異數量
 */
export const getComparisonDifference = (current, last) => {
  const currentNum = parseInt(current);
  const lastNum = parseInt(last);
  if (isNaN(currentNum) || isNaN(lastNum)) {
    throw new Error('Invalid month values');
  }
  const difference = currentNum - lastNum;
  return `${difference >= 0 ? '+' : ''}${difference}`;
};

/**
 * 計算寬度百分比
 * @param {Object} item - 包含 current 和 last 的對象
 * @returns {Object} 包含兩個月份的寬度百分比
 */
export const calculateWidthPercentages = (current, last) => {
  const currentNum = parseInt(current);
  const lastNum = parseInt(last);
  if (isNaN(currentNum) || isNaN(lastNum)) {
    throw new Error('Invalid month values');
  }

  const maxValue = Math.max(currentNum, lastNum);
  const currentPercentage = Math.round(
    Math.max(20, (currentNum / maxValue) * 100)
  );
  const lastPercentage = Math.round(Math.max(20, (lastNum / maxValue) * 100));

  return {
    currentPercentage,
    lastPercentage
  };
};
