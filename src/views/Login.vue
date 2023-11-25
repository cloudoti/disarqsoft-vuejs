<template>
  <section
id="login-bg"
    class="w-full h-full text-gray-900 py-36 bg-center bg-cover bg-no-repeat">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 flex items-center justify-center">
      <div class="hidden lg:w-3/6 lg:pr-0 pr-0">
        <h1 class="font-medium text-5xl text-black">Fácil, rápido y eficiente.</h1>
        <p class="leading-relaxed mt-4 text-white">
          Gestiona tú laboratorio y manten a tus pacientes actualizados en tiempo real.</p>
      </div>
      <div
        class="relative lg:w-3/6 xl:w-2/5 md:w-full bg-gray-50 p-8 flex flex-col lg:ml-auto w-full mt-10 lg:mt-0 rounded-md">
        <div>
          <img
            class="h-12 w-auto"
            src="@/assets/logo-conecta.jpeg"
            alt="Labinhome"/>
          <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
            Inicia sesión en tu cuenta
          </h2>
        </div>

        <div class="mt-8">
          <div class="mt-6">
            <form
              class="space-y-6">
              <div>
                <Input
                  label="Usuario"
                  name="username"
                  required
                  autocomplete="off"
                  v-model="v$.username.$model"
                  placeholder="Ingrese el nombre de usuario"
                  :errors="v$.username.$errors"
                />
              </div>

              <div class="space-y-1">
                <Input
                  label="Password"
                  type="password"
                  name="password"
                  required
                  autocomplete="off"
                  @keyup.enter="login"
                  v-model="v$.password.$model"
                  placeholder="Ingresa tu password"
                  :errors="v$.password.$errors"
                />
              </div>

              <div class="text-sm text-right">
                <a
                  @click="passwordRecovery"
                  class="font-medium text-blue-600 hover:text-blue-500 cursor-pointer">
                  Olvidaste tu contraseña?
                </a>
              </div>

              <div>
                <Button
                  type="button"
                  label="Sign in"
                  :disabled="btnAcceptDisable"
                  :loading="loadingButton"
                  @click="login"
                  class="w-full">
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  computed, inject, reactive, ref,
} from 'vue';
import { helpers, required } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';
import { useToast } from 'vue-toastification';
import Input from '@/ui/components/Input.vue';
import Button from '@/ui/components/Button.vue';
import Store from '@/data/Store';
import router from '@/router';
import AuthAPI from '@/data/api/AuthAPI';
import global from '@/data/global';
import ERouteType from '@/router/ERouteType';

const {
  auth,
  loggedIn,
} = inject<Store>('store', {});

if (auth?.authenticate) {
  if (global.isAdmin()) {
    router.push(ERouteType.USER_PATH);
  } else if (global.isAdvise()) {
    router.push(ERouteType.QUOTATION_PATH);
  }
}

const toast = useToast();

const loadingButton = ref(false);

const formState = reactive({
  username: '',
  password: '',
});

const rules = computed(() => ({
  username: {
    required: helpers.withMessage('El usuario es obligatorio', required),
  },
  password: {
    required: helpers.withMessage(`El password es obligatorio`, required),
  },
}));

const v$ = useVuelidate(rules, formState, { $autoDirty: true });

const btnAcceptDisable = computed(() => {
  if (v$.value.$invalid) {
    return true;
  }
  return false;
});

const login = async () => {
  loadingButton.value = true;
  await v$.value.$validate();

  if (v$.value.$invalid) {
    loadingButton.value = false;
    toast.warning('Los datos ingresados no son correctos');
  } else {
    AuthAPI.Auth(formState.username, formState.password)
      .then((data) => {
        toast.success('Inicio de sesión autorizado');

        loggedIn(formState.username, data.access_token);

        setTimeout(() => {
          // eslint-disable-next-line no-restricted-globals
          location.reload();
        }, 500);
      })
      .catch((error) => {
        toast.warning('Los datos ingresados no son correctos');
      })
      .finally(() => {
        loadingButton.value = false;
      });
  }
};

const passwordRecovery = async () => {
  setTimeout(() => {
    router.push('/recupera-tu-contrasena');
  }, 300);
};

</script>
