import { PartnerAddress } from './partner_address.model';
import { PartnerContact } from './partner_contact.model';
import { PartnerPayment } from './partner_payment.model';

export interface Partner {
    _id?: string;
    email?: string;

    name: string;
    imageURL: string;
    slug?: string;
    subtitle?: string;
    description?: string;
    timetable?: string;
    sector: string;

    contact: PartnerContact;
    address: PartnerAddress;
    payments?: PartnerPayment[];

    createdAt?: Date;
};