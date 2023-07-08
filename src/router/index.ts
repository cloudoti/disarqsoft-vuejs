import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '@/views/Home.vue';
import WorkTray from '@/views/workTray/WorkTray.vue';
import WorkOrder from '@/views/workOrder/WorkOrder.vue';
import Patient from '@/views/setting/product/Product.vue';
import PatientList from '@/views/setting/product/ProductList.vue';
import Setting from '@/layouts/backOffice/Setting.vue';
import Account from '@/layouts/account/Account.vue';
import UserList from '@/views/setting/user/UserList.vue';
import Storage from '@/data/global';
import ERolesType from '@/data/entity/enums/ERolesType';
import ERouteType from '@/router/ERouteType';

const rolesUser = Storage.auth.roles === undefined ? [] : Storage.auth.roles;

const childConfiguration = [
  {
    path: ERouteType.PATIENT_PATH,
    name: ERouteType.PATIENT_NAME,
    component: PatientList,
  },
  {
    path: ERouteType.NEW_PATIENT_PATH,
    name: ERouteType.NEW_PATIENT_NAME,
    component: Patient,
  },
  {
    path: ERouteType.EDIT_PATIENT_PATH,
    name: ERouteType.EDIT_PATIENT_NAME,
    component: Patient,
    props: true,
  },
  {
    path: ERouteType.USER_PATH,
    name: ERouteType.USER_NAME,
    component: UserList,
  },
];

const fnChildConfiguration = (x) => {
  let valid = false;

  if (x.path === ERouteType.PATIENT_PATH && rolesUser.includes(ERolesType.CONFIG_BUSINESS)) {
    valid = true;
  }

  if (x.path === ERouteType.NEW_PATIENT_PATH && rolesUser.includes(ERolesType.CONFIG_BUSINESS)) {
    valid = true;
  }

  if (x.path === ERouteType.EDIT_PATIENT_PATH && rolesUser.includes(ERolesType.CONFIG_BUSINESS)) {
    valid = true;
  }

  if (x.path === ERouteType.USER_PATH && rolesUser.includes(ERolesType.SUPER_ADMIN)) {
    valid = true;
  }

  if (x.path === ERouteType.NEW_USER_PATH && rolesUser.includes(ERolesType.SUPER_ADMIN)) {
    valid = true;
  }

  if (x.path === ERouteType.EDIT_USER_PATH && rolesUser.includes(ERolesType.SUPER_ADMIN)) {
    valid = true;
  }

  return valid;
};

const fnChildAccount = (x) => {
  let valid = false;

  if (x.path === ERouteType.USER_LABORATORY_PATH
        && rolesUser.some((role) => [ERolesType.ADMIN, ERolesType.CONFIG_ACCOUNT].includes(role))) {
    valid = true;
  }

  if (x.path === ERouteType.NEW_USER_LABORATORY_PATH
        && rolesUser.some((role) => [ERolesType.ADMIN, ERolesType.CONFIG_ACCOUNT].includes(role))) {
    valid = true;
  }

  if (x.path === ERouteType.EDIT_USER_LABORATORY_PATH
        && rolesUser.some((role) => [ERolesType.ADMIN, ERolesType.CONFIG_ACCOUNT].includes(role))) {
    valid = true;
  }

  return valid;
};

const childHome = [
  {
    path: ERouteType.ORDER_PATH,
    name: ERouteType.ORDER_NAME,
    component: WorkTray,
  },
  {
    path: ERouteType.NEW_ORDER_PATH,
    name: ERouteType.NEW_ORDER_NAME,
    component: WorkOrder,
  },
];

const fnChildHome = (x) => {
  let valid = false;

  if (x.path === ERouteType.ORDER_PATH
        && rolesUser.some((role) => [ERolesType.REGISTER_ORDERS].includes(role))) {
    valid = true;
  } else if (x.path === ERouteType.NEW_ORDER_PATH
        && rolesUser.some((role) => [ERolesType.REGISTER_ORDERS].includes(role))) {
    valid = true;
  }

  return valid;
};

const filterChildHome = childHome.filter(fnChildHome);

if (rolesUser.some((role) => [ERolesType.CONFIG_BUSINESS, ERolesType.SUPER_ADMIN,
  ERolesType.ADMIN].includes(role))) {
  filterChildHome.push({
    path: ERouteType.CONFIGURATIONS_PATH,
    name: ERouteType.CONFIGURATIONS_NAME,
    component: Setting,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    children: childConfiguration.filter(fnChildConfiguration),
  });
}

if (rolesUser.some((role) => [ERolesType.CONFIG_ACCOUNT, ERolesType.ADMIN].includes(role))) {
  filterChildHome.push({
    path: ERouteType.ACCOUNT_PATH,
    name: ERouteType.ACCOUNT_NAME,
    component: Account,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    children: childConfiguration.filter(fnChildAccount),
  });
}

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    children: filterChildHome,
  },
  {
    path: '/login',
    name: 'Login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue'),
  },
  {
    path: '/recupera-tu-contrasena',
    name: 'Recupera tu contraseña',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/PasswordRecovery.vue'),
  },
  {
    path: '/cambia-tu-contrasena',
    name: 'Cambia tu contraseña',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/ChangePassword.vue'),
  },
  {
    path: '/crea-tu-contrasena',
    name: 'Crea tu contraseña',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/CreatePassword.vue'),
  },
  {
    path: '/error',
    name: 'Error',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/error/ErrorHandling.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import(/* webpackChunkName: "about" */ '../views/error/ErrorHandling.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
