import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, HostListener } from '@angular/core';
import { Subject } from 'rxjs';
import { tap, takeUntil, finalize } from 'rxjs/operators';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal, NgbActiveModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

/**
 * Environment
 */
import { environment } from '../../../environments/environment';

/**
 * Components
 */
import { StepperPartnerLoyaltyPointsComponent } from '../../stepper-partner-loyalty_points/stepper-partner-loyalty_points.component';
import { StepperPartnerLoyaltyOfferComponent } from '../../stepper-partner-loyalty_offer/stepper-partner-loyalty_offer.component';
import { StepperPartnerMicrocreditCampaignComponent } from '../../stepper-partner-microcredit_campaign/stepper-partner-microcredit_campaign.component';

/**
 * Services
 */
import { StaticDataService } from '../../core/helpers/static-data.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ItemsService } from '../../core/services/items.service';

/**
 * Models & Interfaces
 */
import { Offer, MicrocreditCampaign } from 'sng-core';

@Component({
  selector: 'app-partner-dashboard',
  templateUrl: './partner-dashboard.component.html',
  styleUrls: ['./partner-dashboard.component.scss'],
  // providers: [LoyaltyLocalService]
})
export class PartnerDashboardComponent implements OnInit, OnDestroy {

  /**
   * Configuration and Static Data
   */
  public configAccess: Boolean[] = environment.access;

  /**
   * Content Variables
   */
  public offers: Offer[];
  public microcredit: MicrocreditCampaign[];

  // public posts: PostEvent[];
  // singlePost: PostEvent;
  // singlePartner = false;
  // public campaign: MicrocreditCampaign;

  seconds: number = 0;

  loading: boolean = false;
  private unsubscribe: Subject<any>;

  /**
   * Component Constructor
   *
   * @param cdRef: ChangeDetectorRef
   * @param modalService: NgbModal
   * @param matDialog: MatDialog
   * @param translate: TranslateService
   * @param staticDataService: StaticDataService
   * @param authenticationService: AuthenticationService
   * @param itemsService: ItemsService
   * @param scannerService: ScannerService
   */
  constructor(
    private cdRef: ChangeDetectorRef,
    private modalService: NgbModal,
    public matDialog: MatDialog,
    private translate: TranslateService,
    private staticDataService: StaticDataService,
    private authenticationService: AuthenticationService,
    private itemsService: ItemsService,
  ) {
    // this.customOptions = this.staticDataService.getOwlOptionsThree;
    this.unsubscribe = new Subject();
  }

  /**
   * On Init
   */
  ngOnInit() {
    const now = new Date();
    this.seconds = parseInt(now.getTime().toString());

    this.fetchOffersData();
    this.fetchCampaignsData();
    // this.fetchPostsEventsData();
  }

  /**
   * On Destroy
   */
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
  }

  /**
   * Close Modal on Browser Back Button
   */
  controlModalState(state: boolean) {
    if (state) {
      const modalState = {
        modal: true,
        desc: 'ScannerModals'
      };
      history.pushState(modalState, null);
    } else if (window.history.state.modal) {
      history.back();
    }
  }

  @HostListener('window:popstate')
  dismissModal() {
    this.controlModalState(false);
    this.modalService.dismissAll();
  }

  /**
   * Fetch Offers List (for One Partner)
   */
  fetchOffersData() {
    this.itemsService.readOffersByStore(this.authenticationService.currentUserValue.user["_id"], '0-0-1')
      .pipe(
        tap(
          data => {
            this.offers = data;
            console.log("Partner Dashboard (Loyalty Offers)", this.offers)
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

  /**
   * Fetch Microcredit Campaigns List (for One Partner)
   */
  fetchCampaignsData() {
    console.log('this.microcredit');
    this.itemsService.readPrivateMicrocreditCampaignsByStore(this.authenticationService.currentUserValue.user["_id"], '0-0-0')
      .pipe(
        tap(
          data => {
            const seconds = this.seconds;
            this.microcredit = data.filter((item) => {
              return ((item.status == 'published') && (item.redeemStarts < seconds) && (seconds < item.redeemEnds));
            });;
            console.log("Partner Dashboard (Microcredit Campaigns)", this.microcredit)
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

  /**
   * Open Wizard (Scan for Points)
   */
  openModalA() {
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.width = "600px";

    // https://material.angular.io/components/dialog/overview
    const modalDialog = this.matDialog.open(StepperPartnerLoyaltyPointsComponent, dialogConfig);
  }

  /**
   * Open Wizard (Scan for Offer)
   */
  openModalB(offer: Offer) {
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.width = "600px";
    dialogConfig.data = {
      offer: offer
    };

    // https://material.angular.io/components/dialog/overview
    const modalDialog = this.matDialog.open(StepperPartnerLoyaltyOfferComponent, dialogConfig);
  }

  /**
   * Open Wizard (Scan for Microcredit Campaign)
   */
  openModalC(campaign: MicrocreditCampaign) {
    //  const currentMicrocredit = this.microcredit.filter(o => o.campaign_id === campaign_id)
    //  console.log(currentMicrocredit);//if (currentMicrocredit[0] ))

    if ((campaign.redeemStarts > this.seconds) || (campaign.redeemEnds < this.seconds)) {
      return;
    }
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.width = "600px";
    dialogConfig.data = {
      campaign: campaign
    };

    // https://material.angular.io/components/dialog/overview
    const modalDialog = this.matDialog.open(StepperPartnerMicrocreditCampaignComponent, dialogConfig);
  }
}
