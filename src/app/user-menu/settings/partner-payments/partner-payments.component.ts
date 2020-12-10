import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators, FormArray, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { first, takeUntil, tap, finalize } from 'rxjs/operators';
import Swal from 'sweetalert2'

// Translate
import { TranslateService } from '@ngx-translate/core';

// Services
import { AuthenticationService } from '../../../core/services/authentication.service';
import { PartnersService } from '../../../core/services/partners.service';
import { MembersService } from '../../../core/services/members.service';
import { StaticDataService } from '../../../core/helpers/static-data.service';
// Environment
import { environment } from '../../../../environments/environment';

import {
  Member,
  Partner,
  PartnerPayment,
  PaymentList,
  GeneralList
} from 'sng-core';



@Component({
  selector: 'app-partner-payments',
  templateUrl: './partner-payments.component.html',
  styleUrls: ['./partner-payments.component.scss']
})
export class PartnerPaymentsComponent implements OnInit, OnDestroy {
  /**
   * Configuration and Static Data
   */
  public subAccessConfig: Boolean[] = environment.subAccess;
  public paymentsList: PaymentList[];

  public initialImage: string = '';

  showPaymentError: boolean = false;

  validator: any;

  /**
   * Forms
   */
  partnerForm: FormGroup;

  submitted: boolean = false;

  loading: boolean = false;
  private unsubscribe: Subject<any>;

  /**
   * @param router: Router
   * @param fb: FormBuilder
   * @param cdRef: ChangeDetectorRef
   * @param translate: TranslateService
   * @param authenticationService: AuthenticationService
   * @param partnersService: PartnersService
   * @param membersService: MembersService
   * @param staticDataService: StaticDataService
  */
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private translate: TranslateService,
    private authenticationService: AuthenticationService,
    private partnersService: PartnersService,
    private membersService: MembersService,
    private staticDataService: StaticDataService,
  ) {
    this.paymentsList = this.staticDataService.getPaymentsList;
    this.validator = this.staticDataService.getValidators.user;
    this.unsubscribe = new Subject();
  }

  /**
   * On Init
   */
  ngOnInit() {
    this.initPartnerForm();
    this.fetchPartnerData();
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
   * Configuration
   */
  configurationOnFetchPartnerData(partner: Partner) {
    if (partner.payments) { // && this.subAccessConfig[1]){
      this.partnerForm.patchValue({
        ...{
          payments: (this.paymentsList.map(item => {
            const obj = (partner.payments).find(o => o.bic === item.bic);
            return { ...item, ...obj };
          })).map(a => a.value)
        }
      });
    }
  };

  fetchPartnerData() {
    this.partnersService.readPartnerInfo(this.authenticationService.currentUserValue.user["_id"])
      .pipe(
        tap(
          data => {
            // this.partnerForm.patchValue(data.payments);
            this.configurationOnFetchPartnerData(data)
          },
          error => {
            Swal.fire(
              this.translate.instant('MESSAGE.ERROR.TITLE'),
              this.translate.instant(error),
              'error'
            );
            this.submitted = false;
          }),
        takeUntil(this.unsubscribe),
        finalize(() => {
          this.loading = false;
          this.cdRef.markForCheck();
        })
      )
      .subscribe();
  }

  initPartnerForm() {
    this.partnerForm = this.fb.group({
      payments: new FormArray([]),
    });

    this.paymentsList.forEach(element => {
      const payment = new FormControl('',
      );
      this.payments.push(payment);
    });
  }

  get payments() {
    return this.partnerForm.get('payments') as FormArray;
  }

  clearPartnerPaymentsValidators() {
    this.paymentsList.forEach((value, i) => {
      this.payments.at(i).clearValidators();
      this.payments.at(i).updateValueAndValidity();
    });
  }

  setPartnerPaymentsValidators() {
    this.paymentsList.forEach((value, i) => {
      this.payments.at(i).setValidators(Validators.required);
      this.payments.at(i).updateValueAndValidity();
    });
  }


  setPaymentsValues(controls: { [key: string]: AbstractControl }) {
    var payments: PartnerPayment[] = [];
    this.paymentsList.forEach((value, i) => {
      if (controls.payments.value[i]) {
        payments.push({
          bic: this.paymentsList[i].bic,
          name: this.paymentsList[i].name,
          value: controls.payments.value[i]
        })
      }
    });
    return payments;
  }

  onPartnerSubmit() {
    if (this.submitted || this.loading) return;

    const controls = this.partnerForm.controls;
    const partner_payments: PartnerPayment[] = this.setPaymentsValues(controls);
    /** check form */
    if (!partner_payments.length) {

      (partner_payments.length) ? this.clearPartnerPaymentsValidators() : this.setPartnerPaymentsValidators();
      this.showPaymentError = (partner_payments.length === 0)

      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );

      this.loading = false; this.submitted = false;
      return;
    }

    // if (this.partnerForm.invalid) {
    //   Object.keys(controls).forEach(controlName =>
    //     controls[controlName].markAsTouched()
    //   );
    //   return;
    // }

    this.loading = true;

    this.partnersService.updatePartnerPayments(this.authenticationService.currentUserValue.user["_id"], partner_payments)
      .pipe(
        tap(
          data => {

            this.authenticationService.updateCurrentUser(data.name, data.imageURL);
            Swal.fire({
              title: this.translate.instant('MESSAGE.SUCCESS.TITLE'),
              text: this.translate.instant('MESSAGE.SUCCESS.PROFILE_UPDATED'),
              icon: 'success',
              timer: 2500
            });
            // .then((result) => {
            //   this.router.navigate(['/']);
            // });
          },
          error => {
            console.log(error);
            Swal.fire(
              this.translate.instant('MESSAGE.ERROR.TITLE'),
              this.translate.instant(error),
              'error'
            );
          }),
        takeUntil(this.unsubscribe),
        finalize(() => {
          this.submitted = false;
          this.loading = false;
          this.cdRef.markForCheck();
        })
      )
      .subscribe();
  }

  /**
    * Checking control validation
    *
    * @param controlName: string => Equals to formControlName
    * @param validationType: string => Equals to valitors name
    */
  isPartnerControlHasError(controlName: string, validationType: string): boolean {
    const control = this.partnerForm.controls[controlName];
    if (!control) {
      return false;
    }

    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }
}
