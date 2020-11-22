import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

import { LocalLoyaltyInterface } from './_loyalty.interface';

@Injectable()
export class LocalLoyaltyService {

    private userSource = new BehaviorSubject({
        identifier_scan: '',
        identifier_form: '',
        email: ''
    });
    user = this.userSource.asObservable();


    private loyaltyOfferSource = new BehaviorSubject({
        partner_id: '',
        partner_name: '',
        partner_slug: '',
        partner_imageURL: '',
        partner_address: {
            street: '',
            postCode: '',
            city: '',
            coordinates: ['', '']
        },

        offer_id: '',
        offer_imageURL: '',
        offer_slug: '',
        title: '',
        subtitle: '',
        description: '',
        cost: 0,
        expiresAt: 0,
        createdAt: ''
    });
    loyaltyOffer = this.loyaltyOfferSource.asObservable();

    private transactionSource = new BehaviorSubject({
        offer_id: '',
        offer_title: '',
        cost: 0,
        points: 0,
        discount_points: 0,
        final_points: 0,
        possible_quantity: 0,
        quantity: 0
    });
    transaction = this.transactionSource.asObservable();


    constructor() { }

    changeUser(user: LocalLoyaltyInterface["User"]) {
        this.userSource.next(user);
    };

    changeLoyaltyOffer(loyaltyOffer: LocalLoyaltyInterface["Offer"]) {
        this.loyaltyOfferSource.next(loyaltyOffer);
    }

    changeTransaction(transaction: LocalLoyaltyInterface["Transaction"]) {
        this.transactionSource.next(transaction);
    };
}
