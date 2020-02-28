import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { tap, takeUntil, finalize } from 'rxjs/operators';

import { ItemsService } from '../core/services/items.service';
import { MicrocreditCampaign } from '../core/models/microcredit-campaign.model';
import { SupportService } from './_support.service';

@Component({
  selector: 'app-customer-support',
  templateUrl: './customer-support.component.html',
  styleUrls: ['./customer-support.component.scss']
})
export class CustomerSupportComponent implements OnInit, OnDestroy {
  //Set Basic Variables
  loading: boolean = false;
  private unsubscribe: Subject<any>;
  //Set Content Variables
  campaigns: MicrocreditCampaign[];
  singleMicrocredit: any;

  //Set Child Modals
  @ViewChild('campaignModal', {static: false}) campaignModal;

  constructor(
    public matDialog: MatDialog,
    private modalService: NgbModal,
    private cdRef: ChangeDetectorRef,
    private itemsService: ItemsService,
    private supportService: SupportService
  ) {
    this.supportService.microcreditCampaigns.subscribe(campaigns => this.campaigns = campaigns)
    this.unsubscribe = new Subject();
  }

  ngOnInit() {
    //Get Microcredit Campaigns
    this.fetchMicrocreditData();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
  }

  /**
	* Assets Function On init
	*/

  //Get Microcredit Campaigns
  fetchMicrocreditData() {
    this.itemsService.readAllPublicMicrocreditCampaigns()
      .pipe(
        tap(
          data => {
            this.campaigns = data;
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

  /*
	/ Modals
  */
  
  //Open Microcredit
	openMicrocredit(campaign) {	  
		this.singleMicrocredit = campaign;
		this.modalService.open(
			this.campaignModal, 
			{
				ariaLabelledBy: 'modal-basic-title', 
				size: 'lg', 
				backdropClass: 'fullscrenn-backdrop',
				//backdrop: 'static',
				windowClass: 'fullscrenn-modal',
			}
		).result.then((result) => {
			console.log('closed');
			}, (reason) => {
				console.log('dismissed');
		});
	}


    /*
  openModal(merchant_id: string, campaign_id: string) {
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.height = "350px";
    dialogConfig.width = "600px";
    dialogConfig.data = {
      merchant_id: merchant_id,
      campaign_id: campaign_id
    };
    const modalDialog = this.matDialog.open(SupportMicrocreditComponent, dialogConfig);
  }*/

}
