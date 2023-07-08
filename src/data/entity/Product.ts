import Category from '@/data/entity/Category';

export default class Product {
  id?: number;

  code?: string;

  name?: string;

  description?: string;

  price?: number;

  category?: Category;

  type?: string;

  status?: string;

  observation?: string;
}
