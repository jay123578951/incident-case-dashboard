<template>
  <div v-bind="$attrs">
    <IndexCommonDateHeader
      ref="dateHeaderRef"
      title="各縣市數據統計"
      v-model="selectedDate"
    />

    <section>
      <div v-if="rawData.length === 0" class="text-center text-[#999]">
        尚無統計資料
      </div>

      <div v-else class="flex w-full flex-col gap-8 lg:flex-row lg:gap-6">
        <div
          class="flex w-full flex-col items-center lg:w-[44%] lg:items-stretch"
        >
          <ul
            class="border-[rgba(28, 32, 46, 0.1)] mb-2 flex w-fit divide-x divide-dashed rounded-lg border bg-white p-4 shadow"
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

          <div class="flex h-[620px] w-full justify-center lg:justify-start">
            <ClientOnly>
              <IndexMapTaiwanMap
                ref="citiesMapRef"
                :map-data="activeReasonData"
                class="max-w-[420px]"
                @select-county="selectedName = $event"
              />
            </ClientOnly>
          </div>
        </div>
        <div class="w-full lg:w-[56%]">
          <template v-if="!selectedName">
            <h2 class="mb-4 text-2xl font-bold">
              {{ selectedDate.year }}年{{ selectedMonthName }} 全國縣市統計
            </h2>
            <IndexCommonStatisticsList
              :list-title="ListTitle"
              :left-column="leftColumn"
              :right-column="rightColumn"
              show-level-border
            />
          </template>
          <template v-else>
            <div class="mb-4 flex items-center justify-between">
              <h2 class="text-2xl font-bold">
                {{ selectedDate.year }}年{{ selectedMonthName }}
                {{ selectedName }}統計
              </h2>
              <v-btn
                variant="text"
                size="large"
                prepend-icon="mdi-chevron-left"
                class="!py-1 !text-[#51596B]"
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
import { useBreakpoints } from '@vueuse/core';
import { getPreviousMonth } from '~/utils/statistics';

defineOptions({ inheritAttrs: true });

const dateHeaderRef = ref(null);
const selectedDate = ref({ year: '113', month: null });
const selectedYear = computed(() => selectedDate.value.year);
const selectedMonth = computed(() => selectedDate.value.month);
const selectedMonthName = computed(() => getMonthName(selectedMonth.value));
const getMonthName = (month) => {
  const monthNames = [
    '1月',
    '2月',
    '3月',
    '4月',
    '5月',
    '6月',
    '7月',
    '8月',
    '9月',
    '10月',
    '11月',
    '12月'
  ];
  return monthNames[month - 1];
};
const breakpoints = useBreakpoints({
  sm: 0,
  md: 768,
  lg: 1024
});
const activeBreakpoint = breakpoints.active();

const rawData = ref([]);
const isLoading = ref(false);

const fetchMonthlyStats = async (year, month) => {
  try {
    isLoading.value = true;

    const safeMonth = month ?? '00';
    const res = await fetch(`/json/cities-summary/${year}${safeMonth}.json`);
    const { data } = await res.json();
    rawData.value = Array.isArray(data) ? data : [];

    // 同步更新地圖樣式
    const countyData = transformToCountyData(rawData.value);
    if (citiesMapRef.value?.countyBoundary) {
      selectedName.value = null;
      citiesMapRef.value.countyBoundary.dataByCounty.value = countyData;
      citiesMapRef.value.countyBoundary.updateAllCountyStyles();
    }
  } catch (err) {
    console.error('載入各縣市數據統計失敗', err);
    rawData.value = [];
  } finally {
    isLoading.value = false;
  }
};

watch(
  [selectedYear, selectedMonth],
  async ([y, m]) => {
    if (dateHeaderRef.value) {
      dateHeaderRef.value.closeSelect();
    }

    await new Promise((resolve) => setTimeout(resolve, 250));

    await fetchMonthlyStats(y, m);
    if (citiesMapRef.value?.reloadGeoJSON) {
      await citiesMapRef.value.reloadGeoJSON();
    }
  },
  { immediate: true }
);

const citiesMapRef = ref(null);
const selectedName = ref(null);
const cityReasonData = ref();
const isCityLoading = ref(false);

const ListTitle = ref(['縣市', '案件數', '救援人數']);
const cityListTitle = ref(['原因', '案件數', '佔比']);

const enrichNationwideReasonData = (data) => {
  const totalCases = data.reduce((sum, item) => sum + item.cases, 0);
  const nonZeroData = data.filter((item) => item.cases > 0);
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

    const index = sorted.findIndex((d) => d.name === item.name);
    if (index < highCutoff) return { ...base, level: 'high' };
    if (index < midCutoff) return { ...base, level: 'mid' };
    return { ...base, level: 'low' };
  });
};

const previousMonth = computed(() => {
  return selectedMonth.value ? getPreviousMonth(selectedMonth.value) : null;
});

const enrichCityReasonData = (data) => {
  if (!Array.isArray(data) || data.length === 0) return [];

  const totalCases = data.reduce((sum, item) => sum + item.cases, 0);
  return data
    .map((item) => ({
      ...item,
      percent: totalCases ? (item.cases / totalCases) * 100 : 0,
      previousMonth: previousMonth.value
    }))
    .sort((a, b) => b.cases - a.cases);
};

const computedReasonData = computed(() =>
  enrichNationwideReasonData(rawData.value)
);
const computedCityReasonData = computed(() => {
  if (!cityReasonData.value || cityReasonData.value.length === 0) return [];
  return enrichCityReasonData(cityReasonData.value);
});
const activeReasonData = computed(() =>
  selectedName.value ? computedCityReasonData.value : computedReasonData.value
);

const totalCases = computed(() =>
  activeReasonData.value.reduce((sum, item) => sum + item.cases, 0)
);
const totalRescued = computed(() =>
  activeReasonData.value.reduce((sum, item) => sum + item.rescued, 0)
);

const sortedReasonData = computed(() =>
  [...activeReasonData.value].sort((a, b) => b.cases - a.cases)
);
const mid = computed(() => Math.ceil(sortedReasonData.value.length / 2));
const leftColumn = computed(() =>
  activeBreakpoint.value === 'sm'
    ? sortedReasonData.value
    : sortedReasonData.value.slice(0, mid.value)
);
const rightColumn = computed(() =>
  activeBreakpoint.value === 'sm' ? [] : sortedReasonData.value.slice(mid.value)
);

const cityLeftColumn = computed(() =>
  activeBreakpoint.value === 'sm'
    ? computedCityReasonData.value
    : computedCityReasonData.value.slice(0, 9)
);
const cityRightColumn = computed(() =>
  activeBreakpoint.value === 'sm'
    ? []
    : computedCityReasonData.value.slice(9, 13)
);

watch(selectedName, async (name) => {
  if (!name) return;
  try {
    isCityLoading.value = true;

    const encodedName = encodeURIComponent(name);
    const url = `/json/city-reasons/${selectedYear.value}00${encodedName}.json`;
    const res = await fetch(url);
    const { data } = await res.json();
    cityReasonData.value = Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('載入城市資料失敗', err.message);
  } finally {
    isCityLoading.value = false;
  }
});

const transformToCountyData = (data) => {
  const result = {};
  for (const item of data) {
    const name = item.name.replace('管理處', '');
    result[name] = {
      value: item.cases,
      level: item.level
    };
  }
  return result;
};

const resetMap = () => {
  citiesMapRef.value?.countyBoundary.resetCountySelection();
  selectedName.value = null;
};
</script>
