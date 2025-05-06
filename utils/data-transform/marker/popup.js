/**
 * 生成 Marker Popup 的 HTML 內容
 * @param {Object} props - Marker 的屬性
 * @returns {string} HTML 字串
 */
export function generatePopupHTML(props) {
  if (!props) return `<b>無資料</b>`;

  if (props.id && props.address) return `<b>${props.id} - ${props.address}</b>`;
  if (props.id) return `<b>${props.id}</b>`;
  if (props.address) return `<b>${props.address}</b>`;
  return `<b>無資料</b>`;
}
