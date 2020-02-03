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
    redeem: string; // '00', '10', '11' - Cannnot and Does Not Want, Can but Does Not Want, Can and Want
    registration: string; // '00', '01', '10', '11' - None, Link Card, Link Email, Full Registration
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