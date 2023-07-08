import api from '@/helpers/AxiosConfig.ts';
import BaseApi from '@/data/api/BaseApi';

class UsersAPI extends BaseApi {
  constructor() {
    super();
    this.url = 'user';
  }

  ListUsers = async (): Promise<any> => {
    const response = await api.get<any>(`/${this.url}`);
    return (response && response.data) || null;
  };
}

export default new UsersAPI();
