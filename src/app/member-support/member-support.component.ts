import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Subject, Subscription } from 'rxjs';
import { tap, takeUntil, finalize } from 'rxjs/operators';

import { ItemsService } from '../core/services/items.service';
import { MicrocreditCampaign } from '../core/models/microcredit_campaign.model';
import { SupportService } from './_support.service';

@Component({
  selector: 'app-member-support',
  templateUrl: './member-support.component.html',
  styleUrls: ['./member-support.component.scss']
})
export class MemberSupportComponent implements OnInit, OnDestroy {
  //Set Child Modals
  @ViewChild('campaignModal', { static: false }) campaignModal;

  //Set Content Variables
  public campaigns: MicrocreditCampaign[] = [];
  singleMicrocredit: MicrocreditCampaign;

  counter: number = 0;

  //Set Basic Variables
  loading: boolean = false;
  private unsubscribe: Subject<any>;
  // private subscription: Subscription = new Subscription;

  constructor(
    public matDialog: MatDialog,
    private modalService: NgbModal,
    private cdRef: ChangeDetectorRef,
    private itemsService: ItemsService,
    private supportService: SupportService
  ) {
    //  this.subscription.add(this.supportService.microcreditCampaigns.subscribe(campaigns => this.campaigns = campaigns));
    this.unsubscribe = new Subject();
  }

  /**
   * On Init
   */
  ngOnInit() {
    this.fetchMicrocreditData(this.counter);
  }

  /**
   * On destroy
   */
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    //   this.subscription.unsubscribe();
    this.loading = false;
  }

  /**
   * Randomize
   */
  shuffle(array: MicrocreditCampaign[]) {
    return array.sort(() => Math.random() - 0.5);
  }

  /**
	* Assets Function On Init
	*/

  //Get Microcredit Campaigns
  fetchMicrocreditData(counter: number) {
    this.itemsService.readAllPrivateMicrocreditCampaigns(`6-${counter.toString()}-1`)
      .pipe(
        tap(
          data => {
            // this.campaigns = this.shuffle(data);
            this.campaigns = this.campaigns.concat(data);
            this.supportService.changeMicrocreditCampaigns(this.campaigns);
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

  onScroll() {
    this.counter = this.counter + 1;
    this.fetchMicrocreditData(this.counter);
    console.log('scrolled!!');
    //	this.offers = this.offers.concat(this.offers);
    this.cdRef.markForCheck();
  }

  /*
	/ Modals
  */

  //Open Microcredit
  openMicrocredit(campaign: MicrocreditCampaign) {
    this.singleMicrocredit = campaign;
    this.modalService.open(
      this.campaignModal, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
      backdropClass: 'fullscrenn-backdrop',
      //backdrop: 'static',
      windowClass: 'fullscreen-modal',
    }).result.then((result) => {
      console.log('closed');
    }, (reason) => {
      console.log('dismissed');
    });
  }

}
