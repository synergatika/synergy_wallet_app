import { Content } from './content.model';

export interface Activity {
    slug: number;
    amount: number;
    stores: number;
    transactions: number;
    rate: number;
    badge: string;

    image?: string;
    text?: Content;
    text_id?: string;
}