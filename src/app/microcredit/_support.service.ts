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
        campaign_slug: '',
        title: '',
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
        // supports: [{
        //     _id: '', backer_id: '', initialTokens: 0, redeemedTokens: 0, payment_id: '', status: 'order'
        // }],
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
        merchant_id: '',
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