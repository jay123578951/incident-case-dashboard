<template>
  <div v-bind="$attrs">
    <IndexCommonPageHeader
      title="各縣市數據統計"
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

          <div class="w-full h-[600px]">
            <ClientOnly>
              <IndexMapTaiwanMap
                ref="mapRef"
                :mpa-data="computedReasonData"
                class="max-w-[420px]"
                @select-county="selectedName = $event"
              />
            </ClientOnly>
          </div>
        </div>
        <div class="w-[56%]">
          <template v-if="!selectedName">
            <h2 class="text-2xl font-bold mb-4">全國縣市統計</h2>
            <IndexCommonStatisticsList
              :list-title="ListTitle"
              :left-column="leftColumn"
              :right-column="rightColumn"
            />
          </template>
          <template v-else>
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-2xl font-bold">{{ selectedName }}數據統計</h2>
              <v-btn
                variant="text"
                size="large"
                prepend-icon="mdi-chevron-left"
                class="!text-[#51596B] !py-1"
                @click="selectedName = null ; resetMap()"
              >
                返回全國縣市
              </v-btn>
            </div>
            <IndexCommonStatisticsList
              :list-title="cityListTitle"
              :left-column="cityLeftColumn"
              :right-column="cityRightColumn"
            />
          </template>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';

defineOptions({
  inheritAttrs: true
})

const mapRef = ref(null);
const selectedDate = ref({
  year: '114',
  month: '1'
})
const selectedYear = computed(() => selectedDate.value.year)
const selectedMonth = computed(() => selectedDate.value.month)
const selectedName = ref(null);

const ListTitle = ref(['原因', '案件數', '救援人數']);

const reasonData = ref([ 
  { name: '新北市', cases: 146, rescued: 250 },
  { name: '台北市', cases: 101, rescued: 130 },
  { name: '台中市', cases: 51, rescued: 58 },
  { name: '台南市', cases: 44, rescued: 50 },
  { name: '高雄市', cases: 23, rescued: 28 },
  { name: '桃園市', cases: 22, rescued: 24 },
  { name: '彰化縣', cases: 21, rescued: 23 },
  { name: '雲林縣', cases: 19, rescued: 21 },
  { name: '苗栗縣', cases: 18, rescued: 20 },
  { name: '南投縣', cases: 17, rescued: 19 },
  { name: '嘉義縣', cases: 16, rescued: 18 },
  { name: '嘉義市', cases: 15, rescued: 17 },
  { name: '屏東縣', cases: 14, rescued: 16 }, 
  { name: '宜蘭縣', cases: 13, rescued: 15 },
  { name: '花蓮縣', cases: 12, rescued: 14 },
  { name: '台東縣', cases: 11, rescued: 13 },
  { name: '澎湖縣', cases: 10, rescued: 12 },
  { name: '金門縣', cases: 9, rescued: 11 },
  { name: '連江縣', cases: 8, rescued: 0 },
  { name: '新竹縣', cases: 0, rescued: 0 },
  { name: '新竹市', cases: 0, rescued: 0 },
  { name: '基隆市', cases: 0, rescued: 0 },
]);

const computedReasonData = computed(() => {
  const data = [...reasonData.value];
  const nonZeroData = data.filter(item => item.cases > 0);
  const sorted = [...nonZeroData].sort((a, b) => b.cases - a.cases);

  const total = sorted.length;
  const highCutoff = Math.floor(total * 0.25);
  const midCutoff = Math.floor(total * 0.5);

  return data.map((item) => {
    if (item.cases === 0) return { ...item, level: 'none' };

    const index = sorted.findIndex(d => d.name === item.name);
    if (index < highCutoff) return { ...item, level: 'high' };
    if (index < midCutoff) return { ...item, level: 'mid' };
    return { ...item, level: 'low' };
  });
});

const totalCases = computed(() => {
  return computedReasonData.value.reduce((sum, item) => sum + item.cases, 0);
});

const totalRescued = computed(() => {
  return computedReasonData.value.reduce((sum, item) => sum + item.rescued, 0);
});

const sortedReasonData = computed(() =>
  [...computedReasonData.value].sort((a, b) => b.cases - a.cases)
);

const mid = computed(() => Math.ceil(sortedReasonData.value.length / 2));
const leftColumn = computed(() => sortedReasonData.value.slice(0, mid.value));
const rightColumn = computed(() => sortedReasonData.value.slice(mid.value));

// 點擊縣市後取得的資料
const cityReasonData = ref([]);
watch(() => selectedName.value, () => {
  cityReasonData.value = [
    { name: '新北市', cases: 199, rescued: 250 },
    { name: '台北市', cases: 101, rescued: 130 },
    { name: '台中市', cases: 51, rescued: 58 },
    { name: '台南市', cases: 44, rescued: 50 },
    { name: '高雄市', cases: 23, rescued: 28 },
    { name: '遲歸(失聯)', cases: 22, rescued: 24 },
    { name: '疲勞', cases: 38, rescued: 40 },
    { name: '天候惡劣', cases: 12, rescued: 20 },
    { name: '動物昆蟲攻擊', cases: 7, rescued: 10 },
    { name: '落石', cases: 3, rescued: 4 },
    { name: '落雷', cases: 0, rescued: 0 },
    { name: '不明', cases: 8, rescued: 9 },
    { name: '其他', cases: 26, rescued: 30 }
  ]
});

const cityCauseCategories = [
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
const cityListTitle = ref(['縣市', '案件數', '救援人數']);

const cityLeftColumn = computed(() => cityReasonData.value.slice(0, 9));
const cityRightColumn = computed(() => cityReasonData.value.slice(9, 13));

const resetMap = () => {
  mapRef.value?.resetCountySelection();
};
</script>
