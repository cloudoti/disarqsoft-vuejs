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
        class="relative lg:w-3/6 xl:w-2/5 md:w-full bg-gray-50 p-8 flex flex-col lg:ml-auto w-full mt-10 lg:mt-0 rounded-md">
        <div>
          <img
            class="h-12 w-auto"
            src="@/assets/logo-conecta.jpeg"
            alt="Labinhome"/>
          <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
            Recupera tu contraseña
          </h2>
        </div>

        <div class="mt-8">
          <div class="mt-6">
            <form
              @submit.prevent=""
              class="space-y-6">
              <div>
                <Input
                  label="Email"
                  name="email"
                  required
                  autocomplete="off"
                  v-model="v$.email.$model"
                  @keyup.enter.prevent="passwordRecovery"
                  placeholder="Ingrese el correo electronico"
                  :errors="v$.email.$errors"
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
                  label="Recuperar"
                  :disabled="btnAcceptDisable"
                  :loading="loadingButton"
                  @click="passwordRecovery"
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
import { email, helpers, required } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';
import { useToast } from 'vue-toastification';
import Input from '@/ui/components/Input.vue';
import Button from '@/ui/components/Button.vue';
import Store from '@/data/Store';
import router from '@/router';
import AuthAPI from '@/data/api/AuthAPI';

const {
  auth,
  loggedIn,
} = inject<Store>('store', {});

if (auth?.authenticate) {
  router.push('/');
}

const toast = useToast();

const loadingButton = ref(false);

const formState = reactive({
  email: '',
});

const rules = computed(() => ({
  email: {
    email: helpers.withMessage('Email no es válido', email),
    required: helpers.withMessage('Email es obligatorio', required),
  },
}));

const v$ = useVuelidate(rules, formState, { $autoDirty: true });

const btnAcceptDisable = computed(() => {
  if (v$.value.$invalid) {
    return true;
  }
  return false;
});

const returnLogin = async () => {
  setTimeout(() => {
    router.push('/login');
  }, 300);
};

const passwordRecovery = async () => {
  await v$.value.$validate();

  if (v$.value.email.$error) {
    return;
  }

  loadingButton.value = true;

  AuthAPI.PasswordRecovery(formState.email)
    .then((data) => {
      toast.success('Se envió un correo electrónico de recuperación de contraseña');

      setTimeout(() => {
        router.push('/login');
      }, 1000);
    })
    .catch((error) => {
      toast.warning('Los datos ingresados no son correctos');
    })
    .finally(() => {
      loadingButton.value = false;
    });
};

</script>
