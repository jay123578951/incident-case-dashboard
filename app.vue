<template>
  <v-app>
    <CommonHeader v-if="showHeaderFooter" />

    <NuxtLayout />

    <CommonFooter v-if="showHeaderFooter" />
  </v-app>
</template>

<script setup>
import { useRoute } from 'vue-router';
const route = useRoute();
const showHeaderFooter = computed(() => route.path !== '/swagger');
</script>
