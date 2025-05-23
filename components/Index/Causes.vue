<template>
  <div v-bind="$attrs">
    <IndexCommonDateHeader title="事故原因數據統計" v-model="selectedDate" />

    <section class="mb-10 lg:mb-20">
      <div class="mb-6 md:mb-5 lg:mb-6">
        <IndexCommonSubtitle :title="`${selectedDate.year}年 事故原因前五名`" />
      </div>

      <template v-if="reasonData.length === 0">
        <div class="text-center text-[#999]">尚無統計資料</div>
      </template>
      <template v-else>
        <ul class="grid grid-cols-1 gap-2.5 lg:grid-cols-6 lg:gap-6">
          <li
            v-for="(item, index) of top5Reasons"
            :key="index"
            class="border-[rgba(0, 0, 0, 0.05)] col-span-1 flex items-center justify-between overflow-hidden rounded-[12px] border bg-white pe-5 shadow-sm lg:col-span-2"
            :class="{
              'lg:col-start-2': index === 0
            }"
          >
            <div class="flex items-center gap-x-3">
              <div
                class="flex aspect-square w-14 items-center justify-center rounded-br-[20px] bg-gradient-to-r from-[#64D1BD] to-[#2DBFC6] py-[9px]"
              >
                <p class="text-2xl font-bold text-white md:text-[28px]">
                  {{ index + 1 }}
                </p>
              </div>
              <p class="text-2xl font-bold text-[#51596B]">{{ item.name }}</p>
            </div>
            <p class="text-lg text-[#51596B]">
              案件數<span class="px-1 text-xl font-bold text-[#E85869]">{{
                item.cases
              }}</span
              >件
            </p>
          </li>
        </ul>
      </template>
    </section>

    <section>
      <div class="mb-6 md:mb-5 lg:mb-6">
        <IndexCommonSubtitle :title="`${selectedDate.year}事 故原因比例分布`" />
      </div>

      <template v-if="reasonData.length === 0">
        <div class="text-center text-[#999]">尚無統計資料</div>
      </template>
      <template v-else>
        <div class="flex w-full flex-col gap-8 lg:flex-row lg:gap-6">
          <div
            class="flex w-full flex-col items-center lg:w-[44%] lg:items-stretch"
          >
            <ul
              class="border-[rgba(28, 32, 46, 0.1)] mb-4 flex w-fit divide-x divide-dashed rounded-lg border bg-white p-4 shadow-sm md:mb-10"
            >
              <li class="flex flex-col items-center justify-center pe-4">
                <p class="mb-0 text-[28px] font-bold md:mb-1.5">
                  {{ totalCases }}
                </p>
                <p class="text-lg text-[#666D80]">案件數量</p>
              </li>
              <li class="flex flex-col items-center justify-center ps-4">
                <p class="mb-0 text-[28px] font-bold md:mb-1.5">
                  {{ totalRescued }}
                </p>
                <p class="text-lg text-[#666D80]">救援人數</p>
              </li>
            </ul>
            <DashboardPieChart
              :series="chartSeries"
              :height="activeBreakpoint === 'sm' ? 'fit-content' : '487px'"
              :width="activeBreakpoint === 'sm' ? '360px' : ''"
              :spacing="0"
              :showBackground="false"
              :showBorder="false"
              :showShadow="false"
            />
          </div>
          <div class="w-full lg:w-[56%]">
            <IndexCommonStatisticsList
              :list-title="ListTitle"
              :left-column="leftColumn"
              :right-column="rightColumn"
              mode="percent"
            />
          </div>
        </div>
      </template>
    </section>
  </div>
</template>

<script setup>
import { useBreakpoints } from '@vueuse/core';

const selectedDate = ref({ year: '113', month: null });
const selectedYear = computed(() => selectedDate.value.year);
const selectedMonth = computed(() => selectedDate.value.month);
const causeCategories = [
  { name: '迷路', color: '#9E96FA' },
  { name: '創傷', color: '#F288BE' },
  { name: '墜谷', color: '#76DBC8' },
  { name: '疾病', color: '#FCD547' },
  { name: '高山症', color: '#ACEB6C' },
  { name: '遲歸(失聯)', color: '#C596FA' },
  { name: '疲勞', color: '#7DA9FA' },
  { name: '天候惡劣', color: '#FA8390' },
  { name: '動物昆蟲攻擊', color: '#62A0CC' },
  { name: '落石', color: '#62A0CC' },
  { name: '落雷', color: '#62A0CC' },
  { name: '不明', color: '#5686CC' },
  { name: '其他', color: '#7CA8E5' }
];
const breakpoints = useBreakpoints({
  sm: 0,
  md: 768,
  lg: 1024
});
const activeBreakpoint = breakpoints.active();

const ListTitle = ref(['原因', '案件數', '佔比%']);
const isLoading = ref(false);
const reasonData = ref([]);

const fetchReasonStats = async (year, month) => {
  try {
    isLoading.value = true;

    const safeMonth = month ?? '00';
    const res = await fetch(`/json/cause-reasons/${year}${safeMonth}.json`);

    const { data } = await res.json();
    reasonData.value = Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('載入事故原因失敗', err);
    reasonData.value = [];
  } finally {
    isLoading.value = false;
  }
};

watch(
  [selectedYear, selectedMonth],
  ([y, m]) => {
    fetchReasonStats(y, m);
  },
  { immediate: true }
);

const totalCases = computed(() =>
  reasonData.value.reduce((sum, item) => sum + item.cases, 0)
);
const totalRescued = computed(() =>
  reasonData.value.reduce((sum, item) => sum + item.rescued, 0)
);

const top5Reasons = computed(() =>
  [...reasonData.value].sort((a, b) => b.cases - a.cases).slice(0, 5)
);

const mergedData = computed(() => {
  const nameToItem = Object.fromEntries(
    reasonData.value.map((i) => [i.name, i])
  );
  const total = causeCategories.reduce(
    (sum, cat) => sum + (nameToItem[cat.name]?.cases || 0),
    0
  );

  return causeCategories
    .map((cat) => {
      const item = nameToItem[cat.name] || {};
      const cases = item.cases || 0;
      return {
        ...cat,
        cases,
        rescued: item.rescued || 0,
        percent: total ? (cases / total) * 100 : 0
      };
    })
    .sort((a, b) => b.cases - a.cases);
});

const chartSeries = computed(() => [
  {
    colorByPoint: false,
    data: mergedData.value.map((i) => ({
      name: i.name,
      y: i.cases,
      color: i.color
    }))
  }
]);

const leftColumn = computed(() =>
  activeBreakpoint.value === 'sm'
    ? mergedData.value
    : mergedData.value.slice(0, 9)
);
const rightColumn = computed(() =>
  activeBreakpoint.value === 'sm' ? [] : mergedData.value.slice(9, 13)
);
</script>
