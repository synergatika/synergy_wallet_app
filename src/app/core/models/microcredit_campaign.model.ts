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

interface Bank {
    bic: string;
    name: string;
    value: string;
}

interface Tokens {
    _id: string;
    initialTokens: number;
    redeemedTokens: number
}

export interface MicrocreditCampaign {

    partner_id: string;
    partner_name: string;
    partner_email: string;
    partner_slug: string;
    partner_imageURL: string;
    partner_payments: Bank[];
    partner_address: Address;
    partner_contact: Contact;

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
