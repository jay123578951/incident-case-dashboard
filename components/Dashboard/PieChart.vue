<template>
  <BaseChart
    :options="chartOptions"
    :height="height"
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
  spacing: { type: Number, default: 30 },
  showBackground: { type: Boolean, default: true }
});

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
    margin: 20,
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
        distance: 46,
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