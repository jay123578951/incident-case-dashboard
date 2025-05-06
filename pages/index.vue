<template>
  <div class="mb-8 flex gap-4">
    <v-btn variant="flat" color="primary-7" prepend-icon="mdi-magnify"
      >查詢</v-btn
    >
    <v-btn
      variant="flat"
      color="warning"
      prepend-icon="mdi-magnify"
      class="!text-gray-900"
      >查詢</v-btn
    >
    <v-btn
      variant="tonal"
      color="teal-7"
      prepend-icon="mdi-magnify"
      class="!border !border-teal-7"
      >查詢</v-btn
    >
    <v-btn variant="outlined" color="primary-7" append-icon="mdi-magnify"
      >查詢</v-btn
    >
    <v-btn variant="text" color="primary-7" append-icon="mdi-magnify"
      >查詢</v-btn
    >
  </div>

  <div class="flex gap-4">
    <v-autocomplete
      :items="[
        'California',
        'Colorado',
        'Florida',
        'Georgia',
        'Texas',
        'Wyoming'
      ]"
      variant="outlined"
      placeholder="消防栓編號、水公司編號、自訂編號"
      prepend-inner-icon="mdi-magnify"
      append-inner-icon="mdi-chevron-down"
      menu-icon=""
      max-width="344"
    ></v-autocomplete>
    <v-select
      :items="[
        'California',
        'Colorado',
        'Florida',
        'Georgia',
        'Texas',
        'Wyoming'
      ]"
      variant="outlined"
      placeholder="消防栓屬性"
      append-inner-icon="mdi-chevron-down"
      menu-icon=""
      max-width="344"
    ></v-select>
    <v-text-field variant="outlined" max-width="344" clearable></v-text-field>
  </div>

  <div class="flex gap-4">
    <!-- 折線圖 -->
    <ClientOnly>
      <div class="flex flex-col">
        <div>
          <DashboardLineChart
            title="折線圖"
            :categories="['一月', '二月', '三月']"
            :series="[
              { name: '2025 年', data: [100, 150, 200], color: '#ED8F30' }
            ]"
            :yAxisTitle="'數量（支）'"
          />
        </div>

        <div>
          <DashboardBarChart
            title="柱狀圖"
            :categories="['一月', '二月', '三月']"
            :series="[
              {
                name: 'A',
                data: [3, 5, 10],
                color: '#C0F0FC'
              },
              {
                name: 'B',
                data: [14, 8, 15],
                color: '#7FDDF5'
              }
            ]"
          />
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup>
definePageMeta({
  title: '縣市水源儀表板'
});
</script>
