import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, finalize, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { FormControl, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

/**
 * Environment
 */
import { environment } from '../../../../environments/environment';

/**
 * Services
 */
import { StaticDataService } from '../../../core/helpers/static-data.service';
import { AuthenticationService } from '../../../core/services/authentication.service';

import {
  PaymentList,
  GeneralList
} from 'sng-core';

@Component({
  selector: 'app-new-partner',
  templateUrl: './new-partner.component.html',
  styleUrls: ['./new-partner.component.scss']
})
export class NewPartnerComponent implements OnInit, OnDestroy {

  /**
   * Configuration and Static Data
   */
  public subAccessConfig: Boolean[] = environment.subAccess;
  // public paymentsList: PaymentList[];
  public sectorList: GeneralList[];
  validator: any;

  /**
   * Forms
   */
  submitForm: FormGroup;
  submitted: boolean = false;

  /**
   * File Variables
   */
  fileData: File = null;
  previewUrl: any = null;

  /**
   * Form Errors
   */
  showImageError: boolean = false;
  showPaymentError: boolean = false;

  loading: boolean = false;
  private unsubscribe: Subject<any>;

  /**
    * Component Constructor
    *
    * @param cdRef: ChangeDetectorRef
    * @param fb: FormBuilder
    * @param router: Router
    * @param translate: TranslateService
    * @param staticDataService: StaticDataService
    * @param authenticationService: AuthenticationService
    */
  constructor(
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private router: Router,
    private translate: TranslateService,
    private staticDataService: StaticDataService,
    private authenticationService: AuthenticationService
  ) {
    // this.paymentsList = this.staticDataService.getPaymentsList;
    this.sectorList = this.staticDataService.getSectorList;
    this.validator = this.staticDataService.getValidators.user;
    this.unsubscribe = new Subject();
  }

  /**
   * On Init
   */
  ngOnInit() {
    this.initForm();
  }

  /**
   * On destroy
   */
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
  }

  initForm() {
    this.submitForm = this.fb.group({

      /** Form Groups Related with Partner's Basic Info */
      email: ['', Validators.compose([
        Validators.required,
        Validators.email,
        Validators.minLength(this.validator.email.minLength),
        Validators.maxLength(this.validator.email.maxLength)
      ])
      ],
      name: ['', Validators.compose([
        Validators.required,
        Validators.minLength(this.validator.name.minLength),
        Validators.maxLength(this.validator.name.maxLength)])
      ],
      // subtitle: ['', Validators.compose([
      //   Validators.minLength(this.validator.subtitle.minLength),
      //   Validators.maxLength(this.validator.subtitle.maxLength)])
      // ],
      // description: ['', Validators.compose([
      //   Validators.required,
      //   Validators.minLength(this.validator.description.minLength),
      //   Validators.maxLength(this.validator.description.maxLength)])
      // ],
      sector: ['', Validators.compose([
        Validators.required,
      ])
      ],
      // timetable: [''],

      /** Form Groups Related with Partner's Address */
      // street: ['', Validators.compose([
      //   Validators.required,
      //   Validators.minLength(this.validator.address.street.minLength),
      //   Validators.maxLength(this.validator.address.street.maxLength)])
      // ],
      // postCode: ['', Validators.compose([
      //   Validators.required,
      //   Validators.minLength(this.validator.address.postCode.minLength),
      //   Validators.maxLength(this.validator.address.postCode.maxLength)])
      // ],
      // city: ['', Validators.compose([
      //   Validators.required,
      //   Validators.minLength(this.validator.address.city.minLength),
      //   Validators.maxLength(this.validator.address.city.maxLength)])
      // ],
      // lat: ['', Validators.compose([
      //   Validators.required,
      //   Validators.minLength(this.validator.address.coordinates.minLength),
      //   Validators.maxLength(this.validator.address.coordinates.maxLength),
      //   Validators.min(this.validator.address.lat.minValue),
      //   Validators.max(this.validator.address.lat.maxValue)
      // ])
      // ],
      // long: ['', Validators.compose([
      //   Validators.required,
      //   Validators.minLength(this.validator.address.coordinates.minLength),
      //   Validators.maxLength(this.validator.address.coordinates.maxLength),
      //   Validators.min(this.validator.address.long.minValue),
      //   Validators.max(this.validator.address.long.maxValue)])
      // ],

      /** Form Groups Related with Partner's Contact */
      // phone: ['', Validators.compose([
      //   Validators.required,
      //   Validators.minLength(this.validator.contact.phone.minLength),
      //   Validators.maxLength(this.validator.contact.phone.maxLength)
      // ])
      // ],
      // websiteURL: ['', Validators.compose([
      //   Validators.required,
      //   Validators.minLength(this.validator.contact.websiteURL.minLength),
      //   Validators.maxLength(this.validator.contact.websiteURL.maxLength),
      // ])
      // ],

      /** Form Groups Related with Partner's Payments */
      // payments: new FormArray([]),
    });

    // if (!this.subAccessConfig[0]) this.clearPartnerAddressValidators(this.submitForm);
    // if (!this.subAccessConfig[1]) this.clearPartnerContactValidators(this.submitForm);

    // this.paymentsList.forEach(element => {
    //   const payment = new FormControl('');
    //   this.payments.push(payment);
    // });
  }

  // get payments() {
  //   return this.submitForm.get('payments') as FormArray;
  // }

  /**
   * Set/Clear Validators
   */
  // clearPartnerAddressValidators(form: FormGroup) {
  //   form.get('street').clearValidators();
  //   form.get('street').updateValueAndValidity();
  //   form.get('postCode').clearValidators();
  //   form.get('postCode').updateValueAndValidity();
  //   form.get('city').clearValidators();
  //   form.get('city').updateValueAndValidity();

  //   form.get('lat').clearValidators();
  //   form.get('lat').updateValueAndValidity();
  //   form.get('long').clearValidators();
  //   form.get('long').updateValueAndValidity();

  //   form.get('timetable').clearValidators();
  //   form.get('timetable').updateValueAndValidity();
  // }

  // clearPartnerContactValidators(form: FormGroup) {
  //   form.get('phone').clearValidators();
  //   form.get('phone').updateValueAndValidity();
  //   form.get('websiteURL').clearValidators();
  //   form.get('websiteURL').updateValueAndValidity();
  // }

  // setPartnerPaymentsValidators() {
  //   this.paymentsList.forEach((value, i) => {
  //     this.payments.at(i).setValidators(Validators.required);
  //     this.payments.at(i).updateValueAndValidity();
  //   });
  // }

  // clearPartnerPaymentsValidators() {
  //   this.paymentsList.forEach((value, i) => {
  //     this.payments.at(i).clearValidators();
  //     this.payments.at(i).updateValueAndValidity();
  //   });
  // }

  /**
   * Image Upload
   */
  // fileProgress(fileInput: any) {
  //   this.fileData = <File>fileInput.target.files[0];
  //   this.preview();
  // }

  // preview() {
  //   if (this.fileData == null) {
  //     this.onImageCancel();
  //     return;
  //   }
  //   this.showImageError = false;

  //   var mimeType = this.fileData.type;
  //   if (mimeType.match(/image\/*/) == null) {
  //     return;
  //   }

  //   var reader = new FileReader();
  //   reader.readAsDataURL(this.fileData);
  //   reader.onload = (_event) => {
  //     if (this.previewUrl !== reader.result) {
  //       this.cdRef.markForCheck();
  //     }
  //     this.previewUrl = reader.result;
  //   }
  // }

  // onImageCancel() {
  //   this.previewUrl = null;
  //   this.fileData = null;
  //   this.showImageError = true;
  //   this.cdRef.markForCheck();
  // }

  // setPaymentsValues(controls: any) {
  //   var payments: PartnerPayment[] = [];
  //   this.paymentsList.forEach((value, i) => {
  //     if (controls.payments.value[i]) {
  //       payments.push({
  //         bic: this.paymentsList[i].bic,
  //         name: this.paymentsList[i].name,
  //         value: controls.payments.value[i]
  //       })
  //     }
  //   });
  //   return payments;
  // }

  /**
   * On Submit Form
   */
  onSubmit() {
    if (this.loading) return;

    const controls = this.submitForm.controls;
    // const partner_payments: PartnerPayment[] = this.setPaymentsValues(controls);
    /** check form */
    if (this.submitForm.invalid) {// || !this.fileData) {
      //|| !partner_payments.length) {
      //(partner_payments.length) ? this.clearPartnerPaymentsValidators() : this.setPartnerPaymentsValidators();
      //this.showPaymentError = (partner_payments.length === 0)
      //    this.showImageError = (!this.fileData);

      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }
    this.loading = true;

    const newUser = {
      fullname: controls.name.value,
      email: (controls.email.value).toLowerCase(),
      sector: controls.sector.value
    };

    // const formData = new FormData();
    // formData.append('imageURL', this.fileData);
    // formData.append('email', (controls.email.value).toLowerCase());
    // formData.append('name', controls.name.value);
    // formData.append('subtitle', controls.subtitle.value);
    // formData.append('description', controls.description.value);
    // formData.append('timetable', controls.timetable.value);

    // formData.append('sector', controls.sector.value);
    // formData.append('street', controls.street.value);
    // formData.append('postCode', controls.postCode.value);
    // formData.append('city', controls.city.value);
    // formData.append('lat', controls.lat.value);
    // formData.append('long', controls.long.value);

    // formData.append('phone', controls.phone.value);
    // formData.append('websiteURL', controls.websiteURL.value);

    // formData.append('payments', JSON.stringify(partner_payments));

    this.authenticationService.register_partner(newUser.fullname, newUser.email, newUser.sector)
      .pipe(
        tap(
          data => {
            Swal.fire({
              title: this.translate.instant('MESSAGE.SUCCESS.TITLE'),
              text: this.translate.instant('MESSAGE.SUCCESS.PARTNER_CREATED'),
              icon: 'success',
              timer: 2500
            }).then((result) => {
              this.router.navigate(['/']);
            });
          },
          error => {
            console.log("Error", error);
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

  /**
    * Checking control validation
    *
    * @param controlName: string => Equals to formControlName
    * @param validationType: string => Equals to valitors name
    */
  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.submitForm.controls[controlName];
    if (!control) {
      return false;
    }

    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }
}
