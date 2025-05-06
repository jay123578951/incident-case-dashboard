<template>
  <v-app>
    <Header />
    <Navigation v-model="drawer" />

    <v-main>
      <Breadcrumbs />
      <v-container fluid class="min-h-[calc(100vh-64px-65px-44px)]">
        <NuxtPage />
      </v-container>
      <Footer />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue';

const drawer = ref(true);
</script>

<style>
.v-navigation-drawer {
  z-index: 1000;
}
</style>
