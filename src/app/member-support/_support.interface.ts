import { MicrocreditCampaign } from '../core/models/microcredit_campaign.model';

interface MicrocreditSupport {
    partner_id: string;
    campaign_id: string;
    support_id: string;
    payment_id: string;
    amount: number;
    method: string;
    how: {
        title: string,
        value: string
    };
}

export interface SupportInterface {
    MicrocreditCampaign: MicrocreditCampaign;
    MicrocreditSupport: MicrocreditSupport;
}