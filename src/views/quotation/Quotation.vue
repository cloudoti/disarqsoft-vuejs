<template>
  <div class="mx-auto lg:max-w-7xl">
    <div class="bg-white px-4 shadow p-6 sm:rounded-lg">
      <BreadCrumb :show-back="true">Cotizaciones /
        {{ +props.id > 0 ? 'Editar' : 'Agregar' }}
      </BreadCrumb>
      <form class="relative mt-10">
        <Loading
            opacity
            :show="loadingProduct"
            size="10"/>
        <div class="px-5 sm:px-8 lg:px-10 py-5">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <Autocomplete
                  label="Cliente"
                  placeholder="Cliente (nombre ó documento)"
                  v-bind:suggestions="filterClientList"
                  v-model="clientName"
                  v-bind:selected-item="selectClient"
                  v-on:change="getClientList"
                  :required="true"
                  :show-empty-result="false"
                  :debounce="500"
              >
                <template #messageResult="item">
                  <div class="flex-row">
                    <div class="mt-1">{{ `${item.item.typeNie}: ${item.item.nie}` }}</div>
                    {{ `NOMBRE: ${item.item.name} ${item.item.fatherLastName} ${item.item.motherLastName}` }}
                  </div>
                </template>
              </Autocomplete>
            </div>
            <div>
              <Input
                  autocomplete="off"
                  v-model="client.companyName"
                  :disabled="true"
                  :hide-optional="true"
              />
            </div>
          </div>
          <div class="grid grid-cols-3 gap-4 mt-6">
            <div>
              <Input
                  autocomplete="off"
                  v-model="client.phone"
                  :disabled="true"
                  :hide-optional="true"
              />
            </div>
            <div class="col-span-2">
              <Input
                  autocomplete="off"
                  v-model="client.email"
                  :disabled="true"
                  :hide-optional="true"
              />
            </div>
          </div>
        </div>
        <div class="px-5 sm:px-8 lg:px-10 py-5">
          <div class="grid grid-cols-4 gap-4">
            <div>
              <Select
                  label="Vehículos"
                  name="vehicleSelect"
                  v-model="vehicle"
                  :required="true"
                  :options="vehicleList"
              >
                <template #optionContent="item">
                  {{ item.item.brand?.name }} {{ item.item.model }} {{ item.item.vehicleRegistration }}
                </template>
              </Select>
            </div>
            <div>
              <Input
                  autocomplete="off"
                  v-model="vehicle.type"
                  :disabled="true"
                  :hide-optional="true"
              />
            </div>
            <div>
              <Input
                  autocomplete="off"
                  v-model="vehicle.model"
                  :disabled="true"
                  :hide-optional="true"
              />
            </div>
            <div>
              <Input
                  autocomplete="off"
                  v-model="vehicle.year"
                  :disabled="true"
                  :hide-optional="true"
              />
            </div>
          </div>
        </div>
        <hr>
        <div class="px-5 sm:px-8 lg:px-10 py-5">
          <div class="grid grid-cols-4 gap-4 items-center justify-center">
            <div>
              Detalle del servicio
            </div>
            <div class="col-start-4 col-span-2 text-right">
              <a class="px-6 text-blue-600">
                <Autocomplete
                    label="Producto"
                    placeholder="Producto (nombre ó tipo de servicio)"
                    v-bind:suggestions="filterProductList"
                    v-model="productName"
                    v-bind:selected-item="selectProduct"
                    v-on:change="getProductList"
                    :required="true"
                    :show-empty-result="false"
                    :debounce="500"
                >
                  <template #messageResult="item">
                    {{ item.item.name }}
                  </template>
                </Autocomplete>
              </a>
            </div>
          </div>
        </div>
        <div class="px-5 sm:px-8 lg:px-10 py-5">
          <div class="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
            <table class="text-left">
              <tbody>
              <tr
                  v-for="(row, i) in quotationDetail"
                  :key="row.id">
                <td>
                  <div class="flex items-center">
                    <div class="h-10 w-10 flex-shrink-0">
                      <div class="h-10 w-10 rounded-full bg-gray-700">
                        <div class="relative left-4 top-2 text-white">{{ i + 1 }}</div>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="flex font-medium text-gray-900">
                        {{ `${row.product?.name}` }}
                        <a
                            class="ml-2"
                            v-on:click="remoteProduct(i)">
                          <TrashIcon class="h-5 w-5 text-blue-600"/>
                        </a>
                      </div>
                      <div class="mt-1 text-gray-500">{{ `${row.product?.typeService?.name}` }}</div>
                    </div>
                  </div>
                </td>
                <td class="relative py-5 pr-6">
                  <div class="flex gap-x-6">
                    <div class="flex-auto">
                      <div class="flex items-start gap-x-3">
                        <div class="text-sm font-medium leading-6 text-gray-900">
                          S/ {{ parseFloat(`${row.product?.price ?? "0.00"}`).toFixed(2) }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="absolute bottom-0 right-full h-px w-screen bg-gray-100"></div>
                  <div class="absolute bottom-0 left-0 h-px w-screen bg-gray-100"></div>
                </td>
                <td class="hidden py-5 pr-6 sm:table-cell w-1/7">
                  <div class="text-sm leading-6 text-gray-900">
                    <Input
                        label="Cantidad"
                        name="quantity"
                        autocomplete="off"
                        placeholder="Cantidad"
                        v-model="row.quantity"
                        :required="false"
                        :hide-optional="true"
                        :errors="errors[i]"
                        v-on:change="() => calculateProduct()"
                        :debounce="250"
                    /></div>
                </td>
                <td class="py-5 text-right">
                  <div class="flex justify-end">
                    <a
                        href="#"
                        class="text-sm font-medium leading-6 text-indigo-600 hover:text-indigo-500"><span
                        class="hidden sm:inline"> S/ {{ parseFloat(`${row.price ?? "0.00"}`).toFixed(2) }}</span></a>
                  </div>
                  <div class="mt-1 text-xs leading-5 text-gray-900">S/ {{
                      parseFloat(`${row.igv ?? "0.00"}`).toFixed(2)
                    }} IGV
                  </div>
                </td>
              </tr>
              </tbody>
              <tfoot v-show="quotationDetail.length > 0">
              <tr>
                <th
                    scope="row"
                    colspan="3"
                    class="hidden pl-4 pr-3 pt-4 text-right text-sm font-normal text-gray-500 sm:table-cell sm:pl-0">Sub
                  total
                </th>
                <th
                    scope="row"
                    class="pl-4 pr-3 pt-4 text-left text-sm font-normal text-gray-500 sm:hidden">Sub total
                </th>
                <td class="pl-3 pr-4 pt-4 text-right text-sm text-gray-500 sm:pr-0"> S/
                  {{ parseFloat(`${subtotal ?? "0.00"}`) }}
                </td>
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
                <td class="pl-3 pr-4 pt-4 text-right text-sm text-gray-500 sm:pr-0"> S/
                  {{ parseFloat(`${igv ?? "0.00"}`).toFixed(2) }}
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
                <td class="pl-3 pr-4 pt-4 text-right text-sm font-semibold text-gray-900 sm:pr-0"> S/
                  {{ parseFloat(`${total ?? "0.00"}`).toFixed(2) }}
                </td>
              </tr>
              </tfoot>
            </table>
          </div>
          <div class="mt-3">(*) Campos obligatorios</div>
        </div>
      </form>
      <div class="px-5 sm:px-8 lg:px-10 py-5 text-right">
        <Button
            :label="'Agregar cotización'"
            :callback="handleSubmit"
            :disabled="btnAcceptDisable"
            :loading="loadingButton"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed, defineProps, reactive, ref,
} from 'vue';
import { useToast } from 'vue-toastification';
import Decimal from 'decimal.js';
import {
  TrashIcon,
} from '@heroicons/vue/outline';
import { createAlert } from '@/ui/plugins/alert';
// eslint-disable-next-line import/no-cycle
import router from '@/router';
import BreadCrumb from '@/ui/components/BreadCrumb.vue';
import Loading from '@/ui/components/Loading.vue';
import Input from '@/ui/components/Input.vue';
import Autocomplete from '@/ui/components/Autocomplete.vue';
import ClientsAPI from '@/data/api/ClientsAPI';
import VehiclesAPI from '@/data/api/VehiclesAPI';
import ProductsAPI from '@/data/api/ProductsAPI';
import Select from '@/ui/components/Select.vue';
import Vehicle from '@/data/entity/Vehicle';
import Product from '@/data/entity/Product';
import Client from '@/data/entity/Client';
import Quotation from '@/data/entity/Quotation';
import QuotationDetail from '@/data/entity/QuotationDetail';
import Button from '@/ui/components/Button.vue';
import QuotationsAPI from '@/data/api/QuotationsAPI';
import User from '@/data/entity/User';

const toast = useToast();
const alert = createAlert();

const loadingProduct = ref(false);
const loadingButton = ref(false);

const vehicleList = ref<Vehicle[]>([]);
const vehicle = ref<Vehicle>({});

const clientName = ref('');
const client = ref<Client>({});

const clientList = ref<Client[]>();
const filterClientList = ref<Client[]>();

const productName = ref('');
const product = ref<Product>({});

const productList = ref<Product[]>();
const filterProductList = ref<Product[]>();

let quotation: Quotation;
const quotationDetail = ref<QuotationDetail[]>([]);

const errors = ref<any[]>([]);

const subtotal = ref(0);
const total = ref(0);
const igv = ref(0);

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

const checkIsNumber = (value) => {
  const numericRegex = /^[0-9]*$/;

  const isNumber = value && numericRegex.test(`${value}`);

  return isNumber && +value > 0;
};

const btnAcceptDisable = computed(() => !client.value.id || !vehicle.value.id
    || !quotationDetail.value || quotationDetail.value.length === 0
    || quotationDetail.value.some((v) => !checkIsNumber(v.quantity ?? '0')) || errors.value.some((v) => (v?.length ?? 0) > 0));

const selectClient = (item) => {
  client.value = item;
  clientName.value = `${item.name} ${item.fatherLastName} ${item.motherLastName}`;

  VehiclesAPI.ListByClient(item.id).then((data) => {
    vehicleList.value = data;
  });
};

const getClientList = () => {
  if (!clientName.value) {
    return;
  }

  filterClientList.value = clientList.value?.filter((c) => `${c.nie}`.toUpperCase().includes(`${clientName.value}`.toUpperCase())
      || `${c.name} ${c.fatherLastName} ${c.motherLastName}`.toUpperCase().includes(`${clientName.value}`.toUpperCase()));
};

const selectProduct = (item) => {
  if (quotationDetail.value.some((d) => d.product?.id === item.id)) {
    toast.warning('El servicio ya fue agregado');
    return;
  }

  const detail = new QuotationDetail();
  detail.product = item;

  quotationDetail.value.push(detail);
  productName.value = '';

  errors.value.push(null);
};

const getProductList = () => {
  if (!productName.value) {
    return;
  }

  filterProductList.value = productList.value?.filter((c) => `${c.name} ${c.typeService?.name ?? ''}`
    .toUpperCase().includes(`${productName.value}`.toUpperCase()));
};

const calculateTotal = () => {
  let st = 0;
  let t = 0;
  let i = 0;

  (quotationDetail.value ?? []).forEach((o, index) => {
    const isNumber = checkIsNumber(o.quantity);
    errors.value[index] = !isNumber ? [{ $message: 'Cantidad incorrecta' }] : [];

    if (isNumber) {
      // eslint-disable-next-line no-unused-expressions,no-param-reassign
      o.total = +new Decimal(o.product!.price!).mul(new Decimal(o.quantity!)).toFixed(2);
      // eslint-disable-next-line no-unused-expressions,no-param-reassign
      o.price = +new Decimal(o.total).div(new Decimal('1.18')).toFixed(2);
      // eslint-disable-next-line no-unused-expressions,no-param-reassign
      o.igv = +new Decimal(o.total).minus(new Decimal(o.price)).toFixed(2);

      st = +new Decimal(o.price).plus(new Decimal(st)).toFixed(2);
      t = +new Decimal(o.total).plus(new Decimal(t)).toFixed(2);
      i = +new Decimal(o.igv).plus(new Decimal(i)).toFixed(2);
    } else {
      // eslint-disable-next-line no-unused-expressions,no-param-reassign
      o.price = 0;
      // eslint-disable-next-line no-unused-expressions,no-param-reassign
      o.igv = 0;
      // eslint-disable-next-line no-unused-expressions,no-param-reassign
      o.total = 0;
    }
  });

  subtotal.value = parseFloat(parseFloat(`${st}`).toFixed(2));
  total.value = parseFloat(parseFloat(`${t}`).toFixed(2));
  igv.value = parseFloat(parseFloat(`${i}`).toFixed(2));
};

const calculateProduct = () => {
  calculateTotal();
};

const remoteProduct = (index) => {
  quotationDetail.value.splice(index, 1);
  calculateProduct();
};

const handleSubmit = async () => {
  loadingButton.value = true;

  if (quotationDetail.value.some((d) => !d.quantity || d.quantity <= 0)) {
    loadingButton.value = false;
    alert.warning(['Debe ingresar una cantidad'], { title: 'Datos faltantes' });
  } else if (!client.value.id || !vehicle.value.id || quotationDetail.value.length === 0) {
    loadingButton.value = false;
    alert.warning(['Debe ingresar un cliente, vehículo y un servicio'], { title: 'Datos faltantes' });
  } else {
    quotation = {
      vehicle: {
        id: vehicle.value.id,
      },
      client: {
        id: client.value.id,
      },
      price: subtotal.value,
      igv: igv.value,
      total: total.value,
      detail: [],
    };
    console.log(quotation);
    quotationDetail.value.forEach((d) => {
      quotation!.detail!.push(d);
    });

    QuotationsAPI.Insert(quotation)
      .then((data) => {
        toast.success('Los datos fueron registrados satisfactoriamente');
        if (!props.notRedirect) {
          // eslint-disable-next-line no-use-before-define
          goToback();
        }
        // eslint-disable-next-line no-use-before-define
        callBackSubmitResult(data);
      })
      .catch((data) => {
        alert.warning(data.observations, { title: 'Error al guardar' });
      })
      .finally(() => {
        loadingButton.value = false;
      });
  }
};

const mounted = async () => {
  loadingProduct.value = true;
  const promises: Promise<any>[] = [];

  promises.push(ClientsAPI.List());
  // promises.push(VehiclesAPI.List());
  promises.push(ProductsAPI.ListPatient());

  Promise.all(promises)
    .then((values) => {
      const [clients/* , vehicles */, products] = values;
      // Se obtiene el resultado de la primera promesa
      clientList.value = clients;
      // vehicleList.value = vehicles;
      productList.value = products;
    })
    .catch(() => {
      toast.warning('Ocurrio error al cargar la información');
    })
    .finally(() => {
      loadingProduct.value = false;
    });
};

mounted();

const goToback = () => {
  router.go(-1);
};

const callBackSubmitResult = (obj: User) => {
  if (props.callbackSubmit !== undefined && typeof props.callbackSubmit === 'function') {
    props.callbackSubmit(obj);
  }
};

</script>

<style scoped>

</style>
