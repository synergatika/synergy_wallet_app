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

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss'],
  // providers: [LoyaltyLocalService]
})
export class ScannerComponent implements OnInit, OnDestroy {

  public configAccess: Boolean[] = environment.access;

  moved: boolean;
  posts: PostEvent[];
  singlePost: PostEvent;
  singlePartner = false;

  public offers: ScannerInterface["Offer"][];
  public microcredit: ScannerInterface["MicrocreditCampaign"][];

  loading: boolean = false;
  private unsubscribe: Subject<any>;

  @ViewChild('postModal', { static: false }) postModal;
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      940: {
        items: 3
      }
    },
    margin: 30,
    nav: true
  }

  constructor(
    private cdRef: ChangeDetectorRef,
    //private translate: TranslateService,
    private scannerService: ScannerService,
    private authenticationService: AuthenticationService,
    private itemsService: ItemsService,
    public matDialog: MatDialog,
    private modalService: NgbModal,
  ) {
    this.scannerService.offers.subscribe(offers => this.offers = offers)
    this.scannerService.microcredit.subscribe(microcredit => this.microcredit = microcredit)
    this.unsubscribe = new Subject();
  }

	/**
	 * On Init
	 */
  ngOnInit() {
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

  openModalA() {
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.width = "600px";

    // https://material.angular.io/components/dialog/overview
    const modalDialog = this.matDialog.open(ScanLoyaltyComponent, dialogConfig);
  }

  openModalB(offer_id: string) {
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.width = "600px";
    dialogConfig.data = {
      offer_id: offer_id//'5e3298c9ba608903716b09c2'
    };
    // https://material.angular.io/components/dialog/overview
    const modalDialog = this.matDialog.open(ScanOffersComponent, dialogConfig);
  }

  openModalC(campaign_id: string) {
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.width = "600px";
    dialogConfig.data = {
      campaign_id: campaign_id//'5e3298c9ba608903716b09c2'
    };
    // https://material.angular.io/components/dialog/overview
    const modalDialog = this.matDialog.open(ScanMicrocreditComponent, dialogConfig);
  }

  fetchCampaignsData() {
    console.log('this.microcredit');
    this.itemsService.readPrivateMicrocreditCampaignsByStore(this.authenticationService.currentUserValue.user["_id"], '0-0-0')
      .pipe(
        tap(
          data => {
            this.microcredit = data;

            console.log(this.microcredit);
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

  fetchOffersData() {
    this.itemsService.readOffersByStore(this.authenticationService.currentUserValue.user["_id"], '0-0-0')
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

  openPost(post) {
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

  mousedown() {
    this.moved = false;
  }

  mousemove() {
    this.moved = true;
  }

  mouseup(data) {
    if (this.moved) {
      console.log('moved')
    } else {
      console.log('not moved');
      console.log(data);
      this.openPost(data);
      //this.router.navigate(['/post', {id: mercId , id2: offerId}]);

    }
    this.moved = false;
  }

}
