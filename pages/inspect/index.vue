<template>
  <div class="relative h-main-content">
    <div class="absolute right-0 top-0 z-20 w-full ps-5 pt-5">
      <FormsSearchFilter
        v-model:selectedItem="selectedItem"
        :marker-data="markers"
        :no-data="noDataText"
      />
    </div>

    <!-- 地圖 -->
    <Map ref="mapRef" :marker-data="markers" />
  </div>
</template>

<script setup>
definePageMeta({
  title: '水源查察'
});

import { useMarkerStore } from '~/stores/marker-store';

const userStore = useMarkerStore();
const { markers } = storeToRefs(userStore);

const noDataText = ref('找不到符合的水源');
const selectedItem = ref(null);

// 聚焦 Marker
const mapRef = ref(null);
watch(
  () => selectedItem.value,
  async (newVal) => {
    if (newVal && mapRef.value) {
      await nextTick();

      if (mapRef.value.focusMarkerById) {
        mapRef.value.focusMarkerById(newVal);
      }
    }
  },
  { immediate: true, flush: 'post' }
);
</script>
