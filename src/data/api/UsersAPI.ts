import api from '@/helpers/AxiosConfig';
import BaseApi from '@/data/api/BaseApi';
import User from '@/data/entity/User';

class UsersAPI extends BaseApi {
  constructor() {
    super();
    this.url = 'user';
  }

  InsertUser = async (user: User): Promise<User> => {
    const response = await api.post<User>(`/${this.url}`, user);
    return (response && response.data) || null;
  };

  UpdateUser = async (user: User): Promise<User> => {
    const response = await api.put<User>(`/${this.url}/${user.id}`, user);
    return (response && response.data) || null;
  };

  GetById = async (id: number): Promise<any> => {
    const response = await api.get<any>(`/${this.url}/${id}`);
    return (response && response.data) || null;
  };

  ListUsers = async (): Promise<any> => {
    const response = await api.get<any>(`/${this.url}`);
    return (response && response.data) || null;
  };

  ListRoles = async (): Promise<any> => {
    const response = await api.get<any>(`/role`);
    return (response && response.data) || null;
  };
}

export default new UsersAPI();
