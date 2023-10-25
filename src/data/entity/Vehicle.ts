import Client from '@/data/entity/Client';

export default class Vehicle {
    id?: number;

    vehicleRegistration?: string;

    model?: string;

    type?: string;

    motor?: string;

    year?: string;

    active?: boolean;

    client?: Client;
}
