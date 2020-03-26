import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

import { SupportInterface } from './_support.interface';
import { MicrocreditCampaign } from '../core/models/microcredit_campaign.model';
import { MicrocreditSupport } from '../core/models/microcredit-support.model';

@Injectable()
export class SupportService {

    private microcreditCampaignsSource = new BehaviorSubject([]);
    microcreditCampaigns = this.microcreditCampaignsSource.asObservable();

    private microcreditCurrentSource = new BehaviorSubject({
        merchant_id: '',
        merchant_name: '',
        merchant_email: '',
        merchant_slug: '',
        merchant_imageURL: '',
        merchant_address: {
            street: '',
            city: '',
            postCode: '',
            coordinates: ['', '']
        },
        merchant_contact: {
            phone: '',
            websiteURL: ''
        },
        merchant_payments: {
            paypal: '',
            nationalBank: '',
            eurobank: '',
            alphaBank: '',
            pireausBank: ''
        },
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
        merchant_id: '',
        campaign_id: '',
        support_id: '',
        payment_id: '',
        amount: 0,
        method: '',
        how: ''
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
