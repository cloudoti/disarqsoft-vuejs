<template>
  <div :class="['ml-3 text-sm font-medium text-gray-900']">
    <span
        class="-top-2 left-2 -mt-px inline-block px-1 text-xs font-medium text-gray-900">
      {{ required ? '(*) ' : '' }} {{ label }}</span>
    <Toggle
        v-model="model"
        :classes="{'is-success': model,
                  toggle: 'flex w-14 h-5 rounded-full relative cursor-pointer transition items-center box-content border-2 text-xs leading-none',
                  toggleOn: 'bg-blue-600 border-blue-600 justify-start text-white',
                  toggleOff: 'bg-gray-200 border-gray-200 justify-end text-gray-700',
                  toggleOnDisabled: 'bg-gray-300 border-gray-300 justify-start text-gray-400 cursor-not-allowed',
                  toggleOffDisabled: 'bg-gray-200 border-gray-200 justify-end text-gray-400 cursor-not-allowed',
                  handle: 'inline-block bg-white w-5 h-5 top-0 rounded-full absolute transition-all',
                  handleOn: 'left-full transform -translate-x-full',
                  handleOff: 'left-0',
                  handleOnDisabled: 'bg-gray-100 left-full transform -translate-x-full',
                  handleOffDisabled: 'bg-gray-100 left-0',
                  label: 'text-center w-8 border-box whitespace-nowrap select-none',
                  }"
        :offLabel="offLabel"
        :onLabel="onLabel"
    />
  </div>
</template>

<script setup lang="ts">

import { computed, defineEmits, defineProps } from 'vue';

import Toggle from '@vueform/toggle';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: () => (false),
  },
  label: {
    type: String,
    default: () => (''),
  },
  offLabel: {
    type: String,
    default: () => ('off'),
  },
  onLabel: {
    type: String,
    default: () => ('on'),
  },
  required: {
    type: Boolean,
    default: () => false,
  },
});

const emit = defineEmits(['update:modelValue']);

const model = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});
</script>

<style scoped>

</style>
