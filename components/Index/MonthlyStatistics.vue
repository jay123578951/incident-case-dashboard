<template>
  <div v-bind="$attrs">
    <IndexCommonDateHeader
      title="月統計數據"
      v-model="selectedDate"
      :enable-clearable="false"
    />

    <section>
      <div class="mx-auto w-full">
        <!-- Tabs Header -->
        <div class="mb-6 flex justify-center lg:mb-8">
          <div
            class="flex w-full justify-center rounded-[12px] bg-white p-2 md:w-fit"
          >
            <button
              v-for="tabItem in tabs"
              :key="tabItem.value"
              @click="activeTab = tabItem.value"
              class="w-full rounded-lg px-5 py-2 text-lg font-bold transition-colors duration-300 md:w-fit md:py-2.5 md:text-xl"
              :class="{
                'bg-gradient-to-t from-[#2DBFC6] to-[#64D1BD] text-white':
                  activeTab === tabItem.value,
                '!text-[#7C8494] hover:bg-gray-100': activeTab !== tabItem.value
              }"
            >
              {{ tabItem.label }}
            </button>
          </div>
        </div>

        <div v-if="selectedYear === dataStartYear" class="mb-4">
          <IndexCommonAlert :data-start-year="dataStartYear" />
        </div>

        <!-- Tabs Content -->
        <transition name="fade" mode="out-in">
          <div :key="activeTab" class="bg-transparent">
            <!-- 與上個月份比較 -->
            <div v-if="activeTab === 'lastMonth'">
              <ul class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
                <li
                  v-if="processedCurrentData.length === 0"
                  class="col-span-6 text-center text-[#999]"
                >
                  尚無統計資料
                </li>
                <li
                  v-for="(item, index) of processedCurrentData"
                  :key="index"
                  class="border-[rgba(0, 0, 0, 0.05)] rounded-2xl border bg-white p-4 shadow-sm"
                >
                  <div class="items-top mb-3 flex justify-between">
                    <div class="flex h-fit items-center gap-x-2">
                      <div class="h-6 w-1.5 rounded-full bg-[#67C0E0]"></div>
                      <p class="text-xl font-medium text-[#666D80]">
                        {{ item.title }}
                      </p>
                    </div>
                    <div
                      v-if="item.type === 'bar'"
                      class="rounded-lg p-2 lg:p-2.5"
                      :class="
                        item.thisMonth > item.lastMonth
                          ? 'bg-[#FFD4D8]'
                          : 'bg-[#C4F5EB]'
                      "
                    >
                      <v-icon
                        :icon="
                          item.thisMonth > item.lastMonth
                            ? 'custom:ic-trending_up'
                            : 'custom:ic-trending_down'
                        "
                        size="24"
                      ></v-icon>
                    </div>
                  </div>

                  <div v-if="item.type === 'text'">
                    <p class="-mt-1.5 mb-1.5 text-right text-lg text-[#666D80]">
                      與上個月比較
                    </p>
                  </div>

                  <template v-if="item.type === 'bar'">
                    <div
                      class="flex grid grid-cols-1 items-end justify-between gap-x-2 lg:grid-cols-2"
                    >
                      <div
                        class="mb-4 grid w-full gap-y-3 pe-14 text-base font-bold leading-5 lg:mb-0 lg:gap-y-2.5 lg:pe-0 lg:text-lg"
                      >
                        <div
                          class="width-transition flex items-center justify-between rounded-md px-2.5 py-[5px] lg:py-1.5"
                          :class="
                            item.thisMonth > item.lastMonth
                              ? 'bg-[#FFD4D8] text-[#A81B2B]'
                              : 'bg-[#C4F5EB] text-[#227A69]'
                          "
                          :style="{ width: item.thisMonthWidth }"
                        >
                          <p class="truncate">{{ selectedMonth }}月</p>
                          <p>{{ item.thisMonth }}</p>
                        </div>
                        <div
                          class="width-transition flex items-center justify-between rounded-md bg-[#E9ECF2] px-2.5 py-1.5 text-[#666D80]"
                          :style="{ width: item.lastMonthWidth }"
                        >
                          <p class="truncate">{{ item.previousMonth }}月</p>
                          <p>{{ item.lastMonth }}</p>
                        </div>
                      </div>
                      <div class="sm:text-left lg:text-right">
                        <p
                          class="mb-1.5 text-xl font-bold lg:mb-2 lg:text-2xl"
                          :class="
                            item.comparisonSign === '+'
                              ? 'text-[#E85869]'
                              : 'text-[#44BDA7]'
                          "
                        >
                          {{ item.comparisonSign
                          }}{{ item.comparisonPercentage }}%
                        </p>
                        <p class="text-base text-[#666D80] lg:text-lg">
                          與上個月份比較
                          <span
                            class="px-1.5"
                            :class="
                              item.comparisonSign === '+'
                                ? 'text-[#E85869]'
                                : 'text-[#44BDA7]'
                            "
                          >
                            {{ item.comparisonDifference }} </span
                          >件
                        </p>
                      </div>
                    </div>
                  </template>

                  <template v-if="item.type === 'text'">
                    <ul class="flex flex-col gap-y-3">
                      <li
                        v-for="(caseItem, index) of item.value"
                        :key="index"
                        class="flex items-center justify-between"
                      >
                        <div
                          class="flex items-center gap-x-2 text-xl font-bold md:gap-x-3 lg:text-2xl"
                        >
                          <p
                            class="w-9 rounded-md py-1 text-center md:w-10 md:py-1.5 lg:w-11"
                            :class="{
                              'bg-[#FEEFB7] text-[#705800]': index === 0,
                              'bg-[#EBF1FF] text-[#7F8494]': index === 1,
                              'bg-[#F2F4F7] text-[#666D80]': index === 2
                            }"
                          >
                            {{ index + 1 }}
                          </p>
                          <p>{{ caseItem.name }}</p>
                        </div>
                        <div
                          class="flex items-center gap-x-1 text-right lg:gap-x-2"
                        >
                          <p class="flex items-center gap-x-1">
                            <span class="text-xl font-bold lg:text-2xl">{{
                              caseItem.thisMonth
                            }}</span>
                            <span class="text-lg text-[#666D80] lg:text-xl"
                              >件</span
                            >
                          </p>
                          <p
                            class="flex items-center text-lg text-[#666D80] lg:text-xl"
                          >
                            <span>(</span>
                            <span
                              class="w-7 text-center"
                              :class="
                                caseItem.comparisonSign === '+'
                                  ? 'text-[#E85869]'
                                  : 'text-[#44BDA7]'
                              "
                            >
                              {{ caseItem.comparisonDifference }}
                            </span>
                            <span>)</span>
                          </p>
                        </div>
                      </li>
                    </ul>
                  </template>
                </li>
              </ul>
            </div>

            <!-- 與去年同期比較 -->
            <div v-if="activeTab === 'lastYear'">
              <ul class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
                <li
                  v-if="processedLastYearData.length === 0"
                  class="col-span-6 text-center text-[#999]"
                >
                  尚無統計資料
                </li>
                <li
                  v-for="(item, index) of processedLastYearData"
                  :key="index"
                  class="border-[rgba(0, 0, 0, 0.05)] rounded-2xl border bg-white p-4 shadow-sm"
                >
                  <div class="items-top mb-3 flex justify-between">
                    <div class="flex h-fit items-center gap-x-2">
                      <div class="h-6 w-1.5 rounded-full bg-[#67C0E0]"></div>
                      <p class="text-xl font-medium text-[#666D80]">
                        {{ item.title }}
                      </p>
                    </div>
                    <div
                      v-if="item.type === 'bar'"
                      class="rounded-lg p-2 lg:p-2.5"
                      :class="
                        item.thisYear > item.lastYear
                          ? 'bg-[#FFD4D8]'
                          : 'bg-[#C4F5EB]'
                      "
                    >
                      <v-icon
                        :icon="
                          item.thisYear > item.lastYear
                            ? 'custom:ic-trending_up'
                            : 'custom:ic-trending_down'
                        "
                        size="24"
                      ></v-icon>
                    </div>
                  </div>

                  <div v-if="item.type === 'text'">
                    <p class="-mt-1.5 mb-1.5 text-right text-lg text-[#666D80]">
                      與去年同期比較
                    </p>
                  </div>

                  <template v-if="item.type === 'bar'">
                    <div
                      class="flex grid grid-cols-1 items-end justify-between gap-x-2 lg:grid-cols-2"
                    >
                      <div
                        class="mb-4 grid w-full gap-y-3 pe-14 text-base font-bold leading-5 lg:mb-0 lg:gap-y-2.5 lg:pe-0 lg:text-lg"
                      >
                        <div
                          class="width-transition flex items-center justify-between rounded-md px-2.5 py-[5px] lg:py-1.5"
                          :class="
                            item.thisYear > item.lastYear
                              ? 'bg-[#FFD4D8] text-[#A81B2B]'
                              : 'bg-[#C4F5EB] text-[#227A69]'
                          "
                          :style="{ width: item.thisMonthWidth }"
                        >
                          <p class="truncate">{{ formattedCurrentDate }}</p>
                          <p>{{ item.thisYear }}</p>
                        </div>
                        <div
                          class="width-transition flex items-center justify-between rounded-md bg-[#E9ECF2] px-2.5 py-1.5 text-[#666D80]"
                          :style="{ width: item.lastMonthWidth }"
                        >
                          <p class="truncate">{{ formattedPreviousDate }}</p>
                          <p>{{ item.lastYear }}</p>
                        </div>
                      </div>
                      <div class="sm:text-left lg:text-right">
                        <p
                          class="mb-1.5 text-xl font-bold lg:mb-2 lg:text-2xl"
                          :class="
                            item.comparisonSign === '+'
                              ? 'text-[#E85869]'
                              : 'text-[#44BDA7]'
                          "
                        >
                          {{ item.comparisonSign
                          }}{{ item.comparisonPercentage }}%
                        </p>
                        <p class="text-base text-[#666D80] lg:text-lg">
                          與上個月份比較
                          <span
                            class="px-1.5"
                            :class="
                              item.comparisonSign === '+'
                                ? 'text-[#E85869]'
                                : 'text-[#44BDA7]'
                            "
                          >
                            {{ item.comparisonDifference }} </span
                          >件
                        </p>
                      </div>
                    </div>
                  </template>

                  <template v-if="item.type === 'text'">
                    <ul class="flex flex-col gap-y-3">
                      <li
                        v-for="(caseItem, index) of item.value"
                        :key="index"
                        class="flex items-center justify-between"
                      >
                        <div
                          class="flex items-center gap-x-2 text-xl font-bold md:gap-x-3 lg:text-2xl"
                        >
                          <p
                            class="w-9 rounded-md py-1 text-center md:w-10 md:py-1.5 lg:w-11"
                            :class="{
                              'bg-[#FEEFB7] text-[#705800]': index === 0,
                              'bg-[#EBF1FF] text-[#7F8494]': index === 1,
                              'bg-[#F2F4F7] text-[#666D80]': index === 2
                            }"
                          >
                            {{ index + 1 }}
                          </p>
                          <p class="font-bold">{{ caseItem.name }}</p>
                        </div>
                        <div
                          class="flex items-center gap-x-1 text-right lg:gap-x-2"
                        >
                          <p class="flex items-center gap-x-1">
                            <span class="text-xl font-bold lg:text-2xl">{{
                              caseItem.thisYear
                            }}</span>
                            <span class="text-lg text-[#666D80] lg:text-xl"
                              >件</span
                            >
                          </p>
                          <p
                            class="flex items-center text-lg text-[#666D80] lg:text-xl"
                          >
                            <span>(</span>
                            <span
                              class="w-7 text-center"
                              :class="
                                caseItem.comparisonSign === '+'
                                  ? 'text-[#E85869]'
                                  : 'text-[#44BDA7]'
                              "
                            >
                              {{ caseItem.comparisonDifference }}
                            </span>
                            <span>)</span>
                          </p>
                        </div>
                      </li>
                    </ul>
                  </template>
                </li>
              </ul>
            </div>
          </div>
        </transition>
      </div>
    </section>
  </div>
</template>

<script setup>
import {
  getPreviousMonth,
  getPreviousYear,
  getComparisonSign,
  getComparisonPercentage,
  getComparisonDifference,
  calculateWidthPercentages
} from '~/utils/statistics';

defineOptions({
  inheritAttrs: true
});

const selectedDate = ref({ year: '113', month: '01' });
const selectedYear = computed(() => selectedDate.value.year);
const selectedMonth = computed(() => selectedDate.value.month);
const dataStartYear = '111';

// 新增日期格式化的計算屬性
const formattedCurrentDate = computed(
  () => `${selectedYear.value}年${selectedMonth.value}月`
);
const formattedPreviousDate = computed(
  () => `${getPreviousYear(selectedYear.value)}年${selectedMonth.value}月`
);

const tabs = [
  { label: '與上個月比較', value: 'lastMonth' },
  { label: '與去年同期比較', value: 'lastYear' }
];
const activeTab = ref('lastMonth');

const rawData = ref([]);
const samePeriodLastYearData = ref([]);
const isLoadingCurrent = ref(false);
const isLoadingLastYear = ref(false);

const fetchMonthlyStats = async (year, month) => {
  try {
    isLoadingCurrent.value = true;
    const url = `/json/monthly-detail/${year}${month}.json`;
    const res = await fetch(url);
    const data = await res.json();
    rawData.value = data.statistics || [];
  } catch (err) {
    console.error('載入本月數據失敗', err);
    rawData.value = [];
  } finally {
    isLoadingCurrent.value = false;
  }
};

const fetchSamePeriodLastYearStats = async (year, month) => {
  try {
    isLoadingLastYear.value = true;
    const url = `/json/monthly-detail-compare-last-year/${year}${month}.json`;
    const res = await fetch(url);
    const data = await res.json();
    samePeriodLastYearData.value = data.statistics || [];
  } catch (err) {
    console.error('載入去年同期數據失敗', err);
    samePeriodLastYearData.value = [];
  } finally {
    isLoadingLastYear.value = false;
  }
};

watch(
  [selectedYear, selectedMonth],
  ([year, month]) => {
    fetchMonthlyStats(year, month);
    fetchSamePeriodLastYearStats(year, month);
  },
  { immediate: true }
);

const previousMonth = computed(() => {
  return selectedMonth.value ? getPreviousMonth(selectedMonth.value) : null;
});

/**
 * 將 raw 資料轉換為帶有比較資料的處理結果
 * @param {Array} data
 * @returns {Array}
 */
const processData = (
  data,
  { currentKey = 'thisMonth', compareKey = 'lastMonth' } = {}
) => {
  return data.map((item) => {
    if (item.type === 'bar') {
      const base = {
        ...item,
        previousMonth: previousMonth.value,
        comparisonSign: getComparisonSign(item[currentKey], item[compareKey]),
        comparisonPercentage: getComparisonPercentage(
          item[currentKey],
          item[compareKey]
        ),
        comparisonDifference: getComparisonDifference(
          item[currentKey],
          item[compareKey]
        )
      };
      const widths = calculateWidthPercentages(
        item[currentKey],
        item[compareKey]
      );
      return {
        ...base,
        thisMonthWidth: `${widths.currentPercentage}%`,
        lastMonthWidth: `${widths.lastPercentage}%`
      };
    }

    if (item.type === 'text' && Array.isArray(item.value)) {
      const processedValues = item.value.map((subItem) => {
        // 移除目前拿到的資料裡含有的「管理處」三個字
        const cleanName = subItem.name.replace(/管理處$/, '');

        return {
          ...subItem,
          name: cleanName,
          previousMonth: previousMonth.value,
          comparisonSign: getComparisonSign(
            subItem[currentKey],
            subItem[compareKey]
          ),
          comparisonDifference: getComparisonDifference(
            subItem[currentKey],
            subItem[compareKey]
          )
        };
      });

      return {
        ...item,
        value: processedValues
      };
    }

    return item;
  });
};

// 處理當月與前月（預設 thisMonth vs lastMonth）
const processedCurrentData = computed(() => processData(rawData.value));

// 處理去年同期（使用 thisYear vs lastYear）
const processedLastYearData = computed(() =>
  processData(samePeriodLastYearData.value, {
    currentKey: 'thisYear',
    compareKey: 'lastYear'
  })
);
</script>

<style scoped>
.width-transition {
  transition: width 0.3s ease;
  flex-shrink: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
