<template>
  <v-autocomplete
    v-model="selectedItem"
    :items="items"
    :loading="loading"
    :custom-filter="customFilter"
    :menu-props="{ openOnFocus: true }"
    :group-by="'region'"
    :item-title="(item) => `${item.id} - ${item.address}`"
    item-value="id"
    item-props
    clearable
    hide-details
    variant="solo"
    placeholder="請輸入地址搜尋"
    prepend-inner-icon="mdi-magnify"
    menu-icon=""
    class="max-w-[328px]"
  >
    <template v-slot:item="{ props, item }">
      <div
        v-bind="props"
        class="flex cursor-pointer items-center gap-4 p-3 transition hover:bg-gray-100"
      >
        <div class="flex-auto space-y-1">
          <div class="flex items-center gap-2 text-gray-500">
            <v-icon icon="custom:fire-hydrant" size="18" />
            {{ item.raw.id }}
          </div>
          <div
            class="flex items-center gap-2 text-sm font-medium text-gray-800"
          >
            <v-icon icon="mdi-map-marker" size="18" />
            {{ item.raw.address }}
          </div>
        </div>
        <div class="min-w-[60px] flex-1">
          <v-img
            v-if="item.raw.image"
            :src="item.raw.image"
            class="rounded-md"
            max-height="60"
            aspect-ratio="1/1"
            cover
          />
        </div>
      </div>
    </template>
    <template #loading>
      <div class="px-4 py-2 text-sm text-gray-500">
        <v-progress-circular
          indeterminate
          size="20"
          color="primary"
          class="mr-2"
        />
        載入中...
      </div>
    </template>
    <template #no-data>
      <div class="flex items-center gap-2 px-4 py-2 text-sm text-gray-500">
        <v-icon icon="mdi-magnify-off" />
        {{ noDataText }}
      </div>
    </template>
  </v-autocomplete>
</template>

<script setup>
const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  noDataText: {
    type: String,
    default: '找不到符合的資料'
  }
});

const emit = defineEmits(['update:selectedItem']);
const selectedItem = ref(null);
const loading = ref(false);

// emit 回傳選擇的項目 id
watch(selectedItem, (newVal) => {
  emit('update:selectedItem', newVal);
});

const customFilter = (address, queryText) => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 300);
  const query = queryText || '';
  return address.toLowerCase().includes(query.toLowerCase());
};
</script>
