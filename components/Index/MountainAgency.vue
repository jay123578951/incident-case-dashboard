<template>
  <div v-bind="$attrs">
    <IndexCommonPageHeader
      title="事故原因數據統計"
      v-model="selectedDate"
    />

    <section>
      <div class="w-full flex justify-between">
        <div class="w-5/12">
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
            src="/images/index/taiwan-statistical-map2.png"
          ></v-img>
        </div>
        <div class="w-5/12">
          <h2 class="text-2xl font-bold mb-4">全國山域機關統計</h2>
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
  { name: '玉山國家公園', cases: 64, rescued: 84, level: 'high' },
  { name: '太魯閣國家公園', cases: 59, rescued: 82, level: 'high' },
  { name: '雪霸國家公園', cases: 51, rescued: 64, level: 'mid' },
  { name: '陽明山國家公園', cases: 35, rescued: 46, level: 'low' },
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

const leftColumn = computed(() => sortedReasonData.value);
const rightColumn = computed(() => []);
</script>
