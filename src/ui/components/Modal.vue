<template>
  <TransitionRoot
    as="template"
    :show="model">
    <Dialog
      as="div"
      class="fixed z-10 inset-0 overflow-y-auto"
      @close="closeIfShown">
      <div
        class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0">
          <DialogOverlay class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
        </TransitionChild>

        <!-- This element is to trick the browser into centering the modal contents. -->
        <span
          class="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true">&#8203;</span>
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-to="opacity-100 translate-y-0 sm:scale-100"
          leave="ease-in duration-200"
          leave-from="opacity-100 translate-y-0 sm:scale-100"
          leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
          <div
            class="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden
            shadow-xl transform transition-all sm:my-8 sm:align-middle sm:p-6">
            <button
              v-if="!hideClose"
              aria-label="close"
              class="absolute top-0 right-0 text-3xl text-gray-500 mt-2 mx-4"
              @click="closeModal"
            >
              ×
            </button>
            <h4
              v-if="title"
              class="text-md text-gray-700 -m-2">{{ title }}</h4>
            <div class="mt-6">
              <slot/>
            </div>
          </div>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import {
  Dialog,
  DialogOverlay,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue';
import {
  computed, defineEmits, defineProps, watch,
} from 'vue';

const props = defineProps({
  modelValue: {
    required: true,
    type: Boolean,
  },
  title: {
    default: () => undefined,
    type: String,
  },
  hideClose: {
    type: Boolean,
    default: false,
  },
  dismissible: {
    type: Boolean,
    default: true,
  },
  close: {
    required: true,
    type: Function,
  },
});

const emit = defineEmits(['update:modelValue']);

const model = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

watch(model, (newVal, _) => {
  console.log('oeeee', newVal);
  if (newVal) {
    return document.querySelector('body')!
      .classList
      .add('overflow-hidden');
  }
  return document.querySelector('body')!
    .classList
    .remove('overflow-hidden');
});

const closeModal = () => {
  props.close();
};

const closeIfShown = () => {
  if (!props.hideClose && props.dismissible) {
    closeModal();
  }
};

(() => {
  if (!props.hideClose && props.dismissible) {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    });
  }
})();
</script>

<style>

</style>
