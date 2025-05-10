<template>
  <section class="bg-[#E9ECF2] flex items-center justify-between py-[22px] rounded-2xl mb-10">
    <h2 class="text-[32px] font-bold text-[#303647] px-4 border-s-[6px] border-[#67C0E0]">{{ title }}</h2>
    <div class="flex items-center gap-2 me-2.5">
      <v-select
        v-model="selectedYear"
        label="年度"
        :items="years"
        variant="solo"
        hide-details
        flat
        min-width="200"
        append-inner-icon="mdi-chevron-down"
        menu-icon=""
        class="w-full"
        @update:model-value="handleYearChange"
      ></v-select>
      <v-select
        v-if="showMonth"
        v-model="selectedMonth"
        label="月份"
        :items="months"
        variant="solo"
        hide-details
        flat
        min-width="200"
        append-inner-icon="mdi-chevron-down"
        menu-icon=""
        class="w-full"
        @update:model-value="handleMonthChange"
      ></v-select>
    </div>
  </section>
</template>

<script setup>
defineOptions({
  inheritAttrs: true
})

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  modelValue: {
    type: Object,
    required: true
  },
  showMonth: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue'])

const selectedYear = ref(props.modelValue.year)
const selectedMonth = ref(props.modelValue.month)
const years = ref(['114', '113', '112'])
const months = ref(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'])

const handleYearChange = (value) => {
  emit('update:modelValue', { year: value, month: selectedMonth.value })
}

const handleMonthChange = (value) => {
  emit('update:modelValue', { year: selectedYear.value, month: value })
}

// 監聽外部 modelValue 的變化
watch(() => props.modelValue, (newValue) => {
  selectedYear.value = newValue.year
  selectedMonth.value = newValue.month
}, { deep: true })
</script> 