<template>
  <div v-bind="$attrs">
    <section class="flex flex-col items-center">
      <!-- <CommonLogo class="mb-4 hidden lg:flex" /> -->

      <div
        class="rounded-lg border-b-4 border-e-4 border-[#009299] bg-gradient-to-r from-[#64D1BD] to-[#009EA6] px-5 py-4 lg:px-4 lg:py-5"
      >
        <h1 class="text-[28px] font-bold text-white md:text-[32px] lg:text-5xl">
          {{ title }}
        </h1>
      </div>
    </section>
  </div>
</template>

<script setup>
defineOptions({
  inheritAttrs: false
});

const title = ref('儀表板');
// const title = ref('山域事故案件儀錶板');
</script>
