import Product from '@/data/entity/Product';

export default class OrderDetail {
    id?: number;

    product?: Product;

    quantity?: number;

    price?: number;

    total?: number;

    igv?: number;
}
