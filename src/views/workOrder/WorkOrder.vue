<template>
  <div class="mx-auto lg:max-w-7xl">
    <div class="bg-white px-4 shadow p-6 sm:rounded-lg">
      <BreadCrumb :show-back="false">Registro de Orden</BreadCrumb>
      <section
          aria-labelledby="who-to-follow-heading">
        <div class="mt-4">
          <Wizard
              label-end-button="Guardar orden"
              :callback-end-button="() => { saveOrder() }"
              :enable-steps="[contact && paymentMethod, (orderList?.length??0) > 0]">
            <Step title="Datos de la orden">
              <div class="py-5">
                <Autocomplete
                    label="Contacto"
                    placeholder="Contacto (nombre ó dni)"
                    v-bind:suggestions="contactList"
                    v-model="contactName"
                    v-bind:selected-item="selectContact"
                    v-on:change="getContactList"
                    :required="true"
                    :showEmptyResult="true"
                    :debounce="500"
                >
                  <template #messageResult="emp">
                    {{ emp.item.firstName }} {{ emp.item.lastName }} | {{ emp.item.nie }}
                  </template>
                  <template #messageEmptyResult>
                    No se encontraron registros. Por favor vuelva a intentarlo.
                  </template>
                </Autocomplete>
              </div>
              <div class="py-5">
                <Select
                    label="Método de pago"
                    name="paymentMethodSelect"
                    v-model="paymentMethod"
                    :required="true"
                    :options="['Efectivo', 'Tarjeta de crédito', 'Transferencia']"
                >
                  <template #optionContent="item">
                    {{ item.item }}
                  </template>
                </Select>
              </div>
            </Step>
            <Step title="Detalle de la Orden">
              <div class="py-5">
                <Autocomplete
                    label="Producto"
                    placeholder="Producto (nombre ó descripción)"
                    v-bind:suggestions="productList"
                    v-model="productName"
                    v-bind:selected-item="selectProduct"
                    v-on:change="getProductList"
                    :required="true"
                    :showEmptyResult="true"
                    :debounce="500"
                >
                  <template #messageResult="emp">
                    {{ emp.item.name }}
                  </template>
                  <template #messageEmptyResult>
                    No se encontraron registros. Por favor vuelva a intentarlo.
                  </template>
                </Autocomplete>
              </div>
              <div class="py-5">
                <table class="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-md">
                  <thead class="bg-gray-50">
                  <tr>
                    <th
                        style="width: 15%;"
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
                    >
                      Codigo
                    </th>
                    <th
                        style="width: 35%;"
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
                    >
                      Nombre
                    </th>
                    <th
                        style="width: 10%;"
                        scope="col"
                        class="px-6 py-3 text-center text-xs font-medium text-black uppercase tracking-wider"
                    >
                      Precio
                    </th>
                    <th
                        style="width: 10%;"
                        scope="col"
                        class="px-6 py-3 text-center text-xs font-medium text-black uppercase tracking-wider"
                    >
                      Cantidad
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
                      class="bg-white divide-y divide-gray-200 text-gray-600">
                  <tr
                      v-for="(row, index) in orderList??[]"
                      :key="row.id">
                    <td class="px-6 py-2 text-left text-xs whitespace-nowrap">
                      <div class="text-sm font-medium">
                        {{ row.product?.code }}
                      </div>
                    </td>
                    <td class="px-6 py-2 text-left text-xs whitespace-nowrap align-top">
                      <div class="text-sm font-medium">
                        {{ row.product?.name }}
                      </div>
                      <div class="text-sm text-gray-500">
                        {{ row.product?.description }}
                      </div>
                    </td>
                    <td class="px-6 py-2 text-left text-xs whitespace-nowrap align-top">
                      <div class="text-sm font-medium">
                        {{ row.price }}
                      </div>
                    </td>
                    <td class="px-6 py-2 text-left text-xs whitespace-nowrap align-top">
                      <div class="text-sm font-medium">
                        <Input
                            name="quantity"
                            autocomplete="off"
                            v-model="row.quantity"
                            placeholder="Cantidad"
                            :required="false"
                            v-on:change="() => calculateProduct(row)"
                        />
                      </div>
                    </td>
                    <td class="px-6 py-2 text-left text-xs whitespace-nowrap align-top">
                      <div class="text-sm font-medium">
                        {{ row.total }}
                      </div>
                    </td>
                    <td class="px-6 py-2 text-xs whitespace-nowrap flex items-center justify-center">
                      <div class="flex justify-center">
                        <TrashIcon
                            class="h-5 w-5 text-blue-600 cursor-pointer"
                            @click="removeProduct(index)"
                        />
                      </div>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
              <div class="py-5">
                <div class="flex justify-between w-100">
                  <label class="block text-sm font-medium text-gray-700">
                  </label>
                  <div class="text-sm font-medium text-gray-700 font-bold text-right">
                    <div>Total: {{
                        functions.formatMoneyTwoDecimal(totalDelivery.toString())
                      }}
                    </div>
                    <div>Total: {{
                        functions.formatMoneyTwoDecimal(total.toString())
                      }}
                    </div>
                  </div>
                </div>
              </div>
            </Step>
          </Wizard>
        </div>
      </section>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  TrashIcon,
} from '@heroicons/vue/outline';
import {
  computed, reactive, ref, watch,
} from 'vue';
import { useToast } from 'vue-toastification';
import { createAlert } from '@/ui/plugins/alert';
import Wizard from '@/ui/components/wizard/Wizard.vue';
import Step from '@/ui/components/wizard/Step.vue';
import functions from '@/helpers/Functions';
import BreadCrumb from '@/ui/components/BreadCrumb.vue';
import Autocomplete from '@/ui/components/Autocomplete.vue';
// eslint-disable-next-line import/no-cycle
import Select from '@/ui/components/Select.vue';
import Loading from '@/ui/components/Loading.vue';
import Employee from '@/data/entity/Employee';
import EmployeesAPI from '@/data/api/EmployeesAPI';
import OrderDetail from '@/data/entity/OrderDetail';
import Product from '@/data/entity/Product';
import ProductsAPI from '@/data/api/ProductsAPI';
import Input from '@/ui/components/Input.vue';
import Order from '@/data/entity/Order';
import WorkOrdersAPI from '@/data/api/WorkOrdersAPI';

const toast = useToast();
const alert = createAlert();

// region Step 1

// Contact
const contactList = ref<Employee[]>();
const contact = ref<Employee>();
const contactName = ref('');

const paymentMethod = ref('');
const total = ref(0);
const totalDelivery = ref(0);

const productList = ref<Product[]>();
const productName = ref('');

const orderList = ref<OrderDetail[]>([]);

// endregion Step 1

// region Step 2

// endregion Step 2

// region Step 3

const loading = ref(false);

// endregion Step 3

// region Functions Step 1

const getContactList = async () => {
  if (contactName.value) {
    contactList.value = await EmployeesAPI.FilterEmployee(contactName.value);
  }
};

const selectContact = (p: Employee) => {
  contact.value = p;
  contactName.value = p.id ? `${p.firstName}` : '';
};

// endregion Functions Step 1

// region Functions Step 2
const getProductList = async () => {
  if (productName.value) {
    productList.value = await ProductsAPI.FilterProduct(productName.value);
  }
};

const calculateTotal = () => {
  let t = 0;

  (orderList.value ?? []).forEach((o) => {
    if (o.quantity) {
      // eslint-disable-next-line no-unused-expressions,no-param-reassign
      o.total = o.price! * o.quantity!;

      t += o.total;
    }
  });

  total.value = t;
  totalDelivery.value = t * 0.1;
};

const calculateProduct = (o: OrderDetail) => {
  // eslint-disable-next-line no-param-reassign
  if (o.quantity) o.total = o.price! * o.quantity!;

  calculateTotal();
};

const selectProduct = (p: Product) => {
  const o = {
    product: p,
    price: p.price,
    quantity: 1,
    total: 0,
  };
  // eslint-disable-next-line no-unused-expressions
  orderList.value?.push(o);

  calculateProduct(o);

  productName.value = '';
};

const removeProduct = (i: number) => {
  if (orderList.value.length === 1) {
    orderList.value = [];
  } else {
    orderList.value = orderList.value.splice(i, 1);
  }

  calculateTotal();
};

const saveOrder = async () => {
  const order: Order = {};

  order.user = { id: contact.value?.id };
  order.paymentMethod = (paymentMethod.value ? paymentMethod.value.charAt(1) : undefined);
  order.total = total.value;
  order.totalDelivery = totalDelivery.value;
  order.detail = [];

  orderList.value.forEach((d) => {
    const detail: OrderDetail = {};
    detail.product = d.product;
    detail.price = d.price;
    detail.quantity = d.quantity;
    detail.total = d.total;

    // eslint-disable-next-line no-unused-expressions
    order.detail?.push(detail);
  });

  await WorkOrdersAPI.SaveOrders(order);

  toast.success('Orden guardada correctamente');
};

// endregion Functions Step 2

</script>

<style scoped>
</style>
