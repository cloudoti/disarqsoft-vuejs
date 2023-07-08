<template>
  <div class="flex h-screen">
    <div class="m-auto text-center px-5">
      <div
        class="mx-auto flex items-center justify-center h-32 w-32 rounded-full bg-blue-100">
        <EmojiSadIcon
          class="h-20 w-20 text-blue-600"
        ></EmojiSadIcon>
      </div>
      <h2 class="mt-5 font-medium">
        <div v-if="code === 401">
          <div class="text-xl text-blue-900">{{ code }}</div>
          <div class="mt-5 text-4xl font-bold">No estás Autorizado</div>
        </div>
        <div v-else-if="code === 404">
          <div class="text-xl text-blue-900">{{ code }}</div>
          <div class="mt-5 text-4xl font-bold">No existe</div>
        </div>
        <div v-else-if="pathName.trim() == 'not-found'">
          <div class="text-xl text-blue-900">{{ fullPath }}</div>
          <div class="mt-5 text-4xl font-bold">No existe</div>
        </div>
        <div v-else>
          <div class="text-xl text-blue-900">UPS!</div>
          <div class="mt-5 text-4xl font-bold">Ocurrió un error inesperado</div>
        </div>

      </h2>
      <p class="mt-5 text-xl text-gray-500">
        <span v-if="code === 401">
          Este error podría solucionarse iniciando sesión nuevamente.
        </span>
        <span v-else-if="code === 404">
          Lo sentimos, no hemos podido encontrar el recurso solicitado.
        </span>
        <span v-else-if="pathName === 'not-found'">
          Lo sentimos, no hemos podido encontrar la ruta solicitada.
        </span>
        <span v-else>
          Estamos presentando problemas técnicos, pero estamos trabajando para estar de regreso.
        </span>
      </p>
      <div class="mt-6">
        <a
          href="/"
          class="text-sm justify-center flex items-center font-medium text-blue-600 hover:text-blue-500">
          <span class="mr-2">Regresar al inicio</span>
          <span
          class="text-4xl"
          aria-hidden="true">
          &rarr;
          </span>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { EmojiSadIcon } from '@heroicons/vue/outline';
import { ref } from 'vue';
import { useToast } from 'vue-toastification';
import router from '@/router';

export default {
  components: {
    EmojiSadIcon,
  },
  mounted() {
    this.pathName = this.$route.name;
    this.fullPath = this.$route.fullPath;
    if (this.$route.query.code) {
      this.code = +this.$route.query.code;
    }
    if (this.code === 401) {
      this.toast.warning('No estás Autorizado.\nInicie sesión nuevamente.');
      router.push('/login');
    }
  },
  setup() {
    const code = ref(0);
    const pathName = ref('');
    const fullPath = ref('');
    const toast = useToast();
    return {
      code,
      pathName,
      fullPath,
      toast,
    };
  },
};
</script>
