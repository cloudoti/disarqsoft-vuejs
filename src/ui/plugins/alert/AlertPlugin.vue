<template>
  <TransitionRoot
    as="template"
    :show="open">
    <Dialog
      as="div"
      class="fixed z-10 inset-0 overflow-y-auto"
      @close="dismiss">
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
            class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
            <div>
              <div
                class="mx-auto flex items-center justify-center h-12 w-12 rounded-full"
                :class="[type === 'success'? 'bg-green-100' : '',
                type === 'info'? 'bg-blue-100' : '',
                type === 'warning'? 'bg-yellow-100' : '',
                type === 'error'? 'bg-red-100' : '',
                ]">
                <CheckIcon
                  v-if="type === 'success'"
                  class="h-6 w-6 text-green-600"
                  aria-hidden="true"/>
                <InformationCircleIcon
                  v-else-if="type === 'info'"
                  class="h-6 w-6 text-blue-600"
                  aria-hidden="true"/>
                <ExclamationIcon
                  v-else-if="type === 'warning'"
                  class="h-6 w-6 text-yellow-600"
                  aria-hidden="true"/>
                <EmojiSadIcon
                  v-else-if="type === 'error'"
                  class="h-6 w-6 text-red-600"
                  aria-hidden="true"/>
              </div>
              <div class="mt-3 text-center sm:mt-5">
                <DialogTitle
                  as="h3"
                  class="text-lg leading-6 font-medium text-gray-900">
                  {{ title }}
                </DialogTitle>
                <div class="mt-2">
                  <p
                    class="text-sm text-gray-500"
                    v-for="(message, index) in messages"
                    v-bind:key="index">
                    {{ message }}
                  </p>
                </div>
              </div>
            </div>
            <div
              class="mt-5 sm:mt-6"
              :class="[showButtonCancel ? 'sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense' : '']">
              <button
                type="button"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                @click="clickYes">
                {{ buttonYesName }}
              </button>
              <button
                v-if="showButtonCancel"
                type="button"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                @click="clickCancel"
                ref="cancelButtonRef">
                {{ buttonCancelName }}
              </button>
            </div>
          </div>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script>
import { ref } from 'vue';
import {
  Dialog,
  DialogOverlay,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue';
import {
  CheckIcon,
  ExclamationIcon,
  InformationCircleIcon,
  EmojiSadIcon,
} from '@heroicons/vue/outline';
import removeElement from './helpers/remove-element';

export default {
  name: 'AlertPlugin',
  components: {
    Dialog,
    DialogOverlay,
    DialogTitle,
    TransitionChild,
    TransitionRoot,
    CheckIcon,
    ExclamationIcon,
    InformationCircleIcon,
    EmojiSadIcon,
  },
  props: {
    type: {
      type: String,
      required: true,
    },
    messages: {
      type: Array,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    buttonYesName: {
      type: String,
      default: 'Ok',
    },
    showButtonCancel: {
      type: Boolean,
      default: false,
    },
    buttonCancelName: {
      type: String,
      default: 'Cancel',
    },
    dismissible: {
      type: Boolean,
      default: true,
    },
    onClickYes: {
      type: Function,
      default: () => true,
    },
    onClickCancel: {
      type: Function,
      default: () => true,
    },
    onClose: {
      type: Function,
      default: () => true,
    },
  },
  setup() {
    const open = ref(true);

    return {
      open,
    };
  },
  methods: {
    close() {
      this.open = false;
      if (this.onClose !== 'undefined' && typeof this.onClose === 'function') {
        this.onClose();
      }

      setTimeout(() => {
        // this.onClose.apply(null, arguments);
        removeElement(this.$el);
      }, 250);
    },
    dismiss() {
      if (this.dismissible) {
        this.close();
      }
    },
    clickYes() {
      if (this.onClickYes !== 'undefined' && typeof this.onClickYes === 'function') {
        this.onClickYes();
      }
      this.close();
    },
    clickCancel() {
      if (this.onClickCancel !== 'undefined' && typeof this.onClickCancel === 'function') {
        this.onClickCancel();
      }
      this.close();
    },
  },
};
</script>

<style scoped>

</style>
