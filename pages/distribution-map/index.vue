<template>
  <div class="relative h-main-content">
    <div class="absolute right-0 top-0 z-[1000] w-full ps-5 pt-5">
      <FormsSearch :placeholder="placeholder" />
    </div>

    <!-- 地圖 -->
    <Map ref="mapRef" :marker-data="geoJSON" />
  </div>
</template>

<script setup>
definePageMeta({
  title: '全區水源分佈圖'
});

import { useMarkerStore } from '~/stores/marker-store';

const userStore = useMarkerStore();
const { geoJSON } = storeToRefs(userStore);

const placeholder = ref('請輸入地址搜尋');

// 在組件掛載時載入資料
onMounted(async () => {
  await userStore.fetch();
});
</script>
