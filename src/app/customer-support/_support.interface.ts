import { MicrocreditCampaign } from '../core/models/microcredit-campaign.model';

interface MicrocreditSupport {
    merchant_id: string;
    campaign_id: string;
    support_id: string;
    payment_id: string;
    amount: number;
    method: string;
    how:string;
}

export interface SupportInterface {
    MicrocreditCampaign: MicrocreditCampaign;
    MicrocreditSupport: MicrocreditSupport;
}