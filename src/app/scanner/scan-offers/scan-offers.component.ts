import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef, Inject } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { Subject } from 'rxjs';
import { tap, takeUntil, finalize } from 'rxjs/operators';
// Global Services
import { LoyaltyService } from '../../core/services/loyalty.service';

// Local Services
import { ScannerService } from '../_scanner.service';

// Local Models & Interfaces
import { ScannerInterface } from '../_scanner.interface';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { WizardComponent } from 'angular-archwizard';
@Component({
  selector: 'app-scan-offers',
  templateUrl: './scan-offers.component.html',
  styleUrls: ['./scan-offers.component.sass'],
  // providers: [LoyaltyLocalService]
})
export class ScanOffersComponent implements OnInit, OnDestroy {

  @ViewChild(WizardComponent, { static: true })
  public wizard: WizardComponent;

  offer_id: string;

  loading: boolean = false;
  private unsubscribe: Subject<any>;

  user: ScannerInterface["User"];
  offers: ScannerInterface["Offer"][];
  transaction: ScannerInterface["OfferTransaction"];

  submitted: boolean = false;

  showIdentifierForm = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private loyaltyService: LoyaltyService,
    private scannerService: ScannerService,
    public dialogRef: MatDialogRef<ScanOffersComponent>, @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.offer_id = this.data.offer_id;
    this.scannerService.offers.subscribe(offers => this.offers = offers);
    this.scannerService.offerTransaction.subscribe(transaction => this.transaction = transaction);
    this.scannerService.user.subscribe(user => this.user = user);
    this.unsubscribe = new Subject();
  }

  ngOnInit() {
    this.initializeOfferData();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
  }

  initializeOfferData() {
    const currentOffer = this.offers[this.offers.map(function (e) { return e.offer_id; }).indexOf(this.offer_id)];
    this.transaction.offer_id = currentOffer.offer_id;
    this.transaction.cost = currentOffer.cost;
    this.scannerService.changeOfferTransaction(this.transaction);
  }

  fetchBalanceData() {
    const identifier = this.user.identifier_scan || this.user.identifier_form;
    this.loyaltyService.memberBalance((identifier).toLowerCase())
      .pipe(
        tap(
          data => {
            console.log(parseInt(data.data.points, 16));
            this.transaction.points = parseInt(data.data.points, 16);
            this.transaction.possible_quantity = Math.floor(this.transaction.points / this.transaction.cost);
            this.scannerService.changeOfferTransaction(this.transaction);
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
    this.fetchBalanceData();
  }

  onSubmitIdentifierForm(event: string) {
    this.fetchBalanceData();
  }

  onSubmitOfferForm(event: number) {
    const identifier = this.user.identifier_scan || this.user.identifier_form;
    const redeemPoints = {
      _to: (identifier).toLowerCase(),
      _points: this.transaction.discount_points,
      password: 'all_ok'
    };

    this.loyaltyService.redeemPoints(redeemPoints._to, redeemPoints._points, redeemPoints.password)
      .pipe(
        tap(
          data => {
            this.onNextStep();
            console.log(data);
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

  onShowIdentifierFormChange() {
    this.showIdentifierForm = !this.showIdentifierForm;
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
