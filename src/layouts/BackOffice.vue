<template>
  <div class="relative min-h-screen bg-gray-100">
    <Popover
      as="template"
      v-slot="{ open, close }">
      <header
        :class="[open ? 'fixed inset-0 z-40 overflow-y-auto' : '',
      'bg-white shadow-sm lg:static lg:overflow-y-visible']">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="relative py-1 flex justify-between xl:grid xl:grid-cols-12 lg:gap-8">
            <div class="flex md:left-0 md:inset-y-0 xl:col-span-2">
              <div class="flex-shrink-0 flex items-center">
                <a href="#">
                  <img
                    class="block h-10 md:h-16 w-auto"
                    src="@/assets/logo-conecta.jpeg"
                    alt="Workflow"/>
                </a>
              </div>
            </div>
            <!-- Start Menu Icon when width >= 768px -->
            <div class="flex items-center lg:hidden">
              <PopoverButton
                class="-mx-2 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-rose-500">
                <MenuIcon
                  v-if="!open"
                  class="block h-6 w-6"
                  aria-hidden="true"/>
                <XIcon
                  v-else
                  class="block h-6 w-6"
                  aria-hidden="true"/>
              </PopoverButton>
            </div>
            <!-- End Menu Icon when width >= 768px -->

            <!-- Start Header when width >= 1024px -->
            <div class="hidden lg:flex lg:items-center lg:justify-end xl:col-span-10">
              <div
                class="flex items-center px-6 py-4 md:max-w-3xl md:mx-auto lg:max-w-none lg:mx-0 xl:px-0">

                <span
                  v-for="item in appNavigation"
                  :key="item.name"
                  class="ml-2">
              <router-link
                v-show="item.show"
                :to="item.href"
                class="text-black-600 hover:bg-gray-300 group flex items-center px-3 py-2 text-sm font-medium rounded-md"
                :class="[item.current ? 'bg-gray-300' : '']"
                :aria-current="item.current ? 'page' : undefined"
                v-on:click="activeNavigation(item)"
              >
                <component
                  :is="item.icon"
                  :class="[item.current ? 'text-black-500' : 'text-black-400 group-hover:text-gray-500',
                  'flex-shrink-0 -ml-1 mr-3 h-6 w-6']"
                  aria-hidden="true"/>
                  <span class="truncate"/>
                {{ item.name }}
              </router-link>
            </span>
              </div>
              <a
                href="#"
                class="ml-5 flex-shrink-0 bg-white rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500">
                <span class="sr-only">View notifications</span>
              </a>

              <!-- Profile dropdown -->
              <Menu
                as="div"
                class="flex-shrink-0 relative ml-5">
                <div class="flex shadow-sm rounded-md bg-black">
                  <MenuButton
                    class="flex-shrink-0 flex items-center justify-center h-11 w-11 text-white text-3xl font-bold rounded-md py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black-500">
                    {{
                      user.username.charAt(0)
                      .toUpperCase()
                    }}
                  </MenuButton>
                </div>
                <transition
                  enter-active-class="transition ease-out duration-100"
                  enter-from-class="transform opacity-0 scale-95"
                  enter-to-class="transform opacity-100 scale-100"
                  leave-active-class="transition ease-in duration-75"
                  leave-from-class="transform opacity-100 scale-100"
                  leave-to-class="transform opacity-0 scale-95">
                  <MenuItems
                    class="origin-top-right absolute z-10 right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 focus:outline-none">
                    <MenuItem
                      v-for="item in userNavigation"
                      :key="item.name"
                      v-slot="{ active }">
                      <router-link
                        v-show="item.show"
                        :to="item.href"
                        :class="[active ? 'bg-gray-100' : '',
                        'block py-2 px-4 text-sm text-gray-700']">
                        {{ item.name }}
                      </router-link>
                    </MenuItem>
                    <MenuItem
                      v-slot="{ active }">
                      <i
                        @click="logOutLocal"
                        :class="[active ? 'bg-gray-100' : '',
                        'block py-2 px-4 text-sm text-gray-700']">
                        Cerrar Sesión
                      </i>
                    </MenuItem>
                  </MenuItems>
                </transition>
              </Menu>
            </div>
            <!-- End Header when width >= 1024px -->
          </div>
        </div>
        <!-- Start Menu Options when width >= 768px -->
        <PopoverPanel
          as="nav"
          class="lg:hidden"
          aria-label="Global">
          <div class="max-w-3xl mx-auto px-2 pt-2 pb-3 space-y-1 sm:px-4">
            <span
              v-for="item in appNavigation"
              :key="item.name"
            >
              <router-link
                :to="item.href"
                :aria-current="item.current ? 'page' : undefined"
                class="text-black-600 hover:bg-gray-300 group flex items-center px-3 py-2 text-sm font-medium rounded-md"
                :class="[item.current ? 'bg-gray-300' : '']"
                v-on:click="activeNavigation(item); close();"
              >
                {{ item.name }}
              </router-link>
            </span>

          </div>
          <div class="border-t border-gray-200 pt-4">
            <div class="max-w-3xl mx-auto px-4 flex items-center sm:px-6">
              <div class="flex-shrink-0">
                <img
                  class="h-10 w-10 rounded-full"
                  :src="(user.image && user.image !== '') ? user.image : require('@/assets/no-user-photo.png')"
                  alt=""/>
              </div>
              <div class="ml-3">
                <div class="text-base font-medium text-gray-800">{{ user.name }}</div>
                <div class="text-sm font-medium text-gray-500">{{ user.username }}</div>
              </div>
              <button
                type="button"
                class="ml-auto flex-shrink-0 bg-white rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500">
                <span class="sr-only">View notifications</span>
              </button>
            </div>
            <div class="mt-3 max-w-3xl mx-auto px-2 space-y-1 sm:px-4">
              <span
                v-for="item in userNavigation"
                :key="item.name">
              <router-link
                :to="item.href"
                v-on:click="close();"
                class="block rounded-md py-2 px-3 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900">
                {{ item.name }}
              </router-link>
            </span>
              <span>
              <i
                @click="logOutLocal"
                class="block cursor-pointer rounded-md py-2 px-3 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900">
                Cerrar Sesión
              </i>
            </span>
            </div>
          </div>
        </PopoverPanel>
        <!-- End Menu Options when width >= 768px -->
      </header>
    </Popover>

    <div class="py-4 md:py-10">
      <router-view/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Popover,
  PopoverButton,
  PopoverPanel,
} from '@headlessui/vue';

import {
  UserAddIcon,
  InboxInIcon, CalculatorIcon,
} from '@heroicons/vue/solid';

import {
  MenuIcon,
  XIcon,
  ClipboardListIcon,
  PresentationChartBarIcon, DocumentAddIcon,
} from '@heroicons/vue/outline';

import { inject, ref } from 'vue';
import Store from '@/data/Store';
import router from '@/router';
import global from '@/data/global';
import ERouteType from '@/router/ERouteType';

const {
  auth,
  logOut,
} = inject<Store>('store', {});

let userOptions: any[] = [];
if (auth?.authenticate) {
  userOptions = auth.roles!;
}

const open = ref(false);

const user = auth?.user;

const appNavigation = ref([
  {
    name: 'Bandeja',
    href: '/ordenes',
    icon: ClipboardListIcon,
    current: false,
    show: true,
  },
  {
    name: 'Cotizaciones',
    href: '/cotizaciones',
    icon: CalculatorIcon,
    current: false,
    show: true,
  },
  {
    name: 'Registrar OP',
    href: '/nueva-orden',
    icon: DocumentAddIcon,
    current: false,
    show: true,
  },
]);

const userNavigation = [
  {
    name: 'Configuraciones',
    // eslint-disable-next-line no-use-before-define
    href: ERouteType.USER_PATH,
    show: global.isSuperAdmin() || global.isConfigBusiness(),
  },
];

const activeNavigation = (item: any) => {
  appNavigation.value.forEach((elem) => {
    const e = elem;
    e.current = false;
  });
  const i = item;
  i.current = true;
};

const logOutLocal = () => {
  if (typeof logOut === 'function') {
    logOut!();

    router.push('/login');
  }
};

</script>

<style scoped>

</style>
