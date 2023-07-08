import User from '@/data/entity/User';
import OrderDetail from '@/data/entity/OrderDetail';

export default class Order {
    id?: number;

    code?: string;

    issueDate?: Date;

    paymentMethod?: string;

    totalDelivery?: number;

    total?: number;

    user?: User;

    detail?: OrderDetail[];
}
