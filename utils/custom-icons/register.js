import { h } from 'vue';
import fireHydrant from './assets/fireHydrant/fire-hydrant';
import aboveGroundUnused from './assets/fireHydrant/above-ground-unused';
import underGroundUnused from './assets/fireHydrant/under-ground-unused';

import folder from './assets/dashboard/folder';
import car from './assets/dashboard/car';
import people from './assets/dashboard/people';
import death from './assets/dashboard/death';
import person from './assets/dashboard/person';
import icTrendingDown from './assets/dashboard/ic-trending_down';
import icTrendingUp from './assets/dashboard/ic-trending_up';

// 所有 icon 名與 SVG 對應
const svgContents = {
  'fire-hydrant': fireHydrant,
  'above-ground-unused': aboveGroundUnused,
  'under-ground-unused': underGroundUnused,

  'folder': folder,
  'car': car,
  'ic-trending_down': icTrendingDown,
  'ic-trending_up': icTrendingUp,
  'people': people,
  'death': death,
  'person': person,
};

// 產生每個 icon 的 Vue component
const createIconComponent = (svgContent) => ({
  props: {
    color: {
      type: String,
      default: 'currentColor'
    },
    size: {
      type: String,
      default: '24'
    },
    opacity: {
      type: String,
      default: 'currentOpacity'
    },
    viewBox: {
      type: String,
      default: '0 0 24 24'
    }
  },
  render() {
    return h('svg', {
      width: this.size,
      height: this.size,
      viewBox: this.viewBox,
      fill: 'none',
      xmlns: 'http://www.w3.org/2000/svg',
      style: {
        color: this.color,
        opacity: this.opacity
      },
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
