<template>
  <div v-bind="$attrs">
    <CommonPageHeader
      title="年統計數據"
      v-model="selectedDate"
      :show-month="false"
    />

    <section class="mb-10">
      <ul class="grid grid-cols-6 gap-6">
        <li
          v-for="(item, index) of processedData"
          :key="index"
          class="bg-white rounded-2xl p-4"
          :class="{
            'col-span-3': item.cols === '3',
            'col-span-2': item.cols === '2'
          }"
        >
          <div class="flex justify-between items-center mb-7">
            <div>
              <p class="text-[#666D80] text-xl font-medium mb-4">{{ item.title }}</p>
              <p class="text-[40px] leading-10 font-bold">{{ item.value }}</p>
            </div>
            <div
              class="p-3.5 rounded-[20px]"
              :style="{ backgroundColor: item.bgColor }"
            >
              <v-icon :icon="item.icon" size="32" :color="item.iconColor" opacity="0.4" viewBox="0 0 32 32"></v-icon>
            </div>
          </div>
          <div class="text-lg text-[#666D80]">
            <p>與113年比較<span class="px-2 text-lg text-[#44BDA7]">{{ item.formattedDifference }}</span>人</p>
          </div>
        </li>
      </ul>
    </section>

    <section>
      <div>
        <DashboardBarChart
          title="案件數與前一年同期比較"
          :yAxisTitle="'案件數 (件)'"
          :categories="months"
          :series="chartSeries"
          :height="'455px'"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { calculateAnnualDifference, calculateAnnualPercentage } from '~/utils/statistics'

defineOptions({
  inheritAttrs: true
})

const selectedDate = ref({
  year: '114',
  month: '1'
})

const selectedYear = computed(() => selectedDate.value.year)
const years = ref(['114', '113'])
const months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']

const uiConfigs = [
  { icon: 'custom:folder', cols: '3', iconColor: '#317E99', bgColor: '#DAF5FE' },
  { icon: 'custom:car', cols: '3', iconColor: '#705800', bgColor: '#FEEFB7' },
  { icon: 'custom:people', cols: '2', iconColor: '#2C9481', bgColor: '#C4F5EB' },
  { icon: 'custom:death', cols: '2', iconColor: '#483EAD', bgColor: '#EAE8FF' },
  { icon: 'custom:person', cols: '2', iconColor: '#51596B', bgColor: '#E9ECF2' }
];

const rawData = ref([
  {
    title: '年度案件數量 (件)',
    value: '95',
    lastYearValue: '664',
  },
  {
    title: '年度案件數量 (件)',
    value: '95',
    lastYearValue: '664',
  },
  {
    title: '年度案件數量 (件)',
    value: '95',
    lastYearValue: '664',
  },
  {
    title: '年度案件數量 (件)',
    value: '95',
    lastYearValue: '664',
  },
  {
    title: '年度案件數量 (件)',
    value: '95',
    lastYearValue: '664',
  },
])

// 處理數據，計算差異和格式化
const processedData = computed(() => {
  return rawData.value.map((item, index) => {
    const difference = calculateAnnualDifference(item.value, item.lastYearValue);
    const config = uiConfigs[index] || {};
    return {
      ...item,
      ...config,
      formattedDifference: `${difference.sign} ${difference.value}`,
      percentage: calculateAnnualPercentage(item.value, item.lastYearValue)
    };
  });
});

// 圖表數據
const chartSeries = computed(() => [
  {
    name: '113',
    data: [3, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55],
    color: '#64D1BD'
  },
  {
    name: '114',
    data: [14, 8, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60],
    color: '#FFB433'
  }
]);
</script>