import { reactive, readonly } from 'vue';
import Auth from '@/data/Auth';
import ERolesType from '@/data/entity/enums/ERolesType';

const authStorage = localStorage.getItem('auth');

const auth = reactive(authStorage ? JSON.parse(authStorage) : new Auth(false));

const loggedIn = (username, token) => {
  const data = token.split('.')[1];

  auth.authenticate = true;
  auth.user = JSON.parse(atob(data));
  auth.user.username = username;
  auth.token = token;

  // ERolesType.CONFIG_BUSINESS
  auth.roles = [ERolesType.CONFIG_BUSINESS, ERolesType.REGISTER_ORDERS, ERolesType.SUPER_ADMIN];

  localStorage.setItem('auth', JSON.stringify(auth));
};

const logOut = () => {
  auth.authenticate = false;
  auth.user = null;
  auth.token = null;

  localStorage.clear();
};
let userOptions: any[] = [];

if (auth?.authenticate) {
  userOptions = auth.roles!;
}

const isSuperAdmin = () => userOptions.includes('SUPER_ADMIN');
const isAdmin = () => userOptions.includes('ADMIN');
const isConfigBusiness = () => userOptions.includes('CONFIGURACION_DEL_NEGOCIO');

export default {
  auth: readonly(auth),
  loggedIn,
  logOut,
  isSuperAdmin,
  isAdmin,
  isConfigBusiness,
};
