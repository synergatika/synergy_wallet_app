import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil, finalize, tap } from 'rxjs/operators';

// Swal Alert
import Swal from 'sweetalert2';

// Translate
import { TranslateService } from '@ngx-translate/core';

// Services
import { ItemsService } from '../../core/services/items.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { StaticDataService } from '../../core/services/static-data.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-new-partner',
  templateUrl: './new-partner.component.html',
  styleUrls: ['./new-partner.component.scss']
})
export class NewPartnerComponent implements OnInit, OnDestroy {

  public subAccessConfig: Boolean[] = environment.subAccess;
  public paymentsList: any[];

  sectorList: any;
  validator: any;

  fileData: File = null;
  previewUrl: any = null;
  showImageError: boolean = false;
  showPaymentError: boolean = false;

  submitForm: FormGroup;
  submitted: boolean = false;

  loading: boolean = false;
  private unsubscribe: Subject<any>;

  /**
    * Component constructor
    *
    * @param cdRef: ChangeDetectorRef
    * @param fb: FormBuilder
    * @param router: Router
    * @param translate: TranslateService
    * @param authenticationService: AuthenticationService,
    * @param staticDataService: StaticDataService,
    */
  constructor(
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private router: Router,
    private translate: TranslateService,
    private authenticationService: AuthenticationService,
    private staticDataService: StaticDataService,
  ) {
    this.paymentsList = this.staticDataService.getPaymentsList;
    this.sectorList = this.staticDataService.getSectorList;
    this.validator = this.staticDataService.getUserValidator;
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
      email: ['', Validators.compose([
        Validators.required,
        Validators.email
      ])
      ],
      name: ['', Validators.compose([
        Validators.required,
      ])
      ],
      subtitle: [''],
      description: ['', Validators.compose([
        Validators.required,
      ])
      ],
      sector: ['', Validators.compose([
        Validators.required,
      ])
      ],

      /** Form Groups Related with Partner's Address */
      timetable: [''],
      street: ['', Validators.compose([
        Validators.required,
      ])
      ],
      postCode: ['', Validators.compose([
        Validators.required,
      ])
      ],
      city: ['', Validators.compose([
        Validators.required,
      ])
      ],
      lat: ['', Validators.compose([
        Validators.required,
      ])
      ],
      long: ['', Validators.compose([
        Validators.required,
      ])
      ],

      /** Form Groups Related with Partner's Contact */
      phone: ['', Validators.compose([
        Validators.required
      ])
      ],
      websiteURL: ['', Validators.compose([
        Validators.required
      ])
      ],

      /** Form Groups Related with Partner's Payments */
      payments: new FormArray([]),
      // nationalBank: [''],
      // pireausBank: [''],
      // eurobank: [''],
      // alphaBank: [''],
      // paypal: [''],
    });

    (this.subAccessConfig[0]) ? this.clearPartnerAddressValidators(this.submitForm) : '';
    (this.subAccessConfig[1]) ? this.clearPartnerContactValidators(this.submitForm) : '';
    //  (this.subAccessConfig[2]) ? this.clearPartnerPaymentsValidators(this.submitForm) : '';

    this.paymentsList.forEach(element => {
      const payment = new FormControl('');
      this.payments.push(payment);
    });
  }

  get payments() {
    return this.submitForm.get('payments') as FormArray;
  }

  /**
   * Set / Clear Validators 
   */
  setPartnerPaymentsValidators() {
    this.paymentsList.forEach((value, i) => {
      this.payments.at(i).setValidators(Validators.required);
      this.payments.at(i).updateValueAndValidity();
    });
  }

  clearPartnerAddressValidators(form: FormGroup) {
    form.get('timetable').clearValidators();
    form.get('timetable').updateValueAndValidity();

    form.get('street').clearValidators();
    form.get('street').updateValueAndValidity();
    form.get('postCode').clearValidators();
    form.get('postCode').updateValueAndValidity();
    form.get('city').clearValidators();
    form.get('city').updateValueAndValidity();

    form.get('lat').clearValidators();
    form.get('lat').updateValueAndValidity();
    form.get('long').clearValidators();
    form.get('long').updateValueAndValidity();
  }

  clearPartnerContactValidators(form: FormGroup) {
    form.get('phone').clearValidators();
    form.get('phone').updateValueAndValidity();
    form.get('websiteURL').clearValidators();
    form.get('websiteURL').updateValueAndValidity();
  }

  clearPartnerPaymentsValidators() {
    this.paymentsList.forEach((value, i) => {
      this.payments.at(i).clearValidators();
      this.payments.at(i).updateValueAndValidity();
    });
  }

  /**
   * Image Upload
   */
  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    this.preview();
  }

  preview() {
    if (this.fileData == null) {
      this.onImageCancel();
      return;
    }
    this.showImageError = false;

    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      if (this.previewUrl !== reader.result) {
        this.cdRef.markForCheck();
      }
      this.previewUrl = reader.result;
    }
  }

  onImageCancel() {
    this.previewUrl = null;
    this.fileData = null;
    this.showImageError = true;
    this.cdRef.markForCheck();
  }

  setPaymentsValues(controls: any) {
    var payments: any[] = [];
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

  onSubmit() {
    if (this.submitted || this.loading) return;

    const controls = this.submitForm.controls;
    const partner_payments: any[] = this.setPaymentsValues(controls);
    /** check form */
    if (this.submitForm.invalid || !this.fileData || !partner_payments.length) {
      (partner_payments.length) ? this.clearPartnerPaymentsValidators() : this.setPartnerPaymentsValidators();
      this.showPaymentError = (partner_payments.length === 0)
      this.showImageError = (!this.fileData);

      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    this.submitted = true;
    this.loading = true;

    const formData = new FormData();
    formData.append('imageURL', this.fileData);
    formData.append('email', (controls.email.value).toLowerCase());
    formData.append('name', controls.name.value);

    formData.append('subtitle', controls.subtitle.value);
    formData.append('description', controls.description.value);
    formData.append('timetable', controls.timetable.value);

    formData.append('sector', controls.sector.value);
    formData.append('street', controls.street.value);
    formData.append('postCode', controls.postCode.value);
    formData.append('city', controls.city.value);
    formData.append('lat', controls.lat.value);
    formData.append('long', controls.long.value);
    formData.append('phone', controls.phone.value);
    formData.append('websiteURL', controls.websiteURL.value);

    formData.append('payments', JSON.stringify(partner_payments));
    // formData.append('nationalBank', controls.nationalBank.value);
    // formData.append('pireausBank', controls.pireausBank.value);
    // formData.append('eurobank', controls.eurobank.value);
    // formData.append('alphaBank', controls.alphaBank.value);
    // formData.append('paypal', controls.paypal.value);

    this.authenticationService.register_partner(formData)
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
  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.submitForm.controls[controlName];
    if (!control) {
      return false;
    }

    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }
}
