import api from '@/helpers/AxiosConfig';
import BaseApi from '@/data/api/BaseApi';
import Quotation from '@/data/entity/Quotation';

class QuotationsAPI extends BaseApi {
  constructor() {
    super();
    this.url = 'quotation';
  }

    Insert = async (quotation: Quotation): Promise<Quotation> => {
      const response = await api.post<Quotation>(`/${this.url}`, quotation);
      return (response && response.data) || null;
    };

    Update = async (quotation: Quotation): Promise<Quotation> => {
      const response = await api.put<Quotation>(`/${this.url}/${quotation.id}`, quotation);
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

export default new QuotationsAPI();
