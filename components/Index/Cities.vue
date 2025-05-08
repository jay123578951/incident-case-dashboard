<template>
  <div v-bind="$attrs">
    <IndexCommonPageHeader
      title="事故原因數據統計"
      v-model="selectedDate"
    />

    <section>
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
          <v-img
            max-width="420"
            cover
            src="/images/index/taiwan-statistical-map.png"
          ></v-img>
        </div>
        <div class="w-[56%]">
          <h2 class="text-2xl font-bold mb-4">全國縣市統計</h2>
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

const ListTitle = ref(['原因', '案件數', '救援人數']);

const reasonData = ref([ 
  { name: '新北市', cases: 146, rescued: 250, level: 'high' },
  { name: '台北市', cases: 101, rescued: 130, level: 'high' },
  { name: '台中市', cases: 51, rescued: 58, level: 'high' },
  { name: '台南市', cases: 44, rescued: 50, level: 'high' },
  { name: '高雄市', cases: 23, rescued: 28, level: 'high' },
  { name: '桃園市', cases: 22, rescued: 24, level: 'high' },
  { name: '彰化縣', cases: 21, rescued: 23, level: 'high' },
  { name: '雲林縣', cases: 19, rescued: 21, level: 'mid' },
  { name: '苗栗縣', cases: 18, rescued: 20, level: 'mid' },
  { name: '南投縣', cases: 17, rescued: 19, level: 'mid' },
  { name: '嘉義縣', cases: 16, rescued: 18, level: 'mid' },
  { name: '嘉義市', cases: 15, rescued: 17, level: 'mid' },
  { name: '屏東縣', cases: 14, rescued: 16, level: 'low' }, 
  { name: '宜蘭縣', cases: 13, rescued: 15, level: 'low' },
  { name: '花蓮縣', cases: 12, rescued: 14, level: 'low' },
  { name: '台東縣', cases: 11, rescued: 13, level: 'low' },
  { name: '澎湖縣', cases: 10, rescued: 12, level: 'low' },
  { name: '金門縣', cases: 9, rescued: 11, level: 'low' },
  { name: '連江縣', cases: 8, rescued: 0, level: 'low' },
  { name: '新竹縣', cases: 0, rescued: 0, level: 'none' },
  { name: '新竹市', cases: 0, rescued: 0, level: 'none' },
  { name: '基隆市', cases: 0, rescued: 0, level: 'none' },
]);

const totalCases = computed(() => {
  return reasonData.value.reduce((sum, item) => sum + item.cases, 0);
});

const totalRescued = computed(() => {
  return reasonData.value.reduce((sum, item) => sum + item.rescued, 0);
});

const sortedReasonData = computed(() =>
  [...reasonData.value].sort((a, b) => b.cases - a.cases)
);

const mid = computed(() => Math.ceil(sortedReasonData.value.length / 2));
const leftColumn = computed(() => sortedReasonData.value.slice(0, mid.value));
const rightColumn = computed(() => sortedReasonData.value.slice(mid.value));
</script>
