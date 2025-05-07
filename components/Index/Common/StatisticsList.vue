<template>
  <div class="grid grid-cols-2 gap-4 rounded-xl">
    <!-- 左欄 -->
    <div>
      <div class="flex bg-[#51596B] text-white text-lg font-semibold rounded-lg mb-2 px-3 py-2">
        <template v-for="(title, index) in listTitle" :key="index">
          <div
            class="w-1/3"
            :class="index === 0 ? 'text-start' : 'text-end'"
          >{{ title }}</div>
        </template>
      </div>
      <ul class="grid gap-y-1.5 rounded-lg">
        <li
          v-for="item in leftColumn"
          :key="item.name"
          class="flex items-center text-lg rounded-lg bg-white p-3"
          :class="[
            item.level ? 'border-s-[6px]' : '',
            item.level === 'high' ? 'border-s-[#FCA2AC]' : '',
            item.level === 'mid' ? 'border-s-[#FFE482]' : '',
            item.level === 'low' ? 'border-s-[#ADF0E3]' : '',
            item.level === 'none' ? 'border-s-[#DCDFE5]' : ''
          ]"
        >
          <div class="w-1/3 font-bold">{{ item.name }}</div>
          <div class="w-1/3 text-end">{{ item.cases }}</div>
          <div class="w-1/3 text-end">{{ item.percent.toFixed(2) }}%</div>
        </li>
      </ul>
    </div>

    <!-- 右欄 -->
    <div>
      <div class="flex bg-[#51596B] text-white text-lg font-semibold rounded-lg mb-2 px-3 py-2">
        <template v-for="(title, index) in listTitle" :key="index">
          <div
            class="w-1/3"
            :class="index === 0 ? 'text-start' : 'text-end'"
          >{{ title }}</div>
        </template>
      </div>
      <ul class="grid gap-y-1.5 rounded-lg">
        <li
          v-for="(item, index) in rightColumn"
          :key="index"
          class="flex items-center text-lg rounded-lg bg-white p-3"
          :class="[
            item.level ? 'border-s-[6px]' : '',
            item.level === 'high' ? 'border-s-[#FCA2AC]' : '',
            item.level === 'mid' ? 'border-s-[#FFE482]' : '',
            item.level === 'low' ? 'border-s-[#ADF0E3]' : '',
            item.level === 'none' ? 'border-s-[#DCDFE5]' : ''
          ]"
        >
          <div class="w-1/3 font-bold">{{ item.name }}</div>
          <div class="w-1/3 text-end">{{ item.cases }}</div>
          <div class="w-1/3 text-end">{{ item.percent.toFixed(2) }}%</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  leftColumn: {
    type: Array,
    required: true
  },  
  rightColumn: {
    type: Array,
    required: true
  },
  listTitle: {
    type: Array,
    required: true
  }
})
</script>


