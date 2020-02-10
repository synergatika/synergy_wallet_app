import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

import { SupportInterface } from './_support.interface';

@Injectable()
export class SupportService {

    private microcreditSource = new BehaviorSubject([]);
    microcredit = this.microcreditSource.asObservable();

    private microcreditSupportSource = new BehaviorSubject({
        merchant_id: '',
        campaign_id: '',
        minAmount: 0,
        maxAmount: 0,
        support_id: '',
        payment: '',
        amount: 0
    });
    microcreditSupport = this.microcreditSupportSource.asObservable();

    constructor() { }

    changeMicrocreditCampaigns(microcredit: SupportInterface["MicrocreditCampaign"][]) {
        this.microcreditSource.next(microcredit);
    }

    changeMicrocreditSupport(support: SupportInterface["MicrocreditSupport"]) {
        this.microcreditSupportSource.next(support);
    }
}