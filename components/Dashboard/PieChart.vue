<template>
  <BaseChart
    :options="chartOptions"
    :height="height"
    :width="width"
    :showBorder="showBorder"
  />
</template>

<script setup>
import { useBreakpoints } from '@vueuse/core'
import BaseChart from './BaseChart.vue';

const props = defineProps({
  title: String,
  categories: Array,
  series: Array,
  yAxisTitle: String,
  height: String,
  width: String,
  spacing: { type: Number, default: 30 },
  showBackground: { type: Boolean, default: true },
  showBorder: { type: Boolean, default: true },
  showShadow: { type: Boolean, default: true }
});
const breakpoints = useBreakpoints({
  sm: 0,
  md: 768,
  lg: 1024
})
const activeBreakpoint = breakpoints.active()

const chartOptions = computed(() => ({
  chart: {
    type: 'pie',
    animation: true,
    backgroundColor: props.showBackground ? 'white' : 'transparent',
    spacing: props.spacing,
  },
  title: { 
    text: props.title, 
    style: { 
      fontSize: '24px', 
      fontWeight: 'bold'
    },
  },
  plotOptions: {
    series: { animation: { duration: 500 } },
    pie: {
      allowPointSelect: true,
      borderWidth: 1,
      cursor: 'pointer',
      dataLabels: {
        enabled: true,
        format: '<b>{point.name}</b><br>{point.percentage:.2f}%',
        distance: activeBreakpoint.value === 'sm' ? 0 : 20,
        style: {
          color: '#51596B'
        }
      },
      showInLegend: true
    }
  },
  series: props.series,
  credits: {
    enabled: false
  }
}));
</script> 