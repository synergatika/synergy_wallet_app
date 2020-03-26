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

@Component({
  selector: 'app-personal-information',
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.scss']
})
export class PersonalInformationComponent implements OnInit, OnDestroy {
  @ViewChild('fileInputMerch', { static: false }) imageInputMerch: ElementRef;
  @ViewChild('fileInput', { static: false }) imageInput: ElementRef;

  public validator: any = {
    name: {
      minLength: 3,
      maxLenth: 250
    }
  };

  private access: string = '';
  public customer: Customer = {
    name: '',
    imageURL: null
  };
  public merchant: Merchant = {
    _id: '',
    name: '',
    imageURL: null,
    sector: '',
    subtitle: '',
    description: '',
    timetable: '',
    contact: {
      phone: '',
      websiteURL: '',
    },
    address: {
      street: '',
      postCode: '',
      city: '',
      coordinates: []
    },
    payments: {
      nationalBank: '',
      pireausBank: '',
      eurobank: '',
      alphaBank: '',
      paypal: ''
    }
  };
  menu = [
    {
      title: 'FIELDS.SECTOR_CHOICES._',
      value: 'Other',
    },
    {
      title: 'FIELDS.SECTOR_CHOICES.A',
      value: 'Β2Β Services',
    },
    {
      title: 'FIELDS.SECTOR_CHOICES.B',
      value: 'Durables',
    },
    {
      title: 'FIELDS.SECTOR_CHOICES.C',
      value: 'Durables (Technology)',
    },
    {
      title: 'FIELDS.SECTOR_CHOICES.D',
      value: 'Education',
    },
    {
      title: 'FIELDS.SECTOR_CHOICES.E',
      value: 'Food',
    },
    {
      title: 'FIELDS.SECTOR_CHOICES.F',
      value: 'Hotels, Cafés and Restaurants',
    },
    {
      title: 'FIELDS.SECTOR_CHOICES.G',
      value: 'Recreation and Culture',
    },
  ];

  customerForm: FormGroup;
  merchantForm: FormGroup;
  submitted: boolean = false;

  fileData: File = null;
  previewUrl: any = null;
  originalImage: boolean = true;
  // fileUploadProgress: string = null;
  // uploadedFilePath: string = null;

  private sectorsArray = ['None', 'B2B Services & Other Goods and Services',
    'Durables', 'Durables (Technology)',
    'Education', 'Food',
    'Hotels, Cafes and Restaurants', 'Recreation and Culture'
  ];

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
   */
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private translate: TranslateService,
    private authenticationService: AuthenticationService,
    private merchantsService: MerchantsService,
    private customersService: CustomersService,
  ) {
    this.unsubscribe = new Subject();
  }

	/**
	 * On Init
	 */
  ngOnInit() {
    this.access = this.authenticationService.currentUserValue.user["access"];
    (this.access === 'merchant') ? this.fetchMerchantData() : this.fetchCustomerData();
    (this.access === 'merchant') ? this.initMerchantForm() : this.initCustomerForm();
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
            this.customer = Object.assign({}, this.customer, data);
            this.previewUrl = this.customer.imageURL || '../../../../assets/media/users/default.jpg';
            this.customerForm.patchValue(this.customer);
          },
          error => {
            Swal.fire(
              this.translate.instant('MESSAGE.ERROR.TITLE'),
              this.translate.instant('MESSAGE.ERROR.SERVER'),
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
            this.merchant = Object.assign({}, this.merchant, data);
            console.log(this.merchant);
            // this.merchant.sector = (this.sectorsArray.indexOf(this.merchant.sector)).toString();
            this.previewUrl = this.merchant.imageURL || '../../../../assets/media/users/default.png';
            this.merchantForm.patchValue({ ...data, ...data.payments, ...data.address, ...data.contact });

            // name: this.merchant.name,
            // subtitle: this.merchant.subtitle,
            // description: this.merchant.description,
            // sector: this.merchant.sector,
            // timetable: this.merchant.timetable,
            // street: this.merchant.address.street,
            // postCode: this.merchant.address.postCode,
            // city: this.merchant.address.city,
            // phone: this.merchant.contact.phone,
            // websiteURL: this.merchant.contact.websiteURL,
            // nationalBank: this.merchant.payments.nationalBank,
            // pireausBank: this.merchant.payments.pireausBank,
            // eurobank: this.merchant.payments.eurobank,
            // alphaBank: this.merchant.payments.alphaBank,
            // paypal: this.merchant.payments.paypal,
          },
          error => {
            Swal.fire(
              this.translate.instant('MESSAGE.ERROR.TITLE'),
              this.translate.instant('MESSAGE.ERROR.SERVER'),
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

  initMerchantForm() {
    this.merchantForm = this.fb.group({
      name: [this.merchant.name, Validators.compose([
        Validators.required,
        Validators.minLength(this.validator.name.minLength),
        Validators.maxLength(this.validator.name.maxLength)
      ])
      ],
      subtitle: [this.merchant.subtitle],
      description: [this.merchant.description, Validators.compose([
        Validators.required,
      ])
      ],
      timetable: [this.merchant.timetable],
      sector: [this.merchant.sector, Validators.compose([
        Validators.required,
      ])
      ],
      street: [this.merchant.address.street, Validators.compose([
        Validators.required,
      ])
      ],
      postCode: [this.merchant.address.postCode, Validators.compose([
        Validators.required,
      ])
      ],
      city: [this.merchant.address.city, Validators.compose([
        Validators.required,
      ])
      ],
      phone: [this.merchant.contact.phone, Validators.compose([
        Validators.required
      ])
      ],
      websiteURL: [this.merchant.contact.websiteURL, Validators.compose([
        Validators.required
      ])
      ],
      nationalBank: [this.merchant.payments.nationalBank],
      pireausBank: [this.merchant.payments.pireausBank],
      eurobank: [this.merchant.payments.eurobank],
      alphaBank: [this.merchant.payments.alphaBank],
      paypal: [this.merchant.payments.paypal],
    });
  }

  initCustomerForm() {
    this.customerForm = this.fb.group({
      name: [this.merchant.name, Validators.compose([
        Validators.required,
        Validators.minLength(this.validator.name.minLength),
        Validators.maxLength(this.validator.name.maxLength)
      ])
      ],
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
      this.previewUrl = this.merchant.imageURL || '../../../../assets/media/users/default.jpg';
      this.imageInputMerch.nativeElement.value = null;
    } else {
      this.previewUrl = this.customer.imageURL || '../../../../assets/media/users/default.jpg';
      this.imageInput.nativeElement.value = null;
    }
    this.fileData = null;
    this.originalImage = true;
  }

  onCustomerSubmit() {
    //  if (this.submitted) return;
    const controls = this.customerForm.controls;
    /** check form */
    if (this.customerForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    // for (var key in this.customer) {
    //   if ((this.customer[key] === null || this.customer[key] === "") && (key !== 'imageURL')) {
    //     Swal.fire(
    //       this.translate.instant('MESSAGE.ERROR.TITLE'),
    //       this.translate.instant('MESSAGE.ERROR.ALL_FIELDS_REQUIRED'),
    //       'error'
    //     );
    //     return;
    //   }
    // }
    this.submitted = true;

    const formData = new FormData();
    formData.append('imageURL', this.fileData);
    formData.append('name', controls.name.value);

    this.customersService.updateProfile(formData)
      .pipe(first())
      .subscribe(
        data => {
          this.authenticationService.updateCurrentUser(data.name, data.imageURL);
          Swal.fire(
            this.translate.instant('MESSAGE.SUCCESS.TITLE'),
            this.translate.instant('MESSAGE.SUCCESS.PROFILE_UPDATED'),
            'success'
          );
          setTimeout(() => {
            this.router.navigateByUrl('/');
          }, 2500);
        },
        error => {
          Swal.fire(
            this.translate.instant('MESSAGE.ERROR.TITLE'),
            this.translate.instant('MESSAGE.ERROR.SERVER'),
            'error'
          );
          this.submitted = false;
        });
  }

  onMerchantSubmit() {
    console.log("Submit Merchant");
    // if (this.submitted) return;
    const controls = this.merchantForm.controls;
    /** check form */
    if (this.merchantForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    // for (var key in this.merchant) {
    //   if ((this.merchant[key] === null || this.merchant[key] === "") && (key !== 'imageURL') && (key !== 'websiteURL')) {
    //     Swal.fire(
    //       this.translate.instant('MESSAGE.ERROR.TITLE'),
    //       this.translate.instant('MESSAGE.ERROR.ALL_FIELDS_REQUIRED'),
    //       'error'
    //     );
    //     return;
    //   }
    // }
    this.submitted = true;

    const formData = new FormData();
    formData.append('imageURL', this.fileData);
    formData.append('name', controls.name.value);

    formData.append('subtitle', this.merchant.subtitle);
    formData.append('description', this.merchant.description);
    formData.append('timetable', this.merchant.timetable);

    formData.append('sector', controls.sector.value);
    formData.append('street', controls.street.value);
    formData.append('postCode', controls.postCode.value);
    formData.append('city', controls.city.value);
    formData.append('lat', this.merchant.address.coordinates[0]);
    formData.append('long', this.merchant.address.coordinates[0]);
    formData.append('phone', controls.phone.value);
    formData.append('websiteURL', controls.websiteURL.value);

    formData.append('nationalBank', this.merchant.payments.nationalBank);
    formData.append('pireausBank', this.merchant.payments.pireausBank);
    formData.append('eurobank', this.merchant.payments.eurobank);
    formData.append('alphaBank', this.merchant.payments.alphaBank);
    formData.append('paypal', this.merchant.payments.paypal);

    this.merchantsService.updateMerchantInfo(this.authenticationService.currentUserValue.user["_id"], formData)
      .pipe(
        tap(
          data => {
            console.log(data);
            this.authenticationService.updateCurrentUser(data.name, data.imageURL);
            Swal.fire(
              this.translate.instant('MESSAGE.SUCCESS.TITLE'),
              this.translate.instant('MESSAGE.SUCCESS.PROFILE_UPDATED'),
              'success'
            );
            setTimeout(() => {
              this.router.navigateByUrl('/');
            }, 2500);
          },
          error => {
            console.log(error);
            Swal.fire(
              this.translate.instant('MESSAGE.ERROR.TITLE'),
              this.translate.instant('MESSAGE.ERROR.SERVER'),
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
