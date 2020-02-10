import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { tap, takeUntil, finalize } from 'rxjs/operators';

// Services
import { ItemsService } from '../../core/services/items.service';
import { MicrocreditService } from '../../core/services/microcredit.service';
import { AuthenticationService } from '../../core/services/authentication.service';
// Models
import { MicrocreditCampaign } from '../../core/models/microcredit-campaign.model';
import { MicrocreditSupport } from 'src/app/core/models/microcredit-support.model';

@Component({
  selector: 'app-edit-microcredit-campaign',
  templateUrl: './edit-microcredit-campaign.component.html',
  styleUrls: ['./edit-microcredit-campaign.component.sass']
})
export class EditMicrocreditCampaignComponent implements OnInit, OnDestroy {

  loading: boolean = false;
  private unsubscribe: Subject<any>;

  campaign_id: string;
  unpaidSupports: MicrocreditSupport[];
  paidSupports: MicrocreditSupport[];
  campaign: MicrocreditCampaign;
  to_pay: string[] = [];
  to_unpay: string[] = [];

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

  onToPayCheckBoxChange(backer) {
    if (this.to_pay.indexOf(backer) < 0) {
      this.to_pay.push(backer);
    } else {
      this.to_pay.splice(this.to_pay.indexOf(backer), 1);
    }
    console.log(this.to_pay);
  }

  onToUnpayCheckBoxChange(backer) {
    if (this.to_unpay.indexOf(backer) < 0) {
      this.to_unpay.push(backer);
    } else {
      this.to_unpay.splice(this.to_unpay.indexOf(backer), 1);
    }
    console.log(this.to_unpay);
  }

  groupBy(arr, property) {
    return arr.reduce(function (memo, x) {
      if (!memo[x[property]]) { memo[x[property]] = []; }
      memo[x[property]].push(x);
      return memo;
    }, {});
  }

  fetchCampaignData() {
    this.itemsService.readCampaign(this.authenticationService.currentUserValue.user["_id"], this.campaign_id)
      .pipe(
        tap(
          data => {
            this.campaign = data;
            const groupedSupports = this.groupBy(this.campaign.backers, 'status'); // => {orange:[...], banana:[...]}
            this.paidSupports = groupedSupports.confirmation;
            this.unpaidSupports = groupedSupports.order;
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
  }
  // this.microcreditService.earnTokensByMerchant(this.authenticationService.currentUserValue.user["_id"], this.campaign_id, 'demo@email.com', 250)
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

  onSubmit() {
    this.microcreditService.confirmPayment(this.authenticationService.currentUserValue.user["_id"], this.campaign_id, 'pay', this.to_pay)
      .pipe(
        tap(
          data => {
            console.log(data);
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

    this.microcreditService.confirmPayment(this.authenticationService.currentUserValue.user["_id"], this.campaign_id, 'unpay', this.to_unpay)
      .pipe(
        tap(
          data => {
            console.log(data);
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
  }
}
