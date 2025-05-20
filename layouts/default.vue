<template>
  <div class="relative min-h-screen bg-[#F3F6FA] text-[#1C202E]">
    <!-- 背景圖層 -->
    <div
      class="pointer-events-none absolute inset-0 z-0 bg-[url('/images/index/background.png')] bg-contain bg-top bg-no-repeat"
    ></div>

    <!-- 實際內容層 -->
    <div class="relative z-10">
      <div class="mx-auto !max-w-[1080px] !px-4 py-0 md:!px-10 lg:!px-0" fluid>
        <NuxtPage />
      </div>
    </div>
  </div>
</template>
