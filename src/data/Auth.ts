export default class Auth {
  authenticate = false;

  user?: {
    companyId: number, userId: number, name: string,
    username: string, image: string, timeZone: string
  };

  token?: string;

  roles?: string[];

  userType?: { id: number, name: string };

  constructor(authenticate: boolean,
    user?: {
      companyId: number; userId: number; name: string;
      username: string; image: string; timeZone: string
    },
    token?: string,
    roles?: string[],
    userType?: { id: number, name: string }) {
    this.authenticate = authenticate;
    this.user = user;
    this.token = token;
    this.roles = roles;
    this.userType = userType;
  }
}
