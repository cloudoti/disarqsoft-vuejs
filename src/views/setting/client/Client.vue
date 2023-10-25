<template>
  <BreadCrumb :show-back="showBreadCrumb">Configuración / Cliente /
    {{ +props.id > 0 ? 'Editar cliente' : 'Agregar cliente' }}
  </BreadCrumb>
  <form class="relative">
    <Loading
        opacity
        :show="loadingProduct"
        size="10"/>
    <div class="px-5 sm:px-8 lg:px-10 py-5">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <Select
              label="Tipo de documento"
              name="typeNie"
              v-model="typeNie"
              :required="true"
              :options="typeNieList"
              :disabled="disableOfEdit"
          >
            <template #optionContent="item">
              {{ item.item.name }}
            </template>
          </Select>
        </div>
        <div>
          <Input
              label="Número de documento"
              name="nie"
              autocomplete="off"
              v-model="v$.clientNie.$model"
              placeholder="Ingrese número de documento."
              :required="true"
              :errors="v$.clientNie.$errors"
          />
        </div>
      </div>
    </div>
    <div class="px-5 sm:px-8 lg:px-10 pt-1 pb-5">
      <div class="grid grid-cols-3 gap-4">
        <Input
            label="Nombre"
            name="name"
            autocomplete="off"
            v-model="v$.clientName.$model"
            placeholder="Ingrese nombre."
            :required="true"
            :errors="v$.clientName.$errors"
        />
        <div>
          <Input
              label="Apellido Paterno"
              name="fatherLastName"
              autocomplete="off"
              v-model="v$.clientFatherLastName.$model"
              placeholder="Ingrese apellido del padre."
              :required="true"
              :errors="v$.clientFatherLastName.$errors"
          />
        </div>
        <div>
          <Input
              label="Apellido Materno"
              name="motherLastName"
              autocomplete="off"
              v-model="v$.clientMotherLastName.$model"
              placeholder="Ingrese apellido de la madre."
              :required="true"
              :errors="v$.clientMotherLastName.$errors"
          />
        </div>
      </div>
    </div>
    <div class="px-5 sm:px-8 lg:px-10 pt-1 pb-5">
      <div class="md:grid grid-cols-3 gap-4">
        <div>
          <Input
              label="Nombre empresa"
              name="companyName"
              autocomplete="off"
              v-model="v$.clientCompanyName.$model"
              placeholder="Ingrese el nombre de la empresa."
              :errors="v$.clientCompanyName.$errors"
          />
        </div>
        <div>
          <Input
              label="Teléfono"
              name="phone"
              autocomplete="off"
              v-model="v$.clientPhone.$model"
              placeholder="Ingrese el número de teléfono."
              :errors="v$.clientPhone.$errors"
          />
        </div>
        <div>
          <Input
              label="Email"
              name="emial"
              autocomplete="off"
              v-model="v$.clientEmail.$model"
              placeholder="Ingrese el corrreo."
              :errors="v$.clientEmail.$errors"
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
  email, helpers, maxLength, required,
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
import ClientsAPI from '@/data/api/ClientsAPI';
import Client from '@/data/entity/Client';

let user: Client;
const disableOfEdit = ref(false);

const toast = useToast();
const alert = createAlert();

const loadingProduct = ref(false);
const loadingButton = ref(false);
const typeNieList = ref<Status[]>([{
  code: 'DNI',
  name: 'DNI',
},
{
  code: 'RUC',
  name: 'RUC',
},
{
  code: 'CE',
  name: 'Carnet de extranjería',
}]);
const typeNie = ref<Status>();

const statusList = ref<Status[]>([{
  code: 'true',
  name: 'Activo',
},
{
  code: 'false',
  name: 'Inactivo',
}]);
const status = ref<Status>();

const btnName = ref('Agregar usuario');
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
  clientTypeNie: '',
  clientNie: '',
  clientName: '',
  clientFatherLastName: '',
  clientMotherLastName: '',
  clientCompanyName: '',
  clientPhone: '',
  clientEmail: '',
  clientStatus: '',
});

const rules = computed(() => ({
  clientNie: {
    required: helpers.withMessage('Número del documento es obligatorio', required),
    maxLength: helpers.withMessage(`Máximo de caracteres es 20`, maxLength(20)),
  },
  clientName: {
    required: helpers.withMessage('Nombre es obligatorio', required),
    maxLength: helpers.withMessage(`Máximo de caracteres es 100`, maxLength(100)),
  },
  clientFatherLastName: {
    required: helpers.withMessage('Apellido del padre es obligatorio', required),
    maxLength: helpers.withMessage(`Máximo de caracteres es 100`, maxLength(100)),
  },
  clientMotherLastName: {
    required: helpers.withMessage('Apellido de la madre es obligatorio', required),
    maxLength: helpers.withMessage(`Máximo de caracteres es 100`, maxLength(100)),
  },
  clientCompanyName: {
    required: helpers.withMessage('Nombre de la empresa es obligatorio', required),
    maxLength: helpers.withMessage(`Máximo de caracteres es 100`, maxLength(100)),
  },
  clientEmail: {
    email: helpers.withMessage('El correo no es correcto', email),
  },
  clientPhone: {
    maxLength: helpers.withMessage(`Máximo de caracteres es 20`, maxLength(20)),
  },
}));

const v$ = useVuelidate(rules, formState, { $autoDirty: true });

const btnAcceptDisable = computed(() => v$.value.$invalid);

const handleSubmit = async () => {
  loadingButton.value = true;

  await v$.value.$validate();

  if (v$.value.$invalid) {
    loadingButton.value = false;
    toast.warning('Los datos ingresados no son correctos');
  } else {
    user = {
      typeNie: typeNie.value?.code,
      nie: formState.clientNie,
      name: formState.clientName,
      fatherLastName: formState.clientFatherLastName,
      motherLastName: formState.clientMotherLastName,
      companyName: formState.clientCompanyName,
      email: formState.clientEmail,
      phone: formState.clientPhone,
      active: Boolean(status.value?.code),
    };
    if (+props.id > 0) {
      user.id = +props.id;
      ClientsAPI.Update(user)
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
      ClientsAPI.Insert(user)
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

  if (+props.id > 0) {
    promises.push(ClientsAPI.GetById(+props.id));
  }
  Promise.all(promises)
    .then((values) => {
      const [pat] = values;
      // Se obtiene el resultado de la primera promesa
      if (+props.id > 0) {
        user = pat;

        if (user.id! > 0) {
          typeNie.value = typeNieList.value.find((s) => s.code === user.typeNie);
          formState.clientNie = user.nie!;
          formState.clientName = user.name!;
          formState.clientFatherLastName = user.fatherLastName!;
          formState.clientMotherLastName = user.motherLastName!;
          formState.clientCompanyName = user.companyName!;
          formState.clientEmail = user.email!;
          formState.clientPhone = user.phone!;
          status.value = statusList.value.find((s) => s.code === `${user.active}`);
          btnName.value = 'Editar cliente';
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

const callBackSubmitResult = (obj: Client) => {
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
