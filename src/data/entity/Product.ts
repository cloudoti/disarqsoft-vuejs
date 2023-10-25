import Catalog from '@/data/entity/Catalog';

export default class Product {
    id?: number;

    name?: string;

    price?: number;

    typeService?: Catalog;

    active?: boolean;
}
