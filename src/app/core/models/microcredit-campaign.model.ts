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

    supports: {
        _id: string,
        backer_id: string,
        initialTokens: number,
        redeemedTokens: number,
        payment_id: string
        status: boolean
    },
    createdAt: Date
}