<template>
  <section
    class="mb-6 flex flex-col items-start justify-between rounded-2xl bg-[#E9ECF2] py-2.5 pe-2.5 md:flex-row md:items-center lg:mb-10 lg:py-[22px]"
  >
    <h2
      class="mb-3 border-s-[6px] border-[#67C0E0] px-4 text-2xl font-bold text-[#303647] md:mb-0 md:text-[28px] md:text-[28px] lg:text-2xl lg:text-[32px]"
    >
      {{ title }}
    </h2>
    <div class="ps-2 md:ps-0">
      <DateSelector
        v-if="showYear || showMonth"
        ref="dateSelectorRef"
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
import DateSelector from './DateSelector.vue';

defineOptions({ inheritAttrs: true });

const dateSelectorRef = ref(null);

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
});

const emit = defineEmits(['update:modelValue']);

defineExpose({
  closeSelect: () => {
    dateSelectorRef.value?.closeMenus();
  }
});
</script>
