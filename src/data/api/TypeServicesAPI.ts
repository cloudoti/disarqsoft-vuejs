import api from '@/helpers/AxiosConfig';
import BaseApi from '@/data/api/BaseApi';

class TypeServicesAPI extends BaseApi {
  constructor() {
    super();
    this.url = 'type-service';
  }

  List = async (): Promise<any> => {
    const response = await api.get<any>(`/${this.url}`);
    return (response && response.data) || null;
  };
}

export default new TypeServicesAPI();
