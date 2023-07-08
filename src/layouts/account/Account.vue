<template>
  <main class="max-w-7xl mx-auto pb-10 lg:py-12 lg:px-8">
    <div class="lg:grid lg:grid-cols-12 lg:gap-x-5">
      <aside class="py-3 md:py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
        <h1 class="text-xl"><strong>Mi Cuenta</strong></h1>
        <nav
          aria-label="Sidebar"
          class="sticky top-4 divide-y divide-gray-300 mt-5">
          <div class="md:pb-8 space-y-1">
          <span
            v-for="item in navigation"
            :key="item.name">
              <router-link
                v-show="item.show"
                :to="item.href"
                :class="[item.current ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-50',
                'group flex items-center px-3 py-2 text-sm font-medium rounded-md']"
                :aria-current="item.current ? 'page' : undefined"
                v-on:click="activeNavigation(item)">
                <component
                  :is="item.icon"
                  :class="[item.current ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
                  'flex-shrink-0 -ml-1 mr-3 h-6 w-6']"
                  aria-hidden="true"/>
                  <span class="truncate"/>
                {{ item.name }}
              </router-link>
            </span>
          </div>
        </nav>
      </aside>

      <div class="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
        <main class="bg-white px-4 shadow p-6 sm:rounded-lg">
          <router-view></router-view>
        </main>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import {
  BadgeCheckIcon,
  BeakerIcon,
  IdentificationIcon,
  LibraryIcon,
  OfficeBuildingIcon,
  UserGroupIcon,
  UsersIcon,
  ClipboardListIcon,
} from '@heroicons/vue/outline';
import { inject, ref } from 'vue';
import Store from '@/data/Store';
import global from '@/data/global';

const {
  auth,
  logOut,
} = inject<Store>('store', {});

let userOptions: any[] = [];

if (auth?.authenticate) {
  userOptions = auth.roles!;
}

const navigation = ref([
  {
    name: 'Sucursales',
    href: '/cuenta/sucursales',
    icon: OfficeBuildingIcon,
    current: true,
    show: global.isAdmin() || global.isConfigAccount(),
  },
  {
    name: 'Usuarios',
    href: '/cuenta/usuarios-laboratorio',
    icon: IdentificationIcon,
    current: false,
    show: global.isAdmin(),
  },
  {
    name: 'General',
    href: '/cuenta/general',
    icon: BadgeCheckIcon,
    current: false,
    show: global.isAdmin(),
  },
  {
    name: 'Plantillas',
    href: '/cuenta/plantilla',
    icon: ClipboardListIcon,
    current: false,
    show: global.isAdmin(),
  },
]);

const activeNavigation = (item: any) => {
  navigation.value.forEach((elem) => {
    const e = elem;
    e.current = false;
  });
  const i = item;
  i.current = true;
};

</script>

<style scoped>

</style>
