<template>
  <v-container fluid max-width="600">
    <v-row>
      <v-col class="flex justify-end">
        <v-btn
          variant="outlined"
          color="primary-7"
          prepend-icon="mdi-pencil"
          :to="`/manage/fire-hydrant/${items.id}/edit`"
        >
          編輯
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="4">
        <v-list-subheader>消防栓編號</v-list-subheader>
      </v-col>

      <v-col cols="8">
        <v-text-field
          flat
          disabled
          variant="outlined"
          :model-value="items.id"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="4">
        <v-list-subheader>種類</v-list-subheader>
      </v-col>

      <v-col cols="8">
        <v-text-field
          flat
          disabled
          variant="outlined"
          :model-value="items.category"
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
          disabled
          variant="outlined"
          :model-value="items.address"
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
          disabled
          variant="outlined"
          :model-value="items.lat"
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
          disabled
          variant="outlined"
          :model-value="items.lng"
        ></v-text-field>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
definePageMeta({
  title: '檢視消防栓'
});

const items = ref({
  id: 'A-001',
  name: '台北101',
  lat: 25.033611,
  lng: 121.565,
  category: 'A',
  address: '台北市信義區信義路五段7號'
});
</script>
