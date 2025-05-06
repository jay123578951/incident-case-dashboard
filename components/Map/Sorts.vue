<template>
  <v-card class="mx-auto rounded-lg" max-width="300" variant="outlined">
    <v-list density="compact">
      <v-list-subheader>消防栓型式</v-list-subheader>

      <v-list-item
        v-for="(item, i) in items"
        :key="i"
        :value="item"
        color="primary"
        rounded="xl"
      >
        <template v-slot:prepend>
          <div class="mr-2">
            <v-icon :icon="item.icon" size="32"></v-icon>
          </div>
        </template>

        <template v-slot:append>
          <p class="text-sm">{{ item.text }}</p>
        </template>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup>
const items = [
  { text: '地上式消防栓', icon: 'custom:above-ground-unused' },
  { text: '地下式消防栓', icon: 'custom:under-ground-unused' }
];
</script>
