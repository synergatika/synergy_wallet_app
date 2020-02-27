import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { tap, takeUntil, finalize } from 'rxjs/operators';

import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { AddSupportComponent } from '../add-support/add-support.component';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

// Services
import { ItemsService } from '../../core/services/items.service';
import { MicrocreditService } from '../../core/services/microcredit.service';
import { AuthenticationService } from '../../core/services/authentication.service';
// Models
import { MicrocreditCampaign } from '../../core/models/microcredit-campaign.model';
import { MicrocreditSupport } from 'src/app/core/models/microcredit-support.model';
import { SupportService } from '../_support.service';
import { SupportInterface } from '../_support.interface';

@Component({
  selector: 'app-edit-microcredit-campaign',
  templateUrl: './edit-microcredit-campaign.component.html',
  styleUrls: ['./edit-microcredit-campaign.component.scss']
})
export class EditMicrocreditCampaignComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  
  loading: boolean = false;
  stateUpdateLoading: boolean = false;
  private unsubscribe: Subject<any>;

  campaign_id: string;
  unpaidSupports: MicrocreditSupport[];
  paidSupports: MicrocreditSupport[];
  campaigns: MicrocreditCampaign[];
  current: MicrocreditCampaign;
  groupedSupports: Array<any> = [];
  to_pay: string[] = [];
  to_unpay: string[] = [];
  displayedColumns: string[] = ['backer_id', 'initialTokens', 'status'];
  dataSource:any;
  
  constructor(
    public matDialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private itemsService: ItemsService,
    private microcreditService: MicrocreditService,
    private authenticationService: AuthenticationService,
    private supportService: SupportService
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.campaign_id = params['_id'];
    });
    this.supportService.microcreditCampaigns.subscribe(campaigns => this.campaigns = campaigns);
    this.supportService.microcreditCurrent.subscribe(current => this.current = current);
    this.unsubscribe = new Subject();
  }

  ngOnInit() {
    this.initializeCurrentCampaignData();
    this.fetchSupportsData();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
  }

  fetchSupportsData() {
	 // console.log('this.campaign_id');
	 // console.log(this.campaign_id);
    this.microcreditService.readAllSupportsByMicrocreditCampaign(this.authenticationService.currentUserValue.user["_id"], this.campaign_id)
      .pipe(
        tap(
          data => {
            console.log(data);
            const groupedSupports = this.groupBy(data, 'status'); // => {orange:[...], banana:[...]}
            this.paidSupports = groupedSupports.confirmation;
            this.unpaidSupports = groupedSupports.order;
			if (this.unpaidSupports) {
				this.groupedSupports = this.groupedSupports.concat(this.unpaidSupports);
			};
			if (this.paidSupports) {
				this.groupedSupports = this.groupedSupports.concat(this.paidSupports);
			};
			console.log(groupedSupports);
			console.log(this.groupedSupports);
			this.dataSource = new MatTableDataSource(this.groupedSupports);
			this.dataSource.sort = this.sort;
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

  initializeCurrentCampaignData() {   	
	this.itemsService.readCampaign(this.authenticationService.currentUserValue.user["_id"], this.campaign_id)
		  .pipe(
			tap(
			  data => {
				this.current = data;
				console.log('this.current');
				console.log(this.current);
				this.supportService.changeMicrocreditCurrent(this.current);		
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
	/*const currentCampaign = this.campaigns[this.campaigns.map(function (e) { return e.campaign_id; }).indexOf(this.campaign_id)];
    this.current = currentCampaign;	*/
  }
  
  changeSupportState (backer, state) {
	   //console.log(backer);
	   //console.log(state.checked);
	   let pay: string;
	  //return;
    if (state.checked == true) {
     pay ="pay";
    } else {
      pay = 'unpay';
    }
	this.stateUpdateLoading = true;
	return;
	this.microcreditService.confirmPayment(this.authenticationService.currentUserValue.user["_id"], this.campaign_id, pay, backer)
      .pipe(
        tap(
          data => {
			console.log('confirmPayment data');
            console.log(data);
			this.stateUpdateLoading = false;
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
  
  onToPayCheckBoxChange(backer) {
    if (this.to_pay.indexOf(backer) < 0) {
      this.to_pay.push(backer);
    } else {
      this.to_pay.splice(this.to_pay.indexOf(backer), 1);
    }
    console.log(this.to_pay);
  }

  onToUnpayCheckBoxChange(backer) {
    if (this.to_unpay.indexOf(backer) < 0) {
      this.to_unpay.push(backer);
    } else {
      this.to_unpay.splice(this.to_unpay.indexOf(backer), 1);
    }
    console.log(this.to_unpay);
  }

  groupBy(arr, property) {
    return arr.reduce(function (memo, x) {
      if (!memo[x[property]]) { memo[x[property]] = []; }
      memo[x[property]].push(x);
      return memo;
    }, {});
  }

  openModal() {
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.height = "350px";
    dialogConfig.width = "600px";
    dialogConfig.data = {
      campaign_id: this.campaign_id//'5e3298c9ba608903716b09c2'
    };
    // https://material.angular.io/components/dialog/overview
    const modalDialog = this.matDialog.open(AddSupportComponent, dialogConfig);
  }

  /*onSubmit() {
    this.microcreditService.confirmPayment(this.authenticationService.currentUserValue.user["_id"], this.campaign_id, 'pay', this.to_pay)
      .pipe(
        tap(
          data => {
            console.log(data);
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

    this.microcreditService.confirmPayment(this.authenticationService.currentUserValue.user["_id"], this.campaign_id, 'unpay', this.to_unpay)
      .pipe(
        tap(
          data => {
            console.log(data);
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
  }*/
}
