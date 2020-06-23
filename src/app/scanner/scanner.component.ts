import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, HostListener } from '@angular/core';
import { Subject } from 'rxjs';
import { tap, takeUntil, finalize } from 'rxjs/operators';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal, NgbActiveModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { OwlOptions } from 'ngx-owl-carousel-o';

/**
 * Environment
 */
import { environment } from '../../environments/environment';

/**
 * Services
 */
import { StaticDataService } from '../core/services/static-data.service';
import { AuthenticationService } from '../core/services/authentication.service';
import { ItemsService } from '../core/services/items.service';

/**
 * Models & Interfaces
 */
import { PostEvent } from '../core/models/post_event.model';
import { MicrocreditCampaign } from '../core/models/microcredit_campaign.model';

/**
 * Components
 */
import { ScanLoyaltyComponent } from './scan-loyalty/scan-loyalty.component';
import { ScanOffersComponent } from './scan-offers/scan-offers.component';
import { ScanMicrocreditComponent } from './scan-microcredit/scan-microcredit.component';

/**
 * Local Services & Interfaces
 */
import { ScannerInterface } from './_scanner.interface';
import { ScannerService } from './_scanner.service';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss'],
  // providers: [LoyaltyLocalService]
})
export class ScannerComponent implements OnInit, OnDestroy {

	/**
	 * Configuration and Static Data
	 */
  public configAccess: Boolean[] = environment.access;

	/**
	 * Children Modals
	 */
  @ViewChild('postModal', { static: false }) postModal: NgbModalRef;

  /** 
   * Carousel Variables
   */
  customOptions: OwlOptions;
  moved: boolean;

  /**
   * Content Variables
   */
  public posts: PostEvent[];
  public offers: ScannerInterface["Offer"][];
  public microcredit: ScannerInterface["MicrocreditCampaign"][];
  singlePost: PostEvent;
  singlePartner = false;
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
    private scannerService: ScannerService
  ) {
    this.customOptions = this.staticDataService.getOwlOptionsThree;
    this.scannerService.offers.subscribe(offers => this.offers = offers)
    this.scannerService.microcredit.subscribe(microcredit => this.microcredit = microcredit)
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
    this.fetchPostsEventsData();
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

  @HostListener('window:popstate', ['$event'])
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
            console.log(this.offers)
            this.scannerService.changeOffers(this.offers);
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
            console.log(seconds)
            this.microcredit = data.filter((item) => {
              return ((item.status == 'published') && (item.redeemStarts < seconds) && (seconds < item.redeemEnds));
            });;
            this.scannerService.changeMicrocreditCampaigns(this.microcredit);
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
   * Fetch Post & Events List
   */
  fetchPostsEventsData() {
    this.itemsService.readAllPrivatePostsEvents('0-0-0')
      .pipe(
        tap(
          data => {
            this.posts = data;
            console.log('this.posts');
            console.log(this.posts);
            //this.scannerService.changeOffers(this.posts);
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
    const modalDialog = this.matDialog.open(ScanLoyaltyComponent, dialogConfig);
  }

  /**
   * Open Wizard (Scan for Offer)
   */
  openModalB(offer_id: string) {
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.width = "600px";
    dialogConfig.data = {
      offer_id: offer_id
    };

    // https://material.angular.io/components/dialog/overview
    const modalDialog = this.matDialog.open(ScanOffersComponent, dialogConfig);
  }

  /**
   * Open Wizard (Scan for Microcredit Campaign)
   */
  openModalC(campaign_id: string) {
    const currentMicrocredit = this.microcredit.filter(o => o.campaign_id === campaign_id)
    console.log(currentMicrocredit);//if (currentMicrocredit[0] ))

    if ((currentMicrocredit[0].redeemStarts > this.seconds) || (currentMicrocredit[0].redeemEnds < this.seconds)) {
      return;
    }
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.width = "600px";
    dialogConfig.data = {
      campaign_id: campaign_id
    };

    // https://material.angular.io/components/dialog/overview
    const modalDialog = this.matDialog.open(ScanMicrocreditComponent, dialogConfig);
  }

  /**
   * Open PostEvent Modal
   */
  openPost(post: PostEvent) {
    console.log('post modal');
    console.log(post);
    this.singlePost = post;

    this.controlModalState(true);

    this.modalService.open(
      this.postModal,
      {
        ariaLabelledBy: 'modal-basic-title',
        size: 'lg',
        backdropClass: 'fullscrenn-backdrop',
        //backdrop: 'static',
        windowClass: 'fullscreen-modal',
      }
    ).result.then((result) => {
      console.log('closed');
      this.controlModalState(false);

    }, (reason) => {
      console.log('dismissed');
      this.controlModalState(false);

    });
  }


	/**
	 * Actions to Open Modals from Carousel
	 */
  mousedown() { this.moved = false; }
  mousemove() { this.moved = true; }
  mouseup(data: any, type: string) {
    if (this.moved) { }
    else {
      if (type == 'post') {
        this.openPost(data);
      } else { }
    }
    this.moved = false;
  }
}
