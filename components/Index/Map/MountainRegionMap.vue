<template>
</template>

<script setup>
import { useParkBoundaryLayer } from '@/composables/map/visual/useParkBoundaryLayer';

const props = defineProps({
  map: { type: Object, required: true },
  geojson: { type: Object, required: true },
  parkData: { type: Object, default: () => ({}) },
  enableHover: { type: Boolean, default: true },
  enableTooltip: { type: Boolean, default: true }
});

const emit = defineEmits(['select-park']);

const {
  loadParkBoundaries,
  dataByPark,
  resetParkSelection
} = useParkBoundaryLayer(props.map, emit, {
  enableHover: props.enableHover,
  enableTooltip: props.enableTooltip
});

onMounted(() => {
  dataByPark.value = props.parkData;
  loadParkBoundaries(props.geojson);
});

watch(() => props.parkData, (newData) => {
  dataByPark.value = newData;
});

defineExpose({
  resetParkSelection
});
</script>
