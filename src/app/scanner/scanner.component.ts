import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';

import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { tap, takeUntil, finalize } from 'rxjs/operators';

import { OffersService } from '../core/services/offers.service';
import { AuthenticationService } from '../core/services/authentication.service';

import { LoyaltyLocalInterface } from './loyaltyLocal.interface';
import { LoyaltyLocalService } from './loyaltyLocal.service';

import { ScanLoyaltyComponent } from './scan-loyalty/scan-loyalty.component';
import { ScanOffersComponent } from './scan-offers/scan-offers.component';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.sass'],
  providers: [LoyaltyLocalService]
})
export class ScannerComponent implements OnInit, OnDestroy {

  loading: boolean = false;
  private unsubscribe: Subject<any>;

  offers: LoyaltyLocalInterface["Offer"][];


  constructor(
    public matDialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private loyaltyLocalService: LoyaltyLocalService,
    private authenticationService: AuthenticationService,
    private offersService: OffersService,
  ) {
    this.loyaltyLocalService.offers.subscribe(offers => this.offers = offers)
    this.unsubscribe = new Subject();
  }

  openModalA() {
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.height = "350px";
    dialogConfig.width = "600px";
    dialogConfig.data = {
      offer_id: '5e31aac39c804306ae7529b0'
    };
    // https://material.angular.io/components/dialog/overview
    const modalDialog = this.matDialog.open(ScanLoyaltyComponent, dialogConfig);
  }

  openModalB() {
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.height = "350px";
    dialogConfig.width = "600px";
    // https://material.angular.io/components/dialog/overview
    const modalDialog = this.matDialog.open(ScanOffersComponent, dialogConfig);
  }


  fetchOffersData() {
    this.offersService.readOffersByStore(this.authenticationService.currentUserValue.user["_id"])
      .pipe(
        tap(
          data => {
            this.offers = data;
            this.loyaltyLocalService.changeOffers(data);
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

  ngOnInit() {
    this.fetchOffersData();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
  }

}
