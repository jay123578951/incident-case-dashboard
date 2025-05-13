<template>
  <div class="relative">
    <div
      v-if="loading"
      class="absolute inset-0 z-10 flex items-center justify-center"
    >
      <span class="text-gray-600">Loading chart...</span>
    </div>
    <div
      ref="chartRef"
      class="w-full rounded-2xl"
      :class="{
        'border border-[rgba(0, 0, 0, 0.05)]': props.showBorder,
        'shadow-sm': props.showShadow
      }"
      :style="{ height: props.height }"
    ></div>
  </div>
</template>

<script setup>
import Highcharts from 'highcharts';

const props = defineProps({
  options: { type: Object, required: true },
  height: { type: String, default: '24rem' },
  showLoadingBackground: { type: Boolean, default: true },
  showBorder: { type: Boolean, default: false },
  showShadow: { type: Boolean, default: false }
});

const chartRef = ref(null);
const chartInstance = ref(null);
const loading = ref(true);

const renderChart = () => {
  loading.value = true;

  nextTick(() => {
    if (chartRef.value) {
      if (chartInstance.value) {
        chartInstance.value.destroy();
      }

      const chartOptions = {
        ...props.options,
        accessibility: {
          enabled: false
        }
      };

      chartInstance.value = Highcharts.chart(
        chartRef.value,
        chartOptions,
        () => {
          loading.value = false;
        }
      );
    }
  });
};

const handleResize = () => {
  chartInstance.value?.reflow();
};

onMounted(() => {
  renderChart();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  chartInstance.value?.destroy();
});

watch(
  () => props.options,
  () => {
    renderChart();
  },
  { deep: true }
);
</script>
