<template>
  <v-text-field
    v-model="searchAddress"
    item-props
    hide-details
    variant="solo"
    :placeholder="placeholder"
    append-inner-icon="mdi-magnify"
    menu-icon=""
    class="max-w-[328px]"
    :loading="isLoading"
    @click:append-inner=""
  >
  </v-text-field>
</template>

<script setup>
const props = defineProps({
  placeholder: {
    type: String,
    default: ''
  }
});

const searchAddress = ref('');
const isLoading = ref(false);
</script>
