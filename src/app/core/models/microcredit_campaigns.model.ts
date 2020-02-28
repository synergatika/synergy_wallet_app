export interface MicrocreditCampaign {

    merchant_id: string;
    merchant_name: string;
    merchant_imageURL: string;

    offer_id: string;
    description: string;
    cost: number;
    expiresAt: number;
    createdAt: string;

    merchant_payments: any;
}
