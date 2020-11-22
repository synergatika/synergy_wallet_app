import { MicrocreditCampaign } from 'sng-core';

interface User {
    identifier_scan: string;
    identifier_form: string;
    email: string | undefined;
}

interface Actions {
    registration: string; // '00', '01', '10', '11' - None, Link Card, Link Email, Full Registration
}

interface Transaction {
    partner_id: string;
    campaign_id: string;
    support_id: string;
    payment_id: string;
    method: string;
    amount: number;
    paid: boolean;
}

export interface LocalMicrocreditInterface {
    User: User;
    Actions: Actions;
    MicrocreditCampaign: MicrocreditCampaign;
    Transaction: Transaction;
}
