<template>
  <client-only>
    <v-navigation-drawer color="primary-13" class="text-primary-3">
      <v-list density="compact" nav class="!py-5">
        <div v-for="(item, index) in nav" :key="'nav#' + index">
          <v-list-item
            v-if="!item.subNav"
            :title="item.title"
            :to="item.to"
            active-class="!bg-primary-13 text-white"
            class="!mb-2"
          ></v-list-item>

          <v-list-group :value="item.title" v-else>
            <template #activator="{ props }">
              <v-list-item
                v-bind="props"
                :title="item.title"
                class="!mb-2"
              ></v-list-item>
            </template>

            <div
              v-for="(subItem, subIndex) in item.subNav"
              :key="'subnav#' + subIndex"
            >
              <v-list-item
                :title="subItem.title"
                :to="subItem.to"
                nav
                class="!mb-2"
              ></v-list-item>
            </div>
          </v-list-group>
        </div>
      </v-list>
    </v-navigation-drawer>
  </client-only>
</template>

<script setup>
// import { reactive } from 'vue'

// defineProps({
//   modelValue: {
//     type: Boolean,
//     default: true
//   }
// })

// defineEmits(['update:modelValue'])

const nav = [
  {
    title: '首頁',
    to: '/'
  },
  {
    title: '水源管理',
    subNav: [
      {
        title: '轄區水源',
        to: '/manage/water-source'
      },
      {
        title: '查詢消防栓',
        to: '/manage/fire-hydrant'
      },
      {
        title: '其他水源管理',
        to: '/manage/other'
      }
    ]
  },
  {
    title: '水源查察',
    to: '/inspect'
  },
  {
    title: '水源會勘',
    to: '/survey'
  },
  {
    title: '水源報修',
    to: '/repair'
  },
  {
    title: '全區水源分布圖',
    to: '/distribution-map'
  },
  {
    title: '後台管理',
    to: '/setting'
  }
];
</script>

<style>
.v-navigation-drawer {
  z-index: 1000;
}

.v-list-item-title {
  font-size: 1.2rem !important;
  font-weight: 700 !important;
  line-height: 1.5 !important;
}

.v-list-group__items .v-list-item-title {
  font-weight: 400 !important;
}
</style>
