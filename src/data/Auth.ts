export default class Auth {
  authenticate = false;

  user?: {
    username: string, sub: number
  };

  token?: string;

  role?: number;

  constructor(authenticate: boolean,
    user?: {
      username: string; sub: number
    },
    token?: string,
    role?: number) {
    this.authenticate = authenticate;
    this.user = user;
    this.token = token;
    this.role = role;
  }
}
