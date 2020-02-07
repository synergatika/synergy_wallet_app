import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { tap, takeUntil, finalize } from 'rxjs/operators';

// Services
import { ItemsService } from '../../core/services/items.service';
import { MicrocreditService } from '../../core/services/microcredit.service';
import { AuthenticationService } from '../../core/services/authentication.service';
// Models
import { MicrocreditCampaign } from '../../core/models/microcredit_campaigns.model';

@Component({
  selector: 'app-edit-microcredit-campaign',
  templateUrl: './edit-microcredit-campaign.component.html',
  styleUrls: ['./edit-microcredit-campaign.component.sass']
})
export class EditMicrocreditCampaignComponent implements OnInit, OnDestroy {

  loading: boolean = false;
  private unsubscribe: Subject<any>;

  campaign_id: string;

  campaign: MicrocreditCampaign;

  constructor(
    private cdRef: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private itemsService: ItemsService,
    private microcreditService: MicrocreditService,
    private authenticationService: AuthenticationService
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.campaign_id = params['_id'];
    });
    console.log(this.campaign_id)
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
    this.itemsService.readCampaign(this.authenticationService.currentUserValue.user["_id"], this.campaign_id)
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

    // this.microcreditService.createCustomerBacker(this.authenticationService.currentUserValue.user["_id"], this.campaign_id, 'demo@email.com', 250)
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

  // this.microcreditService.createCustomerBacker(this.authenticationService.currentUserValue.user["_id"], '5e3c092e778887047c4ee847', 'demo@email.com', 450)
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
}
