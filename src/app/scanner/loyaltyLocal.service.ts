import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

import { LoyaltyLocalInterface } from './loyaltyLocal.interface';

@Injectable()
export class LoyaltyLocalService {

    //loyaltyLocalInterface: LoyaltyLocalInterface;

    private userSource = new BehaviorSubject({
        identifier_scan: '',
        identifier_form: '',
        email: ''
    });
    user = this.userSource.asObservable();

    private pointsTransactionSource = new BehaviorSubject({
        amount: 0,
        final_amount: 0,
        discount_amount: 0,
        discount_points: 0,
        points: 0,
    });
    pointsTransaction = this.pointsTransactionSource.asObservable();

    private actionsSource = new BehaviorSubject({
        can_redeem: false,
        want_redeem: false,
        need_full_registration: false,
        need_card_update: false,
        need_email_update: false,
        need_email_registration: false,
        need_card_registration: false,
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
        quantity: 0
    });
    offerTransaction = this.offerTransactionSource.asObservable();

    constructor() { }

    changeUser(user: LoyaltyLocalInterface["User"]) {
        this.userSource.next(user);
    };

    changePointsTransaction(transaction: LoyaltyLocalInterface["PointsTransaction"]) {
        this.pointsTransactionSource.next(transaction);
    };

    changeActions(actions: LoyaltyLocalInterface["Actions"]) {
        this.actionsSource.next(actions);
    }

    changeOffers(offers: LoyaltyLocalInterface["Offer"][]) {
        this.offersSource.next(offers);
    }

    changeOfferTransaction(transaction: LoyaltyLocalInterface["OfferTransaction"]) {
        this.offerTransactionSource.next(transaction);
    };
}