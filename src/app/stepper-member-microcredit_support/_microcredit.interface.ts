import { MicrocreditCampaign } from 'sng-core';

interface Transaction {
    partner_id: string;
    campaign_id: string;
    support_id: string;
    payment_id: string;
    amount: number;
    method: string;
    paid: boolean;
    how: {
        title: string,
        value: string
    };
}

export interface LocalMicrocreditInterface {
    MicrocreditCampaign: MicrocreditCampaign;
    Transaction: Transaction;
}
