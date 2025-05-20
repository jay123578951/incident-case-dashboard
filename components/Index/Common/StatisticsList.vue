<template>
  <div
    class="grid rounded-[12px]"
    :class="[
      loading
        ? 'grid-cols-2 gap-4'
        : rightColumn.length > 0
          ? 'grid-cols-1 gap-4 md:grid-cols-2'
          : 'grid-cols-1'
    ]"
  >
    <template v-if="loading">
      <v-skeleton-loader
        type="list-item-two-line"
        class="rounded-lg bg-white"
        :loading="true"
        v-for="i in 8"
        :key="i"
      />
    </template>
    <template v-else>
      <!-- 左欄 -->
      <div>
        <div
          class="border-[rgba(28, 32, 46, 0.1)] mb-2 flex rounded-lg border bg-[#51596B] px-3 py-2 text-lg font-semibold text-white shadow-sm"
        >
          <template v-for="(title, index) in listTitle" :key="index">
            <div class="w-1/2" :class="index === 0 ? 'text-start' : 'text-end'">
              {{ title }}
            </div>
          </template>
        </div>
        <ul class="grid gap-y-1.5 rounded-lg">
          <li
            v-for="item in leftColumn"
            :key="item.name"
            class="border-[rgba(28, 32, 46, 0.1)] flex items-center rounded-lg border bg-white p-3 text-lg shadow-sm"
            :style="getLevelStyleString(item.level)"
          >
            <div class="w-1/3 font-bold">{{ item.name }}</div>
            <div class="w-1/3 text-end">{{ item.cases }}</div>
            <div class="w-1/3 text-end">{{ displayValue(item) }}</div>
          </li>
        </ul>
      </div>

      <!-- 右欄 -->
      <div v-if="rightColumn.length > 0">
        <div
          class="border-[rgba(28, 32, 46, 0.1)] mb-2 flex rounded-lg border bg-[#51596B] px-3 py-2 text-lg font-semibold text-white shadow-sm"
        >
          <template v-for="(title, index) in listTitle" :key="index">
            <div class="w-1/2" :class="index === 0 ? 'text-start' : 'text-end'">
              {{ title }}
            </div>
          </template>
        </div>
        <ul class="grid gap-y-1.5 rounded-lg">
          <li
            v-for="item in rightColumn"
            :key="item.name"
            class="border-[rgba(28, 32, 46, 0.1)] flex items-center rounded-lg border bg-white p-3 text-lg shadow-sm"
            :style="getLevelStyleString(item.level)"
          >
            <div class="w-1/3 font-bold">{{ item.name }}</div>
            <div class="w-1/3 text-end">{{ item.cases }}</div>
            <div class="w-1/3 text-end">{{ displayValue(item) }}</div>
          </li>
        </ul>
      </div>
    </template>
  </div>
</template>

<script setup>
const props = defineProps({
  leftColumn: {
    type: Array,
    required: true
  },
  rightColumn: {
    type: Array,
    default: () => []
  },
  listTitle: {
    type: Array,
    required: true
  },
  mode: {
    type: String,
    default: 'rescued'
  },
  loading: {
    type: Boolean,
    default: false
  },
  showLevelBorder: {
    type: Boolean,
    default: false
  }
});

const displayValue = (item) => {
  switch (props.mode) {
    case 'percent':
      return `${(Number(item.percent) || 0).toFixed(2)}%`;
    case 'cases':
      return item.cases;
    case 'rescued':
    default:
      return item.rescued;
  }
};

const levelColors = {
  high: '#FCA2AC',
  mid: '#FFE482',
  low: '#ADF0E3',
  none: '#DCDFE5'
};

const getLevelStyleString = (level) => {
  if (!props.showLevelBorder || !level) return '';
  const color = levelColors[level] || '';
  return `border-left: 6px solid ${color} !important;`;
};
</script>
