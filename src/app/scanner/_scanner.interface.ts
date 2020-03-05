export interface User {
    identifier_scan: string;
    identifier_form: string;
    email: string | undefined;
}

export interface PointsTransaction {
    amount: number;
    final_amount: number;
    discount_amount: number;
    discount_points: number;
    points: number;
    quantity?: any;
    initial_tokens? : any;
    redeemed_tokens?: any;
    discount_tokens?: any;
}

export interface Actions {
    redeem: string; // '00', '10', '11' - Cannnot and Does Not Want, Can but Does Not Want, Can and Want
    registration: string; // '00', '01', '10', '11' - None, Link Card, Link Email, Full Registration
}

export interface Offer {
    merchant_id: string;
    merchant_name: string;
    merchant_imageURL: string;
    offer_id: string;
		title: string;
		subtitle: string;
    description: string;
    cost: number;
    expiresAt: number;
    createdAt: string;

    offer_imageURL?: any;

}

export interface OfferTransaction {
    offer_id: string;
    cost: number;
    discount_points: number;
    points: number;
    possible_quantity: number;
    quantity: number;
    final_amount: number;
    initial_tokens?: any;
    redeemed_tokens?: any;
    discount_tokens?: number;
}

export interface MicrocreditSupport {
    campaign_id: string;
    support_id: string;
    backer_id: string;
    initialTokens: number;
    redeemedTokens: number;
    status: boolean;
}

export interface MicrocreditCampaign {
    merchant_id: string;
    merchant_name: string;
    merchant_imageURL: string;
    campaign_id: string;
    terms: string;
    description: string;
    expiresAt: number;
    createdAt: Date;
}

export interface MicrocreditTransaction {
    campaign_id: string;
    support_id: string;
    initial_tokens: number;
    redeemed_tokens: number;
    possible_tokens: number;
    discount_tokens: number;
    final_amount?: any;
    discount_points?: any;
    quantity?: any;
}

// export interface ScannerInterface {
//     User: User;
//     PointsTransaction: PointsTransaction;
//     Actions: Actions;
//     Offer: Offer;
//     OfferTransaction: OfferTransaction;
//     MicrocreditSupport: MicrocreditSupport;
//     MicrocreditCampaign: MicrocreditCampaign;
//     MicrocreditTransaction: MicrocreditTransaction;
// }
