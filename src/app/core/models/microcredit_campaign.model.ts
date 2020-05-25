import { PartnerAddress } from './partner_address.model';
import { PartnerContact } from './partner_contact.model';
import { PartnerPayment } from './partner_payment.model';

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

    partner_payments: PartnerPayment[];
    partner_address: PartnerAddress;
    partner_contact: PartnerContact;

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
