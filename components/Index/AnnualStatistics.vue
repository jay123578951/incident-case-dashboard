<template>
  <div v-bind="$attrs">
    <CommonPageHeader
      title="年統計數據"
      v-model="selectedDate"
      :show-month="false"
    />

    <section class="mb-10">
      <ul class="grid grid-cols-6 gap-6">
        <li v-if="processedData.length === 0" class="col-span-6 text-center text-[#999]">
          尚無統計資料
        </li>
        <li
          v-else
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
            <p>與{{ stats?.previousYear }}年比較
              <span
                v-if="item.formattedDifference"
                class="px-2 text-lg"
                :class="{
                  'text-[#E85869]': item.sign === '+',
                  'text-[#44BDA7]': item.sign === '-'
                }"
              >
                {{ item.formattedDifference }}
              </span>
              人</p>
          </div>
        </li>
      </ul>
    </section>

    <section>
      <DashboardBarChart
        v-if="chartSeries.length > 0"
        title="案件數與前一年同期比較"
        :yAxisTitle="'案件數 (件)'"
        :categories="months"
        :series="chartSeries"
        :height="'455px'"
      />
    </section>
  </div>
</template>

<script setup>
import { getProcessedStatCards } from '~/utils/statistics'

defineOptions({
  inheritAttrs: true
})

const isLoading = ref(false);
const fetchError = ref(null);

const selectedDate = ref({ year: '114', month: '1' });
const selectedYear = computed(() => selectedDate.value.year);
const months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

const statCardUIConfigs = [
  { icon: 'custom:folder', cols: '3', iconColor: '#317E99', bgColor: '#DAF5FE' },
  { icon: 'custom:car', cols: '3', iconColor: '#705800', bgColor: '#FEEFB7' },
  { icon: 'custom:people', cols: '2', iconColor: '#2C9481', bgColor: '#C4F5EB' },
  { icon: 'custom:death', cols: '2', iconColor: '#483EAD', bgColor: '#EAE8FF' },
  { icon: 'custom:person', cols: '2', iconColor: '#51596B', bgColor: '#E9ECF2' }
];

const stats = ref(null);
const processedData = computed(() =>
  getProcessedStatCards(stats.value?.summary || [], statCardUIConfigs)
);

const selectedType = ref('cases');
const chartSeries = computed(() => {
  const breakdown = stats.value?.monthlyBreakdown?.[selectedType.value];
  if (!breakdown) return [];

  return [
    {
      name: stats.value.previousYear,
      data: breakdown[stats.value.previousYear],
      color: '#64D1BD'
    },
    {
      name: stats.value.year,
      data: breakdown[stats.value.year],
      color: '#FFB433'
    }
  ];
});

const fetchStats = async (year) => {
  try {
    isLoading.value = true;
    // const res = await fetch(`/json/response-data.json?year=${year}`);
    const res = await fetch(`/json/total-annual-statistics/${year}.json`);
    const data = await res.json();
    await new Promise(resolve => setTimeout(resolve, 500));
    stats.value = data;
  } catch (err) {
    fetchError.value = err;
    console.error('載入年度統計失敗:', err);
  } finally {
    isLoading.value = false;
  }
};

watch(selectedYear, (year) => {
  fetchStats(year);
}, { immediate: true });
</script>