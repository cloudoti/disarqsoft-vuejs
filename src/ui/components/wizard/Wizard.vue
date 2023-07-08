<template>
  <div class="border border-gray-300 rounded-md">
    <nav>
      <ol
        class="border-b justify-center border-gray-300 divide-y divide-gray-300 flex divide-y-0"
      >
        <li
          class="relative sm:flex-1 sm:flex"
          v-for="(title, index) in tabTitles"
          :key="title">
          <a
            @click="activeStep(index, title)"
            href="#"
            class="items-center flex"
            v-bind:class="[selectedTitle === title
            ? 'group w-full'
            : 'px-6 py-4 text-sm font-medium']">
              <span
                class="items-center flex"
                v-bind:class="[selectedTitle === title
              ? 'px-6 py-4 text-sm font-medium'
              : 'flex-shrink-0 w-10 h-10 justify-center border-2 border-gray-300 rounded-full group-hover:border-gray-400']">
                <span
                  v-bind:class="[selectedTitle === title
                  ? 'flex-shrink-0 w-10 h-10 flex items-center justify-center bg-blue-600 rounded-full group-hover:bg-blue-800'
                  : 'text-gray-500 group-hover:text-gray-900']"
                >
                  <CheckIcon
                    v-if="selectedTitle === title"
                    class="w-6 h-6 text-white"/>
                  <span
                    v-else
                    class="text-gray-500 group-hover:text-gray-900">
                    0{{ index + 1 }}
                  </span>
                </span>
                <span
                  v-if="selectedTitle === title"
                  class="ml-4 text-sm font-medium text-gray-900">
                  {{ title }}
                </span>
              </span>
            <span
              v-if="selectedTitle !== title"
              class="hidden sm:block ml-4 text-sm font-medium text-gray-500 group-hover:text-gray-900">
                  {{ title }}
                </span>
          </a>

          <div
            v-show="index != tabTitles.length - 1"
            class="block absolute top-0 right-0 h-full w-5">
            <svg
              class="h-full w-full text-gray-300"
              viewBox="0 0 22 80"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M0 -2L20 40L0 82"
                vector-effect="non-scaling-stroke"
                stroke="currentcolor"
                stroke-linejoin="round"
              ></path>
            </svg>
          </div>
        </li>
      </ol>
    </nav>
    <div class="p-5">
      <slot/>
      <div
        class="border-t pt-3 flex items-center justify-between">
        <div class="flex-1 min-w-0">
          <h1 class="text-lg font-medium leading-6 text-gray-900 sm:truncate">
            <Button
              label="Atrás"
              v-if="hasPrevious()"
              @click="previous"
              :secondary="true"
            >
            </Button>
          </h1>
        </div>
        <div class="flex sm:ml-4">
          <Button
            v-if="hasNext()"
            @click="next"
            :secondary="true"
            label="Siguiente"
          >
          </Button>
          <Button
            v-if="isEnd()"
            :disabled="!isActiveEnd()"
            :label="labelEndButton"
            @click="callbackEndButton"
          >
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { provide, ref } from 'vue';

import { CheckIcon } from '@heroicons/vue/solid';
import Button from '@/ui/components/Button.vue';

export default {
  name: 'Wizard',
  props: {
    labelEndButton: {
      type: String,
      default: () => 'Finalizar',
    },
    callbackEndButton: {
      type: Function,
      require: () => true,
    },
    enableSteps: {
      type: Array,
      require: true,
    },
  },
  setup(props, { slots }) {
    const tabTitles = ref(slots.default()
      .map((tab) => tab.props.title));
    const selectedTitle = ref(tabTitles.value[0]);

    provide('selectedTitle', selectedTitle);
    return {
      tabTitles,
      selectedTitle,
    };
  },
  methods: {
    activeStep(index, title) {
      if (this.enableSteps && this.enableSteps.length >= index && this.enableSteps[index]) {
        this.selectedTitle = title;
      }
    },
    previous() {
      const index = this.tabTitles.indexOf(this.selectedTitle);

      if (index > 0 && this.enableSteps.length >= index - 1 && this.enableSteps[index - 1]) {
        this.selectedTitle = this.tabTitles[index - 1];
      }
    },
    next() {
      const index = this.tabTitles.indexOf(this.selectedTitle);

      if (index < this.tabTitles.length - 1 && this.enableSteps.length >= index && this.enableSteps[index]) {
        this.selectedTitle = this.tabTitles[index + 1];
      }
    },
    isStart() {
      const index = this.tabTitles.indexOf(this.selectedTitle);

      return index === 0;
    },
    isEnd() {
      const index = this.tabTitles.indexOf(this.selectedTitle);

      return index === this.tabTitles.length - 1;
    },
    isActiveEnd() {
      const index = this.tabTitles.indexOf(this.selectedTitle);

      if (index === this.tabTitles.length - 1 && this.enableSteps.length - 1 === index) {
        return this.enableSteps[index];
      }

      return true;
    },
    hasPrevious() {
      const index = this.tabTitles.indexOf(this.selectedTitle);
      return index > 0;
    },
    hasNext() {
      const index = this.tabTitles.indexOf(this.selectedTitle);

      return index < this.tabTitles.length - 1;
    },
  },
  components: {
    CheckIcon,
    Button,
  },
};
</script>

<style scoped>

</style>
