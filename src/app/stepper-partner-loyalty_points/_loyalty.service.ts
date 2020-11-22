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

    private transactionSource = new BehaviorSubject({
        amount: 0,
        possible_discount_amount: 0,
        discount_amount: 0,
        final_amount: 0,
        points: 0,
        discount_points: 0,
        final_points: 0
    });
    transaction = this.transactionSource.asObservable();

    private actionsSource = new BehaviorSubject({
        redeem: '00',
        registration: 'xxxxxx'
    });
    actions = this.actionsSource.asObservable();


    constructor() { }

    changeUser(user: LocalLoyaltyInterface["User"]) {
        this.userSource.next(user);
    };

    changeTransaction(transaction: LocalLoyaltyInterface["Transaction"]) {
        this.transactionSource.next(transaction);
    };

    changeActions(actions: LocalLoyaltyInterface["Actions"]) {
        this.actionsSource.next(actions);
    }
}
