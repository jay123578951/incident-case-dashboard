<template>
  <h2
    class="flex items-center justify-center gap-x-4 text-center text-2xl font-bold text-[#1C202E] lg:text-[32px]"
  >
    <span
      class="w-full max-w-7 border-t border-dashed border-[rgba(28,32,46,0.2)] md:max-w-[180px]"
    ></span>
    <span class="w-full">{{ title }}</span>
    <span
      class="w-full max-w-7 border-t border-dashed border-[rgba(28,32,46,0.2)] md:max-w-[180px]"
    ></span>
  </h2>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  }
});
</script>
