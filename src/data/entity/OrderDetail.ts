import Order from '@/data/entity/Order';
import Product from '@/data/entity/Product';

export default class OrderDetail {
    id?: number;

    order?: Order;

    product?: Product;

    quantity?: number;

    price?: number;

    total?: number;
}
