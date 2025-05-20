<template>
  <div class="flex items-center gap-2">
    <client-only>
      <v-select
        v-if="showYear"
        v-model="selectedYear"
        v-model:menu="yearMenuOpen"
        label="年度"
        :items="years"
        variant="solo"
        hide-details
        flat
        theme="light"
        :density="computedDensity"
        max-width="200"
        append-inner-icon="mdi-chevron-down"
        menu-icon=""
        class="w-[140px] lg:w-[200px]"
        @update:model-value="onYearChange"
      >
      </v-select>
      <v-select
        v-if="showMonth"
        v-model="selectedMonth"
        v-model:menu="monthMenuOpen"
        label="月份"
        :items="months"
        item-title="text"
        item-value="value"
        variant="solo"
        :clearable="enableClearable"
        hide-details
        flat
        :density="computedDensity"
        max-width="200"
        append-inner-icon="mdi-chevron-down"
        menu-icon=""
        class="w-[140px] lg:w-[200px]"
        @update:model-value="onMonthChange"
      />
    </client-only>
  </div>
</template>

<script setup>
import { useBreakpoints } from '@vueuse/core';

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  showYear: {
    type: Boolean,
    default: true
  },
  showMonth: {
    type: Boolean,
    default: true
  },
  enableClearable: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['update:modelValue']);

const years = ref(['113', '112', '111']);
const months = ref(
  Array.from({ length: 12 }, (_, i) => {
    const value = String(i + 1).padStart(2, '0');
    const text = String(i + 1);
    return { value, text };
  })
);
const breakpoints = useBreakpoints({
  sm: 0,
  md: 768,
  lg: 1024
});
const activeBreakpoint = breakpoints.active();
const computedDensity = computed(() => {
  if (activeBreakpoint.value === 'sm') return 'comfortable';
  if (activeBreakpoint.value === 'md') return 'comfortable';
  return 'default';
});

const yearMenuOpen = ref(false);
const monthMenuOpen = ref(false);

const selectedYear = computed({
  get: () => props.modelValue.year,
  set: (val) => {
    emit('update:modelValue', {
      year: val,
      month: props.modelValue.month
    });
  }
});

const selectedMonth = computed({
  get: () => props.modelValue.month,
  set: (val) => {
    emit('update:modelValue', {
      year: props.modelValue.year,
      month: val
    });
  }
});

const onYearChange = (value) => {
  emit('update:modelValue', {
    year: value,
    month: props.showMonth ? selectedMonth.value : undefined
  });
};

const onMonthChange = (value) => {
  emit('update:modelValue', {
    year: selectedYear.value,
    month: value
  });
};

defineExpose({
  closeMenus: () => {
    yearMenuOpen.value = false;
    monthMenuOpen.value = false;
  }
});
</script>

<style scoped>
.v-theme--light {
  --v-hover-opacity: 0.04;
  --v-theme-overlay-multiplier: 1;
}
</style>
