<template>
  <div>
    <v-card flat>
      <template v-slot:text>
        <v-text-field
          v-model="search"
          label="Search"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          clearable
          hide-details
          single-line
          class="mb-4"
        ></v-text-field>
      </template>
      <v-data-table
        :loading="!tableLoaded"
        :headers="headers"
        :items="original"
        :search="search"
        :items-per-page="5"
        class="border"
      >
        <template v-slot:item.actions="{ item }">
          <v-btn variant="text" size="small"></v-btn>
          <v-btn
            variant="tonal"
            color="teal-7"
            class="!border !border-teal-7"
            :to="`/manage/fire-hydrant/${item.id}`"
            >檢視</v-btn
          >
        </template>

        <template v-slot:bottom>
          <div class="pt-2 text-center">
            <v-pagination
              v-model="page"
              :length="pageCount"
              :total-visible="4"
            ></v-pagination>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup>
definePageMeta({
  title: '查詢消防栓'
});

import { useMarkerStore } from '~/stores/marker-store';

const userStore = useMarkerStore();
const { original } = storeToRefs(userStore);

const tableLoaded = ref(false);
const search = ref('');
const page = ref(1);
const pageCount = computed(() => {
  return Math.ceil(original.value.length / 5);
});
const headers = ref([
  { key: 'id', title: '消防栓編號' },
  { key: 'customId', title: '自訂編號' },
  { key: 'unit', title: '轄區單位' },
  { key: 'category', title: '種類' },
  { key: 'address', title: '位置' },
  { key: 'actions', title: '', sortable: false, align: 'end' }
]);

onMounted(() => {
  setTimeout(() => {
    tableLoaded.value = true;
  }, 1000);
});
</script>
