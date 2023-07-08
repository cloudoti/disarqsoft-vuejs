<template>

  <div class="relative ">
    <label
      for="search"
      class="text-gray-900"
    >
      {{ label }}
    </label>

    <input
      type="text"
      v-model="searchTerm"
      :placeholder="model && model.name ? model.name : placeholder"
      class="p-3 mb-0.5 w-full border rounded"
      autocomplete="off"
      :disabled="disabled"
      v-on:keyup="callBackPressEnterResult"
      v-bind:class="{ 'border-red-700': required && (!model || (model && !model.id)), 'border-gray-300 placeholder-black': model && model.id }"
    >
    <ul
      v-if="showEmptyResult && !searchItems.length && searchTerm.trim() !=='' && !model.id "
    >
      <li
@click="callBackEmptyResult"
          class="cursor-pointer hover:bg-gray-100 px-2 py-1 pt-1 pb-2 font-bold border-gray-200"
      >{{messageEmptyResult}}</li>
    </ul>
    <ul
      v-if="searchItems.length"
      class="w-full rounded bg-white border border-gray-300 space-y-1 absolute z-10 content-input-auto custom-scroll"
    >
      <li
        v-show="showSearchCount"
        class="px-1 pt-1 pb-2 font-bold border-b border-gray-200">
        Mostrando {{ searchItems.length }} de {{ suggestions.length }} resultados
      </li>
      <li
        v-for="(searchItem, index) in searchItems"
        :key="index + '-' + searchItem[keyName]"
        @click="selectItem(searchItem) "
        class="cursor-pointer hover:bg-gray-100 px-2 py-1"
      >
        {{ searchItem[keyName] }}
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import {
  computed, defineEmits, defineProps, PropType, ref, watch,
} from 'vue';

const searchTerm = ref('');
let searchSelected: string | undefined = '';

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
  label: {
    type: String,
    default: '',
  },
  showSearchCount: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: '',
  },
  typeModal: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
  suggestions: Array,
  keyName: String,
  keysFilter: Array as PropType<Array<string>>,
  callBackEmpty: {
    type: Function,
    default: () => true,
  },
  callBackPressEnter: {
    type: Function,
    default: () => true,
  },
  messageEmptyResult: {
    type: String,
    default: 'No se encontraron resultados',
  },
  showEmptyResult: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);

const model = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

const selectItem = (item: any) => {
  searchSelected = item.name;
  model.value = item;
  searchTerm.value = `${item.name}`;
};

const searchItems = computed(() => {
  if (searchSelected !== '' && searchSelected === searchTerm.value) {
    return [];
  }
  const reset = () => {
    model.value = {};
    searchSelected = '';
  };
  reset();
  if (searchTerm.value === '') {
    return [];
  }
  let matches = 0;
  // eslint-disable-next-line
  const considence = props.suggestions?.filter((suggestion: any) => {

    if (suggestion !== undefined && suggestion !== null && searchTerm.value.length > 0) {
      let filterKeys: string[] = [];
      if (props.keysFilter !== undefined) {
        filterKeys = props.keysFilter;
      } else {
        filterKeys = Object.keys(suggestion);
      }
      // eslint-disable-next-line
      for (const prop of filterKeys) {
        const val = suggestion[prop];
        if (val !== undefined && val !== null && val.toString()
          .toLowerCase()
          .includes(searchTerm.value.toLowerCase())) {
          matches += 1;
          return suggestion;
        }
      }
    }
    return '';
  });
  return considence;
});

const callBackEmptyResult = () => {
  searchTerm.value = '';
  if (props.callBackEmpty !== undefined && typeof props.callBackEmpty === 'function') {
    props.callBackEmpty(props.typeModal?.trim());
  }
};

const callBackPressEnterResult = (e) => {
  if (e.keyCode === 13) {
    searchTerm.value = '';
  }
  if (props.callBackPressEnter !== undefined && typeof props.callBackPressEnter === 'function') {
    props.callBackPressEnter(props.typeModal?.trim(), e);
  }
};

</script>
