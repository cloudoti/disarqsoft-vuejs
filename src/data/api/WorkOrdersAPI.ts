import api from '@/helpers/AxiosConfig.ts';
import BaseApi from '@/data/api/BaseApi';
import WorkTrayParams from '@/data/entity/WorkTrayParams';
import WorkTrayOrderDetail from '@/data/entity/WorkTrayOrderDetail';
import Order from '@/data/entity/Order';

class WorkOrdersAPI extends BaseApi {
  constructor() {
    super();
    this.url = 'order';
  }

  getWorkTrayOrderById = async (workTrayOrderMinimumDate: number, workTrayOrderId: number): Promise<WorkTrayOrderDetail> => {
    const response = await
    api.get<WorkTrayOrderDetail>(`/${this.url}/work-tray-order-detail/${workTrayOrderMinimumDate}/${workTrayOrderId}`);
    return (response && response.data) || null;
  };

  ListOrders = async (workTrayParams?: WorkTrayParams): Promise<Order[]> => {
    const response = await api.get<any[]>(`/${this.url}`);
    return (response && response.data) || null;
  };

  SaveOrders = async (order?: Order): Promise<any> => {
    const response = await api.post(`/${this.url}`, order);
    return (response && response.data) || null;
  };
}

export default new WorkOrdersAPI();
