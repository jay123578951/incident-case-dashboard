export const LayerTypes = Object.freeze({
  MARKER: 'marker',
  CIRCLE: 'circle',
  POLYGON: 'polygon',
  TEMP_MARKER: 'temp_marker'
});

export const MapIcons = Object.freeze({
  FIRE_HYDRANT: {
    ABOVE_GROUND_UNUSED: 'aboveGroundUnused',
    ABOVE_GROUND_GREEN: 'aboveGroundGreen',
    ABOVE_GROUND_YELLOW: 'aboveGroundYellow',
    ABOVE_GROUND_RED: 'aboveGroundRed',
    ABOVE_GROUND_REPAIRING: 'aboveGroundRepairing',
    UNDER_GROUND_UNUSED: 'underGroundUnused'
  },
  WATER_WELL: {
    DEFAULT: 'well'
  },
  DISASTER: {
    LOW: 'disasterLow',
    MEDIUM: 'disasterMedium',
    HIGH: 'disasterHigh'
  },
  TEMP_MARKER: {
    DEFAULT: 'bluePin'
  }
});
