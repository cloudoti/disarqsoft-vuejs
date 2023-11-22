<template>
  <BreadCrumb :show-back="showBreadCrumb">Configuración / Vehículo /
    {{ +props.id > 0 ? 'Editar vehículo' : 'Agregar vehículo' }}
  </BreadCrumb>
  <form class="relative">
    <Loading
        opacity
        :show="loadingProduct"
        size="10"/>
    <div class="px-5 sm:px-8 lg:px-10 py-5">
      <div class="grid grid-cols-3 gap-4">
        <div class="col-span-2">
          <Autocomplete
              label="Cliente"
              placeholder="Cliente (nombre ó documento)"
              v-bind:suggestions="filterClientList"
              v-model="clientName"
              v-bind:selected-item="selectClient"
              v-on:change="getClientList"
              :required="true"
              :show-empty-result="false"
              :disabled="disableOfEdit"
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
          <Switch
              v-model="v$.vehicleStatus.$model"
              :required="true"
              label="Estado"
              on-label=""
              off-label=""
          />
        </div>
      </div>
    </div>

    <div class="px-5 sm:px-8 lg:px-10 py-5">
      <div class="grid grid-cols-3 gap-4">
        <div>
          <Input
              label="Placa"
              name="vehicleRegistration"
              autocomplete="off"
              v-model="v$.vehicleVehicleRegistration.$model"
              placeholder="Ingrese número de placa."
              :required="true"
              :errors="v$.vehicleVehicleRegistration.$errors"
          />
        </div>
        <div>
          <Select
              label="Marca"
              name="brand"
              v-model="brand"
              :required="true"
              :options="brandList"
              :disabled="disableOfEdit"
              :errors="brand ? [] : ['Marca es obligatorio']"
          >
            <template #optionContent="item">
              {{ item.item.name }}
            </template>
          </Select>
        </div>
        <div>
          <Input
              label="Modelo"
              name="model"
              autocomplete="off"
              v-model="v$.vehicleModel.$model"
              placeholder="Ingrese modelo."
              :required="true"
              :errors="v$.vehicleModel.$errors"
          />
        </div>
      </div>
    </div>

    <div class="px-5 sm:px-8 lg:px-10 py-5">
      <div class="grid grid-cols-3 gap-4">
        <div>
          <Input
              label="Año"
              name="vehicleYear"
              autocomplete="off"
              v-model="v$.vehicleYear.$model"
              placeholder="Ingrese el año."
              :required="true"
              :errors="v$.vehicleYear.$errors"
          />
        </div>
        <div>
          <Select
              label="Tipo"
              name="type"
              v-model="type"
              :required="true"
              :options="typeList"
              :disabled="disableOfEdit"
              :errors="type ? [] : ['Tipo es obligatorio']"
          >
            <template #optionContent="item">
              {{ item.item.name }}
            </template>
          </Select>
        </div>
        <div>
          <Input
              label="Motor"
              name="motor"
              autocomplete="off"
              v-model="v$.vehicleMotor.$model"
              placeholder="Ingrese motor."
              :required="true"
              :errors="v$.vehicleMotor.$errors"
          />
        </div>
      </div>
      <div class="mt-3">(*) Campos obligatorios</div>
    </div>
  </form>
  <div class="px-5 sm:px-8 lg:px-10 py-5 text-right">
    <Button
        :label="btnName"
        :callback="handleSubmit"
        :disabled="btnAcceptDisable"
        :loading="loadingButton"/>
  </div>
</template>
<script setup lang="ts">

import {
  computed, defineProps, reactive, ref,
} from 'vue';
import {
  helpers, maxLength, minLength, maxValue, minValue, required,
} from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';
import { useToast } from 'vue-toastification';
import { createAlert } from '@/ui/plugins/alert';
import BreadCrumb from '@/ui/components/BreadCrumb.vue';
// eslint-disable-next-line import/no-cycle
import router from '@/router';
import Button from '@/ui/components/Button.vue';
import Loading from '@/ui/components/Loading.vue';
import Input from '@/ui/components/Input.vue';
import Select from '@/ui/components/Select.vue';
import Status from '@/data/entity/Status';
import VehiclesAPI from '@/data/api/VehiclesAPI';
import ClientsAPI from '@/data/api/ClientsAPI';
import Vehicle from '@/data/entity/Vehicle';
import Client from '@/data/entity/Client';
import Autocomplete from '@/ui/components/Autocomplete.vue';
import Switch from '@/ui/components/Switch.vue';
import Catalog from '@/data/entity/Catalog';
import BrandsAPI from '@/data/api/BrandsAPI';

let user: Vehicle;
const disableOfEdit = ref(false);

const toast = useToast();
const alert = createAlert();

const loadingProduct = ref(false);
const loadingButton = ref(false);
const typeList = ref<Status[]>([{
  code: 'Pickup',
  name: 'Pickup',
},
{
  code: 'Sedan',
  name: 'Sedan',
},
{
  code: 'Sport',
  name: 'Sport',
}]);
const type = ref<Status>();

const brandList = ref<Catalog[]>([]);
const brand = ref<Catalog>();

const clientName = ref('');
const client = ref<Client>();

const clientList = ref<Client[]>();
const filterClientList = ref<Client[]>();

const btnName = ref('Agregar vehículo');
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

const formState = reactive({
  vehicleVehicleRegistration: '',
  vehicleModel: '',
  vehicleMotor: '',
  vehicleYear: '',
  vehicleStatus: true,
});

const alphaNumeric = helpers.regex(/^[a-zA-Z0-9\s]*$/);
const vehicleRegistration = helpers.regex(/^[a-zA-Z0-9\\-]*$/);

const rules = computed(() => ({
  vehicleVehicleRegistration: {
    required: helpers.withMessage('Número de placa es obligatorio', required),
    maxLength: helpers.withMessage(`Máximo de caracteres es 7`, maxLength(7)),
    minLength: helpers.withMessage(`Mínimo de caracteres es 7`, minLength(7)),
    regex: helpers.withMessage('Sólo se permiten números y letras', vehicleRegistration),
  },
  vehicleModel: {
    required: helpers.withMessage('Modelo es obligatorio', required),
    minLength: helpers.withMessage(`Mínimo de caracteres es 2`, minLength(2)),
    maxLength: helpers.withMessage(`Máximo de caracteres es 20`, maxLength(20)),
    regex: helpers.withMessage('Sólo se permiten números y letras', alphaNumeric),
  },
  vehicleMotor: {
    required: helpers.withMessage('Motor es obligatorio', required),
    maxLength: helpers.withMessage(`Máximo de caracteres es 5`, maxLength(5)),
    minValue: helpers.withMessage(`Valor mínimo 1000`, minValue(1000)),
    regex: helpers.withMessage('Sólo se permiten números y letras', alphaNumeric),
  },
  vehicleYear: {
    required: helpers.withMessage('Año es obligatorio', required),
    maxValue: helpers.withMessage(`Valor máximo 2025`, maxValue(2025)),
    minValue: helpers.withMessage(`Valor mínimo 1900`, minValue(1900)),
  },
  vehicleStatus: {},
}));

const v$ = useVuelidate(rules, formState, { $autoDirty: true });

const btnAcceptDisable = computed(() => v$.value.$invalid || !brand.value || !type.value);

const selectClient = (item) => {
  client.value = item;
  clientName.value = `${item.name} ${item.fatherLastName} ${item.motherLastName}`;
};

const getClientList = () => {
  if (!clientName.value) {
    return;
  }

  filterClientList.value = clientList.value?.filter((c) => c.active
      && (`${c.nie}`.toUpperCase().includes(`${clientName.value}`.toUpperCase())
      || `${c.name} ${c.fatherLastName} ${c.motherLastName}`.toUpperCase().includes(`${clientName.value}`.toUpperCase())));
};

const handleSubmit = async () => {
  loadingButton.value = true;

  await v$.value.$validate();

  if (v$.value.$invalid) {
    loadingButton.value = false;
    toast.warning('Los datos ingresados no son correctos');
  } else {
    user = {
      type: type.value?.code,
      vehicleRegistration: formState.vehicleVehicleRegistration,
      model: formState.vehicleModel,
      motor: formState.vehicleMotor,
      year: formState.vehicleYear,
      client: {
        id: client.value?.id,
      },
      brand: {
        id: brand.value?.id,
      },
      active: formState.vehicleStatus,
    };
    if (+props.id > 0) {
      user.id = +props.id;
      VehiclesAPI.Update(user)
        .then(() => {
          toast.success('Los datos fueron modificados correctamente');
          // eslint-disable-next-line no-use-before-define
          goToback();
        })
        .catch((data) => {
          alert.warning(data.observations, { title: 'Error al modificar' });
        })
        .finally(() => {
          loadingButton.value = false;
        });
    } else {
      VehiclesAPI.Insert(user)
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
  }
};

const mounted = async () => {
  loadingProduct.value = true;
  const promises: Promise<any>[] = [];

  promises.push(ClientsAPI.List());
  promises.push(BrandsAPI.List());

  if (+props.id > 0) {
    promises.push(VehiclesAPI.GetById(+props.id));
  }
  Promise.all(promises)
    .then((values) => {
      const [clients, brands, pat] = values;
      // Se obtiene el resultado de la primera promesa
      clientList.value = clients;
      brandList.value = brands;

      if (+props.id > 0) {
        user = pat;

        if (user.id! > 0) {
          selectClient(user.client);
          type.value = typeList.value.find((s) => s.code === user.type);
          client.value = clientList.value?.find((s) => s.id === user.client?.id);
          brand.value = brandList.value?.find((s) => s.id === user.brand?.id);
          formState.vehicleVehicleRegistration = user.vehicleRegistration!;
          formState.vehicleModel = user.model!;
          formState.vehicleMotor = user.motor!;
          formState.vehicleYear = user.year!;

          formState.vehicleStatus = user.active!;
          btnName.value = 'Editar vehículo';
        }
      }
    })
    .catch(() => {
      toast.warning('Ocurrio error al cargar la información');
    })
    .finally(() => {
      loadingProduct.value = false;
    });
};
mounted();

const callBackSubmitResult = (obj: Vehicle) => {
  if (props.callbackSubmit !== undefined && typeof props.callbackSubmit === 'function') {
    props.callbackSubmit(obj);
  }
};

const goToback = () => {
  router.go(-1);
};

</script>
<style>
.hyperlink {
  @apply text-blue-600 underline
}

.hyperlink:visited {
  @apply text-purple-600
}
</style>
