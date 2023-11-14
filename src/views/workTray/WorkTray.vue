<template>
  <div
    class="mx-auto lg:max-w-7xl"
    v-if="workTrayOrderId === 0"
  >
    <div class="bg-white px-4 shadow pt-5 md:pt-5 sm:p-6 sm:rounded-lg">
      <section aria-labelledby="who-to-follow-heading">
        <div class="mt-7 py-3 px-3 border border-grey-100 bg-gray-50 rounded-md">
          <div class="md:grid grid-cols-3 gap-4">
            <div class="mb-4 md:mb-0">
              <Input
                  name="code"
                  autocomplete="off"
                  v-model="filterSearch.code"
                  placeholder="Ingrese código."
              />
            </div>
            <div class="mb-4 md:mb-0">
              <Input
                  name="paymentMethod"
                  autocomplete="off"
                  v-model="filterSearch.paymentMethod"
                  placeholder="Ingrese método de pago."
              />
            </div>
            <div class="mb-4 md:mb-0">
              <div v-if="date?.startDate && settingDate">
                <litepie-datepicker
                    ref="myRef"
                    use-range
                    class="h-9 border-gray-300 cursor-pointer rounded-sm"
                    separator=" - "
                    i18n="es"
                    :auto-apply="true"
                    :start-from="startCalendar"
                    :shortcuts="false"
                    :formatter="formatter"
                    :disable-date="disableDate"
                    v-model="date"
                />
              </div>
              <div v-else>
                <litepie-datepicker
                    ref="myRef"
                    use-range
                    class="h-9 border-gray-300 cursor-pointer rounded-sm"
                    separator=" - "
                    i18n="es"
                    :auto-apply="true"
                    :start-from="startCalendar"
                    :shortcuts="false"
                    :formatter="formatter"
                    :disable-date="disableDate"
                    v-model="dateDefault"
                />
              </div>
            </div>
          </div>
          <div class="mt-3 ml-1">
            <div class="relative inline-flex pr-8">
              <div
                @click="openAdvancedSearch()"
                class="cursor-pointer"
              >
                <span class="text-blue-600">Búsqueda avanzada</span>
                <ChevronDownIcon
                  v-if="!advancedSearch"
                  class="h-5 w-5 absolute right-0.5 top-1/2 transform -translate-y-1/2 text-blue-600"/>
                <ChevronUpIcon
                  v-else
                  class="h-5 w-5 absolute right-0.5 top-1/2 transform -translate-y-1/2 text-blue-600"/>
              </div>
            </div>
          </div>
          <div v-show="advancedSearch">
            <div class="md:grid grid-cols-3 gap-4 mt-3">
              <div class="mb-4 md:mb-0">
                <Autocomplete
                    placeholder="Contacto (nombre ó dni)"
                    v-bind:suggestions="contactList"
                    v-model="filterSearch.contactSearch"
                    v-bind:selected-item="selectContact"
                    v-on:change="getContactList"
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
              <div class="mb-4 md:mb-0">
                <Input
                    name="total"
                    autocomplete="off"
                    v-model="filterSearch.total"
                    placeholder="Ingrese costo total."
                />
              </div>
              <div class="mb-4 md:mb-0">
                <Input
                    name="totalDelivery"
                    autocomplete="off"
                    v-model="filterSearch.totalDelivery"
                    placeholder="Ingrese costo de envío."
                />
              </div>
            </div>
          </div>
          <div class="w-full mt-5 flex justify-end">
            <button
              @click="cleanForm"
              class="w-22 text-gray-700 py-1 px-2 rounded border border-gray-300 shadow-md hover:shadow-lg"
              :disabled="loading"
              v-bind:class="{ 'bg-white hover:bg-gray-50': !loading, 'bg-gray-100 hover:bg-gray-100': loading }"
            >
              Limpiar
            </button>
            <button
              @click="getPagedWorkOrders"
              class="w-22 text-white py-1 px-2 rounded border border-blue-800 shadow-md hover:shadow-lg ml-2"
              :disabled="loading"
              v-bind:class="{ 'bg-blue-600 hover:bg-blue-700': !loading, 'bg-blue-300 hover:bg-blue-300': loading }"
            >
              Buscar
            </button>
          </div>
        </div>

        <div class="relative mt-2">
          <Loading
            :show="loading"
            size="10"
            :opacity="true"/>

          <EmptyResult v-if="!loading && (!pagination || pagination?.length === 0)"/>
          <div>
            <div class="overflow-x-auto py-2 align-middle inline-block w-full">
              <table
                class="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-md"
                v-show="loading || (pagination?.length > 0)"
              >
                <thead class="bg-gray-50">
                <tr>
                  <th
                    style="width: 8%"
                    scope="col"
                    class="px-6 py-3 text-left text-xs text-black tracking-wider"
                  >
                    Orden
                  </th>
                  <th
                    style="width: 8%"
                    scope="col"
                    class="flex-shrink-0 relative px-6 py-3 text-left text-xs text-black tracking-wider"
                  >
                    Fecha
                  </th>
                  <th
                    style="width: 30%;"
                    scope="col"
                    class="px-6 py-3 text-left text-xs text-black tracking-wider"
                  >
                    Método de pago
                  </th>
                  <th
                    style="width: 30%;"
                    scope="col"
                    class="px-6 py-3 text-left text-xs text-black tracking-wider"
                  >
                    Costos
                  </th>
                  <th
                    style="width: 14%;"
                    scope="col"
                    class="px-3 py-3 text-center text-xs text-black tracking-wider"
                  >
                    Ver Orden
                  </th>
                </tr>
                </thead>
                <tbody
                  v-if="pagination"
                  class="bg-white divide-y divide-gray-200 text-gray-600">
                <tr
                  v-for="row in pagination"
                  :key="row.id"
                  class="hover:bg-gray-50"
                  v-bind:class="{ 'bg-gray-300 hover:bg-gray-300': row.id === selectedRow }"
                  @click="selectRow(row.id)"
                >
                  <td class="px-6 py-2 text-left text-xs whitespace-nowrap">
                    <div class="text-sm">
                      {{ row.code }}
                    </div>
                  </td>
                  <td class="px-6 py-2 text-left text-xs whitespace-nowrap">
                    {{row.issueDate}}
                  </td>
                  <td class="px-6 py-2 text-left text-xs whitespace-nowrap">
                    {{row.paymentMethod}}
                  </td>
                  <td class="px-6 py-2 text-left text-xs whitespace-nowrap">
                    <div class="text-sm">
                      <span class="font-medium">Total:</span> {{ row.total }}
                    </div>
                    <div class="text-sm">
                      <span class="font-medium">Envío:</span> {{ row.totalDelivery }}
                    </div>
                  </td>
                  <td class="px-3 py-2 text-center text-xs whitespace-nowrap">
                    <div class="flex justify-center">
                      <EyeIcon
                        class="h-5 w-5 text-blue-600 cursor-pointer"
                        @click="getWorkTrayOrderById('', row.id!)"
                      />
                    </div>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>

</template>
<script setup lang="ts">
import { inject, reactive, ref } from 'vue';
import {
  ChevronDownIcon, ChevronUpIcon, EyeIcon,
} from '@heroicons/vue/outline';
import { useToast } from 'vue-toastification';
import { createAlert } from '@/ui/plugins/alert';
import Autocomplete from '@/ui/components/Autocomplete.vue';
import Loading from '@/ui/components/Loading.vue';
import EmptyResult from '@/ui/components/table/EmptyResult.vue';
import WorkTrayParams from '@/data/entity/WorkTrayParams';
import WorkOrdersAPI from '@/data/api/OrdersAPI';
import WorkTrayOrderDetail from '@/data/entity/WorkTrayOrderDetail';
import Button from '@/ui/components/Button.vue';
import Input from '@/ui/components/Input.vue';
import Store from '@/data/Store';
import Order from '@/data/entity/Order';
import Employee from '@/data/entity/Employee';
import EmployeesAPI from '@/data/api/EmployeesAPI';

const {
  auth,
} = inject<Store>('store', {});

const toast = useToast();

// region Constantes para detalle de la orden médica
const workTrayOrderId = ref(0);
const workTrayOrderDetail = ref<WorkTrayOrderDetail>();
// endregion Constantes para detalle de la orden médica

// region Filtros de búsqueda a excepción del calendario y los ordenamientos
const filterSearch = ref({
  code: '',
  date: null,
  paymentMethod: '',
  total: '',
  totalDelivery: '',
  contactSearch: '',
});

const advancedSearch = ref(false);
const contactSearch = ref('');
const contactList = ref<Employee[]>();
// endregion Filtros de búsqueda a excepción del calendario y los ordenamientos

let params: WorkTrayParams;

const loading = ref(false);
const pagination = ref<Order[]>();
const selectedRow = ref(0);

// region Configuracion del calendario de los filtros de búsqueda
// Identifica si se muestra el calendario por defecto durante la limpieza de filtros de búsqueda
const settingDate = ref(true);

// Formato en que se muestran las fechas en el calendario y su salida a los filtros de búsqueda
const formatter = ref({
  date: 'DD/MM/YYYY',
  month: 'MMMM',
});

// Metodo que renderiza el calendario editable para setear las fechas por defecto en la limpieza
const renderCalendar = () => {
  settingDate.value = false;
  setTimeout(() => {
    settingDate.value = true;
  }, 500);
};

// Fechas por defecto pára el rango de fechas inicial del calendario
const currentDate = new Date();
const minimumDate = new Date();
const currentDateArray = currentDate.toLocaleDateString('es-ES', { timeZone: auth?.user?.timeZone ?? 'America/Lima' })
  .split('/');

const minimumDateArray = minimumDate.toLocaleDateString('es-ES', { timeZone: auth?.user?.timeZone ?? 'America/Lima' })
  .split('/');

const currentDateString = `${parseInt(currentDateArray[0], 10) < 10 ? `0${currentDateArray[0]}` : currentDateArray[0]}/${
  parseInt(currentDateArray[1], 10) < 10 ? `0${currentDateArray[1]}` : currentDateArray[1]}/${currentDateArray[2]}`;
const minimumDateString = `${parseInt(minimumDateArray[0], 10) < 10 ? `0${minimumDateArray[0]}` : minimumDateArray[0]}/${
  parseInt(minimumDateArray[1], 10) < 10 ? `0${minimumDateArray[1]}` : minimumDateArray[1]}/${minimumDateArray[2]}`;

// Fecha en la que deberia aparecer el calendario del lado izquierdo
// Parece no funcionar cuando el rango de fechas esta establecido en el mismo mes
const startCalendar = ref(new Date(new Date().setMonth(currentDate.getMonth() - 1)));

// Función que identifica que fechas estaran inhabilitadas en el calendario
const disableDate = (date) => date < new Date(1970, 0, 1) || date > currentDate;

// Objeto con las fechas del rango por defecto para la limpieza de filtros
const dateDefault = ref({
  startDate: minimumDateString,
  endDate: currentDateString,
});

// Objeto con la información de las fechas para los filtros de búsqueda y el calendario
const date = ref({
  startDate: minimumDateString,
  endDate: currentDateString,
});
// endregion Configuracion del calendario de los filtros de búsqueda

const alert = createAlert();

const cleanForm = () => {
  filterSearch.value.contactSearch = '';
  date.value = {
    startDate: minimumDateString,
    endDate: currentDateString,
  };
  renderCalendar();
};

const openAdvancedSearch = () => {
  advancedSearch.value = !advancedSearch.value;
};

// region Autocompletados de los filtros de búsqueda (busqueda de listados y selección)
const getContactList = async () => {
  console.log(filterSearch.value.contactSearch);
  // form.patient = 0;
  if (filterSearch.value.contactSearch) {
    contactList.value = await EmployeesAPI.FilterEmployee(filterSearch.value.contactSearch);
  }
};

const selectContact = (p: Employee) => {
  // form.patient = p.id ? p.id : 0;
  contactSearch.value = p.firstName ? p.firstName : '';
};
// endregion Autocompletados de los filtros de búsqueda

const search = async (filters: WorkTrayParams) => {
  loading.value = true;
  pagination.value = await WorkOrdersAPI.ListOrders(filters);
  selectedRow.value = 0;
  loading.value = false;
};

const getPagedWorkOrders = (selectedPage?: number, rowsPerPage?: number) => {
  // Validar que se ingreso un rango de fechas
  if (date.value.startDate === '' && date.value.endDate === '') {
    alert.warning(['Por favor seleccione o ingrese un rango de fechas.'], {
      title: 'Rango de fechas no ingresado',
      buttonYesName: 'Aceptar',
      dismissible: false,
    });
    loading.value = false;
    return;
  }

  // Validar que exista un rango de fechas
  const arrayStartDate = date.value.startDate.split('/');
  const arrayEndDate = date.value.endDate.split('/');
  const startDate = new Date(+arrayStartDate[2], +arrayStartDate[1] - 1, +arrayStartDate[0], 0, 0, 0);
  const endDate = new Date(+arrayEndDate[2], +arrayEndDate[1] - 1, +arrayEndDate[0], 23, 59, 59);

  if ((endDate.getTime() - startDate.getTime()) > (86400000 * 31)) {
    alert.warning(['El rango entre fechas para búsquedas', 'debe ser máximo de 31 días.'], {
      title: 'Rango de fechas excedido',
      buttonYesName: 'Aceptar',
      dismissible: false,
    });
    loading.value = false;
    return;
  }

  params = {
    from: startDate.getTime(),
    to: endDate.getTime(),
  };
  search(params);
};

const selectRow = (id) => {
  if (selectedRow.value === id) {
    selectedRow.value = 0;
  } else {
    selectedRow.value = id;
  }
};

getPagedWorkOrders(1, 10);

// region Obtencion del detalle de la orden médica
const getWorkTrayOrderById = async (dateString: string, workOrderId: number) => {
  loading.value = true;
  const arrayDateString = dateString.split('/');
  const workTrayOrderMinimumDate = new Date(
    parseInt(arrayDateString[0], 10),
    parseInt(arrayDateString[1], 10) - 1,
    parseInt(arrayDateString[2], 10),
    0, 0, 0,
  ).getTime();
  workTrayOrderDetail.value = await WorkOrdersAPI.getWorkTrayOrderById(workTrayOrderMinimumDate, workOrderId);
  if (workTrayOrderDetail.value && workTrayOrderDetail.value.examTypes) {
    workTrayOrderDetail.value.examTypes.forEach((examType) => {
      if (examType.exams) {
        examType.exams.forEach((exam) => {
          if (exam.fields && exam.fields.length > 0) {
            exam.fields.forEach((f) => {
              if (f && f.fields && f.fields.length > 0) {
                f.fields.forEach((field) => {
                  // eslint-disable-next-line no-param-reassign
                  field.viewRange = 'NONE';
                  if (field.allRange) {
                    // eslint-disable-next-line no-param-reassign
                    field.allRange.minValueString = field.allRange.minValue ? field.allRange.minValue.toString() : '';
                    // eslint-disable-next-line no-param-reassign
                    field.allRange.maxValueString = field.allRange.maxValue ? field.allRange.maxValue.toString() : '';
                    switch (field.allRange.operation) {
                      case '1':
                        // eslint-disable-next-line no-param-reassign
                        field.viewRange = 'ALL_BETWEEN';
                        // eslint-disable-next-line no-param-reassign
                        field.allRange.operationSymbol = '';
                        break;
                      case '2':
                        // eslint-disable-next-line no-param-reassign
                        field.viewRange = 'ALL_VALUE';
                        // eslint-disable-next-line no-param-reassign
                        field.allRange.operationSymbol = '<=';
                        break;
                      case '3':
                        // eslint-disable-next-line no-param-reassign
                        field.viewRange = 'ALL_VALUE';
                        // eslint-disable-next-line no-param-reassign
                        field.allRange.operationSymbol = '>=';
                        break;
                      case '4':
                        // eslint-disable-next-line no-param-reassign
                        field.viewRange = 'ALL_VALUE';
                        // eslint-disable-next-line no-param-reassign
                        field.allRange.operationSymbol = '<';
                        break;
                      case '5':
                        // eslint-disable-next-line no-param-reassign
                        field.viewRange = 'ALL_VALUE';
                        // eslint-disable-next-line no-param-reassign
                        field.allRange.operationSymbol = '>';
                        break;
                      default:
                        break;
                    }
                  }
                  if (workTrayOrderDetail.value && workTrayOrderDetail.value.patientAge && workTrayOrderDetail.value.patientGender) {
                    if (workTrayOrderDetail.value.patientGender === 'M' && field.specificRangeMale) {
                      // eslint-disable-next-line no-param-reassign
                      field.specificRangeMale.minValueString = field.specificRangeMale.minValue
                        ? field.specificRangeMale.minValue.toString() : '';
                      // eslint-disable-next-line no-param-reassign
                      field.specificRangeMale.maxValueString = field.specificRangeMale.maxValue
                        ? field.specificRangeMale.maxValue.toString() : '';
                      if (workTrayOrderDetail.value!.patientAge! >= field.specificRangeMale.minAge!
                        && workTrayOrderDetail.value!.patientAge! <= field.specificRangeMale.maxAge!) {
                        switch (field.specificRangeMale.operation) {
                          case '1':
                            // eslint-disable-next-line no-param-reassign
                            field.viewRange = 'CUSTOM_BETWEEN_MALE';
                            // eslint-disable-next-line no-param-reassign
                            field.specificRangeMale.operationSymbol = '';
                            break;
                          case '2':
                            // eslint-disable-next-line no-param-reassign
                            field.viewRange = 'CUSTOM_VALUE_MALE';
                            // eslint-disable-next-line no-param-reassign
                            field.specificRangeMale.operationSymbol = '<=';
                            break;
                          case '3':
                            // eslint-disable-next-line no-param-reassign
                            field.viewRange = 'CUSTOM_VALUE_MALE';
                            // eslint-disable-next-line no-param-reassign
                            field.specificRangeMale.operationSymbol = '>=';
                            break;
                          case '4':
                            // eslint-disable-next-line no-param-reassign
                            field.viewRange = 'CUSTOM_VALUE_MALE';
                            // eslint-disable-next-line no-param-reassign
                            field.specificRangeMale.operationSymbol = '<';
                            break;
                          case '5':
                            // eslint-disable-next-line no-param-reassign
                            field.viewRange = 'CUSTOM_VALUE_MALE';
                            // eslint-disable-next-line no-param-reassign
                            field.specificRangeMale.operationSymbol = '>';
                            break;
                          default:
                            break;
                        }
                      }
                    }
                    if (workTrayOrderDetail.value.patientGender === 'F' && field.specificRangeFemale) {
                      // eslint-disable-next-line no-param-reassign
                      field.specificRangeFemale.minValueString = field.specificRangeFemale.minValue
                        ? field.specificRangeFemale.minValue.toString() : '';
                      // eslint-disable-next-line no-param-reassign
                      field.specificRangeFemale.maxValueString = field.specificRangeFemale.maxValue
                        ? field.specificRangeFemale.maxValue.toString() : '';
                      if (workTrayOrderDetail.value!.patientAge! >= field.specificRangeFemale.minAge!
                        && workTrayOrderDetail.value!.patientAge! <= field.specificRangeFemale.maxAge!) {
                        switch (field.specificRangeFemale.operation) {
                          case '1':
                            // eslint-disable-next-line no-param-reassign
                            field.viewRange = 'CUSTOM_BETWEEN_MALE';
                            // eslint-disable-next-line no-param-reassign
                            field.specificRangeFemale.operationSymbol = '';
                            break;
                          case '2':
                            // eslint-disable-next-line no-param-reassign
                            field.viewRange = 'CUSTOM_VALUE_MALE';
                            // eslint-disable-next-line no-param-reassign
                            field.specificRangeFemale.operationSymbol = '<=';
                            break;
                          case '3':
                            // eslint-disable-next-line no-param-reassign
                            field.viewRange = 'CUSTOM_VALUE_MALE';
                            // eslint-disable-next-line no-param-reassign
                            field.specificRangeFemale.operationSymbol = '>=';
                            break;
                          case '4':
                            // eslint-disable-next-line no-param-reassign
                            field.viewRange = 'CUSTOM_VALUE_MALE';
                            // eslint-disable-next-line no-param-reassign
                            field.specificRangeFemale.operationSymbol = '<';
                            break;
                          case '5':
                            // eslint-disable-next-line no-param-reassign
                            field.viewRange = 'CUSTOM_VALUE_MALE';
                            // eslint-disable-next-line no-param-reassign
                            field.specificRangeFemale.operationSymbol = '>';
                            break;
                          default:
                            break;
                        }
                      }
                    }
                  }
                });
              }
            });
          }
        });
      }
    });
  }
  workTrayOrderId.value = workTrayOrderDetail.value && workTrayOrderDetail.value.workOrderId ? workTrayOrderDetail.value.workOrderId : 0;
  loading.value = false;
};
// endregion Obtencion del detalle de la orden médica
</script>

<style scoped>
/* Estilo de los popover tanto para los iconos de ordenamiento
   como para la información de los estados de los exámenes */
:deep(.popper) {
  --popper-theme-background-color: #ffffff;
  --popper-theme-background-color-hover: #ffffff;
  --popper-theme-text-color: #333333;
  --popper-theme-border-width: 1px;
  --popper-theme-border-style: solid;
  --popper-theme-border-color: #dadada;
  --popper-theme-border-radius: 6px;
  --popper-theme-padding: 10px;
  --popper-theme-box-shadow: 0 6px 30px -6px rgba(0, 0, 0, .25);
}
</style>
