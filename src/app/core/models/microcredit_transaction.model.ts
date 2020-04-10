export interface MicrocreditTransaction {
    _id: string;

    customer_id: string;
    merchant_id: string;

    data: {
        campaign_id: string;
        campaign_title: string;
        support_id: string,
        tokens: number,
    };

    tx: string;
    type: string;

    createdAt: Date;
}