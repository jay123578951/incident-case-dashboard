<template>
  <h2 class="text-[32px] font-bold text-[#1C202E] flex items-center justify-center gap-x-4">
    <span class="w-full max-w-[180px] border-t border-dashed border-[#1C202E]"></span>
    {{ title }}
    <span class="w-full max-w-[180px] border-t border-dashed border-[#1C202E]"></span>
  </h2>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>
