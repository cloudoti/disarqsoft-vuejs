import User from '@/data/entity/User';
import OrderDetail from '@/data/entity/OrderDetail';
import Quotation from '@/data/entity/Quotation';
import Vehicle from '@/data/entity/Vehicle';
import Client from '@/data/entity/Client';

export default class Order {
    id?: number;

    issueDate?: Date;

    warrantyDate?: Date;

    price?: number;

    igv?: number;

    total?: number;

    user?: User;

    vehicle?: Vehicle;

    client?: Client;

    quotation?: Quotation;

    detail?: OrderDetail[];
}
