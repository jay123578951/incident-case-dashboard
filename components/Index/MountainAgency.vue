<template>
  <div v-bind="$attrs">
    <IndexCommonDateHeader
      ref="dateHeaderRef"
      title="各山域機關數據統計"
      v-model="selectedDate"
    />

    <section>
      <div v-if="rawData.length === 0" class="text-center text-[#999]">
        尚無統計資料
      </div>

      <div
        v-else
        class="flex w-full flex-col justify-between gap-8 lg:flex-row lg:gap-0"
      >
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

          <div class="relative h-[630px] w-full max-w-[420px]">
            <ClientOnly>
              <IndexMapTaiwanMap
                ref="taiwanMapRef"
                :map-data="computedReasonData"
                :options="mapOptions"
                class="max-w-[420px]"
              />
              <IndexMapAgencyMap
                ref="mapRef"
                :park-data="computedReasonData"
                :mountain-data="computedReasonData"
                class="max-w-[420px]"
                @select-park="handleSelectPark"
              />
            </ClientOnly>
          </div>
        </div>
        <template v-if="!selectedName">
          <div class="w-full lg:w-5/12">
            <h2 class="mb-4 text-2xl font-bold">
              {{ selectedDate.year }}年{{ selectedMonthName }} 全國山域機關統計
            </h2>
            <IndexCommonStatisticsList
              :list-title="ListTitle"
              :left-column="leftColumn"
              :right-column="rightColumn"
              show-level-border
            />
          </div>
        </template>
        <template v-else>
          <div class="w-full lg:w-[56%]">
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
          </div>
        </template>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useBreakpoints } from '@vueuse/core';

defineOptions({
  inheritAttrs: true
});

const mapStore = useMapStore();
const taiwanMapRef = ref(null);

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
    const res = await fetch(`/json/agency-summary/${year}${safeMonth}.json`);
    const { data } = await res.json();
    rawData.value = Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('載入各山域數據統計失敗', err);
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

    mapStore.setTaiwanFaded(false);
    await fetchMonthlyStats(y, m);

    if (taiwanMapRef.value?.reloadGeoJSON) {
      await taiwanMapRef.value.reloadGeoJSON();
    }

    if (mapRef.value?.reloadAgencyGeoJSON) {
      await mapRef.value.reloadAgencyGeoJSON();
    }

    if (taiwanMapRef.value?.countyBoundary) {
      selectedName.value = null;
    }
  },
  { immediate: true }
);

const mapRef = ref(null);
const selectedName = ref(null);
const cityReasonData = ref();
const isCityLoading = ref(false);

const ListTitle = ref(['山域機關', '案件數', '救援人數']);
const cityListTitle = ref(['原因', '案件數', '佔比']);

const mapOptions = ref({
  defaultBorderColor: '#BCC2CC',
  enableHover: false,
  enableTooltip: false,
  setupTaiwanFaded: true
});

const enrichNationwideReasonData = (data) => {
  const totalCases = data.reduce((sum, item) => sum + item.cases, 0);
  const nonZeroData = data.filter((item) => item.cases > 0);
  const sorted = [...nonZeroData].sort((a, b) => b.cases - a.cases);

  const total = sorted.length;
  const highCutoff = Math.floor(total * 0.25);
  const midCutoff = Math.floor(total * 0.5);

  return data.map((item) => {
    // 移除目前拿到的資料裡含有的「管理處」三個字
    const cleanName = item.name.replace(/管理處$/, '');

    const base = {
      ...item,
      name: cleanName,
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
      previousMonth: previousMonth
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
const leftColumn = computed(() => sortedReasonData.value);
const rightColumn = computed(() => []);

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

    const res = await fetch(
      `/json/agency-reason-summary/${selectedYear.value}00${name}管理處.json`
    );
    const { data } = await res.json();

    cityReasonData.value = Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('載入城市資料失敗', err);
  } finally {
    isCityLoading.value = false;
  }
});

const handleSelectPark = (name) => {
  selectedName.value = name;
  mapStore.setTaiwanFaded(true); // 設定為淡化
  taiwanMapRef.value?.countyBoundary.updateAllCountyStyles(); // 更新台灣地圖樣式
};

const resetMap = () => {
  mapRef.value?.resetSelectedPark();
  selectedName.value = null;
  mapStore.setTaiwanFaded(false); // 取消淡化
  taiwanMapRef.value?.countyBoundary.updateAllCountyStyles(); // 更新樣式
};
</script>
