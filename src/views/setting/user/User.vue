<template>
  <BreadCrumb :show-back="showBreadCrumb">Configuración / Usuario /
    {{ +props.id > 0 ? 'Editar usuario' : 'Agregar usuario' }}
  </BreadCrumb>
  <form class="relative">
    <Loading
        opacity
        :show="loadingProduct"
        size="10"/>
    <div class="px-5 sm:px-8 lg:px-10 py-5">
      <div class="grid grid-cols-3 gap-4">
        <Input
            label="Nombre"
            name="name"
            autocomplete="off"
            v-model="v$.userName.$model"
            placeholder="Ingrese nombre."
            :required="true"
            :errors="v$.userName.$errors"
        />
        <div>
          <Input
              label="Apellido Paterno"
              name="fatherLastName"
              autocomplete="off"
              v-model="v$.userFatherLastName.$model"
              placeholder="Ingrese apellido del padre."
              :required="true"
              :errors="v$.userFatherLastName.$errors"
          />
        </div>
        <div>
          <Input
              label="Apellido Materno"
              name="motherLastName"
              autocomplete="off"
              v-model="v$.userMotherLastName.$model"
              placeholder="Ingrese apellido de la madre."
              :required="true"
              :errors="v$.userMotherLastName.$errors"
          />
        </div>
      </div>
    </div>
    <div class="px-5 sm:px-8 lg:px-10 pt-1 pb-5">
      <div class="md:grid grid-cols-3 gap-4">
        <div>
          <Input
              label="Usuario"
              name="username"
              autocomplete="off"
              v-model="v$.userUsername.$model"
              placeholder="Ingrese el precio."
              :errors="v$.userUsername.$errors"
          />
        </div>
        <div>
          <Input
              label="Pasword"
              name="password"
              autocomplete="off"
              v-model="v$.userPassword.$model"
              placeholder="Ingrese el precio."
              :errors="v$.userPassword.$errors"
          />
        </div>
        <div>
          <Select
              label="Rol"
              name="roleSelect"
              v-model="role"
              :required="true"
              :options="roles"
              :disabled="disableOfEdit"
          >
            <template #optionContent="item">
              {{ item.item.name }}
            </template>
          </Select>
        </div>
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
import { helpers, maxLength, required } from '@vuelidate/validators';
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
import Role from '@/data/entity/Role';
import Status from '@/data/entity/Status';
import UsersAPI from '@/data/api/UsersAPI';
import User from '@/data/entity/User';

let user: User;
const disableOfEdit = ref(false);

const toast = useToast();
const alert = createAlert();

const loadingProduct = ref(false);
const loadingButton = ref(false);
const roles = ref<Role[]>([]);
const role = ref<Role>();
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
  userName: '',
  userFatherLastName: '',
  userMotherLastName: '',
  userUsername: '',
  userPassword: '',
  userRole: '',
  userStatus: '',
});

const rules = computed(() => ({
  userName: {
    required: helpers.withMessage('Nombre del empleado es obligatorio', required),
    maxLength: helpers.withMessage(`Máximo de caracteres es 100`, maxLength(100)),
  },
  userFatherLastName: {
    required: helpers.withMessage('Apellido del padre es obligatorio', required),
    maxLength: helpers.withMessage(`Máximo de caracteres es 100`, maxLength(100)),
  },
  userMotherLastName: {
    required: helpers.withMessage('Apellido de la madre es obligatorio', required),
    maxLength: helpers.withMessage(`Máximo de caracteres es 100`, maxLength(100)),
  },
  userUsername: {
    required: helpers.withMessage('Nombre del usuario es obligatorio', required),
    maxLength: helpers.withMessage(`Máximo de caracteres es 100`, maxLength(25)),
  },
  userPassword: {
    required: helpers.withMessage('El password es obligatorio', required),
    maxLength: helpers.withMessage(`Máximo de caracteres es 100`, maxLength(50)),
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
      name: formState.userName,
      fatherLastName: formState.userFatherLastName,
      motherLastName: formState.userMotherLastName,
      username: formState.userUsername,
      password: formState.userPassword,
      role: {
        id: role.value?.id,
      },
      active: Boolean(status.value?.code),
    };
    if (+props.id > 0) {
      user.id = +props.id;
      UsersAPI.UpdateUser(user)
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
      UsersAPI.InsertUser(user)
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

  promises.push(UsersAPI.ListRoles());

  if (+props.id > 0) {
    promises.push(UsersAPI.GetById(+props.id));
  }
  Promise.all(promises)
    .then((values) => {
      const [listCategory, pat] = values;
      // Se obtiene el resultado de la primera promesa
      roles.value = listCategory;
      if (+props.id > 0) {
        user = pat;
        if (user.id! > 0) {
          formState.userName = user.name!;
          formState.userFatherLastName = user.fatherLastName!;
          formState.userMotherLastName = user.motherLastName!;
          formState.userUsername = user.username!;
          formState.userPassword = user.password!;
          role.value = user.role;
          status.value = statusList.value.find((s) => s.code === `${user.active}`);
          btnName.value = 'Editar usuario';
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

const callBackSubmitResult = (obj: User) => {
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
