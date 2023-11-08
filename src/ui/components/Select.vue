<template>
  <div
    class="border border-gray-300 rounded-md px-3 py-1 shadow-sm focus-within:ring-1"
    :class="[
      this.$attrs.disabled ? 'bg-gray-100' : 'bg-' + bgColor,
      (errors?.length??0) == 0 ? 'focus-within:ring-blue-600 focus-within:border-blue-600' :
      'border-red-300 focus-within:ring-red-600 focus-within:border-red-600'
    ]">
    <label
      :for="label??'none'"
      class="-top-2 left-2 -mt-px inline-block px-1 text-xs font-medium text-gray-900"
      :class="['bg-' + bgColor]">
      {{ required ? '(*) ' : '' }} {{ label }}</label>
    <div
      class="w-full inline-flex text-gray-400"
      :class="[this.$attrs.disabled ? 'bg-gray-100' : 'bg-' + bgColor]">
      <slot name="leftIcon"/>

      <select
        :name="label??'none'"
        v-model="model"
        v-bind="$attrs"
        @change="onChangeLocal"
        class="block w-full border-0 py-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
        :class="[$slots.leftIcon ? 'ml-2' : '', this.$attrs.disabled ? 'bg-gray-100' : 'bg-' + bgColor]"
      >
        <option
          hidden
          selected
          v-if="showFirstOption || $slots.firstOptionContent">
          <div v-if="$slots.firstOptionContent">
            <slot name="firstOptionContent"/>
          </div>
          <div v-else>
            Seleccione una opción
          </div>
        </option>
        <option
          v-for="(item, index) of options"
          :key="index"
          v-bind:value="bindValue ? item[bindValue] : item"
        >
          <div v-if="$slots.optionContent">
            <slot
              name="optionContent"
              :item="item"></slot>
          </div>
          <div v-else>
            {{ item.toString() }}
          </div>
        </option>
      </select>
    </div>
  </div>
  <p
    v-for="(error, index) in errors"
    :key="index"
    class="ml-3 mt-2 text-sm text-red-600"
    id="email-error">{{ error.$message }}</p>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

export default defineComponent({
  name: 'Select',
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: [Object, Number, String],
      default: () => undefined,
    },
    options: {
      type: Array,
      default: () => [],
    },
    bindValue: {
      type: String,
      default: () => undefined,
    },
    label: {
      type: String,
      default: () => '',
    },
    bgColor: {
      type: String,
      default: () => 'white',
    },
    required: {
      type: Boolean,
      default: () => false,
    },
    showFirstOption: {
      type: Boolean,
      default: () => false,
    },
    onChange: {
      type: Function,
      default: () => true,
    },
    errors: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    const model = computed({
      get: () => props.modelValue,
      set: (val) => emit('update:modelValue', val),
    });

    return {
      model,
    };
  },
  methods: {
    onChangeLocal(e) {
      if (this.onChange && typeof this.onChange === 'function') {
        this.onChange();
      }
    },
  },
});
</script>

<style scoped>

</style>
