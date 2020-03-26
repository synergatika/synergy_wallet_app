export interface MicrocreditSupport {

    campaign_id: string;
    support_id: string;
    backer_id?: string;
    initialTokens?: number;
    redeemedTokens?: number;
    status?: string;

    amount: number;
    method: string;

    merchant_id: string;
    payment_id: string;
    how: string;
}
