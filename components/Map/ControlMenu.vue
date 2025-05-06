<template>
  <v-menu :close-on-content-click="false" location="bottom end">
    <template v-slot:activator="{ props }">
      <v-btn
        v-bind="props"
        icon="mdi-cog"
        size="small"
        flat
        class="!min-h-[40px]"
      />
    </template>

    <v-card max-width="350">
      <v-list density="compact" nav>
        <v-list-subheader>顯示</v-list-subheader>
        <div class="flex flex-wrap">
          <v-list-item v-for="item in switches" :key="item.key">
            <v-switch
              :model-value="mapViewStore.visibleLayers[item.key]"
              :label="item.label"
              :disabled="item.disabled"
              color="primary-7"
              hide-details
              density="compact"
              @update:modelValue="
                mapViewStore.setVisibleLayer(item.key, $event)
              "
            />
          </v-list-item>
        </div>

        <v-divider />

        <v-list-subheader>篩選</v-list-subheader>
        <v-list-item>
          <v-chip-group v-model="filterStore.hydrantFilters" column multiple>
            <v-chip
              v-for="chip in chips"
              :key="chip.value"
              :text="chip.label"
              :value="chip.value"
              :disabled="chip.disabled"
              filter
              class="ma-1"
            />
          </v-chip-group>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script setup>
import { useMapViewStore } from '@/stores/map-view-store';
import { useFilterStore } from '@/stores/filter-store';

const mapViewStore = useMapViewStore();
const filterStore = useFilterStore();

const switches = computed(() => [
  { key: 'town', label: '鄉鎮邊界', disabled: false },
  { key: 'circles', label: '單點範圍', disabled: true },
  { key: 'polygons', label: '分類範圍', disabled: true }
]);

const chips = computed(() => [
  { label: '地上式消防栓', value: '地上式單口式', disabled: false },
  { label: '地下式消防栓', value: '地下式單口式', disabled: false },
  { label: '1000L/MIN 以上', value: 'above_1000', disabled: true },
  { label: '500-1000L/MIN', value: '500_1000', disabled: true },
  { label: '500L/MIN 以下', value: 'below_500', disabled: true },
  { label: '報修中', value: 'repair', disabled: true }
]);
</script>
