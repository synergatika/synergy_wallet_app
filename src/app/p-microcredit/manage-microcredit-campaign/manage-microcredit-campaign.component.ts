import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { tap, takeUntil, finalize } from 'rxjs/operators';
//import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { AddSupportComponent } from './add-support/add-support.component';
// import { MatSort } from '@angular/material/sort';
// import { MatTableDataSource } from '@angular/material/table';
// import { MatCheckboxChange } from '@angular/material';
import { MatDialog, MatDialogConfig, MatSort, MatTableDataSource, MatCheckboxChange } from '@angular/material';
// Services, Models & Interfaces
import { TranslateService } from '@ngx-translate/core';
import { MicrocreditSupport } from 'src/app/core/models/microcredit_support.model';
import { ItemsService } from '../../core/services/items.service';
import { MicrocreditService } from '../../core/services/microcredit.service';
import { AuthenticationService } from '../../core/services/authentication.service';
// Local Services, Models & Interfaces
import { SupportService } from './_support.service';
import { SupportInterface } from './_support.interface';
// Swal Alert
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-microcredit-campaign',
  templateUrl: './manage-microcredit-campaign.component.html',
  styleUrls: ['./manage-microcredit-campaign.component.scss']
})
export class ManageMicrocreditCampaignComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  seconds: number = 0;
  outOfPeriod: boolean = false;

  loading: boolean = false;
  private unsubscribe: Subject<any>;

  private campaign_id: string;
  public campaigns: SupportInterface["MicrocreditCampaign"][];
  public current: SupportInterface["MicrocreditCampaign"];
  public supports: MicrocreditSupport[];

  displayedColumns: string[] = ['payment_id', 'createdAt', 'method', 'initialTokens', 'status'];
  dataSource: MatTableDataSource<any>;

  constructor(
    public matDialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private itemsService: ItemsService,
    private microcreditService: MicrocreditService,
    private authenticationService: AuthenticationService,
    private translate: TranslateService,
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
    const now = new Date();
    this.seconds = parseInt(now.getTime().toString());

    this.initializeCurrentCampaignData();
    this.fetchSupportsData();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
  }

  fetchSupportsData() {
    this.microcreditService.readAllSupportsByMicrocreditCampaign(this.authenticationService.currentUserValue.user["_id"], this.campaign_id)
      .pipe(
        tap(
          data => {
            this.supports = data;
            this.dataSource = new MatTableDataSource(data);
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
            this.supportService.changeMicrocreditCurrent(this.current);

            if ((this.seconds < this.current.startsAt) || (this.seconds > this.current.expiresAt)) this.outOfPeriod = true;
            console.log("Expired: ", this.outOfPeriod);
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

  changeSupportState(support_id: string, event: MatCheckboxChange) {
    this.loading = true;

    this.microcreditService.confirmPayment(this.authenticationService.currentUserValue.user["_id"], this.campaign_id, support_id)
      .pipe(
        tap(
          data => {
            this.fetchSupportsData();
            Swal.fire({
              title: this.translate.instant('MESSAGE.SUCCESS.TITLE'),
              text: this.translate.instant('MESSAGE.SUCCESS.CAMPAIGN_UPDATED'),
              icon: 'success',
              timer: 2500
            })
          },
          error => {
            event.source.checked = (this.supports[this.supports.map((x) => { return x.support_id; }).
              indexOf(support_id)].status === 'order') ?
              false : true;
            Swal.fire(
              this.translate.instant('MESSAGE.ERROR.TITLE'),
              this.translate.instant(error),
              'error'
            );
          }),
        takeUntil(this.unsubscribe),
        finalize(() => {
          this.loading = false;
          this.cdRef.markForCheck();
        })
      )
      .subscribe();
  }

  openModal() {
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.height = "350px";
    dialogConfig.width = "600px";
    dialogConfig.data = {
      campaign_id: this.campaign_id,//'5e3298c9ba608903716b09c2'
    };
    // https://material.angular.io/components/dialog/overview
    const modalDialog = this.matDialog.open(AddSupportComponent, dialogConfig);
    modalDialog.afterClosed().subscribe(value => {
      if (value) this.fetchSupportsData();
    });
  }

  closeModal(event) {
    console.log("NOOO", event);
    this.fetchSupportsData();
  }
}
