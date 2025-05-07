<template>
    <section>
      <IndexHero class="pt-7 pb-16" />
    
      <IndexAnnualStatistics class="pb-24"/>

      <IndexMonthlyStatistics class="pb-24"/>

      <IndexCauses class="pb-24"/>

      <IndexCities class="pb-24"/>
    </section>
  
    <!-- <div class="flex gap-4"> -->
      <!-- 折線圖 -->
      <!-- <ClientOnly>
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
      </ClientOnly> -->
    <!-- </div> -->
</template>

<script setup>
definePageMeta({
  title: '首頁'
});
</script>
