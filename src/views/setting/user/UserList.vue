<template>
  <BreadCrumb>Configuración / Usuarios</BreadCrumb>

  <div class="flex items-end justify-end mt-2">
    <router-link
      :to="{name: ERouteType.NEW_USER_NAME}"
      class="px-6 text-blue-600">
      Agregar
    </router-link>
  </div>

<!--  <div class="relative mt-5">
    <SearchIcon class="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
    <Input
      type="text"
      placeholder="Ingrese la empresa, ciu o correo."
      v-model.lazy="searchString"
      v-on:change="getPagedUsers()"
      :debounce="500"
    >
      <template #leftIcon>
        <SearchIcon class="h-5"/>
      </template>
    </Input>
  </div>-->

  <div class="relative mt-5">
    <Loading
      :show="loading"
      :opacity="true"
      size="10"/>

    <EmptyResult
      v-if="paginationUser?.length === 0"
    />

    <div>
      <div class="overflow-x-auto py-2 align-middle inline-block w-full">
        <table
          class="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-md"
          v-if="loading || paginationUser?.length > 0">
          <thead class="bg-gray-50">
          <tr>
            <th
              style="width: 45%;"
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
            >
              Usuario
            </th>
            <th
              style="width: 25%;"
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
            >
              Estado
            </th>
          </tr>
          </thead>
          <tbody
            v-if="paginationUser"
            class="bg-white divide-y divide-gray-200">
          <tr
            v-for="row in paginationUser"
            :key="row.id"
            class="hover:bg-gray-50"
            v-bind:class="{ 'bg-gray-300 hover:bg-gray-300': row.id === selectedRow }"
            @click="selectRow(row.id)"
          >
            <td class="px-6 py-2 text-left text-xs whitespace-nowrap">
              <div class="text-sm font-medium">
                {{ row.username }}
              </div>
            </td>
            <td class="px-6 py-4 text-left text-xs whitespace-nowrap">
              <div class="text-sm font-medium">
                {{ !row.active ? 'Inactivo' : 'Activo' }}
              </div>
            </td>
            <td class="px-6 py-2 text-xs whitespace-nowrap flex items-center justify-center">
              <router-link :to="{name: ERouteType.EDIT_USER_NAME, params: { id: row.id }}">
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
import UsersAPI from '@/data/api/UsersAPI';
import BreadCrumb from '@/ui/components/BreadCrumb.vue';
import Input from '@/ui/components/Input.vue';
import EmptyResult from '@/ui/components/table/EmptyResult.vue';
import User from '@/data/entity/User';
import ERouteType from '@/router/ERouteType';

// region constantes y variables de la página
const paginationUser = ref<User[]>();
const searchString = ref('');
const rows = ref(10);
const page = ref(1);
const loading = ref(false);
const selectedRow = ref(0);
let filters: PaginatedSearch;
// endregion constantes y variables de la página

// Método de búsqueda
const search = async (dataSearch: PaginatedSearch) => {
  loading.value = true;
  paginationUser.value = await UsersAPI.ListUsers();

  loading.value = false;
};

// Método que arma los parámetros de búsqueda para llamar al método de búsqueda
const getPagedUsers = (selectedPage?: number, rowsPerPage?: number) => {
  rows.value = rowsPerPage || rows.value;
  page.value = selectedPage || page.value;
  filters = {
    search: searchString.value,
    rows: rows.value,
    page: page.value,
  };
  search(filters);
};

// Selección de fila al clickear sobre ella
const selectRow = (id) => {
  if (selectedRow.value === id) {
    selectedRow.value = 0;
  } else {
    selectedRow.value = id;
  }
};

// Llamada al método que arma los parámetros de búsqueda al cargar la página
getPagedUsers(1, 10);

</script>

<style scoped>
</style>
