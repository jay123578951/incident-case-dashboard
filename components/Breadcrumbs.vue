<template>
  <div class="border-b px-6 py-4">
    <!-- 如果有多層路由才顯示 breadcrumbs -->
    <template v-if="breadcrumbs.length > 1">
      <v-breadcrumbs :items="breadcrumbs" class="mb-2 text-sm" divider="/">
        <template #title="{ item }">
          <NuxtLink
            v-if="item.to"
            :to="item.to"
            class="text-primary hover:underline"
          >
            {{ item.title }}
          </NuxtLink>
          <span v-else>{{ item.title }}</span>
        </template>
      </v-breadcrumbs>
    </template>

    <!-- Page Title -->
    <h1 class="text-2xl font-bold text-primary-13">
      {{ pageTitle }}
    </h1>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();

// 顯示目前頁面的標題
const pageTitle = computed(() => route.meta.title || '未命名頁面');

// 建立 breadcrumbs（含多層 matched 路由）
const breadcrumbs = computed(() => {
  const matched = route.matched.filter((r) => r.meta?.title);

  return matched.map((r) => ({
    title: r.meta.title,
    to: r.path !== route.path ? r.path : undefined
  }));
});
</script>
