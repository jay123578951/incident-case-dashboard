<template>
  <div v-bind="$attrs">
    <IndexCommonPageHeader
      title="各縣市數據統計"
      v-model="selectedDate"
    />

    <section>
      <div v-if="rawData.length === 0" class="text-center text-[#999]">
        尚無統計資料
      </div>

      <div v-else class="w-full flex justify-between gap-x-6">
        <div class="w-[44%]">
          <ul class="flex w-fit divide-x divide-dashed bg-white rounded-lg border border-[rgba(28, 32, 46, 0.1)] shadow p-4 mb-2">
            <li class="flex flex-col items-center justify-center pe-4">
              <p class="text-[28px] font-bold mb-1.5">{{ totalCases }}</p>
              <p class="text-lg text-[#666D80]">案件數量</p>
            </li>
            <li class="flex flex-col items-center justify-center ps-4">
              <p class="text-[28px] font-bold mb-1.5">{{ totalRescued }}</p>
              <p class="text-lg text-[#666D80]">救援人數</p>
            </li>
          </ul>

          <div class="w-full h-[620px]">
            <ClientOnly>
              <IndexMapTaiwanMap
                ref="mapRef"
                :mpa-data="activeReasonData"
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
              show-level-border
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
                @click="resetMap()"
              >
                返回全國縣市
              </v-btn>
            </div>
            <IndexCommonStatisticsList
              :list-title="cityListTitle"
              :left-column="cityLeftColumn"
              :right-column="cityRightColumn"
              mode="percent"
              :loading="isCityLoading"
            />
          </template>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import {
  getPreviousMonth
} from '~/utils/statistics';

defineOptions({ inheritAttrs: true });

const selectedDate = ref({ year: '114', month: '1' });
const selectedYear = computed(() => selectedDate.value.year);
const selectedMonth = computed(() => selectedDate.value.month);

const rawData = ref([]);
const isLoading = ref(false);

const fetchMonthlyStats = async (year, month) => {
  try {
    isLoading.value = true;
    const res = await fetch(`/json/total-cities/nationwide/${year}-${month}.json`);
    const { data } = await res.json();
    rawData.value = Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('載入各縣市數據統計失敗', err);
    rawData.value = [];
  } finally {
    isLoading.value = false;
  }
};

watch([selectedYear, selectedMonth], ([y, m]) => {
  fetchMonthlyStats(y, m);
}, { immediate: true });

const mapRef = ref(null);
const selectedName = ref(null);
const cityReasonData = ref();
const isCityLoading = ref(false);

const ListTitle = ref(['縣市', '案件數', '救援人數']);
const cityListTitle = ref(['原因', '案件數', '佔比']);

const enrichNationwideReasonData = (data) => {
  const totalCases = data.reduce((sum, item) => sum + item.cases, 0);
  const nonZeroData = data.filter(item => item.cases > 0);
  const sorted = [...nonZeroData].sort((a, b) => b.cases - a.cases);

  const total = sorted.length;
  const highCutoff = Math.floor(total * 0.25);
  const midCutoff = Math.floor(total * 0.5);

  return data.map((item) => {
    const base = {
      ...item,
      percent: totalCases ? (item.cases / totalCases) * 100 : 0
    };

    if (item.cases === 0) return { ...base, level: 'none' };

    const index = sorted.findIndex(d => d.name === item.name);
    if (index < highCutoff) return { ...base, level: 'high' };
    if (index < midCutoff) return { ...base, level: 'mid' };
    return { ...base, level: 'low' };
  });
};

const enrichCityReasonData = (data) => {
  if (!Array.isArray(data) || data.length === 0) return [];

  const totalCases = data.reduce((sum, item) => sum + item.cases, 0);
  return data.map((item) => ({
    ...item,
    percent: totalCases ? (item.cases / totalCases) * 100 : 0,
    previousMonth: getPreviousMonth(selectedMonth.value),
  })).sort((a, b) => b.cases - a.cases);
};

const computedReasonData = computed(() => enrichNationwideReasonData(rawData.value));
const computedCityReasonData = computed(() => {
  if (!cityReasonData.value || cityReasonData.value.length === 0) return [];
  return enrichCityReasonData(cityReasonData.value);
});
const activeReasonData = computed(() => selectedName.value ? computedCityReasonData.value : computedReasonData.value);

const totalCases = computed(() => activeReasonData.value.reduce((sum, item) => sum + item.cases, 0));
const totalRescued = computed(() => activeReasonData.value.reduce((sum, item) => sum + item.rescued, 0));

const sortedReasonData = computed(() => [...activeReasonData.value].sort((a, b) => b.cases - a.cases));
const mid = computed(() => Math.ceil(sortedReasonData.value.length / 2));
const leftColumn = computed(() => sortedReasonData.value.slice(0, mid.value));
const rightColumn = computed(() => sortedReasonData.value.slice(mid.value));

const cityLeftColumn = computed(() => computedCityReasonData.value.slice(0, 9));
const cityRightColumn = computed(() => computedCityReasonData.value.slice(9, 13));

watch(selectedName, async (name) => {
  if (!name) return;
  try {
    isCityLoading.value = true;
    const res = await fetch(`/json/total-cities/city/${selectedYear.value}-${selectedMonth.value}/台北市.json`);
    const { data } = await res.json();
    cityReasonData.value = Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('載入城市資料失敗', err);
  } finally {
    isCityLoading.value = false;
  }
});

const resetMap = () => {
  mapRef.value?.resetCountySelection();
  selectedName.value = null;
};
</script>
