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
  auth.role = auth.user.role;

  localStorage.setItem('auth', JSON.stringify(auth));
};

const logOut = () => {
  auth.authenticate = false;
  auth.user = null;
  auth.token = null;

  localStorage.clear();
};

const isAdmin = () => auth.role === ERolesType.ADMIN;
const isAsistant = () => auth.role === ERolesType.ASISTANT;
const isAdvise = () => auth.role === ERolesType.ADVISE;

export default {
  auth: readonly(auth),
  loggedIn,
  logOut,
  isAdmin,
  isAsistant,
  isAdvise,
};
