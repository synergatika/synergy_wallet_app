export interface Offer {

    merchant_id: string;
    merchant_name: string;
    merchant_imageURL: string;

    offer_id: string;
    offer_imageURL: string;
    title: string;
    description: string;
    cost: number;
    expiresAt: number;
    createdAt: string;
}