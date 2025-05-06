<template>
  <BaseChart :options="chartOptions" />
</template>

<script setup>
import BaseChart from './BaseChart.vue';

const props = defineProps({
  title: String,
  categories: Array,
  series: Array,
  yAxisTitle: String
});

const chartOptions = computed(() => ({
  chart: { type: 'line', animation: true },
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
