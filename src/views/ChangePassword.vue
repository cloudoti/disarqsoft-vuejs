<template>
  <section
    class="w-full h-full text-gray-900 py-36 bg-center bg-cover bg-no-repeat"
    style="background:url('http://seguretatdelspacients.gencat.cat/web/.content/minisite/seguretatpacients/que_es_la_seguretat_de_pacients/actualitat/img_actualitat/gestio-del-risc.jpg_2070330387.jpg')">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 flex items-center justify-center">
      <div class="hidden lg:w-3/6 lg:pr-0 pr-0">
        <h1 class="font-medium text-5xl text-black">Fácil, rápido y eficiente.</h1>
        <p class="leading-relaxed mt-4 text-white">
          Gestiona tú laboratorio y manten a tus pacientes actualizados en tiempo real.</p>
      </div>
      <div
        class="lg:w-3/6 xl:w-2/5 md:w-full bg-gray-50 p-8 flex flex-col lg:ml-auto w-full mt-10 lg:mt-0 rounded-md">
        <div>
          <img
            class="h-12 w-auto"
            src="@/assets/logo-conecta.jpeg"
            alt="Labinhome"/>
          <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
            Cambia tu contraseña
          </h2>
        </div>

        <div class="mt-8">
          <div class="mt-6">
            <form
              class="space-y-6">
              <div>
                <Input
                  label="Contraseña"
                  type="password"
                  name="password"
                  required
                  autocomplete="off"
                  v-model="v$.password.$model"
                  placeholder="Ingrese tu nueva contraseña"
                  :errors="v$.password.$errors"
                />
              </div>

              <div class="space-y-1">
                <Input
                  label="Repite tu contraseña"
                  type="password"
                  name="password2"
                  required
                  autocomplete="off"
                  @keyup.enter="changePassword"
                  v-model="v$.repeatPassword.$model"
                  placeholder="Repite tu contraseña"
                  :errors="v$.repeatPassword.$errors"
                />
              </div>

              <div class="flex items-center justify-between">
                <div class="text-sm">
                  <a
                    @click="returnLogin"
                    class="font-medium text-blue-600 hover:text-blue-500 cursor-pointer">
                    &lt;- Regresar al login
                  </a>
                </div>
              </div>

              <div>
                <Button
                  type="button"
                  label="Cambiar"
                  :disabled="btnAcceptDisable"
                  :loading="loadingRecovery"
                  @click="changePassword"
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
import { useRoute } from 'vue-router';
import Input from '@/ui/components/Input.vue';
import Button from '@/ui/components/Button.vue';
import Store from '@/data/Store';
import router from '@/router';
import AuthAPI from '@/data/api/AuthAPI';
import Loading from '@/ui/components/Loading.vue';

const {
  auth,
  loggedIn,
} = inject<Store>('store', {});

if (auth?.authenticate) {
  router.push('/');
}

const recoveryId = useRoute().query?.code as string;

if (!recoveryId) {
  router.push('/login');
}

const toast = useToast();

const loadingRecovery = ref(false);

const formState = reactive({
  password: '',
  repeatPassword: '',
});

const rules = computed(() => ({
  password: {
    required: helpers.withMessage(`El password es obligatorio`, required),
  },
  repeatPassword: {
    required: helpers.withMessage(`El password es obligatorio`, required),
  },
}));

const v$ = useVuelidate(rules, formState, { $autoDirty: true });

const btnAcceptDisable = computed(() => {
  if (v$.value.$invalid) {
    return true;
  }

  if (formState.password !== formState.repeatPassword) {
    return true;
  }
  return false;
});

const returnLogin = async () => {
  setTimeout(() => {
    router.push('/login');
  }, 300);
};

const changePassword = async () => {
  loadingRecovery.value = true;

  AuthAPI.ChangePassword(recoveryId, formState.password, formState.repeatPassword)
    .then((data) => {
      toast.success('Su password a sido actualizado');

      setTimeout(() => {
        router.push('/login');
      }, 1000);
    })
    .catch((error) => {
      toast.warning('Los datos ingresados no son correctos');
    })
    .finally(() => {
      loadingRecovery.value = false;
    });
};

</script>
