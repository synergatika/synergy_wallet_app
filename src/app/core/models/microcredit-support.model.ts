export interface MicrocreditSupport {

    campaign_id: string;
    support_id: string;
    backer_id?: string;
    initialTokens?: number;
    redeemedTokens?: number;
    status?: boolean;

    amount: any;
    method: any;

    merchant_id: any;
    payment_id: any;
    how: any;
}
