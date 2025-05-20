<template>
  <section class="pb-20 md:pb-44 lg:pb-0">
    <IndexHero class="mt-14 py-6 md:pb-8 md:pt-10 lg:mt-0 lg:pb-16 lg:pt-7" />
    <IndexAnnualStatistics ref="annual" id="annual" class="pb-12 md:pb-24" />
    <IndexMonthlyStatistics ref="monthly" id="monthly" class="pb-12 md:pb-24" />
    <IndexCauses ref="causes" id="causes" class="pb-12 md:pb-24" />
    <IndexCities ref="cities" id="cities" class="pb-12 md:pb-24" />
    <IndexMountainAgency
      ref="mountains"
      id="mountains"
      class="md:pd-44 pb-20 lg:pb-60"
    />
  </section>
</template>

<script setup>
import { useScrollStore } from '@/stores/scrollTarget';

definePageMeta({
  title: '首頁'
});

const scrollStore = useScrollStore();

const annual = ref(null);
const monthly = ref(null);
const causes = ref(null);
const cities = ref(null);
const mountains = ref(null);

const refsMap = {
  annual,
  monthly,
  causes,
  cities,
  mountains
};

watch(
  () => scrollStore.target,
  (newTarget) => {
    if (newTarget && refsMap[newTarget]?.value?.$el) {
      const el = refsMap[newTarget].value.$el;
      const headerOffset = 100;
      const top =
        el.getBoundingClientRect().top + window.scrollY - headerOffset;

      window.scrollTo({
        top,
        behavior: 'smooth'
      });

      scrollStore.clear();
    }
  }
);
</script>
