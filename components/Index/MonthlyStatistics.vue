<template>
  <div v-bind="$attrs">
    <CommonPageHeader
      title="月統計數據"
      v-model="selectedDate"
    />

    <section>
      <ul class="grid grid-cols-2 gap-6">
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
            v-if="item.type === 'bar'"
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
              <p class="text-2xl font-bold mb-2" :class="item.thisMonth > item.lastMonth ? 'text-[#E85869]' : 'text-[#44BDA7]'">{{ item.comparisonSign }}{{ item.comparisonPercentage }}%</p>
              <p class="text-[#666D80] text-lg text-nowrap">與上個月份比較<span 
                class="px-1.5"
                :class="item.thisMonth > item.lastMonth ? 'text-[#E85869]' : 'text-[#44BDA7]'"
              >{{ item.comparisonDifference }}</span>件</p>
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
              <p class="text-[#666D80] text-lg text-nowrap">與上個月份比較<span 
                class="px-1.5"
                :class="item.comparisonDifference.startsWith('+') ? 'text-[#E85869]' : 'text-[#44BDA7]'"
              >{{ item.comparisonDifference }}</span>件</p>
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

const selectedDate = ref({
  year: '114',
  month: '1'
})

const selectedYear = computed(() => selectedDate.value.year)
const selectedMonth = computed(() => selectedDate.value.month)

const data = ref([
  {
    type: 'bar',
    title: '年度案件數量 (件)',
    icon: 'custom:ic-trending_down',
    thisMonth: '46',
    lastMonth: '58',
  },
  {
    type: 'bar',
    title: '年度案件數量 (件)',
    icon: 'custom:ic-trending_down',
    thisMonth: '2', 
    lastMonth: '3',
  },
  {
    type: 'bar',
    title: '年度案件數量 (件)',
    icon: 'custom:ic-trending_down',
    thisMonth: '192',
    lastMonth: '186',
  },
  {
    type: 'bar',
    title: '年度案件數量 (件)',
    icon: 'custom:ic-trending_down',
    thisMonth: '16',
    lastMonth: '14',
  },
  {
    type: 'text',
    title: '案件量最多縣市 (件)',
    value: '新北市',
    thisMonth: '58',
    lastMonth: '46',
  },
  {
    type: 'text',
    title: '案件量最多山域機關 (件)',
    value: '太魯閣國家公園',
    thisMonth: '58',
    lastMonth: '46',
  }
])

// 使用 computed 屬性來緩存計算結果
const processedData = computed(() => {
  return data.value.map(item => {
    const base = {
      ...item,
      previousMonth: getPreviousMonth(selectedMonth.value),
      comparisonSign: getComparisonSign(item),
      comparisonPercentage: getComparisonPercentage(item),
      comparisonDifference: getComparisonDifference(item)
    };

    if (item.type === 'bar') {
      const widths = calculateWidthPercentages(item);
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
