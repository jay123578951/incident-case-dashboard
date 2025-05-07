<template>
  <BaseChart
    :options="chartOptions"
    :height="height"
    :showBackground="showBackground"
  />
</template>

<script setup>
import BaseChart from './BaseChart.vue';

const props = defineProps({
  title: String,
  categories: Array,
  series: Array,
  yAxisTitle: String,
  height: String,
  showBackground: { type: Boolean, default: true }
});

const chartOptions = computed(() => ({
  chart: {
    type: 'line',
    animation: true,
    backgroundColor: props.showBackground ? 'white' : 'transparent',
  },
  title: { text: props.title },
  xAxis: { categories: props.categories },
  yAxis: { title: { text: props.yAxisTitle } },
  plotOptions: {
    series: { animation: { duration: 500 } }
  },
  series: props.series,
  credits: {
    enabled: false
  }
}));
</script>
