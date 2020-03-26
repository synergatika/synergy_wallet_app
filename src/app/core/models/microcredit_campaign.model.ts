interface Address {
    street: string;
    city: string;
    postCode: string;
    coordinates: string[];
}

interface Contact {
    phone: string;
    websiteURL: string;
}

interface Payments {
    nationalBank: string;
    pireausBank: string;
    eurobank: string;
    alphaBank: string;
    paypal: string;
}

interface Tokens {
    _id: string;
    initialTokens: number;
    redeemedTokens: number
}

export interface MicrocreditCampaign {

    merchant_id: string;
    merchant_name: string;
    merchant_email: string;
    merchant_slug: string;
    merchant_imageURL: string;
    merchant_payments: Payments;
    merchant_address: Address;
    merchant_contact: Contact;

    _id?: string;
    campaign_id: string;
    campaign_slug: string;
    campaign_imageURL: string;
    title: string;
    subtitle: string;
    terms: string;
    description: string;
    category: string;
    access: string;

    quantitative: boolean;
    stepAmount: number;
    minAllowed: number;
    maxAllowed: number;
    maxAmount: number;

    redeemStarts: number;
    redeemEnds: number;
    startsAt: number;
    expiresAt: number;

    confirmationTokens: Tokens;
    orderedTokens: Tokens;

    createdAt: Date;
}
