import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { first, takeUntil, finalize, tap } from 'rxjs/operators';
import Swal from 'sweetalert2'
import { Subject } from 'rxjs';

// Translate
import { TranslateService } from '@ngx-translate/core';

// Services
import { AuthenticationService } from '../../core/services/authentication.service';
import { MerchantsService } from '../../core/services/merchants.service';
import { CustomersService } from '../../core/services/customers.service';

// Models
import { Merchant } from '../../core/models/merchant.model';
import { Customer } from '../../core/models/customer.model';
import { Router } from '@angular/router';

import { StaticDataService } from '../../core/services/static-data.service';


@Component({
  selector: 'app-personal-information',
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.scss']
})
export class PersonalInformationComponent implements OnInit, OnDestroy {
  @ViewChild('fileInputMerch', { static: false }) imageInputMerch: ElementRef;
  @ViewChild('fileInput', { static: false }) imageInput: ElementRef;

  public access: string = '';
  public initialImage: string = '';

  sectorList: any;
  validator: any;

  customerForm: FormGroup;
  merchantForm: FormGroup;
  submitted: boolean = false;

  fileData: File = null;
  previewUrl: any = null;
  originalImage: boolean = true;

  loading: boolean = false;
  private unsubscribe: Subject<any>;

  /**
   * @param router: Router
   * @param fb: FormBuilder
   * @param cdRef: ChangeDetectorRef
   * @param translate: TranslateService
   * @param authenticationService: AuthenticationService
   * @param merchantsService: MerchantsService
   * @param customersService: CustomersService
   * @param staticDataService: StaticDataService,
  */
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private translate: TranslateService,
    private authenticationService: AuthenticationService,
    private merchantsService: MerchantsService,
    private customersService: CustomersService,
    private staticDataService: StaticDataService,
  ) {
    this.sectorList = this.staticDataService.getSectorList;
    this.validator = this.staticDataService.getUserValidator;
    this.unsubscribe = new Subject();
  }

	/**
	 * On Init
	 */
  ngOnInit() {
    this.access = this.authenticationService.currentUserValue.user["access"];
    (this.access === 'merchant') ? this.initMerchantForm() : this.initCustomerForm();
    (this.access === 'merchant') ? this.fetchMerchantData() : this.fetchCustomerData();
  }

	/**
	 * On Destroy
	 */
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
  }

  fetchCustomerData() {
    console.log('Customer');
    this.customersService.readProfile()
      .pipe(
        tap(
          data => {
            this.initialImage = data.imageURL;
            this.previewUrl = this.initialImage || '../../../../assets/media/users/default.jpg';
            this.customerForm.patchValue({ ...data });
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

  fetchMerchantData() {
    console.log('Merchant');
    this.merchantsService.readMerchantInfo(this.authenticationService.currentUserValue.user["_id"])
      .pipe(
        tap(
          data => {
            this.initialImage = data.imageURL;
            this.previewUrl = this.initialImage || '../../../../assets/media/users/default.png';
            this.merchantForm.patchValue({
              ...data, ...data.address,
              lat: data.address.coordinates[0], long: data.address.coordinates[1],
              ...data.contact, ...data.payments
            });
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

  initCustomerForm() {
    this.customerForm = this.fb.group({
      name: ['', Validators.compose([
        Validators.required,
        Validators.minLength(this.validator.name.minLength),
        Validators.maxLength(this.validator.name.maxLength)
      ])
      ],
    });
  }

  initMerchantForm() {
    this.merchantForm = this.fb.group({
      name: ['', Validators.compose([
        Validators.required,
        Validators.minLength(this.validator.name.minLength),
        Validators.maxLength(this.validator.name.maxLength)
      ])
      ],
      subtitle: [''],
      description: ['', Validators.compose([
        Validators.required,
      ])
      ],
      timetable: [''],
      sector: ['', Validators.compose([
        Validators.required,
      ])
      ],
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
      phone: ['', Validators.compose([
        Validators.required
      ])
      ],
      websiteURL: ['', Validators.compose([
        Validators.required
      ])
      ],
      nationalBank: [''],
      pireausBank: [''],
      eurobank: [''],
      alphaBank: [''],
      paypal: [''],
    });
  }

  fileProgress(fileInput: any) {
    console.log(fileInput);
    if (fileInput) {
      this.fileData = <File>fileInput.target.files[0];
      this.originalImage = false;
      this.preview();
    }
  }

  preview() {
    if (this.fileData == null) {
      this.onImageCancel();
      return;
    }
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
    if (this.access === 'merchant') {
      this.previewUrl = this.initialImage || '../../../../assets/media/users/default.jpg';
      this.imageInputMerch.nativeElement.value = null;
    } else {
      this.previewUrl = this.initialImage || '../../../../assets/media/users/default.jpg';
      this.imageInput.nativeElement.value = null;
    }
    this.fileData = null;
    this.originalImage = true;
  }

  onCustomerSubmit() {
    if (this.submitted || this.loading) return;

    const controls = this.customerForm.controls;
    /** check form */
    if (this.customerForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    this.submitted = true;
    this.loading = true;

    const formData = new FormData();
    formData.append('imageURL', this.fileData);
    formData.append('name', controls.name.value);

    this.customersService.updateProfile(formData)
      .pipe(
        tap(
          data => {
            this.authenticationService.updateCurrentUser(data.name, data.imageURL);
            Swal.fire({
              title: this.translate.instant('MESSAGE.SUCCESS.TITLE'),
              text: this.translate.instant('MESSAGE.SUCCESS.PROFILE_UPDATED'),
              icon: 'success',
              timer: 2500
            }).then((result) => {
              this.router.navigate(['/']);
            });
          },
          error => {
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

  onMerchantSubmit() {
    if (this.submitted || this.loading) return;

    const controls = this.merchantForm.controls;
    /** check form */
    if (this.merchantForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    this.submitted = true;
    this.loading = true;

    const formData = new FormData();
    formData.append('imageURL', this.fileData);
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

    formData.append('nationalBank', controls.nationalBank.value);
    formData.append('pireausBank', controls.pireausBank.value);
    formData.append('eurobank', controls.eurobank.value);
    formData.append('alphaBank', controls.alphaBank.value);
    formData.append('paypal', controls.paypal.value);

    this.merchantsService.updateMerchantInfo(this.authenticationService.currentUserValue.user["_id"], formData)
      .pipe(
        tap(
          data => {
            this.authenticationService.updateCurrentUser(data.name, data.imageURL);

            Swal.fire({
              title: this.translate.instant('MESSAGE.SUCCESS.TITLE'),
              text: this.translate.instant('MESSAGE.SUCCESS.PROFILE_UPDATED'),
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
  isCustomerControlHasError(controlName: string, validationType: string): boolean {
    const control = this.customerForm.controls[controlName];
    if (!control) {
      return false;
    }

    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }

  /**
    * Checking control validation
    *
    * @param controlName: string => Equals to formControlName
    * @param validationType: string => Equals to valitors name
    */
  isMerchantControlHasError(controlName: string, validationType: string): boolean {
    const control = this.merchantForm.controls[controlName];
    if (!control) {
      return false;
    }

    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }
}
