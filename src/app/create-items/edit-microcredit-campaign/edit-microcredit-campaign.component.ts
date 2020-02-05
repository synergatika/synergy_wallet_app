import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';

import { Subject } from 'rxjs';

import { ItemsService } from '../../core/services/items.service';
import { MicrocreditService } from '../../core/services/microcredit.service';
import { AuthenticationService } from '../../core/services/authentication.service';

import { MicrocreditCampaign } from '../../core/models/microcredit_campaigns.model';
import { tap, takeUntil, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-edit-microcredit-campaign',
  templateUrl: './edit-microcredit-campaign.component.html',
  styleUrls: ['./edit-microcredit-campaign.component.sass']
})
export class EditMicrocreditCampaignComponent implements OnInit, OnDestroy {

  loading: boolean = false;
  private unsubscribe: Subject<any>;

  campaign: MicrocreditCampaign;

  constructor(
    private cdRef: ChangeDetectorRef,
    private itemsService: ItemsService,
    private microcreditService: MicrocreditService,
    private authenticationService: AuthenticationService
  ) {
    this.unsubscribe = new Subject();
  }

  ngOnInit() {
    this.fetchCampaignData();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
  }

  fetchCampaignData() {
    this.itemsService.readCampaign(this.authenticationService.currentUserValue.user["_id"], '5e3ad9295b7b5c133e306475')
      .pipe(
        tap(
          data => {
            this.campaign = data;
            console.log(this.campaign);
          },
          error => {
          }),
        takeUntil(this.unsubscribe),
        finalize(() => {
          this.loading = false;
          this.cdRef.markForCheck();
        })
      )
      .subscribe();


    // this.microcreditService.readCustomerBacker(this.authenticationService.currentUserValue.user["_id"], '5e3ad9295b7b5c133e306475', 'demo@email.com')
    //   .pipe(
    //     tap(
    //       data => {
    //         console.log(data);
    //       },
    //       error => {
    //       }),
    //     takeUntil(this.unsubscribe),
    //     finalize(() => {
    //       this.loading = false;
    //       this.cdRef.markForCheck();
    //     })
    //   )
    //   .subscribe();

    // this.microcreditService.createCustomerBacker(this.authenticationService.currentUserValue.user["_id"], '5e3ad9295b7b5c133e306475', 'demo@email.com', 50)
    //   .pipe(
    //     tap(
    //       data => {
    //         console.log(data);
    //       },
    //       error => {
    //       }),
    //     takeUntil(this.unsubscribe),
    //     finalize(() => {
    //       this.loading = false;
    //       this.cdRef.markForCheck();
    //     })
    //   )
    //   .subscribe();

    // this.microcreditService.confirmBacker(this.authenticationService.currentUserValue.user["_id"], '5e3ad9295b7b5c133e306475', ['10', '12'])
    //   .pipe(
    //     tap(
    //       data => {
    //         console.log(data);
    //       },
    //       error => {
    //       }),
    //     takeUntil(this.unsubscribe),
    //     finalize(() => {
    //       this.loading = false;
    //       this.cdRef.markForCheck();
    //     })
    //   )
    //   .subscribe();
  }
}
