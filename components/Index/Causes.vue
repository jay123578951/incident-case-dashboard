<template>
  <div v-bind="$attrs">
    <IndexCommonPageHeader
      title="事故原因數據統計"
      v-model="selectedDate"
    />

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
          <div>
            <DashboardPieChart
              :series="chartSeries"
              :height="'487px'"
              :spacing="0"
              :showBackground="false"
            />
          </div>
        </div>
        <div class="w-[56%]">
          <IndexCommonStatisticsList
            :list-title="ListTitle"
            :left-column="leftColumn"
            :right-column="rightColumn"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
defineOptions({
  inheritAttrs: true
})

const selectedDate = ref({
  year: '114',
  month: '1'
})

const selectedYear = computed(() => selectedDate.value.year)
const selectedMonth = computed(() => selectedDate.value.month)

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

const reasonData = ref([
  { name: '迷路', cases: 199, rescued: 250 },
  { name: '創傷', cases: 101, rescued: 130 },
  { name: '墜谷', cases: 51, rescued: 58 },
  { name: '疾病', cases: 44, rescued: 50 },
  { name: '高山症', cases: 23, rescued: 28 },
  { name: '遲歸(失聯)', cases: 22, rescued: 24 },
  { name: '疲勞', cases: 38, rescued: 40 },
  { name: '天候惡劣', cases: 12, rescued: 20 },
  { name: '動物昆蟲攻擊', cases: 7, rescued: 10 },
  { name: '落石', cases: 3, rescued: 4 },
  { name: '落雷', cases: 0, rescued: 0 },
  { name: '不明', cases: 8, rescued: 9 },
  { name: '其他', cases: 26, rescued: 30 }
]);

const totalCases = computed(() => {
  return reasonData.value.reduce((sum, item) => sum + item.cases, 0);
});

const totalRescued = computed(() => {
  return reasonData.value.reduce((sum, item) => sum + item.rescued, 0);
});

const top5Reasons = computed(() => {
  return [...reasonData.value]
    .sort((a, b) => b.cases - a.cases)
    .slice(0, 5);
});

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
        percent: total ? (cases / total) * 100 : 0,
        ...(item.level !== undefined ? { level: item.level } : {})
      };
    })
    .sort((a, b) => b.cases - a.cases);
});

const chartSeries = computed(() => [
  {
    colorByPoint: false,
    data: mergedData.value.map(i => ({
      name: i.name,
      y: i.cases,
      color: i.color
    }))
  }
]);

const leftColumn = computed(() => mergedData.value.slice(0, 9));
const rightColumn = computed(() => mergedData.value.slice(9, 13));
</script>
