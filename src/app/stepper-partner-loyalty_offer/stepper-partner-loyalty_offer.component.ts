import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef, Inject, HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, Subscription } from 'rxjs';
import { tap, takeUntil, finalize } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { WizardComponent } from 'angular-archwizard';

/**
 * Services
 */
import { MessageNoticeService } from '../core/helpers/message-notice/message-notice.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { LoyaltyService } from '../core/services/loyalty.service';

/**
 * Local Services & Interfaces
 */
import { LocalLoyaltyService } from './_loyalty.service';
import { LocalLoyaltyInterface } from './_loyalty.interface';

@Component({
  selector: 'app-stepper-partner-loyalty_offer',
  templateUrl: './stepper-partner-loyalty_offer.component.html',
  styleUrls: ['./stepper-partner-loyalty_offer.component.scss'],
})
export class StepperPartnerLoyaltyOfferComponent implements OnInit, OnDestroy {

  /**
   * Wizard Component
   */
  @ViewChild(WizardComponent, { static: true })
  public wizard: WizardComponent;

  /**
   * Content Variables
   */
  public user: LocalLoyaltyInterface["User"];
  public offer: LocalLoyaltyInterface["Offer"];
  public transaction: LocalLoyaltyInterface["Transaction"];

  showIdentifierForm = false;

  loading: boolean = false;
  private unsubscribe: Subject<any>;
  private subscription: Subscription = new Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private translate: TranslateService,
    private stepperNoticeService: MessageNoticeService,
    private authenticationService: AuthenticationService,
    private loyaltyService: LoyaltyService,
    private stepperService: LocalLoyaltyService,
    public dialogRef: MatDialogRef<StepperPartnerLoyaltyOfferComponent>, @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.subscription.add(this.stepperService.user.subscribe(user => this.user = user));
    this.subscription.add(this.stepperService.loyaltyOffer.subscribe(offer => this.offer = offer));
    this.subscription.add(this.stepperService.transaction.subscribe(transaction => this.transaction = transaction));
    this.unsubscribe = new Subject();
  }

	/**
	 * On Init
	 */
  ngOnInit() {
    this.offer = this.data.offer;
    this.stepperService.changeLoyaltyOffer(this.offer);

    this.transaction.offer_id = this.offer.offer_id;
    this.transaction.offer_title = this.offer.title;
    this.transaction.cost = this.offer.cost;
    this.stepperService.changeTransaction(this.transaction);
  }

	/**
	 * On destroy
	 */
  ngOnDestroy() {
    this.stepperNoticeService.setNotice(null);
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


  fetchBalanceData(final: boolean) {
    const identifier = this.user.identifier_scan || this.user.identifier_form;
    this.loyaltyService.readBalanceByPartner((identifier).toLowerCase())
      .pipe(
        tap(
          data => {
            console.log(data);

            if (final) {
              this.transaction.final_points = parseInt(data.points, 16);
              this.stepperService.changeTransaction(this.transaction);

              this.stepperNoticeService.setNotice(this.translate.instant('WIZARD_MESSAGES.SUCCESS_TRANSACTION'), 'success');
              this.onNextStep();
            } else {
              console.log(parseInt(data.points, 16));
              this.transaction.points = parseInt(data.points, 16);
              this.transaction.possible_quantity = Math.floor(this.transaction.points / this.transaction.cost);
              this.stepperService.changeTransaction(this.transaction);
              this.onNextStep();

              if (!this.transaction.possible_quantity) {
                this.stepperNoticeService.setNotice(this.translate.instant('WIZARD_MESSAGES.NOT_ENOUGH_POINTS'), 'danger');
              }
            }
          },
          error => {
            this.stepperNoticeService.setNotice(this.translate.instant(error), 'danger');
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

  /**
   * Step A1: Callback from Identifier Scanning
   * 
   * @param event 
   */
  onSuccessScanIdentifier(event: string) {
    this.user.identifier_scan = event;
    this.stepperService.changeUser(this.user);

    this.fetchBalanceData(false);
  }

  /**
   * Step A2: Callback from Identifier Form
   * 
   * @param event 
   */
  onSubmitIdentifierForm(event: string) {
    this.user.identifier_form = event;
    this.stepperService.changeUser(this.user);

    this.fetchBalanceData(false);
  }

  /**
   * Step B: Callback from Offer Form
   * 
   * @param event 
   */
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
            this.stepperNoticeService.setNotice(
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
    this.stepperNoticeService.setNotice(null);
    this.wizard.goToPreviousStep();
  }

  onPreviousStep(event: boolean) {
    console.log('Back')
    this.stepperNoticeService.setNotice(null);
    this.wizard.goToPreviousStep();
  }

  onFinalStep(event = null) {
    this.dialogRef.close();
    // this.controlModalState(false);
  }
}
