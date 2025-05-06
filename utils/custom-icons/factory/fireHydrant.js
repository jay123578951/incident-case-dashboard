import { MapIcons } from '@/utils/constants/mapIcons';

export function createFireHydrantIcon(props = {}) {
  let iconKey = null;

  if (props.type === '地上式單口式') {
    iconKey = MapIcons.FIRE_HYDRANT.ABOVE_GROUND_UNUSED;
  } else {
    iconKey = MapIcons.FIRE_HYDRANT.UNDER_GROUND_UNUSED;
  }

  return L.icon({
    iconUrl: `/images/icon/fireHydrant/${iconKey}.svg`,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -19]
  });
}
