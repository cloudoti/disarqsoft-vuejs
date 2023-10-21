import api from '@/helpers/AxiosConfig';
import BaseApi from '@/data/api/BaseApi';

class CategoryAPI extends BaseApi {
  constructor() {
    super();
    this.url = 'category';
  }

  ListCategory = async (): Promise<any> => {
    const response = await api.get<any>(`/${this.url}`);
    return (response && response.data) || null;
  };
}

export default new CategoryAPI();
