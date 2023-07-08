<template>
  <button
    @click="onClick"
    v-bind:disabled="disabled"
    class="inline-flex justify-center text-white text-sm py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    :class="[!disabled ? (!secondary ? (third ? 'bg-red-500 hover:bg-red-500': 'bg-blue-500 hover:bg-blue-500')
    : 'border border-gray-300 text-gray-500 bg-white hover:bg-gray-100' )
    : (!secondary ? 'bg-gray-500 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-200')]"
  >
    {{ label }}
    <div
      v-if="loading"
      class="ml-3 mt-0.5 -mr-1 h-5 w-5 relative">
      <Loading
        :show="loading"
        :opacity="false"
        size="4"/>
    </div>
  </button>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

import Loading from '@/ui/components/Loading.vue';

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  disabled: {
    type: Boolean,
    required: false,
  },
  secondary: {
    type: Boolean,
    required: false,
  },
  third: {
    type: Boolean,
    required: false,
  },
  callback: {
    type: Function,
    default: () => true,
  },
  loading: {
    type: Boolean,
    required: false,
  },
});

const onClick = () => {
  if (!props.loading && props.callback && typeof props.callback === 'function') {
    props.callback();
  }
};
</script>

<style scoped>

</style>
