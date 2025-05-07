import { h } from 'vue';
import fireHydrant from './assets/fireHydrant/fire-hydrant';
import aboveGroundUnused from './assets/fireHydrant/above-ground-unused';
import underGroundUnused from './assets/fireHydrant/under-ground-unused';

import folder from './assets/dashboard/folder';
import icTrendingDown from './assets/dashboard/ic-trending_down';
import icTrendingUp from './assets/dashboard/ic-trending_up';

// 所有 icon 名與 SVG 對應
const svgContents = {
  'fire-hydrant': fireHydrant,
  'above-ground-unused': aboveGroundUnused,
  'under-ground-unused': underGroundUnused,

  'folder': folder,
  'ic-trending_down': icTrendingDown,
  'ic-trending_up': icTrendingUp,
};

// 產生每個 icon 的 Vue component
const createIconComponent = (svgContent) => ({
  render() {
    return h('svg', {
      width: '24',
      height: '24',
      viewBox: '0 0 24 24',
      fill: 'none',
      xmlns: 'http://www.w3.org/2000/svg',
      innerHTML: svgContent
    });
  }
});

// 轉換成可用 icon component map
const customSvgNameToComponent = Object.entries(svgContents).reduce(
  (acc, [name, content]) => {
    acc[name] = createIconComponent(content);
    return acc;
  },
  {}
);

export default customSvgNameToComponent;
