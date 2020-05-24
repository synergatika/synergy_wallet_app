import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

import { SupportInterface } from './_support.interface';
import { MicrocreditCampaign } from '../core/models/microcredit_campaign.model';
import { MicrocreditSupport } from '../core/models/microcredit_support.model';

@Injectable()
export class SupportService {

    private microcreditCampaignsSource = new BehaviorSubject([]);
    microcreditCampaigns = this.microcreditCampaignsSource.asObservable();

    private microcreditCurrentSource = new BehaviorSubject({
        partner_id: '',
        partner_name: '',
        partner_email: '',
        partner_slug: '',
        partner_imageURL: '',
        partner_address: {
            street: '',
            city: '',
            postCode: '',
            coordinates: ['', '']
        },
        partner_contact: {
            phone: '',
            websiteURL: ''
        },
        partner_payments: [
            {
                bic: '', name: '', value: ''
            }
        ],
        campaign_id: '',
        campaign_imageURL: '',
        title: '',
        campaign_slug: '',
        subtitle: '',
        terms: '',
        description: '',
        category: '',
        access: 'public',
        quantitative: false,
        stepAmount: 0,
        minAllowed: 0,
        maxAllowed: 0,
        maxAmount: 0,
        startsAt: 0,
        expiresAt: 0,
        redeemStarts: 0,
        redeemEnds: 0,

        confirmationTokens: {
            _id: '', initialTokens: 0, redeemedTokens: 0
        },
        orderedTokens: {
            _id: '', initialTokens: 0, redeemedTokens: 0
        },
        createdAt: new Date()
    });
    microcreditCurrent = this.microcreditCurrentSource.asObservable();

    private microcreditSupportSource = new BehaviorSubject({
        partner_id: '',
        campaign_id: '',
        support_id: '',
        payment_id: '',
        amount: 0,
        method: '',
        how: {
            title: '',
            value: ''
        }
    });
    microcreditSupport = this.microcreditSupportSource.asObservable();

    constructor() { }

    changeMicrocreditCampaigns(microcreditCampaigns: MicrocreditCampaign[]) {
        this.microcreditCampaignsSource.next(microcreditCampaigns);
    }

    changeMicrocreditCurrent(microcreditCurrent: MicrocreditCampaign) {
        this.microcreditCurrentSource.next(microcreditCurrent);
    }

    changeMicrocreditSupport(microcreditSupport: MicrocreditSupport) {
        this.microcreditSupportSource.next(microcreditSupport);
    }
}
