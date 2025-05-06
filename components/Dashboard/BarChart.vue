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
  chart: { type: 'column', animation: true },
  title: { text: props.title },
  xAxis: { categories: props.categories },
  yAxis: { title: { text: props.yAxisTitle } },
  plotOptions: {
    series: { animation: { duration: 500 } },
    column: {
      stacking: 'normal',
      dataLabels: {
        enabled: false
      }
    }
  },
  series: props.series,
  credits: {
    enabled: false
  }
}));
</script>
