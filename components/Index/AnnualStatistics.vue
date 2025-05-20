<template>
  <div v-bind="$attrs">
    <IndexCommonDateHeader
      title="年統計數據"
      v-model="selectedDate"
      :show-month="false"
    />

    <div v-if="selectedYear === dataStartYear" class="mb-4">
      <IndexCommonAlert :data-start-year="dataStartYear" />
    </div>

    <section class="mb-4 md:mb-6 lg:mb-10">
      <ul class="grid grid-cols-1 md:grid-cols-6 gap-2 md:gap-4 lg:gap-6">
        <li v-if="processedData.length === 0" class="col-span-6 text-center text-[#999]">
          尚無統計資料
        </li>
        <li
          v-else
          v-for="(item, index) of processedData"
          :key="index"
          class="bg-white rounded-2xl p-4 border border-[rgba(0, 0, 0, 0.05)] shadow-sm"
          :class="{
            'col-span-3': item.cols === '3',
            'col-span-2': item.cols === '2'
          }"
        >
          <div class="flex justify-between items-center mb-5 lg:mb-7">
            <div>
              <p class="text-[#666D80] text-[18px] lg:text-xl font-medium mb-[10px] lg:mb-4">{{ item.title }}</p>
              <AutoCounter
                ref="counters"
                :startAmount="0"
                :endAmount="item.thisYear"
                :duration="1.2"
                :autoinit="false"
                separator=","
                class="text-[32px] lg:text-[40px] leading-10 font-bold"
              />
            </div>
            <div
              class="p-3.5 rounded-[20px]"
              :style="{ backgroundColor: item.bgColor }"
            >
              <v-icon :icon="item.icon" size="32" :color="item.iconColor" opacity="0.4" viewBox="0 0 32 32"></v-icon>
            </div>
          </div>
          <div class="text-base lg:text-lg text-[#666D80]">
            <p>與{{ rawData?.previousYear }}年比較
              <span
                v-if="item.formattedDifference"
                class="px-2"
                :class="{
                  'text-[#E85869]': item.sign === '+',
                  'text-[#44BDA7]': item.sign === '-'
                }"
              >
                {{ item.formattedDifference }}
              </span>
              <span v-if="index === 0">件</span>
              <span v-else>人</span>
            </p>
          </div>
        </li>
      </ul>
    </section>

    <section>
      <DashboardBarChart
        v-if="chartSeries.length > 0"
        title="案件數與前一年同期比較"
        :yAxisTitle="activeBreakpoint === 'sm' ? '' : '案件數 (件)'"
        :categories="categories"
        :series="chartSeries"
        :height="'455px'"
        :showBorder="true"
        :showShadow="true"
      />
    </section>
  </div>
</template>

<script setup>
import { useBreakpoints } from '@vueuse/core'
import AutoCounter from 'vue3-autocounter'

defineOptions({
  inheritAttrs: true
})

import {
  getComparisonSign,
  getComparisonDifference,
  getComparisonPercentage,
} from '~/utils/statistics';

const isLoading = ref(false);
const fetchError = ref(null);

const selectedDate = ref({ year: '113', month: '1' });
const selectedYear = computed(() => selectedDate.value.year);
const dataStartYear = '111';
const counters = ref([])

const categories = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
const statCardUIConfigs = [
  { icon: 'custom:folder', cols: '3', iconColor: '#317E99', bgColor: '#DAF5FE' },
  { icon: 'custom:car', cols: '3', iconColor: '#705800', bgColor: '#FEEFB7' },
  { icon: 'custom:people', cols: '2', iconColor: '#2C9481', bgColor: '#C4F5EB' },
  { icon: 'custom:death', cols: '2', iconColor: '#483EAD', bgColor: '#EAE8FF' },
  { icon: 'custom:person', cols: '2', iconColor: '#51596B', bgColor: '#E9ECF2' }
];
const breakpoints = useBreakpoints({
  sm: 0,
  md: 768,
  lg: 1024
})
const activeBreakpoint = breakpoints.active()

const rawData = ref(null);
const selectedType = ref('cases');

const chartSeries = computed(() => {
  const breakdown = rawData.value?.monthlyBreakdown?.[selectedType.value];
  if (!breakdown) return [];

  return [
    {
      name: rawData.value.previousYear,
      data: breakdown[rawData.value.previousYear],
      color: '#64D1BD'
    },
    {
      name: rawData.value.year,
      data: breakdown[rawData.value.year],
      color: '#FFB433'
    }
  ];
});

const fetchStats = async (year) => {
  try {
    isLoading.value = true;
    const res = await fetch(`/json/yearly-summary/${year}.json`);
    const data = await res.json();

    rawData.value = data;
  } catch (err) {
    fetchError.value = err;
    console.error('載入年度統計失敗:', err);
  } finally {
    isLoading.value = false;
  }
};

const processedData = computed(() => {
  const summary = rawData.value?.summary || [];

  return summary.map((item, index) => {
    const config = statCardUIConfigs[index] || {};

    return {
      ...item,
      ...config,
      sign: getComparisonSign(item.thisYear, item.lastYear),
      formattedDifference: getComparisonDifference(item.thisYear, item.lastYear),
      percentage: getComparisonPercentage(item.thisYear, item.lastYear)
    };
  });
});

const startCounters = async () => {
  await nextTick();
  counters.value.forEach(counter => counter?.start?.());
};

watch(selectedYear, async (year) => {
  await fetchStats(year);
  await startCounters();
}, { immediate: true });

</script>