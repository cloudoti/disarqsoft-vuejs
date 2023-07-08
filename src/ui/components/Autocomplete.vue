<template>
  <div>
    <Input
      type="text"
      autocomplete="off"
      v-model="model"
      v-bind="$attrs"
      @input="selected = false"
    />
    <ul
      v-if="showEmptyResult && !searchItems.length && model.toString().trim() !== ''"
    >
      <li
        @click="selectedEmptyLocal"
        class="cursor-pointer hover:bg-gray-100 px-2 py-2 border-gray-200"
      >
        <div v-if="$slots.messageEmptyResult">
          <slot name="messageEmptyResult"/>
        </div>
        <div
          class="ml-3 mt-2 text-sm text-red-600"
          v-else>
          No se encontraron resultados
        </div>
      </li>
    </ul>
    <ul
      v-if="!selected && searchItems.length"
      class="rounded bg-white border border-gray-300 space-y-1 content-input-auto custom-scroll"
    >
      <li
        v-for="(searchItem, index) in searchItems"
        :key="index + '-' + searchItem.toString()"
        @click="selectedItemLocal(searchItem, index)"
        class="cursor-pointer hover:bg-gray-100 px-2 py-1"
      >
        <div v-if="$slots.messageResult">
          <slot
            name="messageResult"
            :item="searchItem"></slot>
        </div>
        <div v-else>
          {{ searchItem.toString() }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import {
  computed, ref, defineComponent,
} from 'vue';
import Input from '@/ui/components/Input.vue';

export default defineComponent({
  inheritAttrs: false,
  components: {
    Input,
  },
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: String,
      default: () => '',
    },
    suggestions: {
      type: Array,
      default: () => [],
    },
    showEmptyResult: {
      type: Boolean,
      default: false,
    },
    match: {
      type: Function,
      default: undefined,
    },
    selectedItem: {
      type: Function,
      required: true,
    },
    selectedEmpty: {
      type: Function,
      default: () => true,
    },
    isInitial: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const isInitial = ref(props.isInitial);
    const model = computed({
      get: () => props.modelValue,
      set: (val) => emit('update:modelValue', val),
    });

    const selected = ref(!!isInitial.value);

    const searchItems = computed(() => {
      if (props.modelValue === '') {
        return [];
      }

      // eslint-disable-next-line
      return (props.suggestions ?? []).filter((suggestion: any) => {
        if (suggestion && props.modelValue.length > 0) {
          if (props.match && typeof props.match === 'function') {
            return props.match(props.modelValue, suggestion);
          }

          const filterKeys = Object.keys(suggestion);

          // eslint-disable-next-line
          for (const prop of filterKeys) {
            const val = suggestion[prop];
            if (val !== undefined && val !== null && val.toString()
              .toLowerCase()
              .includes(props.modelValue.toLowerCase())) {
              return true;
            }
          }
        }
        selected.value = !props.isInitial;
        return false;
      });
    });

    const selectedItemLocal = (item: any, index: number) => {
      if (props.selectedItem && typeof props.selectedItem === 'function') {
        props.selectedItem(item, index);
      }
      selected.value = true;
    };

    const selectedEmptyLocal = () => {
      if (props.selectedEmpty && typeof props.selectedEmpty === 'function') {
        props.selectedEmpty();
      }
    };

    return {
      model,
      searchItems,
      selected,
      selectedItemLocal,
      selectedEmptyLocal,
    };
  },
});
</script>
