<template>
  <div
    class="bg-white py-2 py-md-3 flex items-center justify-between">
    <div
      class="flex-1 flex items-center justify-between"
      v-if="firstResult && maxResult && totalRows">
      <div class="hidden sm:flex pl-2">
        <p class="text-sm text-gray-700">
          Mostrando del
          <span class="font-medium">{{ firstResult }}</span>
          al
          <span class="font-medium">{{ maxResult }}</span>
          de
          <span class="font-medium">{{ totalRows }}</span>
          resultados
        </p>
      </div>
      <div>
        <Select
          @change="changeRowsPerPage"
          v-model="rowsPerPageModel"
          :options="[10, 20, 50]"
        />
      </div>
      <div>
        <nav
          class="inline-flex"
          aria-label="Pagination"
        >
          <button
            @click="previousPage()"
            class="inline-flex items-center px-2 py-2 text-sm font-medium text-gray-400 hover:text-indigo-600">
            <span class="sr-only">Previous</span>
            <ChevronLeftIcon class="h-5 w-5"/>
          </button>
          <button
            v-if="page - 3 >= 1"
            @click="setPage(page - 3)"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-400 hover:text-indigo-600"
          >
            {{ page - 3 >= 1 ? page - 3 : ' ' }}
          </button>
          <button
            v-if="page - 2 >= 1"
            @click="setPage(page - 2)"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-400 hover:text-indigo-600"
          >
            {{ page - 2 >= 1 ? page - 2 : ' ' }}
          </button>
          <button
            v-if="page - 1 >= 1"
            @click="setPage(page - 1)"
            class="hidden md:inline-flex items-center px-4 py-2 text-sm font-medium text-gray-400 hover:text-indigo-600"
          >
            {{ page - 1 >= 1 ? page - 1 : ' ' }}
          </button>
          <span
            aria-current="page"
            class="z-10 text-indigo-600 inline-flex items-center px-4 py-2 text-sm font-medium"
          >
              {{ page }}
            </span>
          <button
            v-if="page + 1 <= totalPages"
            @click="setPage(page + 1)"
            class="hidden md:inline-flex items-center px-4 py-2 text-sm font-medium text-gray-400 hover:text-indigo-600"
          >
            {{ page + 1 <= totalPages ? page + 1 : ' ' }}
          </button>
          <button
            v-if="page + 2 <= totalPages"
            @click="setPage(page + 2)"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-400 hover:text-indigo-600"
          >
            {{ page + 2 <= totalPages ? page + 2 : ' ' }}
          </button>
          <button
            v-if="page + 3 <= totalPages"
            @click="setPage(page + 3)"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-400 hover:text-indigo-600"
          >
            {{ page + 3 <= totalPages ? page + 3 : ' ' }}
          </button>
          <button
            @click="nextPage()"
            class="inline-flex items-center px-2 py-2 text-sm font-medium text-gray-400 hover:text-indigo-600">
            <span class="sr-only">Next</span>
            <ChevronRightIcon class="h-5 w-5"/>
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed, defineEmits, defineProps, ref,
} from 'vue';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/outline';
import Select from '@/ui/components/Select.vue';

const props = defineProps({
  page: {
    type: Number,
    default: () => (1),
  },
  rowsPerPage: {
    type: Number,
    default: () => (10),
  },
  firstResult: {
    type: Number,
    default: () => (0),
  },
  maxResult: {
    type: Number,
    default: () => (0),
  },
  totalRows: {
    type: Number,
    default: () => (0),
  },
  totalPages: {
    type: Number,
    default: () => (0),
  },
  onChange: {
    type: Function,
    default: () => () => true,
  },
});

const rowsPerPageModel = ref(props.rowsPerPage);

const callOnChange = (newPage: number) => {
  props.onChange(newPage, +rowsPerPageModel.value);
};

const changeRowsPerPage = (val: any) => {
  callOnChange(1);
};

const previousPage = () => {
  if (props.page > 1) {
    callOnChange(props.page - 1);
  }
};

const nextPage = () => {
  if (props.totalPages && props.page < props.totalPages) {
    callOnChange(props.page + 1);
  }
};

const setPage = (p: number | undefined) => {
  if (p && props.totalPages && p >= 1 && p <= props.totalPages) {
    callOnChange(p);
  }
};
</script>

<style scoped>

</style>
