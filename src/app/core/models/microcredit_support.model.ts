export interface MicrocreditSupport {
    partner_address?: any;
    partner_name?: any;
    campaign_imageURL?: any;
    title?:any;
    redeemStarts?: any;
    redeemEnds?:any;
    terms?:any;
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
