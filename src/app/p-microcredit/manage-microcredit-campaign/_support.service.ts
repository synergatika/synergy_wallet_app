import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

import { SupportInterface } from './_support.interface';

@Injectable()
export class SupportService {

    private userSource = new BehaviorSubject({
        identifier_scan: '',
        identifier_form: '',
        email: ''
    });
    user = this.userSource.asObservable();

    private actionsSource = new BehaviorSubject({
        registration: '000000'
    });
    actions = this.actionsSource.asObservable();

    private microcreditCurrentSource = new BehaviorSubject({
        partner_id: '',
        partner_name: '',
        partner_email: '',
        partner_slug: '',
        partner_imageURL: '',
        partner_address: { street: '', city: '', postCode: '', coordinates: ['', ''] },
        partner_contact: { phone: '', websiteURL: '' },
        partner_payments: [{ bic: '', name: '', value: '' }, { bic: '', name: '', value: '' }],

        campaign_id: '',
        campaign_imageURL: '',
        campaign_slug: '',
        title: '',
        subtitle: '',
        terms: '',
        description: '',
        category: '',
        access: 'public',
        status: 'published',

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

    private microcreditCampaignsSource = new BehaviorSubject([]);
    microcreditCampaigns = this.microcreditCampaignsSource.asObservable();

    private microcreditSupportSource = new BehaviorSubject({
        partner_id: '',
        campaign_id: '',
        support_id: '',
        payment_id: '',
        method: '',
        amount: 0,
        paid: true,
    });
    microcreditSupport = this.microcreditSupportSource.asObservable();

    constructor() { }

    changeUser(user: SupportInterface["User"]) {
        this.userSource.next(user);
    };

    changeActions(actions: SupportInterface["Actions"]) {
        this.actionsSource.next(actions);
    }

    changeMicrocreditCampaigns(microcreditCampaigns: SupportInterface["MicrocreditCampaign"][]) {
        this.microcreditCampaignsSource.next(microcreditCampaigns);
    }

    changeMicrocreditCurrent(microcreditCurrent: SupportInterface["MicrocreditCampaign"]) {
        this.microcreditCurrentSource.next(microcreditCurrent);
    }

    changeMicrocreditSupport(microcreditSupport: SupportInterface["MicrocreditSupport"]) {
        this.microcreditSupportSource.next(microcreditSupport);
    }
}