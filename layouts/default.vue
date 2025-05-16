<template>
  <div class="min-h-screen bg-[#F3F6FA] relative">
    <!-- 背景圖層 -->
    <div class="absolute inset-0 z-0 bg-[url('/images/index/background.png')] bg-no-repeat bg-contain bg-top pointer-events-none"></div>

    <!-- 實際內容層 -->
    <div class="relative z-10">
      <div
        class="!max-w-[1080px] mx-auto py-0 !px-4 md:!px-10 lg:!px-0"
        fluid
      >
        <NuxtPage />
      </div>
    </div>
  </div>
</template>

