import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef, Inject } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { Subject } from 'rxjs';
import { tap, takeUntil, finalize } from 'rxjs/operators';
// Global Services
import { MicrocreditService } from '../../core/services/microcredit.service';
import { AuthenticationService } from '../../core/services/authentication.service';

// Local Services
import { ScannerService } from '../_scanner.service';

// Local Models & Interfaces
import { ScannerInterface } from '../_scanner.interface';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { WizardComponent } from 'angular-archwizard';

@Component({
  selector: 'app-scan-microcredit',
  templateUrl: './scan-microcredit.component.html',
  styleUrls: ['./scan-microcredit.component.sass']
})
export class ScanMicrocreditComponent implements OnInit {

  @ViewChild(WizardComponent, { static: true })
  public wizard: WizardComponent;

  campaign_id: string;

  loading: boolean = false;
  private unsubscribe: Subject<any>;

  user: ScannerInterface["User"];
  campaigns: ScannerInterface["MicrocreditCampaign"][];
  transaction: ScannerInterface["MicrocreditTransaction"];
  orders: ScannerInterface["MicrocreditOrder"][];

  submitted: boolean = false;

  showIdentifierForm = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private microcreditService: MicrocreditService,
    private authenticationService: AuthenticationService,
    private scannerService: ScannerService,
    public dialogRef: MatDialogRef<ScanMicrocreditComponent>, @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.campaign_id = this.data.campaign_id;
    this.scannerService.microcredit.subscribe(campaigns => this.campaigns = campaigns);
    this.scannerService.microcreditTransaction.subscribe(transaction => this.transaction = transaction);
    this.scannerService.orders.subscribe(orders => this.orders = orders);
    this.scannerService.user.subscribe(user => this.user = user);
    this.unsubscribe = new Subject();
  }

  ngOnInit() {
    this.initializeCampaignData();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
  }

  initializeCampaignData() {
    const currentCampaign = this.campaigns[this.campaigns.map(function (e) { return e.campaign_id; }).indexOf(this.campaign_id)];
    this.transaction.campaign_id = currentCampaign.campaign_id;
    this.scannerService.changeMicrocreditTransaction(this.transaction);
  }

  fetchBackerData() {
    const identifier = this.user.identifier_scan || this.user.identifier_form;
    this.microcreditService.readCustomerBacker(this.authenticationService.currentUserValue.user["_id"], this.campaign_id, (identifier).toLowerCase())
      .pipe(
        tap(
          data => {
            this.orders = data;
            this.scannerService.changeMicrocreditOrders(this.orders);
            const currentOrder = this.orders.find(order => order.initialTokens - order.redeemedTokens > 0);
            if (currentOrder) {
              this.transaction.support_id = currentOrder.support_id;
              this.transaction.initial_tokens = currentOrder.initialTokens;
              this.transaction.redeemed_tokens = currentOrder.redeemedTokens;
              this.transaction.possible_tokens = (this.transaction.initial_tokens - this.transaction.redeemed_tokens);
              this.scannerService.changeMicrocreditTransaction(this.transaction);
            }
            this.onNextStep();
          },
          error => {
            console.log(error);
          }),
        takeUntil(this.unsubscribe),
        finalize(() => {
          this.loading = false;
          this.cdRef.markForCheck();
        })
      )
      .subscribe();
  }

  onSuccessScanIdentifier(event: string) {
    this.fetchBackerData();
  }

  onSubmitIdentifierForm(event: string) {
    this.fetchBackerData();
  }

  onShowIdentifierFormChange() {
    this.showIdentifierForm = !this.showIdentifierForm;
  }

  onSubmitMicrocreditForm(event: number) {
    const identifier = this.user.identifier_scan || this.user.identifier_form;
    const redeemTokens = {
      _to: (identifier).toLowerCase(),
      _points: this.transaction.discount_tokens,
      password: 'all_ok',
      support_id: this.transaction.support_id
    };

    this.microcreditService.redeemTokens(this.authenticationService.currentUserValue.user["_id"], this.campaign_id, redeemTokens._to, redeemTokens._points, redeemTokens.password, redeemTokens.support_id)
      .pipe(
        tap(
          data => {
            this.onNextStep();
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

  onNextStep() {
    this.wizard.goToNextStep();
  }

  onPreviousStep() {
    this.wizard.goToPreviousStep();
  }

  onFinalStep(event) {
    this.dialogRef.close();
  }
}
