<template>
  <h2 class="text-2xl lg:text-[32px] text-center font-bold text-[#1C202E] flex items-center justify-center gap-x-4">
    <span class="w-full max-w-7 md:max-w-[180px] border-t border-dashed border-[rgba(28,32,46,0.2)]"></span>
    <span class="w-full">{{ title }}</span>
    <span class="w-full max-w-7 md:max-w-[180px] border-t border-dashed border-[rgba(28,32,46,0.2)]"></span>
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
