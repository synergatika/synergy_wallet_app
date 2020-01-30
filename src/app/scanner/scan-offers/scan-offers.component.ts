import { Component, OnInit, OnDestroy, ChangeDetectorRef, Inject } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { Subject } from 'rxjs';
import { tap, takeUntil, finalize } from 'rxjs/operators';
// Global Services
import { LoyaltyService } from '../../core/services/loyalty.service';

// Local Services
import { LoyaltyLocalService } from '../loyaltyLocal.service';

// Local Models & Interfaces
import { LoyaltyLocalInterface } from '../loyaltyLocal.interface';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
@Component({
  selector: 'app-scan-offers',
  templateUrl: './scan-offers.component.html',
  styleUrls: ['./scan-offers.component.sass'],
  // providers: [LoyaltyLocalService]
})
export class ScanOffersComponent implements OnInit, OnDestroy {

  offer_id: string;

  loading: boolean = false;
  private unsubscribe: Subject<any>;

  user: LoyaltyLocalInterface["User"];
  offers: LoyaltyLocalInterface["Offer"][];
  transaction: LoyaltyLocalInterface["OfferTransaction"];

  submitted: boolean = false;

  showEmailForm = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private loyaltyService: LoyaltyService,
    private loyaltyLocalService: LoyaltyLocalService,
    public dialogRef: MatDialogRef<ScanOffersComponent>, @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.offer_id = this.data.offer_id;
    this.loyaltyLocalService.offers.subscribe(offers => this.offers = offers);
    this.loyaltyLocalService.offerTransaction.subscribe(transaction => this.transaction = transaction);
    this.loyaltyLocalService.user.subscribe(user => this.user = user);
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
    this.loyaltyLocalService.changeOfferTransaction(this.transaction);
  }

  fetchBalanceData() {
    const identifier = this.user.identifier || this.user.email;
    this.loyaltyService.memberBalance((identifier).toLowerCase())
      .pipe(
        tap(
          data => {
            console.log(parseInt(data.data.points, 16));
            this.transaction.points = parseInt(data.data.points, 16);
            this.loyaltyLocalService.changeOfferTransaction(this.transaction);
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

  onSuccessScan(event: string) {
    this.fetchBalanceData();
  }

  onSubmitEmailForm(event: string) {
    this.fetchBalanceData();
  }

  onSubmitOfferForm(event: number) {

  }

  onShowEmailFormChange() {
    this.showEmailForm = !this.showEmailForm;
  }

  finalize() {
    if (this.submitted) return;
    this.submitted = true;

    const identifier = this.user.identifier || this.user.email;
    const redeemPoints = {
      _to: (identifier).toLowerCase(),
      _points: this.transaction.discount_points,
      password: 'my_password'//controls.password.value
    };

    this.loyaltyService.redeemPoints(redeemPoints._to, redeemPoints._points, redeemPoints.password)
      .pipe(
        tap(
          data => {
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
}
