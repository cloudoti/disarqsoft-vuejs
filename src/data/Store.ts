import Auth from '@/data/Auth';

export default class Store {
  auth?: Auth;

  loggedIn?: (user, token) => void;

  logOut?: () => void;
}
