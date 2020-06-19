import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { tap, takeUntil, finalize } from 'rxjs/operators';

import { ItemsService } from '../core/services/items.service';
import { AuthenticationService } from '../core/services/authentication.service';

import { ScannerInterface } from './_scanner.interface';
import { ScannerService } from './_scanner.service';

import { ScanLoyaltyComponent } from './scan-loyalty/scan-loyalty.component';
import { ScanOffersComponent } from './scan-offers/scan-offers.component';
import { ScanMicrocreditComponent } from './scan-microcredit/scan-microcredit.component';
// Translate
import { TranslateService } from '@ngx-translate/core';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { PostEvent } from '../core/models/post_event.model';
import { environment } from '../../environments/environment';
import { StaticDataService } from '../core/services/static-data.service';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss'],
  // providers: [LoyaltyLocalService]
})
export class ScannerComponent implements OnInit, OnDestroy {

  public configAccess: Boolean[] = environment.access;

  campaign: any;

  moved: boolean;
  posts: PostEvent[];
  singlePost: PostEvent;
  singlePartner = false;

  seconds: number = 0;

  public offers: ScannerInterface["Offer"][];
  public microcredit: ScannerInterface["MicrocreditCampaign"][];

  loading: boolean = false;
  private unsubscribe: Subject<any>;

  @ViewChild('postModal', { static: false }) postModal;
  customOptions: OwlOptions;

  constructor(
    private cdRef: ChangeDetectorRef,
    //private translate: TranslateService,
    private scannerService: ScannerService,
    private authenticationService: AuthenticationService,
    private itemsService: ItemsService,
    private staticDataService: StaticDataService,
    public matDialog: MatDialog,
    private modalService: NgbModal,
  ) {
    this.customOptions = staticDataService.getOwlOptionsThree;
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
    this.fetchPostsData();
  }

	/**
	 * On Destroy
	 */
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
  }

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

  fetchCampaignsData() {
    console.log('this.microcredit');
    this.itemsService.readPrivateMicrocreditCampaignsByStore(this.authenticationService.currentUserValue.user["_id"], '0-0-1')
      .pipe(
        tap(
          data => {
            const seconds = this.seconds;
            console.log(seconds)
            this.microcredit = data.filter((item) => {
              return ((item.status == 'published') &&
                (item.redeemStarts < seconds) &&
                (seconds < item.redeemEnds));
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

  fetchPostsData() {
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
   * Open Modal (Post/Event Info)
   */
  openPost(post: PostEvent) {
    console.log('post modal');
    console.log(post);
    this.singlePost = post;
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

    }, (reason) => {
      console.log('dismissed');

    });
  }

  //Actions to Open Modals from Carousel
  mousedown() {
    this.moved = false;
  }
  mousemove() {
    this.moved = true;
  }
  mouseup(data, type) {
    if (this.moved) {
      //Do nothings
    } else {
      if (type == 'post') {
        this.openPost(data);
      } else {
        //Do nothing
      }
    }
    this.moved = false;
  }

}
