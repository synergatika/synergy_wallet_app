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
        redeem: '00',
        registration: '000000'
    });
    actions = this.actionsSource.asObservable();

    private microcreditCampaignSource = new BehaviorSubject({
        partner_id: '',
        partner_name: '',
        partner_email: '',
        partner_slug: '',
        partner_imageURL: '',
        partner_address: { street: '', city: '', postCode: '', coordinates: ['', ''] },
        partner_contact: { phone: '', websiteURL: '' },
        partner_payments: [{ bic: '', name: '', value: '' }],

        campaign_id: '',
        campaign_imageURL: '',
        title: '',
        campaign_slug: '',
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
    microcreditCampaign = this.microcreditCampaignSource.asObservable();

    private microcreditSupportsSource = new BehaviorSubject([
        {
            partner_id: '',
            partner_name: '',
            partner_address: {
                street: '',
                postCode: '',
                city: '',
                coordinates: ['', '']
            },
            partner_payments: [
                {
                    bic: '',
                    name: '',
                    value: '',
                }
            ],

            campaign_id: '',
            campaign_imageURL: '',
            title: '',
            terms: '',
            redeemStarts: 0,
            redeemEnds: 0,

            support_id: '',
            payment_id: '',
            backer_id: '',
            initialTokens: 0,
            redeemedTokens: 0,
            status: '',

            amount: 0,
            method: '',

            transactions: [],
            createdAt: new Date(),
            how: {
                title: '',
                value: '',
            }
        }
    ]);
    microcreditSupports = this.microcreditSupportsSource.asObservable();

    private transactionSource = new BehaviorSubject({
        campaign_id: '0',
        campaign_title: '0',
        support_id: '0',
        initial_tokens: 0,
        redeemed_tokens: 0,
        possible_tokens: 0,
        discount_tokens: 0,
    });
    transaction = this.transactionSource.asObservable();

    constructor() { }

    changeUser(user: LocalMicrocreditInterface["User"]) {
        this.userSource.next(user);
    };

    changeActions(actions: LocalMicrocreditInterface["Actions"]) {
        this.actionsSource.next(actions);
    }

    changeMicrocreditSupports(supports: LocalMicrocreditInterface["MicrocreditSupport"][]) {
        this.microcreditSupportsSource.next(supports);
    }

    changeMicrocreditCampaign(campaign: LocalMicrocreditInterface["MicrocreditCampaign"]) {
        this.microcreditCampaignSource.next(campaign);
    }

    changeTransaction(transaction: LocalMicrocreditInterface["Transaction"]) {
        this.transactionSource.next(transaction);
    }
}
