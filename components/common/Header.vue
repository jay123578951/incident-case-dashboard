<template>
  <v-container fluid class="sticky top-0 z-50 bg-white !p-0">
    <!-- 電腦版 -->
    <div class="hidden lg:block">
      <v-row ref="tabRowRef" justify="center" class="relative !m-0 py-6">
        <v-btn
          v-for="(item, index) in items"
          :key="index"
          :ripple="false"
          variant="text"
          size="x-large"
          class="nav-tab-btn relative mx-4 !rounded-none !px-1 !text-2xl !font-bold !leading-9 hover:bg-transparent"
          :class="{
            '!text-[#020203]': activeTab === index,
            '!text-[#7C8494]': activeTab !== index
          }"
          @click="
            () => {
              goToSection(item.id);
            }
          "
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
    <div class="block lg:hidden">
      <!-- App Bar -->
      <v-app-bar
        flat
        density="compact"
        class="h-[56px] border-b border-[rgba(28,32,46,0.05)] px-3 py-1"
      >
        <CommonLogo padding="py-4" />
        <v-spacer />
        <v-app-bar-nav-icon width="40" @click="drawer = !drawer" />
      </v-app-bar>

      <!-- Drawer -->
      <ClientOnly>
        <v-navigation-drawer v-model="drawer" location="top" permanent>
          <v-list class="relative !m-0">
            <v-list-item
              v-for="(item, index) in items"
              :key="index"
              class="text-center"
            >
              <v-btn
                :ripple="false"
                variant="text"
                size="x-large"
                class="nav-tab-btn relative mx-4 !rounded-none !px-1 !text-2xl !font-bold !leading-9 hover:bg-transparent"
                :class="{
                  '!border-b-[4px] !border-[#67C0E0] !text-[#020203]':
                    activeTab === index,
                  '!border-b-[4px] !border-transparent !text-[#7C8494]':
                    activeTab !== index
                }"
                @click="onDrawerClosed(item.id, index)"
                ref="tabButtons"
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
const activeTab = ref(0); // 同時控制底線與文字樣式
const tabButtons = ref([]);
const sliderStyle = ref({ left: '0px', width: '0px' });

const updateSlider = () => {
  if (window.innerWidth < 1024) return;
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

const goToSection = (id, index) => {
  activeTab.value = index;
  scrollStore.scrollTo(id);
  updateSlider();
};

const onDrawerClosed = (id, index) => {
  closeDrawer(300);
  setTimeout(() => {
    goToSection(id, index);
  }, 300);
};

const closeDrawer = (delay = 150) => {
  setTimeout(() => {
    drawer.value = false;
  }, delay);
};

const watchScrollAndUpdateTab = () => {
  const handler = () => {
    const buffer = 120;
    let closestIndex = -1;
    let minDistance = Infinity;

    items.forEach((item, index) => {
      const el = document.getElementById(item.id);
      if (el) {
        const rect = el.getBoundingClientRect();
        const distance = Math.abs(rect.top);
        if (rect.top >= 0 && rect.top < buffer && distance < minDistance) {
          closestIndex = index;
          minDistance = distance;
        }
      }
    });

    if (closestIndex !== -1 && closestIndex !== activeTab.value) {
      activeTab.value = closestIndex;
      updateSlider();
    }
  };

  window.addEventListener('scroll', handler, { passive: true });
  onBeforeUnmount(() => {
    window.removeEventListener('scroll', handler);
  });
};

const initializeActiveTabFromScroll = () => {
  const buffer = 120;
  let closestIndex = -1;
  let minDistance = Infinity;

  items.forEach((item, index) => {
    const el = document.getElementById(item.id);
    if (el) {
      const rect = el.getBoundingClientRect();
      const distance = Math.abs(rect.top);
      if (rect.top >= 0 && rect.top < buffer && distance < minDistance) {
        closestIndex = index;
        minDistance = distance;
      }
    }
  });

  if (closestIndex !== -1) {
    activeTab.value = closestIndex;
    updateSlider();
  }
};

onMounted(() => {
  updateSlider();
  watchScrollAndUpdateTab();
  initializeActiveTabFromScroll();
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

:deep(.v-btn__overlay) {
  opacity: 0 !important;
}
</style>
