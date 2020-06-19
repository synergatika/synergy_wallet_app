import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

import { ScannerInterface } from './_scanner.interface';

@Injectable()
export class ScannerService {

    private userSource = new BehaviorSubject({
        identifier_scan: '',
        identifier_form: '',
        email: ''
    });
    user = this.userSource.asObservable();

    private pointsTransactionSource = new BehaviorSubject({
        amount: 0,
        possible_discount_amount: 0,
        discount_amount: 0,
        final_amount: 0,
        discount_points: 0,
        points: 0,
        previous_points: 0
    });
    pointsTransaction = this.pointsTransactionSource.asObservable();

    private actionsSource = new BehaviorSubject({
        redeem: '00',
        registration: '000000'
    });
    actions = this.actionsSource.asObservable();

    private offersSource = new BehaviorSubject([]);
    offers = this.offersSource.asObservable();

    private offerTransactionSource = new BehaviorSubject({
        offer_id: '',
        cost: 0,
        discount_points: 0,
        points: 0,
        possible_quantity: 0,
        quantity: 0,
        final_amount: 0,
    });
    offerTransaction = this.offerTransactionSource.asObservable();

    private microcreditSource = new BehaviorSubject([]);
    microcredit = this.microcreditSource.asObservable();

    private microcreditSupportsSource = new BehaviorSubject([
        {
            campaign_id: '0',
            support_id: '0',
            backer_id: '0',
            initialTokens: 0,
            redeemedTokens: 0,
            status: ''
        }
    ]);
    microcreditSupports = this.microcreditSupportsSource.asObservable();

    private microcreditTransactionSource = new BehaviorSubject({
        campaign_id: '0',
        support_id: '0',
        initial_tokens: 0,
        redeemed_tokens: 0,
        possible_tokens: 0,
        discount_tokens: 0,
    });
    microcreditTransaction = this.microcreditTransactionSource.asObservable();

    constructor() { }

    changeUser(user: ScannerInterface["User"]) {
        this.userSource.next(user);
    };

    changePointsTransaction(transaction: ScannerInterface["PointsTransaction"]) {
        this.pointsTransactionSource.next(transaction);
    };

    changeActions(actions: ScannerInterface["Actions"]) {
        this.actionsSource.next(actions);
    }

    changeOffers(offers: ScannerInterface["Offer"][]) {
        this.offersSource.next(offers);
    }

    changeOfferTransaction(transaction: ScannerInterface["OfferTransaction"]) {
        this.offerTransactionSource.next(transaction);
    };

    changeMicrocreditSupports(supports: ScannerInterface["MicrocreditSupport"][]) {
        this.microcreditSupportsSource.next(supports);
    }

    changeMicrocreditCampaigns(microcredit: ScannerInterface["MicrocreditCampaign"][]) {
        this.microcreditSource.next(microcredit);
    }

    changeMicrocreditTransaction(transaction: ScannerInterface["MicrocreditTransaction"]) {
        this.microcreditTransactionSource.next(transaction);
    }
}
