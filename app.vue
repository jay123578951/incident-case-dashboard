<template>
  <v-app>
    <Header />
    <!-- <Navigation v-model="drawer" /> -->

    <v-main>
      <NuxtLayout />
    </v-main>

    <Footer />
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
