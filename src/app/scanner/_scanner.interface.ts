import { MicrocreditCampaign } from '../core/models/microcredit_campaign.model';

interface User {
    identifier_scan: string;
    identifier_form: string;
    email: string | undefined;
}

interface PointsTransaction {
    amount: number;
    possible_discount_amount: number;
    discount_amount: number;
    final_amount: number;
    discount_points: number;
    points: number;
    previous_points: number;
    quantity?: any;
    // previous_points: any;
    initial_tokens?: any;
    redeemed_tokens?: any;
    discount_tokens?: any;
}

interface Actions {
    redeem: string; // '00', '10', '11' - Cannnot and Does Not Want, Can but Does Not Want, Can and Want
    registration: string; // '00', '01', '10', '11' - None, Link Card, Link Email, Full Registration
}

interface Offer {
    partner_id: string;
    partner_name: string;
    partner_imageURL: string;
    offer_id: string;
    title: string;
    subtitle: string;
    description: string;
    cost: number;
    expiresAt: number;
    createdAt: string;

    offer_imageURL?: any;

}

interface OfferTransaction {
    offer_id: string;
    cost: number;
    discount_amount?: number;
    discount_points: number;
    points: number;
    possible_quantity: number;
    quantity: number;
    final_amount: number;
    initial_tokens?: any;
    redeemed_tokens?: any;
    discount_tokens?: number;
    previous_points?: number;
}

interface MicrocreditSupport {
    campaign_id: string;
    support_id: string;
    backer_id: string;
    initialTokens: number;
    redeemedTokens: number;
    status: string;
}

// interface MicrocreditCampaign {
//     partner_id: string;
//     partner_name: string;
//     partner_imageURL: string;
//     campaign_id: string;
//     terms: string;
//     description: string;
//     redeemStarts: string;
//     redeemEnds: string;
//     expiresAt: number;
//     createdAt: Date;
// }

interface MicrocreditTransaction {
    campaign_id: string;
    support_id: string;
    discount_amount?: number;
    initial_tokens: number;
    redeemed_tokens: number;
    possible_tokens: number;
    discount_tokens: number;
    points?: number;
    previous_points?: number;
    final_amount?: any;
    discount_points?: any;
    quantity?: any;
}

export interface ScannerInterface {
    User: User;
    PointsTransaction: PointsTransaction;
    Actions: Actions;
    Offer: Offer;
    OfferTransaction: OfferTransaction;
    MicrocreditSupport: MicrocreditSupport;
    MicrocreditCampaign: MicrocreditCampaign // MicrocreditCampaign;
    MicrocreditTransaction: MicrocreditTransaction;
}
