<template>
  <v-alert
    :text="`${dataStartYear}年是資料的起始年度，無法與前年進行比較。`"
    type="warning"
    density="compact"
    theme="dark"
    color="#FFD4D8"
    class="mb-4 rounded-lg !text-[#A81B2B]"
  ></v-alert>
</template>

<script setup>
const props = defineProps({
  dataStartYear: {
    type: String,
    required: true
  }
});
</script>
