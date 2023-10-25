<template>
  <BreadCrumb>Configuración / Productos</BreadCrumb>

  <div class="flex items-end justify-end mt-2">

    <router-link
      :to="{name: ERouteType.NEW_PRODUCT_NAME}"
      class="px-6 text-blue-600">
      Agregar
    </router-link>
  </div>

  <div class="mt-5">
    <Input
      type="text"
      placeholder="Ingrese el nombre del producto ó su código."
      v-model.lazy="search"
      :hide-optional="true"
      v-on:change="getPagedPatients()"
      :debounce="500"
    >
      <template #leftIcon>
        <SearchIcon class="h-5 w-5"/>
      </template>
    </Input>
  </div>

  <div class="relative mt-5">

    <Loading
      :show="loading"
      :opacity="true"
      size="10"/>

    <EmptyResult
      v-if="!loading && paginationPatient?.length === 0"
    />
    <div>
      <div class="overflow-x-auto py-2 align-middle inline-block w-full">
        <table
          class="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-md"
          v-if="loading || paginationPatient?.length > 0"
        >
          <thead class="bg-gray-50">
          <tr>
            <th
              style="width: 60%;"
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
            >
              Nombre
            </th>
            <th
              style="width: 20%;"
              scope="col"
              class="px-6 py-3 text-center text-xs font-medium text-black uppercase tracking-wider"
            >
              Categoria
            </th>
          </tr>
          </thead>
          <tbody
            v-if="paginationPatient"
            class="bg-white divide-y divide-gray-200 text-gray-600">
          <tr
            v-for="row in paginationPatient"
            :key="row.id">
            <td class="px-6 py-2 text-left text-xs whitespace-nowrap align-top">
              <div class="text-sm font-medium">
                {{ row.name }}
              </div>
            </td>
            <td class="px-6 py-2 text-left text-xs whitespace-nowrap align-top">
              <div class="text-sm font-medium">
                {{ row.typeService?.name }}
              </div>
            </td>
            <td class="px-6 py-2 text-xs whitespace-nowrap flex items-center justify-center">
              <router-link :to="{name: ERouteType.EDIT_PRODUCT_NAME, params: { id: row.id }}">
                <PencilIcon class="h-5 w-5 text-blue-600"/>
              </router-link>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  PencilIcon, SearchIcon,
} from '@heroicons/vue/outline';
import PaginatedSearch from '@/data/entity/PaginatedSearch';
import PatientsAPI from '@/data/api/ProductsAPI';
import BreadCrumb from '@/ui/components/BreadCrumb.vue';
import Input from '@/ui/components/Input.vue';
import EmptyResult from '@/ui/components/table/EmptyResult.vue';
import Product from '@/data/entity/Product';
import ERouteType from '@/router/ERouteType';

const paginationPatient = ref<Product[]>();
const search = ref('');
const rows = ref(10);
const page = ref(1);
const loading = ref(false);

let filters: PaginatedSearch;

const mounted = async (dataSearch: PaginatedSearch) => {
  loading.value = true;
  paginationPatient.value = await PatientsAPI.ListPatient();
  loading.value = false;
};

const getPagedPatients = (selectedPage?: number, rowsPerPage?: number) => {
  rows.value = rowsPerPage || rows.value;
  page.value = selectedPage || page.value;
  filters = {
    search: search.value,
    rows: rows.value,
    page: page.value,
  };
  mounted(filters);
};

getPagedPatients(1, 10);

</script>

<style scoped>
</style>
