import api from '@/helpers/AxiosConfig';
import BaseApi from '@/data/api/BaseApi';
import Employee from '@/data/entity/Employee';

class UsersAPI extends BaseApi {
  constructor() {
    super();
    this.url = 'employee';
  }

    FilterEmployee = async (text?: string): Promise<Employee[]> => {
      const queryParams: { text?: string } = {};

      if (text) {
        queryParams.text = text;
      }

      const response = await api.get<Employee[]>(`/${this.url}`, { params: queryParams });
      return (response && response.data) || null;
    };
}

export default new UsersAPI();
