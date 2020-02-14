import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, tap, finalize } from 'rxjs/operators';

import { AuthenticationService } from '../core/services/authentication.service';
import { ItemsService } from '../core/services/items.service';

import { SupportService } from './_support.service';

import { MicrocreditCampaign } from '../core/models/microcredit-campaign.model';


@Component({
  selector: 'app-microcredit',
  templateUrl: './microcredit.component.html',
  styleUrls: ['./microcredit.component.scss']
})
export class MicrocreditComponent implements OnInit, OnDestroy {

  loading: boolean = false;
  private unsubscribe: Subject<any>;

  campaigns: MicrocreditCampaign[];

  constructor(
    private cdRef: ChangeDetectorRef,
    private authenticationService: AuthenticationService,
    private itemsService: ItemsService,
    private supportService: SupportService
  ) {
    this.supportService.microcreditCampaigns.subscribe(campaigns => this.campaigns = campaigns)
    this.unsubscribe = new Subject();
  }

  ngOnInit() {
    this.fetchCampaignsData();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
  }

  fetchCampaignsData() {
    this.itemsService.readPublicMicrocreditCampaignsByStore(this.authenticationService.currentUserValue.user["_id"])
      .pipe(
        tap(
          data => {
            this.campaigns = data;
            this.supportService.changeMicrocreditCampaigns(this.campaigns);
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
