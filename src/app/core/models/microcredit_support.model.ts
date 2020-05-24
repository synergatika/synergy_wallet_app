export interface MicrocreditSupport {

    campaign_id: string;
    support_id: string;
    backer_id?: string;
    initialTokens?: number;
    redeemedTokens?: number;
    status?: string;

    amount: number;
    method: string;

    partner_id: string;
    payment_id: string;
    how: {
        title: string,
        value: string
    };
}
