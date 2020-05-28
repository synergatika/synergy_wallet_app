import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators, FormArray, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { first, takeUntil, tap, finalize } from 'rxjs/operators';
import Swal from 'sweetalert2'

// Translate
import { TranslateService } from '@ngx-translate/core';

// Services
import { AuthenticationService } from '../../core/services/authentication.service';
import { PartnersService } from '../../core/services/partners.service';
import { MembersService } from '../../core/services/members.service';
import { StaticDataService } from '../../core/services/static-data.service';
// Environment
import { environment } from '../../../environments/environment';

// Models
import { Partner } from '../../core/models/partner.model';
import { PartnerPayment } from '../../core/models/partner_payment.model';

import { Member } from '../../core/models/member.model';
import { PaymentList } from 'src/app/core/interfaces/payment-list.interface';
import { GeneralList } from 'src/app/core/interfaces/general-list.interface';



@Component({
  selector: 'app-personal-information',
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.scss']
})
export class PersonalInformationComponent implements OnInit, OnDestroy {
  @ViewChild('fileInputMerch', { static: false }) imageInputMerch: ElementRef;
  @ViewChild('fileInput', { static: false }) imageInput: ElementRef;

  public subAccessConfig: Boolean[] = environment.subAccess;

  public paymentsList: PaymentList[];
  public sectorList: GeneralList[];
  public access: string = '';
  public initialImage: string = '';

  showImageError: boolean = false;
  showPaymentError: boolean = false;

  validator: any;

  memberForm: FormGroup;
  partnerForm: FormGroup;
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
   * @param partnersService: PartnersService
   * @param membersService: MembersService
   * @param staticDataService: StaticDataService,
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
    this.sectorList = this.staticDataService.getSectorList;
    this.validator = this.staticDataService.getUserValidator;
    this.unsubscribe = new Subject();
  }

	/**
	 * On Init
	 */
  ngOnInit() {
    this.access = this.authenticationService.currentUserValue.user["access"];
    (this.access === 'partner') ? this.initPartnerForm() : this.initMemberForm();
    (this.access === 'partner') ? this.fetchPartnerData() : this.fetchMemberData();
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
    if (partner.address && this.subAccessConfig[0]) {
      this.partnerForm.patchValue({
        ...partner.address, lat: partner.address.coordinates[0], long: partner.address.coordinates[1]
      });
    }

    if (partner.contact && this.subAccessConfig[1]) {
      this.partnerForm.patchValue({
        ...partner.contact
      });
    }

    if (partner.payments && this.subAccessConfig[1]) {
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

  fetchMemberData() {
    console.log('Member');
    this.membersService.readProfile()
      .pipe(
        tap(
          data => {
            this.initialImage = data.imageURL;
            this.previewUrl = this.initialImage || '../../../../assets/media/users/default.jpg';
            this.memberForm.patchValue({ ...data });
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

  fetchPartnerData() {
    console.log('Partner');
    this.partnersService.readPartnerInfo(this.authenticationService.currentUserValue.user["_id"])
      .pipe(
        tap(
          data => {
            console.log(data);
            this.initialImage = data.imageURL;
            this.previewUrl = this.initialImage || '../../../../assets/media/users/default.png';
            this.partnerForm.patchValue({ ...data });
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

  initMemberForm() {
    this.memberForm = this.fb.group({
      name: ['', Validators.compose([
        Validators.required,
        Validators.minLength(this.validator.name.minLength),
        Validators.maxLength(this.validator.name.maxLength)
      ])
      ],
    });
  }

  initPartnerForm() {
    this.partnerForm = this.fb.group({
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
      payments: new FormArray([]),

      // nationalBank: [''],
      // pireausBank: [''],
      // eurobank: [''],
      // alphaBank: [''],
      // paypal: [''],
    });

    (this.subAccessConfig[0]) ? this.clearPartnerAddressValidators(this.partnerForm) : '';
    (this.subAccessConfig[1]) ? this.clearPartnerContactValidators(this.partnerForm) : '';

    this.paymentsList.forEach(element => {
      const payment = new FormControl('',
      );
      this.payments.push(payment);
    });
  }

  get payments() {
    return this.partnerForm.get('payments') as FormArray;
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
    console.log("On Clear");
    this.paymentsList.forEach((value, i) => {
      this.payments.at(i).clearValidators();
      this.payments.at(i).updateValueAndValidity();
    });
  }

  setPartnerPaymentsValidators() {
    console.log("On Set");
    this.paymentsList.forEach((value, i) => {
      this.payments.at(i).setValidators(Validators.required);
      this.payments.at(i).updateValueAndValidity();
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
    if (this.access === 'partner') {
      this.previewUrl = this.initialImage || '../../../../assets/media/users/default.jpg';
      this.imageInputMerch.nativeElement.value = null;
    } else {
      this.previewUrl = this.initialImage || '../../../../assets/media/users/default.jpg';
      this.imageInput.nativeElement.value = null;
    }
    this.fileData = null;
    this.originalImage = true;
  }

  onMemberSubmit() {
    if (this.submitted || this.loading) return;

    const controls = this.memberForm.controls;
    /** check form */
    if (this.memberForm.invalid) {
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

    this.membersService.updateProfile(formData)
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

  setPaymentsValues(controls: { [key: string]: AbstractControl }) {
    var payments: PartnerPayment[] = [];
    this.paymentsList.forEach((value, i) => {
      console.log(controls.payments.value[i])
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
    if (this.partnerForm.invalid || !partner_payments.length) {

      (partner_payments.length) ? this.clearPartnerPaymentsValidators() : this.setPartnerPaymentsValidators();
      this.showPaymentError = (partner_payments.length === 0)
      this.showImageError = (!this.fileData);

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

    formData.append('payments', JSON.stringify(partner_payments));

    this.partnersService.updatePartnerInfo(this.authenticationService.currentUserValue.user["_id"], formData)
      .pipe(
        tap(
          data => {
            console.log("Done");

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
  isMemberControlHasError(controlName: string, validationType: string): boolean {
    const control = this.memberForm.controls[controlName];
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
  isPartnerControlHasError(controlName: string, validationType: string): boolean {
    const control = this.partnerForm.controls[controlName];
    if (!control) {
      return false;
    }

    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }
}
