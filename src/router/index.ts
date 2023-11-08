import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '@/views/Home.vue';
import WorkTray from '@/views/workTray/WorkTray.vue';
import WorkOrder from '@/views/workOrder/WorkOrder.vue';
import Product from '@/views/setting/product/Product.vue';
import ProductList from '@/views/setting/product/ProductList.vue';
import Setting from '@/layouts/backOffice/Setting.vue';
import Account from '@/layouts/account/Account.vue';
import User from '@/views/setting/user/User.vue';
import UserList from '@/views/setting/user/UserList.vue';
import Storage from '@/data/global';
import ERolesType from '@/data/entity/enums/ERolesType';
import ERouteType from '@/router/ERouteType';
import Client from '@/views/setting/client/Client.vue';
import ClientList from '@/views/setting/client/ClientList.vue';
import VehicleList from '@/views/setting/vehicle/VehicleList.vue';
import Vehicle from '@/views/setting/vehicle/Vehicle.vue';
import Quotation from '@/views/quotation/Quotation.vue';
import QuotationList from '@/views/quotation/QuotationList.vue';

const rolesUser = Storage.auth.roles === undefined ? [] : Storage.auth.roles;

const childConfiguration = [
  {
    path: ERouteType.PRODUCT_PATH,
    name: ERouteType.PRODUCT_NAME,
    component: ProductList,
  },
  {
    path: ERouteType.NEW_PRODUCT_PATH,
    name: ERouteType.NEW_PRODUCT_NAME,
    component: Product,
  },
  {
    path: ERouteType.EDIT_PRODUCT_PATH,
    name: ERouteType.EDIT_PRODUCT_NAME,
    component: Product,
    props: true,
  },
  {
    path: ERouteType.USER_PATH,
    name: ERouteType.USER_NAME,
    component: UserList,
  },
  {
    path: ERouteType.NEW_USER_PATH,
    name: ERouteType.NEW_USER_NAME,
    component: User,
  },
  {
    path: ERouteType.EDIT_USER_PATH,
    name: ERouteType.EDIT_USER_NAME,
    component: User,
    props: true,
  },
  {
    path: ERouteType.CLIENT_PATH,
    name: ERouteType.CLIENT_NAME,
    component: ClientList,
  },
  {
    path: ERouteType.NEW_CLIENT_PATH,
    name: ERouteType.NEW_CLIENT_NAME,
    component: Client,
  },
  {
    path: ERouteType.EDIT_CLIENT_PATH,
    name: ERouteType.EDIT_CLIENT_NAME,
    component: Client,
    props: true,
  },
  {
    path: ERouteType.VEHICLE_PATH,
    name: ERouteType.VEHICLE_NAME,
    component: VehicleList,
  },
  {
    path: ERouteType.NEW_VEHICLE_PATH,
    name: ERouteType.NEW_VEHICLE_NAME,
    component: Vehicle,
  },
  {
    path: ERouteType.EDIT_VEHICLE_PATH,
    name: ERouteType.EDIT_VEHICLE_NAME,
    component: Vehicle,
    props: true,
  },
];

const fnChildConfiguration = (x) => {
  let valid = false;

  if (x.path === ERouteType.PRODUCT_PATH && rolesUser.includes(ERolesType.CONFIG_BUSINESS)) {
    valid = true;
  }

  if (x.path === ERouteType.NEW_PRODUCT_PATH && rolesUser.includes(ERolesType.CONFIG_BUSINESS)) {
    valid = true;
  }

  if (x.path === ERouteType.EDIT_PRODUCT_PATH && rolesUser.includes(ERolesType.CONFIG_BUSINESS)) {
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

  if (x.path === ERouteType.CLIENT_PATH && rolesUser.includes(ERolesType.SUPER_ADMIN)) {
    valid = true;
  }

  if (x.path === ERouteType.NEW_CLIENT_PATH && rolesUser.includes(ERolesType.SUPER_ADMIN)) {
    valid = true;
  }

  if (x.path === ERouteType.EDIT_CLIENT_PATH && rolesUser.includes(ERolesType.SUPER_ADMIN)) {
    valid = true;
  }

  if (x.path === ERouteType.VEHICLE_PATH && rolesUser.includes(ERolesType.SUPER_ADMIN)) {
    valid = true;
  }

  if (x.path === ERouteType.NEW_VEHICLE_PATH && rolesUser.includes(ERolesType.SUPER_ADMIN)) {
    valid = true;
  }

  if (x.path === ERouteType.EDIT_VEHICLE_PATH && rolesUser.includes(ERolesType.SUPER_ADMIN)) {
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
  {
    path: ERouteType.QUOTATION_PATH,
    name: ERouteType.QUOTATION_NAME,
    component: QuotationList,
  },
  {
    path: ERouteType.NEW_QUOTATION_PATH,
    name: ERouteType.NEW_QUOTATION_NAME,
    component: Quotation,
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
  } else if (x.path === ERouteType.QUOTATION_PATH
      && rolesUser.some((role) => [ERolesType.REGISTER_ORDERS].includes(role))) {
    valid = true;
  } else if (x.path === ERouteType.NEW_QUOTATION_PATH
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
