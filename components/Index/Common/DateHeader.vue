<template>
  <section class="bg-[#E9ECF2] flex flex-col md:flex-row items-start md:items-center justify-between py-2.5 lg:py-[22px] rounded-2xl mb-6 lg:mb-10 pe-2.5">
    <h2 class="text-2xl md:text-[28px] lg:text-2xl md:text-[28px] lg:text-[32px] font-bold text-[#303647] px-4 border-s-[6px] border-[#67C0E0] mb-3 md:mb-0">{{ title }}</h2>
    <div class="ps-2 md:ps-0">
      <DateSelector
        v-if="showYear || showMonth"
        :model-value="modelValue"
        :show-year="showYear"
        :show-month="showMonth"
        :enable-clearable="enableClearable"
        @update:model-value="emit('update:modelValue', $event)"
      />
    </div>
  </section>
</template>

<script setup>
import DateSelector from './DateSelector.vue'

defineOptions({ inheritAttrs: true })

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  modelValue: {
    type: Object,
    default: () => ({})
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
})

const emit = defineEmits(['update:modelValue'])
</script>
