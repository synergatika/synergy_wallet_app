import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

import { LocalMicrocreditInterface } from './_microcredit.interface';

@Injectable()
export class LocalMicrocreditService {

    private userSource = new BehaviorSubject({
        identifier_scan: '',
        identifier_form: '',
        email: ''
    });
    user = this.userSource.asObservable();

    private actionsSource = new BehaviorSubject({
        registration: 'xxxxxx'
    });
    actions = this.actionsSource.asObservable();

    private microcreditCampaignSource = new BehaviorSubject({
        partner_id: '',
        partner_name: '',
        partner_email: '',
        partner_slug: '',
        partner_imageURL: '',
        partner_phone: '',

        partner_address: { street: '', city: '', postCode: '', coordinates: ['', ''] },
        partner_payments: [{ bic: '', name: '', value: '' }, { bic: '', name: '', value: '' }],
        partner_contacts: [{ slug: '', name: '', value: '' }],

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

        tokens: {
            _id: '', earnedTokens: 0, redeemedTokens: 0
        },
        // confirmationTokens: {
        //     _id: '', initialTokens: 0, redeemedTokens: 0
        // },
        // orderedTokens: {
        //     _id: '', initialTokens: 0, redeemedTokens: 0
        // },
        createdAt: new Date()
    });
    microcreditCampaign = this.microcreditCampaignSource.asObservable();

    private transactionSource = new BehaviorSubject({
        partner_id: '',
        campaign_id: '',
        support_id: '',
        payment_id: '',
        method: '',
        amount: 0,
        paid: true,
    });
    transaction = this.transactionSource.asObservable();

    constructor() { }

    changeUser(user: LocalMicrocreditInterface["User"]) {
        this.userSource.next(user);
    };

    changeActions(actions: LocalMicrocreditInterface["Actions"]) {
        this.actionsSource.next(actions);
    }

    changeMicrocreditCampaign(microcreditCampaign: LocalMicrocreditInterface["MicrocreditCampaign"]) {
        this.microcreditCampaignSource.next(microcreditCampaign);
    }

    changeTransaction(transaction: LocalMicrocreditInterface["Transaction"]) {
        this.transactionSource.next(transaction);
    }
}