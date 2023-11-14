import Client from '@/data/entity/Client';
import Catalog from '@/data/entity/Catalog';

export default class Vehicle {
    id?: number;

    vehicleRegistration?: string;

    model?: string;

    type?: string;

    motor?: string;

    year?: string;

    active?: boolean;

    client?: Client;

    brand?: Catalog;
}
