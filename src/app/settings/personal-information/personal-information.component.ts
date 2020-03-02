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
  @ViewChild('fileInputMerch', {static: false}) imageInputMerch : ElementRef;
	@ViewChild('fileInput', {static: false}) imageInput : ElementRef;
  public customer: Customer = {
    name: '',
    imageURL: null
  };

  public merchant: Merchant = {
    _id: '',
    name: '',
    imageURL: null,
    sector: '',
    contact: {
      phone: '',
      websiteURL: '',
    },
    address: {
      street: '',
      postCode: '',
      city: '',
      coordinates: []
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
  submitted = false;
  access: string = '';
  fileData: File = null;
  previewUrl: any = null;
  // fileUploadProgress: string = null;
  // uploadedFilePath: string = null;
  originalImage: boolean = true;

  private sectorsArray = ['None', 'B2B Services & Other Goods and Services',
    'Durables', 'Durables (Technology)',
    'Education', 'Food',
    'Hotels, Cafes and Restaurants', 'Recreation and Culture'
  ];

  loading: boolean = false;
  private unsubscribe: Subject<any>;

  /**
   * @param cdRef: ChangeDetectorRef
   * @param authenticationService: AuthenticationService
   * @param fb: FormBuilder
   * @param translate: TranslateService
   */
  constructor(
    private authenticationService: AuthenticationService,
    private merchantsService: MerchantsService,
    private customersService: CustomersService,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private translate: TranslateService
  ) {
    this.unsubscribe = new Subject();
  }

  initForm() {
    if (this.access === 'merchant') {
      this.merchantsService.readMerchantInfo(this.authenticationService.currentUserValue.user["_id"])
        .pipe(
          tap(
            data => {
              this.merchant = Object.assign({}, this.merchant, data);
							console.log(this.merchant);
             // this.merchant.sector = (this.sectorsArray.indexOf(this.merchant.sector)).toString();
              this.previewUrl = this.merchant.imageURL || '../../../../assets/media/users/default.png';
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
    } else {
      this.customersService.readProfile()
        .pipe(
          tap(
            data => {
              this.customer = Object.assign({}, this.customer, data);
              this.previewUrl = this.customer.imageURL || '../../../../assets/media/users/default.jpg';
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
	  if(this.fileData == null) {
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

  ngOnInit() {
    this.access = this.authenticationService.currentUserValue.user["access"];
    this.initForm();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
  }

  onSubmit() {
    if (this.submitted) return;

    if (this.access === 'merchant') {
      for (var key in this.merchant) {
        if ((this.merchant[key] === null || this.merchant[key] === "") && (key !== 'imageURL') && (key !== 'websiteURL')) {
          Swal.fire(
            this.translate.instant('MESSAGE.ERROR.TITLE'),
            this.translate.instant('MESSAGE.ERROR.ALL_FIELDS_REQUIRED'),
            'error'
          );
          return;
        }
      }
      this.submitted = true;

      const formData = new FormData();
      formData.append('imageURL', this.fileData);
      formData.append('name', this.merchant.name);
      formData.append('sector', this.sectorsArray[this.merchant.sector]);
      formData.append('phone', this.merchant.contact.phone);
      formData.append('websiteURL', this.merchant.contact.websiteURL);
      formData.append('street', this.merchant.address.street);
      formData.append('postCode', this.merchant.address.postCode);
      formData.append('city', this.merchant.address.city);

      this.merchantsService.updateMerchantInfo(this.authenticationService.currentUserValue.user["_id"], formData)
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
    } else {
      for (var key in this.customer) {
        if ((this.customer[key] === null || this.customer[key] === "") && (key !== 'imageURL')) {
          Swal.fire(
            this.translate.instant('MESSAGE.ERROR.TITLE'),
            this.translate.instant('MESSAGE.ERROR.ALL_FIELDS_REQUIRED'),
            'error'
          );
          return;
        }
      }
      this.submitted = true;

      const formData = new FormData();
      formData.append('imageURL', this.fileData);
      formData.append('name', this.customer.name);

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
  }
}
