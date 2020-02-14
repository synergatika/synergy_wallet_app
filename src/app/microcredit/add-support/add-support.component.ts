import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef, Inject } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { Subject } from 'rxjs';
import { tap, takeUntil, finalize } from 'rxjs/operators';
// Global Services
import { MicrocreditService } from '../../core/services/microcredit.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ItemsService } from '../../core/services/items.service';

// Local Services
import { SupportService } from '../_support.service';

// Local Models & Interfaces
import { SupportInterface } from '../_support.interface';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { WizardComponent } from 'angular-archwizard';

@Component({
  selector: 'app-add-support',
  templateUrl: './add-support.component.html',
  styleUrls: ['./add-support.component.scss']
})
export class AddSupportComponent implements OnInit, OnDestroy {

  @ViewChild(WizardComponent, { static: true })
  public wizard: WizardComponent;

  campaign_id: string;

  loading: boolean = false;
  private unsubscribe: Subject<any>;

  user: SupportInterface["User"];
  campaign: SupportInterface["MicrocreditCampaign"];
  support: SupportInterface["MicrocreditSupport"];

  submitted: boolean = false;

  showIdentifierForm = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private microcreditService: MicrocreditService,
    private itemsService: ItemsService,
    private authenticationService: AuthenticationService,
    private supportService: SupportService,
    public dialogRef: MatDialogRef<AddSupportComponent>, @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.campaign_id = this.data.campaign_id;
    this.supportService.microcreditSupport.subscribe(support => this.support = support);
    this.supportService.microcreditCurrent.subscribe(campaign => this.campaign = campaign);
    this.supportService.user.subscribe(user => this.user = user);
    this.unsubscribe = new Subject();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
  }

  initializeSupportData() {
    this.support.campaign_id = this.campaign_id;
    this.supportService.changeMicrocreditSupport(this.support);
  }

  onSuccessScanIdentifier(event: string) {
    this.onNextStep();
    // this.fetchBackerData();
  }

  onSubmitIdentifierForm(event: string) {
    this.onNextStep();
    // this.fetchBackerData();
  }

  onShowIdentifierFormChange() {
    this.showIdentifierForm = !this.showIdentifierForm;
  }

  onSubmitAmountForm(event: number) {
    const identifier = this.user.identifier_scan || this.user.identifier_form;
    const earnTokens = {
      _to: (identifier).toLowerCase(),
      _amount: this.support.amount,
    };

    this.microcreditService.earnTokensByMerchant(this.authenticationService.currentUserValue.user["_id"], this.campaign_id, earnTokens._to, earnTokens._amount, (this.support.paid) ? 'atStore' : 'none', this.support.paid)
      .pipe(
        tap(
          data => {
            this.onNextStep();
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
  }

  onNextStep() {
    this.wizard.goToNextStep();
  }

  onPreviousStep() {
    this.wizard.goToPreviousStep();
  }

  onFinalStep(event) {
    this.dialogRef.close();
  }

}
