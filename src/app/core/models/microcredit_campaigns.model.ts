export interface MicrocreditCampaign {

    merchant_id: string;
    merchant_name: string;
    merchant_imageURL: string;

    campaign_id: string,
    campaign_imageURL: string,
    title: string,
    terms: string,
    description: string,
    category: string,
    access: string,

    quantitative: boolean,
    minAllowed: number,
    maxAllowed: number,
    maxAmount: number,

    redeemStarts: number,
    redeemEnds: number,
    expiresAt: number,

    createdAt: string
}