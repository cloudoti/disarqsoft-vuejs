import Role from '@/data/entity/Role';

export default class User {
  id?: number;

  name?: string;

  fatherLastName?: string;

  motherLastName?: string;

  username?: string;

  password?: string;

  active?: boolean;

  role?: Role;
}
