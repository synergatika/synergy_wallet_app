import { MicrocreditCampaign } from '../core/models/microcredit-campaign.model';
// interface MicrocreditCampaign {
//     merchant_id: string;
//     merchant_name: string;
//     merchant_imageURL: string;
//     campaign_id: string;
//     title: string;
//     terms: string;
//     description: string;
//     minAllowed: number;
//     maxAllowed: number;
//     maxAmount: number;
//     expiresAt: number;
//     createdAt: Date;
// }

interface User {
    identifier_scan: string;
    identifier_form: string;
    email: string | undefined;
}

interface MicrocreditSupport {
    merchant_id: string;
    campaign_id: string;
    support_id: string;
    payment: string;
    amount: number;
    paid: boolean;
}

export interface SupportInterface {
    User: User;
    MicrocreditCampaign: MicrocreditCampaign;
    MicrocreditSupport: MicrocreditSupport;
}