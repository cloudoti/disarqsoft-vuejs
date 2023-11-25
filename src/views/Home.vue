<template>
  <div
    class="home"
    v-if="store?.auth?.authenticate">
    <BackOffice></BackOffice>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';
import { useRoute } from 'vue-router';
import BackOffice from '@/layouts/BackOffice.vue';
import Store from '@/data/Store';
// eslint-disable-next-line import/no-cycle
import router from '@/router';
import ERolesType from '@/data/entity/enums/ERolesType';
import ERouteType from '@/router/ERouteType';

export default defineComponent({
  name: 'Home',
  components: { BackOffice },
  inject: ['store'],
  setup() {
    const {
      auth,
    } = inject<Store>('store', {});

    const rolesUser = auth?.role || 0;

    if (!auth?.authenticate) {
      router.push('/login');
    }

    if (useRoute().path !== '/') {
      return;
    }

    if (rolesUser === ERolesType.ADVISE) {
      router.push(ERouteType.ORDER_PATH);
      return;
    }

    if (rolesUser === ERolesType.ADMIN) {
      router.push(ERouteType.USER_PATH);
    }
  },
});
</script>
