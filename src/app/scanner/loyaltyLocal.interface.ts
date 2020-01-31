interface User {
    identifier_scan: string;
    identifier_form: string;
    email: string | undefined;
}

interface PointsTransaction {
    amount: number;
    final_amount: number;
    discount_amount: number;
    discount_points: number;
    points: number;
}

interface Actions {
    can_redeem: boolean;
    want_redeem: boolean;
    need_full_registration: boolean;
    need_card_update: boolean;
    need_email_update: boolean;
    need_email_registration: boolean;
    need_card_registration: boolean;
}

interface Offer {
    merchant_id: string;
    merchant_name: string;
    merchant_imageURL: string;
    offer_id: string;
    description: string;
    cost: number;
    expiresAt: number;
    createdAt: string;
}

interface OfferTransaction {
    offer_id: string;
    cost: number;
    discount_points: number;
    points: number;
    possible_quantity: number;
    quantity: number;
}

export interface LoyaltyLocalInterface {
    User: User;
    PointsTransaction: PointsTransaction;
    Actions: Actions;
    Offer: Offer;
    OfferTransaction: OfferTransaction;
}