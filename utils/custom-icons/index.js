import { h } from 'vue';
import customSvgNameToComponent from './register';

export default {
  component: (props) => {
    const component = customSvgNameToComponent[props.icon];
    if (!component) {
      console.warn(`[CustomIcon] "${props.icon}" not found`);
      return null;
    }
    return h(component, props); // 可以吃到傳進來的 class、style、size 等
  }
};
