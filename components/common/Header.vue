<template>
  <v-container class="sticky top-0 bg-white z-50" fluid>
    <v-row ref="tabRowRef" justify="center" class="py-[22px] relative">
      <v-btn
        v-for="(item, index) in items"
        :key="index"
        variant="text"
        size="x-large"
        class="nav-tab-btn !text-2xl !font-bold mx-4 px-1 !rounded-none relative"
        :class="{ '!text-[#020203]': activeTab === index, '!text-[#7C8494]': activeTab !== index }"
        @click="() => { activeTab = index; goToSection(item.id) }"
        ref="tabButtons"
      >
        {{ item.name }}
      </v-btn>

      <span
        class="absolute bottom-2 h-[4px] bg-[#67C0E0] transition-all duration-300"
        :style="sliderStyle"
      ></span>
    </v-row>
  </v-container>
</template>

<script setup>
import { useScrollStore } from '@/stores/scrollTarget';

defineOptions({
  inheritAttrs: true
})

const items = [
  {
    name: '年統計數據',
    id: 'annual'
  },
  {
    name: '月統計數據',
    id: 'monthly'
  },
  {
    name: '事故原因統計',
    id: 'causes'
  },
  {
    name: '縣市統計',
    id: 'cities'
  },
  {
    name: '山域機關統計',
    id: 'mountains'
  }
];

const scrollStore = useScrollStore();

const activeTab = ref(0);
const tabButtons = ref([]);
const sliderStyle = ref({ left: '0px', width: '0px' });
let observer = null;

const updateSlider = () => {
  nextTick(() => {
    const btn = tabButtons.value[activeTab.value]?.$el;
    if (btn) {
      const { offsetLeft, offsetWidth } = btn;
      sliderStyle.value = {
        left: `${offsetLeft}px`,
        width: `${offsetWidth}px`
      };
    }
  });
};

const goToSection = (id) => {
  scrollStore.scrollTo(id);
  activeTab.value = items.findIndex(item => item.id === id);
  updateSlider();
};

const createObserver = () => {
  const options = {
    root: null,
    rootMargin: '-50% 0px -50% 0px', // 中心點進入視窗就觸發
    threshold: 0
  };

  observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const index = items.findIndex(item => item.id === entry.target.id);
        if (index !== -1) {
          activeTab.value = index;
          updateSlider();
        }
        break;
      }
    }
  }, options);

  items.forEach(item => {
    const el = document.getElementById(item.id);
    if (el) observer.observe(el);
  });
};

onMounted(() => {
  createObserver();
  updateSlider();
});

onBeforeUnmount(() => {
  if (observer) observer.disconnect();
});
</script>

<style scoped>
:deep(.custom-btn:hover .v-btn__overlay) {
  background-color: transparent !important;
  opacity: 0 !important;
}

:deep(.custom-btn:hover .v-btn__content) {
  color: #020203 !important;
  transition: color 500ms cubic-bezier(0.4, 0, 0.2, 1) !important;
}
</style>
