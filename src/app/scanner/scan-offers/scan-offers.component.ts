import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef, Inject, HostListener } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { Subject, Subscription } from 'rxjs';
import { tap, takeUntil, finalize } from 'rxjs/operators';
// Global Services
import { TranslateService } from '@ngx-translate/core';
import { MessageNoticeService } from '../../core/helpers/message-notice/message-notice.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { LoyaltyService } from '../../core/services/loyalty.service';

// Local Services
import { ScannerService } from '../_scanner.service';

// Local Models & Interfaces
import { ScannerInterface } from '../_scanner.interface';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { WizardComponent } from 'angular-archwizard';
import { Offer } from 'src/app/core/models/offer.model';

@Component({
  selector: 'app-scan-offers',
  templateUrl: './scan-offers.component.html',
  styleUrls: ['./scan-offers.component.scss'],
  // providers: [LoyaltyLocalService]
})
export class ScanOffersComponent implements OnInit, OnDestroy {

  @ViewChild(WizardComponent, { static: true })
  public wizard: WizardComponent;

  offer_id: string;
  showIdentifierForm = false;

  loading: boolean = false;
  private unsubscribe: Subject<any>;
  private subscription: Subscription = new Subscription;

  user: ScannerInterface["User"];
  offers: ScannerInterface["Offer"][];
  transaction: ScannerInterface["OfferTransaction"];

  constructor(
    private cdRef: ChangeDetectorRef,
    private translate: TranslateService,
    private scannerNoticeService: MessageNoticeService,
    private authenticationService: AuthenticationService,
    private loyaltyService: LoyaltyService,
    private scannerService: ScannerService,
    public dialogRef: MatDialogRef<ScanOffersComponent>, @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.offer_id = this.data.offer_id;
    this.subscription.add(this.scannerService.offers.subscribe(offers => this.offers = offers));
    this.subscription.add(this.scannerService.offerTransaction.subscribe(transaction => this.transaction = transaction));
    this.subscription.add(this.scannerService.user.subscribe(user => this.user = user));
    this.unsubscribe = new Subject();
  }

	/**
	 * On Init
	 */
  ngOnInit() {
    // this.controlModalState(true);

    this.initializeOfferData();
  }

	/**
	 * On destroy
	 */
  ngOnDestroy() {
    // this.controlModalState(false);

    this.scannerNoticeService.setNotice(null);
    this.subscription.unsubscribe();
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
  }

  // controlModalState(state: boolean) {
  //   if (state) {
  //     const modalState = {
  //       modal: true,
  //       desc: 'fake state for our modal'
  //     };
  //     history.pushState(modalState, null);
  //   } else if (window.history.state.modal) {
  //     history.back();
  //   }
  // }

  // @HostListener('window:popstate', ['$event'])
  // dismissModal() {
  //   this.dialogRef.close();
  // }


  initializeOfferData() {
    const currentOffer = this.offers[this.offers.map(function (e) { return e.offer_id; }).indexOf(this.offer_id)];
    this.transaction.offer_id = currentOffer.offer_id;
    this.transaction.offer_title = currentOffer.title;
    this.transaction.cost = currentOffer.cost;
    this.scannerService.changeOfferTransaction(this.transaction);
  }

  fetchBalanceData(final: boolean) {
    const identifier = this.user.identifier_scan || this.user.identifier_form;
    this.loyaltyService.readBalanceByPartner((identifier).toLowerCase())
      .pipe(
        tap(
          data => {
            console.log(data);

            if (final) {
              this.transaction.final_points = parseInt(data.points, 16);
              this.scannerService.changeOfferTransaction(this.transaction);

              this.scannerNoticeService.setNotice(this.translate.instant('WIZARD_MESSAGES.SUCCESS_TRANSACTION'), 'success');
              this.onNextStep();
            } else {
              console.log(parseInt(data.points, 16));
              this.transaction.points = parseInt(data.points, 16);
              this.transaction.possible_quantity = Math.floor(this.transaction.points / this.transaction.cost);
              this.scannerService.changeOfferTransaction(this.transaction);
              this.onNextStep();

              if (!this.transaction.possible_quantity) {
                this.scannerNoticeService.setNotice(this.translate.instant('WIZARD_MESSAGES.NOT_ENOUGH_POINTS'), 'danger');
              }
            }
          },
          error => {
            this.scannerNoticeService.setNotice(this.translate.instant(error), 'danger');
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
    this.fetchBalanceData(false);
  }

  onSubmitIdentifierForm(event: string) {
    this.fetchBalanceData(false);
  }

  onSubmitOfferForm(event: number) {
    const identifier = this.user.identifier_scan || this.user.identifier_form;
    const redeemOffer = {
      password: 'all_ok',
      _to: (identifier).toLowerCase(),
      _points: this.transaction.discount_points,
      offer_id: this.transaction.offer_id,
      quanitive: this.transaction.quantity
    };

    this.loading = true;

    this.loyaltyService.redeemOffer(this.authenticationService.currentUserValue.user["_id"], redeemOffer.offer_id, redeemOffer._to, redeemOffer.password, redeemOffer._points, redeemOffer.quanitive)
      .pipe(
        tap(
          data => {
            this.fetchBalanceData(true);
          },
          error => {
            this.scannerNoticeService.setNotice(
              this.translate.instant('WIZARD_MESSAGES.ERROR_REDEEM_OFFER') + '<br>' +
              this.translate.instant(error), 'danger');
            this.loading = false;
          }),
        takeUntil(this.unsubscribe),
        finalize(() => {
          // this.loading = false;
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

  onExternalPreviousStep(event: boolean) {
    console.log('Back')
    this.scannerNoticeService.setNotice(null);
    this.wizard.goToPreviousStep();
  }

  onPreviousStep(event: boolean) {
    console.log('Back')
    this.scannerNoticeService.setNotice(null);
    this.wizard.goToPreviousStep();
  }

  onFinalStep(event = null) {
    this.dialogRef.close();
    // this.controlModalState(false);
  }
}
