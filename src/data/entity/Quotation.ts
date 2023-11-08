import Vehicle from '@/data/entity/Vehicle';
import Client from '@/data/entity/Client';
import QuotationDetail from '@/data/entity/QuotationDetail';

export default class Quotation {
    id?: number;

    issueDate?: Date;

    price?: number;

    total?: number;

    igv?: number;

    vehicle?: Vehicle;

    client?: Client;

    detail?: QuotationDetail[];
}
