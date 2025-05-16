<template>
  <div v-bind="$attrs">
    <section class="flex flex-col items-center">
      <CommonLogo class="hidden lg:flex mb-4" />

      <div class="bg-gradient-to-r from-[#64D1BD] to-[#009EA6] py-4 lg:py-5 px-5 lg:px-4 rounded-lg border-e-4 border-b-4 border-[#009299]">
        <h1 class="text-[28px] md:text-[32px] lg:text-5xl font-bold text-white">山域事故案件儀錶板</h1>
      </div>
    </section>
  </div>
</template>
 
<script setup>
defineOptions({
  inheritAttrs: false
})
</script>
