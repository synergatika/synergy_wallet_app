export interface LoyaltyTransaction {
    _id: string;

    customer_id: string;
    merchant_id: string;

    data: {
        merchant_name: string;
        merchant_email: string;
        points: number,
        amount: number,
        offer_id: string;
        offer_title: string
    };

    tx: string;
    type: string;

    createdAt: Date;
}