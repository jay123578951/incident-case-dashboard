<template>
  <div class="min-h-screen bg-[#F3F6FA] relative">
    <!-- 背景圖層 -->
    <div class="absolute inset-0 z-0 bg-[url('/images/index/background.png')] bg-no-repeat bg-contain bg-top pointer-events-none"></div>

    <!-- 實際內容層 -->
    <div class="relative z-10">
      <v-container
        style="max-width: 1080px"
        class="pa-0 max-w-[1080px] mx-auto"
        fluid
      >
        <NuxtPage />
      </v-container>
    </div>
  </div>
</template>

