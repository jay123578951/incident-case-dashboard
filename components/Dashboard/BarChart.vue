<template>
  <BaseChart
    :options="chartOptions"
    :height="height"
    :showBackground="showBackground"
  />
</template>

<script setup>
import { useBreakpoints } from '@vueuse/core';
import BaseChart from './BaseChart.vue';

const breakpoints = useBreakpoints({
  sm: 0,
  md: 768,
  lg: 1024
});
const activeBreakpoint = breakpoints.active();

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
    type: 'column',
    animation: true,
    backgroundColor: props.showBackground ? 'white' : 'transparent',
    spacing: activeBreakpoint.value === 'sm' ? 16 : 30,
    spacingTop: activeBreakpoint.value === 'sm' ? 24 : 30
  },
  title: {
    text: props.title,
    style: {
      fontSize: '24px',
      fontWeight: 'bold'
    },
    margin: activeBreakpoint.value === 'sm' ? 24 : 20
  },
  xAxis: { categories: props.categories },
  yAxis: { title: { text: props.yAxisTitle } },
  plotOptions: {
    series: { animation: { duration: 500 } },
    column: {
      stacking: activeBreakpoint.value === 'sm' ? 'normal' : '',
      grouping: activeBreakpoint.value === 'sm' ? false : true,
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
