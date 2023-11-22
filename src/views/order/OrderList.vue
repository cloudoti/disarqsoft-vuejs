<template>
  <div class="mx-auto lg:max-w-7xl">
    <div class="bg-white px-4 shadow p-6 sm:rounded-lg">
      <BreadCrumb :show-back="false">Ordenes</BreadCrumb>
      <section
          aria-labelledby="who-to-follow-heading">
        <div class="flex items-end justify-end mt-2">
          <router-link
              :to="{name: ERouteType.NEW_ORDER_NAME}"
              class="px-6 text-blue-600">
            Agregar
          </router-link>
        </div>
        <div class="mt-5">
          <Input
              type="text"
              placeholder="Buscar por código de orden."
              v-model.lazy="search"
              :hide-optional="true"
              v-on:change="getPagedOrden()"
              :debounce="500"
          >
            <template #leftIcon>
              <SearchIcon class="h-5 w-5"/>
            </template>
          </Input>
        </div>
        <div class="mt-4">
          <table
              class="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-md"
              v-if="loading || pagination?.length > 0"
          >
            <thead class="bg-gray-50">
            <tr>
              <th
                  style="width: 10%;"
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
              >
                Código
              </th>
              <th
                  style="width: 40%;"
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
              >
                Datos del Cliente
              </th>
              <th
                  style="width: 20%;"
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
              >
                Datos del Vehículo
              </th>
              <th
                  style="width: 20%;"
                  scope="col"
                  class="px-6 py-3 text-center text-xs font-medium text-black uppercase tracking-wider"
              >
                Detalle
              </th>
              <th
                  style="width: 10%;"
                  scope="col"
                  class="px-6 py-3 text-center text-xs font-medium text-black uppercase tracking-wider"
              >
                Total
              </th>
            </tr>
            </thead>
            <tbody
                v-if="pagination"
                class="bg-white divide-y divide-gray-200 text-gray-600">
            <tr
                v-for="row in pagination"
                :key="row.id">
              <td class="px-6 py-2 text-left text-xs whitespace-nowrap items-center justify-center">
                <div class="text-sm font-medium">
                  {{ `ORD-000${row.id}` }}
                </div>
              </td>
              <td class="px-6 py-2 text-left text-xs whitespace-nowrap items-center justify-center">
                <div class="text-sm font-medium">
                  {{ `${row.client.name} ${row.client.fatherLastName} ${row.client.motherLastName}` }}
                </div>
              </td>
              <td class="px-6 py-2 text-left text-xs whitespace-nowrap align-top">
                <div class="text-sm">
                  <span class="font-medium">Placa:</span> {{ `${row.vehicle.vehicleRegistration}` }}
                </div>
                <div class="text-sm">
                  <span class="font-medium">Modelo:</span> {{ row.vehicle.model }}
                </div>
                <div class="text-sm">
                  <span class="font-medium">Motor:</span> {{ row.vehicle.motor }}
                </div>
              </td>
              <td class="px-6 py-2 text-center text-xm whitespace-nowrap items-center justify-center">
                <div>
                  <button
                      @click="() => openModal(row)"
                      class="text-blue-600">
                    Ver orden
                  </button>
                </div>
              </td>
              <td class="px-6 py-2 text-center font-medium whitespace-nowrap items-center justify-center">
                <div>
                  {{ parseFloat(`${row.total}`).toFixed(2) }}
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </div>
  <Modal
      :model-value="open"
      :close="closeModal"
      :dismissible="true">
    <OrderView :id="`${orderId}`"/>
  </Modal>
</template>

<script setup lang="ts">
import {
  PencilIcon, SearchIcon,
} from '@heroicons/vue/outline';
import { ref } from 'vue';
import BreadCrumb from '@/ui/components/BreadCrumb.vue';
import ERouteType from '@/router/ERouteType';
import Input from '@/ui/components/Input.vue';
import PaginatedSearch from '@/data/entity/PaginatedSearch';
import OrdersAPI from '@/data/api/OrdersAPI';
import OrderView from '@/views/order/OrderView.vue';
import Button from '@/ui/components/Button.vue';
import Modal from '@/ui/components/Modal.vue';
import Order from '@/data/entity/Order';

const pagination = ref<Order[]>();

const search = ref('');
const rows = ref(10);
const page = ref(1);
const loading = ref(false);

const open = ref(false);
const orderId = ref(0);

let filters: PaginatedSearch;

const mounted = async (dataSearch: PaginatedSearch) => {
  loading.value = true;
  pagination.value = await OrdersAPI.List(dataSearch.search);
  loading.value = false;
};

const getPagedOrden = (selectedPage?: number, rowsPerPage?: number) => {
  rows.value = rowsPerPage || rows.value;
  page.value = selectedPage || page.value;
  filters = {
    search: search.value,
    rows: rows.value,
    page: page.value,
  };
  mounted(filters);
};

const openModal = (quotation) => {
  console.log(quotation.id);
  orderId.value = quotation.id;
  open.value = true;
};

const closeModal = () => {
  open.value = false;
};

getPagedOrden(1, 10);
</script>

<style scoped>

</style>
