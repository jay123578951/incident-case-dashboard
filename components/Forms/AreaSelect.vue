<template>
  <v-select
    v-model="selectedArea"
    clearable
    hide-details
    variant="solo"
    label="選擇區域"
    class="me-2 max-w-[220px]"
    :items="towns"
    item-title="name"
    item-value="value"
  ></v-select>
</template>

<script setup>
const towns = [
  {
    name: '壽豐鄉',
    value: '壽豐鄉'
  },
  {
    name: '鳳林鎮',
    value: '鳳林鎮'
  },
  {
    name: '玉里鎮',
    value: '玉里鎮'
  }
];

const props = defineProps({
  modelValue: {
    type: String,
    default: '壽豐鄉'
  }
});

const emit = defineEmits(['update:modelValue']);

const selectedArea = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});
</script>
