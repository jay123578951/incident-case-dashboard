<template>
  <div v-bind="$attrs">
    <CommonPageHeader
      title="月統計數據"
      v-model="selectedDate"
    />

    <section>
      <ul class="grid grid-cols-2 gap-6">
        <li v-if="processedData.length === 0" class="col-span-6 text-center text-[#999]">
          尚無統計資料
        </li>
        <li
          v-for="(item, index) of processedData"
          :key="index"
          class="bg-white rounded-2xl p-4"
        >
          <div class="flex items-top justify-between mb-3">
            <div class="flex items-center gap-x-2">
              <div class="w-1.5 h-6 bg-[#67C0E0] rounded-full"></div>
              <p class="text-xl font-medium text-[#666D80]">{{ item.title }}</p>
            </div>
            <div
              v-if="item.type === 'bar'
              "
              class="p-2.5 rounded-lg"
              :class="item.thisMonth > item.lastMonth ? 'bg-[#FFD4D8]' : 'bg-[#C4F5EB]'"
            >
              <v-icon :icon="item.thisMonth > item.lastMonth ? 'custom:ic-trending_up' : 'custom:ic-trending_down'" size="24"></v-icon>
            </div>
          </div>
          <template v-if="item.type === 'bar'">
            <div class="flex items-end justify-between grid grid-cols-2 gap-x-2">
              <div class="grid gap-y-2.5 w-full text-lg font-bold leading-5">
                <div 
                  class="flex items-center justify-between rounded-md py-1.5 px-2.5 width-transition"
                  :class="item.thisMonth > item.lastMonth ? 'text-[#A81B2B] bg-[#FFD4D8]' : 'text-[#227A69] bg-[#C4F5EB]'"
                  :style="{ width: item.thisMonthWidth }"
                >
                  <p>{{ selectedMonth }}月</p>
                  <p>{{ item.thisMonth }}</p>
                </div>
                <div 
                  class="flex items-center justify-between text-[#666D80] bg-[#E9ECF2] rounded-md py-1.5 px-2.5 width-transition"
                  :style="{ width: item.lastMonthWidth }"
                >
                  <p>{{ item.previousMonth }}月</p>
                  <p>{{ item.lastMonth }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-2xl font-bold mb-2" :class="item.comparisonSign === '+' ? 'text-[#E85869]' : 'text-[#44BDA7]'">
                  {{ item.comparisonSign }}{{ item.comparisonPercentage }}%
                </p>
                <p class="text-[#666D80] text-lg text-nowrap">
                  與上個月份比較
                  <span class="px-1.5" :class="item.comparisonSign === '+' ? 'text-[#E85869]' : 'text-[#44BDA7]'">
                    {{ item.comparisonDifference }}
                  </span>件
                </p>
              </div>
            </div>
          </template>

          <template v-if="item.type === 'text'">
            <div class="flex items-center justify-between grid grid-cols-2 gap-x-2">
              <div class="w-full text-[28px] text-[#1C202E] font-bold">
                <p>{{ item.value }}</p>
              </div>
              <div class="text-right">
                <p class="text-[#1C202E] text-2xl font-bold mb-2">{{ item.thisMonth }}</p>
                <p class="text-[#666D80] text-lg text-nowrap">
                  與上個月份比較
                  <span class="px-1.5" :class="item.comparisonSign === '+' ? 'text-[#E85869]' : 'text-[#44BDA7]'">
                    {{ item.comparisonDifference }}
                  </span>件
                </p>
              </div>
            </div>
          </template>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { 
  getPreviousMonth, 
  getComparisonSign, 
  getComparisonPercentage, 
  getComparisonDifference,
  calculateWidthPercentages 
} from '~/utils/statistics';

defineOptions({
  inheritAttrs: true
})

const selectedDate = ref({ year: '114', month: '1' });
const selectedYear = computed(() => selectedDate.value.year);
const selectedMonth = computed(() => selectedDate.value.month);

const rawData = ref([]);
const isLoading = ref(false);

const fetchMonthlyStats = async (year, month) => {
  try {
    isLoading.value = true;
    const res = await fetch(`/json/total-monthly-statistics/${year}-${month}.json`);
    const data = await res.json();
    // rawData.value = data[year][month].statistics || [];
    rawData.value = data.statistics || [];
  } catch (err) {
    console.error('載入事故原因數據統計失敗', err);
    rawData.value = [];
  } finally {
    isLoading.value = false;
  }
};

watch([selectedYear, selectedMonth], ([y, m]) => {
  fetchMonthlyStats(y, m);
}, { immediate: true });

const processedData = computed(() => {
  return rawData.value.map((item) => {
    const base = {
      ...item,
      previousMonth: getPreviousMonth(selectedMonth.value),
      comparisonSign: getComparisonSign(item.thisMonth, item.lastMonth),
      comparisonPercentage: getComparisonPercentage(item.thisMonth, item.lastMonth),
      comparisonDifference: getComparisonDifference(item.thisMonth, item.lastMonth)
    };

    if (item.type === 'bar') {
      const widths = calculateWidthPercentages(item.thisMonth, item.lastMonth);
      return {
        ...base,
        thisMonthWidth: `${widths.thisMonthPercentage}%`,
        lastMonthWidth: `${widths.lastMonthPercentage}%`
      };
    }

    return base;
  });
});
</script>

<style scoped>
.width-transition {
  transition: width 0.3s ease;
  flex-shrink: 0;
}
</style>
