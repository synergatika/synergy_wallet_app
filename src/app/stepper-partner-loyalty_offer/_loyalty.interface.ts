import { Offer } from 'sng-core';

interface User {
    identifier_scan: string;
    identifier_form: string;
    email: string | undefined;
}

interface Transaction {
    points: number;
    discount_points: number;
    final_points: number;

    offer_id: string;
    offer_title: string;
    cost: number;
    possible_quantity: number;
    quantity: number;
}

export interface LocalLoyaltyInterface {
    User: User;
    Offer: Offer;
    Transaction: Transaction;
}
