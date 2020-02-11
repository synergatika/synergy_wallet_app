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

    private microcreditSource = new BehaviorSubject({
        merchant_id: '',
        merchant_name: '',
        merchant_imageURL: '',
        campaign_id: '',
        title: '',
        terms: '',
        description: '',
        minAllowed: 0,
        maxAllowed: 0,
        maxAmount: 0,
        expiresAt: 0,
        createdAt: new Date()
    });
    microcredit = this.microcreditSource.asObservable();

    private microcreditSupportSource = new BehaviorSubject({
        merchant_id: '',
        campaign_id: '',
        minAmount: 0,
        maxAmount: 0,
        support_id: '',
        payment: '',
        amount: 0,
        paid: true,
    });
    microcreditSupport = this.microcreditSupportSource.asObservable();

    constructor() { }

    changeUser(user: SupportInterface["User"]) {
        this.userSource.next(user);
    };

    changeMicrocreditCampaign(microcredit: SupportInterface["MicrocreditCampaign"]) {
        this.microcreditSource.next(microcredit);
    }

    changeMicrocreditSupport(support: SupportInterface["MicrocreditSupport"]) {
        this.microcreditSupportSource.next(support);
    }
}