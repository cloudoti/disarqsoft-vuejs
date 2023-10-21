import api from '@/helpers/AxiosConfig';
import BaseApi from '@/data/api/BaseApi';
import Product from '@/data/entity/Product';

class ProductsAPI extends BaseApi {
  constructor() {
    super();
    this.url = 'product';
  }

  InsertProduct = async (product: Product): Promise<Product> => {
    const response = await api.post<Product>(`/${this.url}`, product);
    return (response && response.data) || null;
  };

  UpdateProduct = async (product: Product): Promise<Product> => {
    const response = await api.put<Product>(`/${this.url}/${product.id}`, product);
    return (response && response.data) || null;
  };

  ListPatient = async (): Promise<any> => {
    const response = await api.get<any>(`/${this.url}`);
    return (response && response.data) || null;
  };

  GetById = async (id: number): Promise<any> => {
    const response = await api.get<any>(`/${this.url}/${id}`);
    return (response && response.data) || null;
  };

  FilterProduct = async (text?: string): Promise<Product[]> => {
    const queryParams: { text?: string } = {};

    if (text) {
      queryParams.text = text;
    }

    const response = await api.get<Product[]>(`/${this.url}`, { params: queryParams });
    return (response && response.data) || null;
  };
}

export default new ProductsAPI();
