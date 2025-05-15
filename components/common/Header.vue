<template>
  <v-container fluid class="sticky top-0 bg-white z-50 !p-0">
    <!-- 電腦版 -->
    <div class="hidden lg:block">
      <v-row ref="tabRowRef" justify="center" class="!m-0 py-6 relative">
        <v-btn
          v-for="(item, index) in items"
          :key="index"
          variant="text"
          size="x-large"
          class="nav-tab-btn !text-2xl !leading-9 !font-bold mx-4 px-1 !rounded-none relative"
          :class="{ '!text-[#020203]': activeTab === index, '!text-[#7C8494]': activeTab !== index }"
          @click="() => { activeTab = index; goToSection(item.id) }"
          ref="tabButtons"
        >
          {{ item.name }}
        </v-btn>

        <!-- 電腦版滑動底線 -->
        <span
          class="absolute bottom-4 h-[4px] bg-[#67C0E0] transition-all duration-300"
          :style="sliderStyle"
        ></span>
      </v-row>
    </div>

    <!-- 行動裝置 -->
    <div class="lg:hidden block">
      <!-- App Bar -->
      <v-app-bar flat density="compact" class="border-b border-[rgba(28,32,46,0.05)] py-1 px-3 h-[56px]">
        <CommonLogo padding="py-4" />
        <v-spacer />
        <v-app-bar-nav-icon width="40" @click="drawer = !drawer" />
      </v-app-bar>

      <!-- Drawer -->
      <ClientOnly>
        <v-navigation-drawer
          v-model="drawer"
          location="top"
          permanent
        >
          <v-list class="!m-0 relative">
            <v-list-item
              v-for="(item, index) in items"
              :key="index"
              class="text-center py-4"
            >
              <v-btn
                variant="text"
                size="x-large"
                class="no-hover nav-tab-btn !max-w-fit !text-2xl !leading-9 !font-bold mx-4 px-1 !rounded-none w-full"
                :class="{
                  '!text-[#020203] !border-b-[4px] !border-[#67C0E0]': activeTab === index,
                  '!text-[#7C8494] !border-b-[4px] !border-transparent': activeTab !== index
                }"
                @click="() => {
                  activeTab = index;
                  goToSection(item.id);
                  closeDrawer()
                }"
              >
                {{ item.name }}
              </v-btn>
            </v-list-item>
          </v-list>
        </v-navigation-drawer>
      </ClientOnly>
    </div>
  </v-container>
</template>

<script setup>
import { useScrollStore } from '@/stores/scrollTarget';

defineOptions({ inheritAttrs: true });

const items = [
  { name: '年統計數據', id: 'annual' },
  { name: '月統計數據', id: 'monthly' },
  { name: '事故原因統計', id: 'causes' },
  { name: '縣市統計', id: 'cities' },
  { name: '山域機關統計', id: 'mountains' }
];

const scrollStore = useScrollStore();

const drawer = ref(false);
const activeTab = ref(0);
const tabButtons = ref([]);
const sliderStyle = ref({ left: '0px', width: '0px' });
let observer = null;

const updateSlider = () => {
  if (window.innerWidth < 1024) return; // 僅限桌面版
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

const closeDrawer = () => {
  setTimeout(() => {
    drawer.value = false;
  }, 150);
};

const createObserver = () => {
  const options = {
    root: null,
    rootMargin: '-50% 0px -50% 0px',
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
:deep(.no-hover.v-btn:hover) {
    background-color: inherit !important;
    box-shadow: none !important;
}

:deep(.no-hover.v-btn:hover::before) {
    opacity: 0 !important;
}
</style>
