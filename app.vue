<template>
  <v-app>
    <CommonHeader v-if="showHeaderFooter" />

    <v-main class="pt-0">
      <NuxtLayout />
    </v-main>

    <CommonFooter v-if="showHeaderFooter" />
  </v-app>
</template>

<script setup>
import { useRoute } from 'vue-router';
const route = useRoute();
const showHeaderFooter = computed(() => route.path !== '/swagger');
</script>
