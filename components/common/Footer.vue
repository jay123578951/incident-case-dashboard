<template>
  <v-footer color="#7C8494" class="justify-center py-3 text-sm">
    Copyright © {{ year }} {{ name }}. All rights reserved.
  </v-footer>
</template>

<script setup>
const year = ref(new Date().getFullYear());
const name = ref('');
// const name = ref('內政部消防署');
</script>
