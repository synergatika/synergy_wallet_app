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

    points: number;
    discount_points: number;
    final_points: number;

    offer_id?: string;
    offer_title?: string;
    cost?: number;
    possible_quantity?: number;
    quantity?: number;

    campaign_id?: string;
    campaign_title?: string;
    support_id?: string;
    initial_tokens?: any;
    redeemed_tokens?: any;
    possible_tokens?: number;
    discount_tokens?: number;
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
    amount?: number;
    possible_discount_amount?: number;
    discount_amount?: number;
    final_amount?: number;

    points: number;
    discount_points: number;
    final_points: number;

    offer_id: string;
    offer_title: string;
    cost: number;
    possible_quantity: number;
    quantity: number;

    campaign_id?: string;
    campaign_title?: string;
    support_id?: string;
    initial_tokens?: any;
    redeemed_tokens?: any;
    possible_tokens?: number;
    discount_tokens?: number;
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
    amount?: number;
    possible_discount_amount?: number;
    discount_amount?: number;
    final_amount?: number;

    points?: number;
    discount_points?: number;
    final_points?: number;

    offer_id?: string;
    offer_title?: string;
    cost?: number;
    possible_quantity?: number;
    quantity?: number;

    campaign_id: string;
    campaign_title: string;
    support_id: string;
    initial_tokens: any;
    redeemed_tokens: any;
    possible_tokens: number;
    discount_tokens: number;
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
