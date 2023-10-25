import api from '@/helpers/AxiosConfig';
import BaseApi from '@/data/api/BaseApi';
import User from '@/data/entity/User';
import Client from '@/data/entity/Client';

class ClientsAPI extends BaseApi {
  constructor() {
    super();
    this.url = 'client';
  }

  Insert = async (client: Client): Promise<Client> => {
    const response = await api.post<Client>(`/${this.url}`, client);
    return (response && response.data) || null;
  };

  Update = async (client: Client): Promise<Client> => {
    const response = await api.put<Client>(`/${this.url}/${client.id}`, client);
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
}

export default new ClientsAPI();
