<template>
  <div
    v-if="show"
    class="flex justify-center items-center absolute top-0 left-0 h-full w-full z-10"
    :class="[opacity ? 'bg-gray-100 bg-opacity-50' : '']">
    <div
      class="
      animate-spin
      rounded-full
      border-t-4 border-b-4"
      :class="['h-' + size + ' w-' + size, opacity ? 'border-blue-600' : 'border-gray-100']"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: () => (false),
  },
  opacity: {
    type: Boolean,
    default: () => (false),
  },
  size: {
    type: String,
    default: () => ('10'),
  },
});
</script>

<style scoped>

</style>
