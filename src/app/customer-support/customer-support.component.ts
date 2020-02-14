import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { tap, takeUntil, finalize } from 'rxjs/operators';

import { ItemsService } from '../core/services/items.service';
import { MicrocreditCampaign } from '../core/models/microcredit-campaign.model';

import { SupportMicrocreditComponent } from './support-microcredit/support-microcredit.component';
import { SupportService } from './_support.service';

@Component({
  selector: 'app-customer-support',
  templateUrl: './customer-support.component.html',
  styleUrls: ['./customer-support.component.sass']
})
export class CustomerSupportComponent implements OnInit, OnDestroy {

  loading: boolean = false;
  private unsubscribe: Subject<any>;

  campaigns: MicrocreditCampaign[];

  constructor(
    public matDialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private itemsService: ItemsService,
    private supportService: SupportService
  ) {
    this.supportService.microcreditCampaigns.subscribe(campaigns => this.campaigns = campaigns)
    this.unsubscribe = new Subject();
  }

  ngOnInit() {
    this.fetchMicrocreditData();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
  }

  openModal(merchant_id: string, campaign_id: string) {
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.height = "350px";
    dialogConfig.width = "600px";
    dialogConfig.data = {
      merchant_id: merchant_id,
      campaign_id: campaign_id
    };
    const modalDialog = this.matDialog.open(SupportMicrocreditComponent, dialogConfig);
  }

  fetchMicrocreditData() {
    this.itemsService.readAllPublicMicrocreditCampaigns()
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
