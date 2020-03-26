import { MicrocreditCampaign } from '../core/models/microcredit_campaign.model';

interface User {
    identifier_scan: string;
    identifier_form: string;
    email: string | undefined;
}

interface Actions {
    registration: string; // '00', '01', '10', '11' - None, Link Card, Link Email, Full Registration
}

interface MicrocreditSupport {
    merchant_id: string;
    campaign_id: string;
    support_id: string;
    payment_id: string;
    method: string;
    amount: number;
    paid: boolean;
}

export interface SupportInterface {
    User: User;
    Actions: Actions;
    MicrocreditCampaign: MicrocreditCampaign;
    MicrocreditSupport: MicrocreditSupport;
}