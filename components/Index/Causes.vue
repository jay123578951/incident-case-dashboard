<template>
  <div v-bind="$attrs">
    <IndexCommonPageHeader
      title="事故原因數據統計"
      v-model="selectedDate"
    />

    <template v-if="reasonData.length === 0">
      <div class="text-center text-[#999]">
        尚無統計資料
      </div>
    </template>
    <template v-else>
      <section class="mb-20">
        <IndexCommonSubtitle title="事故原因前五名" />
        <ul class="grid grid-cols-6 gap-6">
          <li
            v-for="(item, index) of top5Reasons"
            :key="index"
            class="col-span-2 flex items-center justify-between bg-white rounded-xl overflow-hidden pe-5"
            :class="{
              'col-start-2': index === 0
            }"
          >
            <div class="flex items-center gap-x-3">
              <div class="bg-gradient-to-r from-[#64D1BD] to-[#2DBFC6] w-14 aspect-square flex items-center justify-center rounded-br-[20px]">
                <p class="text-[28px] font-bold text-white">{{ index + 1 }}</p>
              </div>
              <p class="text-2xl font-bold text-[#51596B]">{{ item.name }}</p>
            </div>
            <p class="text-lg text-[#51596B]">案件數<span class="text-xl font-bold text-[#E85869] px-1">{{ item.cases }}</span>件</p>
          </li>
        </ul>
      </section>

      <section>
        <IndexCommonSubtitle title="事故原因比例分布" />
        <div class="w-full flex justify-between gap-x-6">
        <div class="w-[44%]">
          <ul class="flex w-fit divide-x divide-dashed bg-white rounded-lg border border-[rgba(28, 32, 46, 0.1)] shadow p-4 mb-10">
            <li class="flex flex-col items-center justify-center pe-4">
              <p class="text-[28px] font-bold mb-1.5">{{ totalCases }}</p>
              <p class="text-lg text-[#666D80]">案件數量</p>
            </li>
            <li class="flex flex-col items-center justify-center ps-4">
              <p class="text-[28px] font-bold mb-1.5">{{ totalRescued }}</p>
              <p class="text-lg text-[#666D80]">救援人數</p>
            </li>
          </ul>
          <DashboardPieChart
            :series="chartSeries"
            :height="'487px'"
            :spacing="0"
            :showBackground="false"
          />
        </div>
        <div class="w-[56%]">
          <IndexCommonStatisticsList
            :list-title="ListTitle"
            :left-column="leftColumn"
            :right-column="rightColumn"
            mode="percent"
          />
        </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup>
const selectedDate = ref({ year: '114', month: '1' });
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

const ListTitle = ref(['原因', '案件數', '佔比%']);
const isLoading = ref(false);
const reasonData = ref([]);

const fetchReasonStats = async (year, month) => {
  try {
    isLoading.value = true;
    const res = await fetch(`/json/total-causes/${year}-${month}.json`);
    const { data } = await res.json();
    reasonData.value = Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('載入事故原因失敗', err);
    reasonData.value = [];
  } finally {
    isLoading.value = false;
  }
};

watch([selectedYear, selectedMonth], ([y, m]) => {
  fetchReasonStats(y, m);
}, { immediate: true });

const totalCases = computed(() => reasonData.value.reduce((sum, item) => sum + item.cases, 0));
const totalRescued = computed(() => reasonData.value.reduce((sum, item) => sum + item.rescued, 0));

const top5Reasons = computed(() => [...reasonData.value].sort((a, b) => b.cases - a.cases).slice(0, 5));

const mergedData = computed(() => {
  const nameToItem = Object.fromEntries(reasonData.value.map(i => [i.name, i]));
  const total = causeCategories.reduce((sum, cat) => sum + (nameToItem[cat.name]?.cases || 0), 0);

  return causeCategories
    .map(cat => {
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
    data: mergedData.value.map(i => ({ name: i.name, y: i.cases, color: i.color }))
  }
]);

const leftColumn = computed(() => mergedData.value.slice(0, 9));
const rightColumn = computed(() => mergedData.value.slice(9, 13));
</script>
