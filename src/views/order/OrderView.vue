<template>
  <div class="mx-auto lg:max-w-7xl">
    <div class="bg-white px-4 shadow p-6 sm:rounded-lg">
      <div
          id="print"
          class="mt-10 mb-10"
          v-if="!loadingProduct && order.id">
        <div class="px-4 sm:px-6 lg:px-8">
          <div class="sm:flex sm:items-center">
            <div class="sm:flex-auto">
              <h1 class="text-base font-semibold leading-6 text-gray-900">Orden: {{getNumber(order.id)}}</h1>
              <p class="mt-2 text-sm text-gray-700">Grabada el
                <time>{{ moment(order.issueDate).format('DD/MM/YYYY hh:mm') }}</time>
              </p>
            </div>
          </div>
          <div class="sm:flex sm:items-center mt-5">
            <div class="sm:flex-auto">
              <h2 class="text-base font-semibold leading-6 text-gray-900">Cliente</h2>
              <p class="mt-2 text-sm text-gray-700">
                <span>{{
                    `${order.client.name} ${order.client.fatherLastName} ${order.client.motherLastName}`
                  }}</span>.
              </p>
            </div>
          </div>
          <div class="sm:flex sm:items-center mt-5">
            <div class="sm:flex-auto">
              <h2 class="text-base font-semibold leading-6 text-gray-900">Vehículo</h2>
              <p class="mt-2 text-sm text-gray-700">
                <span>{{
                    `${order.vehicle.vehicleRegistration} ${order.vehicle.type} ${order.vehicle.model}`
                  }}</span>.
              </p>
            </div>
          </div>

          <div class="-mx-4 mt-8 flow-root sm:mx-0">
            <table class="min-w-full">
              <colgroup>
                <col class="w-full sm:w-1/2">
                <col class="sm:w-1/6">
                <col class="sm:w-1/6">
                <col class="sm:w-1/6">
              </colgroup>
              <thead class="border-b border-gray-300 text-gray-900">
              <tr>
                <th
                    scope="col"
                    class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Servicio
                </th>
                <th
                    scope="col"
                    class="hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-900 sm:table-cell">Cantidad
                </th>
                <th
                    scope="col"
                    class="hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-900 sm:table-cell">IGV
                </th>
                <th
                    scope="col"
                    class="py-3.5 pl-3 pr-4 text-right text-sm font-semibold text-gray-900 sm:pr-0">Precio
                </th>
              </tr>
              </thead>
              <tbody>
              <tr
                  class="border-b border-gray-200"
                  v-for="(row) in order.detail"
                  :key="row.id">
                <td class="max-w-0 py-5 pl-4 pr-3 text-sm sm:pl-0">
                  <div class="font-medium text-gray-900">
                    {{ `${row.product?.name}` }}
                  </div>
                  <div class="mt-1 truncate text-gray-500">{{ `${row?.product?.typeService?.name ?? ''}` }}</div>
                </td>
                <td class="hidden px-3 py-5 text-right text-sm text-gray-500 sm:table-cell">S/
                  {{ `${row?.quantity ?? '0.00'}` }}
                </td>
                <td class="hidden px-3 py-5 text-right text-sm text-gray-500 sm:table-cell">S/
                  {{ `${row?.igv ?? '0.00'}` }}
                </td>
                <td class="py-5 pl-3 pr-4 text-right text-sm text-gray-500 sm:pr-0">S/
                  {{ parseFloat(`${row?.total ?? '0.00'}`) - parseFloat(`${row?.igv ?? '0.00'}`) }}
                </td>
              </tr>

              </tbody>
              <tfoot>
              <tr>
                <th
                    scope="row"
                    colspan="3"
                    class="hidden pl-4 pr-3 pt-4 text-right text-sm font-normal text-gray-500 sm:table-cell sm:pl-0">Sub
                  Total
                </th>
                <th
                    scope="row"
                    class="pl-4 pr-3 pt-4 text-left text-sm font-normal text-gray-500 sm:hidden">Sub total
                </th>
                <td class="pl-3 pr-4 pt-4 text-right text-sm text-gray-500 sm:pr-0">S/ {{ parseFloat(`${subTotal}`).toFixed(2) }}</td>
              </tr>
              <tr>
                <th
                    scope="row"
                    colspan="3"
                    class="hidden pl-4 pr-3 pt-4 text-right text-sm font-normal text-gray-500 sm:table-cell sm:pl-0">IGV
                </th>
                <th
                    scope="row"
                    class="pl-4 pr-3 pt-4 text-left text-sm font-normal text-gray-500 sm:hidden">IGV
                </th>
                <td class="pl-3 pr-4 pt-4 text-right text-sm text-gray-500 sm:pr-0">S/ {{
                    parseFloat(`${order?.igv ?? '0.00'}`).toFixed(2)
                  }}
                </td>
              </tr>
              <tr>
                <th
                    scope="row"
                    colspan="3"
                    class="hidden pl-4 pr-3 pt-4 text-right text-sm font-semibold text-gray-900 sm:table-cell sm:pl-0">
                  Total
                </th>
                <th
                    scope="row"
                    class="pl-4 pr-3 pt-4 text-left text-sm font-semibold text-gray-900 sm:hidden">Total
                </th>
                <td class="pl-3 pr-4 pt-4 text-right text-sm font-semibold text-gray-900 sm:pr-0">S/
                  {{ parseFloat(`${order?.total ?? '0.00'}`).toFixed(2) }}
                </td>
              </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
      <div class="px-5 sm:px-8 lg:px-10 py-5 text-right">
        <Button
            :label="'Descargar'"
            :callback="handleSubmit"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  defineProps, ref,
} from 'vue';
import { useToast } from 'vue-toastification';
import html2pdf from 'html2pdf.js';
// eslint-disable-next-line import/no-cycle
import moment from 'moment';
import Order from '@/data/entity/Order';
import Button from '@/ui/components/Button.vue';
import OrdersAPI from '@/data/api/OrdersAPI';

const toast = useToast();

const loadingProduct = ref(false);

const order = ref<Order>({});

const subTotal = ref(0.00);

const props = defineProps({
  id: {
    type: String,
    default: '0',
  },
  notRedirect: {
    type: Boolean,
    default: false,
  },
  callbackSubmit: {
    type: Function,
    default: () => true,
  },
  showBreadCrumb: {
    type: Boolean,
    default: true,
  },
});

const getNumber = (number) => `ORD-${`${number}`.padStart(8, '0')}`;

const handleSubmit = async () => {
  html2pdf(document.getElementById('print'), { margin: 1, filename: `${getNumber(order.value.id)}.pdf` });
};

const mounted = async () => {
  loadingProduct.value = true;
  const promises: Promise<any>[] = [];

  promises.push(OrdersAPI.GetById(+props.id));

  Promise.all(promises)
    .then((values) => {
      const [q] = values;
      // Se obtiene el resultado de la primera promesa

      order.value = q;
      subTotal.value = q.total - q.igv;
    })
    .catch(() => {
      toast.warning('Ocurrio error al cargar la información');
    })
    .finally(() => {
      loadingProduct.value = false;
    });
};

mounted();

</script>

<style scoped>

</style>
