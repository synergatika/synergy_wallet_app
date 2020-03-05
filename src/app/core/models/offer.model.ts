export interface Offer {
    merchant_id: string;
    merchant_name: string;
    merchant_imageURL: string;
		title: string;
		subtitle: string;
    offer_id: string;
    description: string;
    cost: number;
    expiresAt: number;
    createdAt: string;
    address:{};
}