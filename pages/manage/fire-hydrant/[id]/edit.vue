<template>
  <v-container fluid max-width="600">
    <v-row>
      <v-col class="flex justify-end">
        <v-btn
          variant="flat"
          color="primary-4"
          prepend-icon="mdi-map-marker"
          @click="isModalOpen = true"
        >
          圖面點選
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="4">
        <v-list-subheader>消防栓編號</v-list-subheader>
      </v-col>

      <v-col cols="8">
        <v-text-field flat variant="outlined" v-model="items.id"></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="4">
        <v-list-subheader>種類</v-list-subheader>
      </v-col>

      <v-col cols="8">
        <v-text-field
          flat
          variant="outlined"
          v-model="items.category"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="4">
        <v-list-subheader>位置</v-list-subheader>
      </v-col>

      <v-col cols="8">
        <v-text-field
          flat
          variant="outlined"
          v-model="items.address"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="4">
        <v-list-subheader>Lat</v-list-subheader>
      </v-col>

      <v-col cols="8">
        <v-text-field
          flat
          variant="outlined"
          v-model="items.lat"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="4">
        <v-list-subheader>Lng</v-list-subheader>
      </v-col>

      <v-col cols="8">
        <v-text-field
          flat
          variant="outlined"
          v-model="items.lng"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-dialog v-model="isModalOpen" width="850" min-height="600">
      <v-card>
        <v-card-title
          class="d-flex justify-space-between align-center border-b border-gray-200 px-4 py-2"
        >
          <span>消防栓位置</span>
          <v-btn
            icon="mdi-close"
            variant="text"
            @click="isModalOpen = false"
          ></v-btn>
        </v-card-title>
        <v-card-text class="pa-4">
          <div class="relative h-[450px]">
            <div class="absolute right-0 top-0 z-20 w-full ps-5 pt-5">
              <v-text-field
                v-model="searchAddress"
                item-props
                hide-details
                variant="solo"
                placeholder="請輸入地址搜尋"
                append-inner-icon="mdi-magnify"
                menu-icon=""
                class="max-w-[328px]"
                :loading="isLoading"
                @click:append-inner="searchAddressLocation"
                @keyup.enter="searchAddressLocation"
              >
              </v-text-field>
            </div>

            <!-- 地圖 -->
            <Map
              ref="mapRef"
              :is-modal-open="isModalOpen"
              :marker-data="geoJSON"
              :temp-location="tempLocation"
              @map-click="setTempLocation"
            />
          </div>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0">
          <v-spacer></v-spacer>
          <v-btn variant="flat" color="primary-4" @click="confirmTempLocation">
            確認位置
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { useMarkerStore } from '~/stores/marker-store';

definePageMeta({
  title: '編輯'
});

const userStore = useMarkerStore();
const { geoJSON } = storeToRefs(userStore);

const mapRef = ref(null);
const isModalOpen = ref(false);
const items = ref({
  id: 'A-001',
  name: '台北101',
  lat: 25.033611,
  lng: 121.565,
  category: 'A',
  address: '台北市信義區信義路五段7號'
});
const searchAddress = ref('台北市信義區信義路五段11號（測試）');
const isLoading = ref(false);
const getAddress = ref({
  lat: '25.0331995',
  lng: '121.5660357'
});

// 當 dialog 打開時，聚焦到當前位置
watch(
  isModalOpen,
  async (newVal) => {
    if (newVal && mapRef.value) {
      await nextTick();

      if (mapRef.value.focusMarkerById) {
        await mapRef.value.focusMarkerById(items.value.id);
      }
    }
  },
  { immediate: true, flush: 'post' }
);

const tempLocation = ref(null);

// 點地圖更新臨時 Marker
const setTempLocation = (latlng) => {
  tempLocation.value = {
    lat: latlng.lat,
    lng: latlng.lng
  };
};

// 搜尋並顯示 Marker 和 Popup
const searchAddressLocation = async () => {
  if (!searchAddress.value) return;

  isLoading.value = true;

  // 模擬 API，到時後要換掉
  await new Promise((resolve) => setTimeout(resolve, 500));

  const location = {
    lat: 25.0331995,
    lng: 121.5660357,
    popupText: searchAddress.value
  };

  // 更新地圖位置（Map.vue 自動 watch 這個 prop）
  tempLocation.value = location;

  await nextTick();

  isLoading.value = false;
};

const confirmTempLocation = () => {
  if (!tempLocation.value) return;

  items.value.lat = tempLocation.value.lat;
  items.value.lng = tempLocation.value.lng;

  tempLocation.value = null;

  isModalOpen.value = false;
};
</script>
