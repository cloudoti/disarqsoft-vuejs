<template>
  <div class="text-xl">
    <h1 class="flex items-center">
      <i
        v-if="showBack"
        @click="back"
        class="cursor-pointer">
        <ChevronLeftIcon class="flex-shrink-0 mr-1.5 h-6 w-6"/>
      </i>
      <strong>
        <slot/>
      </strong>
    </h1>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { ChevronLeftIcon } from '@heroicons/vue/outline';
import router from '@/router';

const props = defineProps({
  showBack: {
    type: Boolean,
    default: () => (false),
  },
});

const back = () => {
  router.go(-1);
};
</script>

<style scoped>

</style>
