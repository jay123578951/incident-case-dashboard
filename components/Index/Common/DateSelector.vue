<template>
  <div class="flex items-center gap-2">
    <v-select
      v-if="showYear"
      v-model="selectedYear"
      label="年度"
      :items="years"
      variant="solo"
      hide-details
      flat
      max-width="200"
      append-inner-icon="mdi-chevron-down"
      menu-icon=""
      class="w-[200px]"
      @update:model-value="onYearChange"
    />
    <v-select
      v-if="showMonth"
      v-model="selectedMonth"
      label="月份"
      :items="months"
      item-title="text"
      item-value="value"
      variant="solo"
      hide-details
      flat
      max-width="200"
      append-inner-icon="mdi-chevron-down"
      menu-icon=""
      class="w-[200px]"
      @update:model-value="onMonthChange"
    />
  </div>
</template>

<script setup>
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
  }
})

const emit = defineEmits(['update:modelValue'])

const selectedYear = ref(props.modelValue?.year ?? null)
const selectedMonth = ref(props.modelValue?.month ?? null)
const years = ref(['113', '112'])
// const months = ref(
//   Array.from({ length: 12 }, (_, i) => {
//     const value = String(i + 1).padStart(2, '0');
//     const text = String(i + 1);
//     return { value, text };
//   })
// );
const months = ref([
  { value: '01', text: '1' },
  { value: '02', text: '2' },
  { value: '03', text: '3' },
  { value: '04', text: '4' },
  { value: '05', text: '5' },
])

const onYearChange = (value) => {
  emit('update:modelValue', {
    year: value,
    month: props.showMonth ? selectedMonth.value : undefined
  })
}

const onMonthChange = (value) => {
  emit('update:modelValue', {
    year: selectedYear.value,
    month: value
  })
}

watch(() => props.modelValue, (newVal) => {
  selectedYear.value = newVal.year
  if (props.showMonth) {
    selectedMonth.value = newVal.month
  }
}, { deep: true })
</script>
