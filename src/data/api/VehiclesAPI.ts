import api from '@/helpers/AxiosConfig';
import BaseApi from '@/data/api/BaseApi';
import Vehicle from '@/data/entity/Vehicle';

class VehiclesAPI extends BaseApi {
  constructor() {
    super();
    this.url = 'vehicle';
  }

    Insert = async (vehicle: Vehicle): Promise<Vehicle> => {
      const response = await api.post<Vehicle>(`/${this.url}`, vehicle);
      return (response && response.data) || null;
    };

    Update = async (vehicle: Vehicle): Promise<Vehicle> => {
      const response = await api.put<Vehicle>(`/${this.url}/${vehicle.id}`, vehicle);
      return (response && response.data) || null;
    };

    GetById = async (id: number): Promise<any> => {
      const response = await api.get<any>(`/${this.url}/${id}`);
      return (response && response.data) || null;
    };

    List = async (): Promise<any> => {
      const response = await api.get<any>(`/${this.url}`);
      return (response && response.data) || null;
    };

  ListByClient = async (id): Promise<any> => {
    const response = await api.get<any>(`/${this.url}/client/${id}`);
    return (response && response.data) || null;
  };
}

export default new VehiclesAPI();
