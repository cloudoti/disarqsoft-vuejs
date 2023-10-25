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
        <div>
          <Select
              label="Client"
              name="client"
              v-model="client"
              :required="true"
              :options="clientList"
              :disabled="disableOfEdit"
          >
            <template #optionContent="item">
              {{ item.item.name }}
            </template>
          </Select>
        </div>
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
      </div>
    </div>

    <div class="px-5 sm:px-8 lg:px-10 py-5">
      <div class="grid grid-cols-3 gap-4">
        <div>
          <Select
              label="Tipo"
              name="type"
              v-model="type"
              :required="true"
              :options="typeList"
              :disabled="disableOfEdit"
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
    </div>
    <div class="px-5 sm:px-8 lg:px-10 pt-1 pb-5">
      <div class="md:grid grid-cols-1 gap-4">
        <div>
          <Select
              label="Estado"
              name="statusSelect"
              v-model="status"
              :required="true"
              :options="statusList"
              :disabled="disableOfEdit"
          >
            <template #optionContent="item">
              {{ item.item.name }}
            </template>
          </Select>
        </div>
      </div>
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
  email, helpers, maxLength, maxValue, required,
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

const statusList = ref<Status[]>([{
  code: 'true',
  name: 'Activo',
},
{
  code: 'false',
  name: 'Inactivo',
}]);
const status = ref<Status>();

const client = ref<Client>();

const clientList = ref<Client[]>();

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
});

const rules = computed(() => ({
  vehicleVehicleRegistration: {
    required: helpers.withMessage('Número de placa es obligatorio', required),
    maxLength: helpers.withMessage(`Máximo de caracteres es 10`, maxLength(10)),
  },
  vehicleModel: {
    required: helpers.withMessage('Modelo es obligatorio', required),
    maxLength: helpers.withMessage(`Máximo de caracteres es 100`, maxLength(100)),
  },
  vehicleMotor: {
    required: helpers.withMessage('Motor es obligatorio', required),
    maxLength: helpers.withMessage(`Máximo de caracteres es 100`, maxLength(100)),
  },
  vehicleYear: {
    required: helpers.withMessage('Año es obligatorio', required),
    maxValue: helpers.withMessage(`Valor máximo 2024`, maxValue(2024)),
  },
}));

const v$ = useVuelidate(rules, formState, { $autoDirty: true });

const btnAcceptDisable = computed(() => {
  console.log(v$.value.$errors);
  return v$.value.$invalid;
});

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
      active: Boolean(status.value?.code),
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

  if (+props.id > 0) {
    promises.push(VehiclesAPI.GetById(+props.id));
  }
  Promise.all(promises)
    .then((values) => {
      const [clients, pat] = values;
      // Se obtiene el resultado de la primera promesa
      clientList.value = clients;

      if (+props.id > 0) {
        user = pat;

        if (user.id! > 0) {
          type.value = typeList.value.find((s) => s.code === user.type);
          client.value = clientList.value?.find((s) => s.id === user.client?.id);
          formState.vehicleVehicleRegistration = user.vehicleRegistration!;
          formState.vehicleModel = user.model!;
          formState.vehicleMotor = user.motor!;
          formState.vehicleYear = user.year!;

          status.value = statusList.value.find((s) => s.code === `${user.active}`);
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
