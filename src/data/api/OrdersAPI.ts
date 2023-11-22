import api from '@/helpers/AxiosConfig';
import BaseApi from '@/data/api/BaseApi';
import WorkTrayParams from '@/data/entity/WorkTrayParams';
import WorkTrayOrderDetail from '@/data/entity/WorkTrayOrderDetail';
import Order from '@/data/entity/Order';

class OrdersAPI extends BaseApi {
  constructor() {
    super();
    this.url = 'order';
  }

  GetById = async (id: number): Promise<any> => {
    const response = await api.get<any>(`/${this.url}/${id}`);
    return (response && response.data) || null;
  };

  List = async (filter?: string): Promise<Order[]> => {
    let filterQuery = '';
    if (filter) {
      filterQuery = `?filter=${filter}`;
    }
    const response = await api.get<any[]>(`/${this.url}${filterQuery}`);
    return (response && response.data) || null;
  };

  Insert = async (order?: Order): Promise<any> => {
    const response = await api.post(`/${this.url}`, order);
    return (response && response.data) || null;
  };
}

export default new OrdersAPI();
