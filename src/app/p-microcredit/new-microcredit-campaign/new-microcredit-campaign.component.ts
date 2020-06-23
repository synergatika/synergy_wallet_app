import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';
import { first, takeUntil, finalize, tap } from 'rxjs/operators';

//Modal
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

// Translate
import { TranslateService } from '@ngx-translate/core';

// Services
import { ItemsService } from '../../core/services/items.service';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../../core/services/authentication.service';
import { StaticDataService } from 'src/app/core/services/static-data.service';

@Component({
  selector: 'app-new-microcredit-campaign',
  templateUrl: './new-microcredit-campaign.component.html',
  styleUrls: ['./new-microcredit-campaign.component.scss']
})

export class NewMicrocreditCampaignComponent implements OnInit, OnDestroy {
  @ViewChild('publish_item', { static: false }) publish_item;

  validator: any;

  fileData: File = null;
  previewUrl: any = null;
  showImageError: boolean = false;

  public title: string = '';
  isQuantitative = false;

  submitForm: FormGroup;
  submitted: boolean = false;

  loading: boolean = false;
  private unsubscribe: Subject<any>;

  /**
    * Component Constructor
    *
    * @param fb: FormBuilder
    * @param cdRef: ChangeDetectorRef
    * @param router: Router
    * @param modalService: NgbModal
    * @param translate: TranslateService
    * @param authenticationService: AuthenticationService
    * @param itemsService: ItemsService
    * @param staticDataService: StaticDataService
    */
  constructor(
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private modalService: NgbModal,
    private translate: TranslateService,
    private authenticationService: AuthenticationService,
    private itemsService: ItemsService,
    private staticDataService: StaticDataService
  ) {
    this.validator = this.staticDataService.getMicrocreditValidator;
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
      title: ['', Validators.compose([
        Validators.required,
        Validators.minLength(this.validator.title.minLength),
        Validators.maxLength(this.validator.title.maxLength)
      ])
      ],
      itemAbstract: [''],
      terms: ['', Validators.compose([
        Validators.required,
        Validators.minLength(this.validator.terms.minLength),
        Validators.maxLength(this.validator.terms.maxLength)
      ])
      ],
      description: ['', Validators.compose([
        Validators.required,
        Validators.minLength(this.validator.description.minLength),
        Validators.maxLength(this.validator.description.maxLength)
      ])
      ],
      category: ['', Validators.compose([
        Validators.required,
      ])
      ],
      access: ['public', Validators.compose([
        Validators.required,
      ])
      ],
      quantitative: [false, Validators.compose([
        Validators.required,
      ])
      ],
      minAllowed: [0, Validators.compose([
        Validators.required,
      ])
      ],
      maxAllowed: [0],
      step: [''],
      maxAmount: [0, Validators.compose([
        Validators.required,
        Validators.min(this.validator.maxAmount.minLength),
        Validators.max(this.validator.maxAmount.maxLength)
      ])
      ],
      redeemStarts: ['', Validators.compose([
        Validators.required,
      ])
      ],
      redeemEnds: ['', Validators.compose([
        Validators.required,
      ])
      ],
      initiation: ['', Validators.compose([
        Validators.required,
      ])
      ],
      expiration: ['', Validators.compose([
        Validators.required,
      ])
      ],
      profile_avatar: ['', Validators.compose([
        Validators.required
      ])
      ],
    },
      { validator: this.endDateAfterOrEqualValidator }
    );
  }

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
    console.log('Image canceled');
    this.previewUrl = null;
    this.fileData = null;
    this.showImageError = true;
    this.cdRef.markForCheck();
  }

  onIsQuantitativeCheckboxChange() {
    this.isQuantitative = !this.isQuantitative;
  }

  createCampaign(formData: FormData, campaignStatus: string) {
    this.itemsService.createMicrocreditCampaign(formData)
      .pipe(
        tap(
          data => {
            console.log('data');
            console.log(data);
            if (campaignStatus == 'publish') {
              this.publishCampaign(formData, data._id);
            } else {
              Swal.fire({
                title: this.translate.instant('MESSAGE.SUCCESS.TITLE'),
                text: this.translate.instant('MESSAGE.SUCCESS.CAMPAIGN_CREATED'),
                icon: 'success',
                timer: 2500
              }).then((result) => {
                this.router.navigate(['/m-campaigns']);
              });
            }
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

  publishCampaign(formData: FormData, campaign_id: string) {
    this.itemsService.publishCampaign(this.authenticationService.currentUserValue.user["_id"], campaign_id, formData)
      .pipe(
        tap(
          data => {
            Swal.fire({
              title: this.translate.instant('MESSAGE.SUCCESS.TITLE'),
              text: this.translate.instant('MESSAGE.SUCCESS.CAMPAIGN_PUBLISHED'),
              icon: 'success',
              timer: 2500
            }).then((result) => {
              this.router.navigate(['/m-campaigns']);
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
   * On Form Submit
   */
  onSubmit(campaignStatus: string) {
    if (this.submitted || this.loading) return;

    const controls = this.submitForm.controls;
    /** check form */
    if (this.submitForm.invalid || !this.fileData) {
      if (!this.fileData) this.showImageError = true;
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    this.submitted = true;
    this.loading = true;

    this.title = controls.title.value;

    const formData = new FormData();
    formData.append('imageURL', this.fileData);
    formData.append('title', controls.title.value);
    formData.append('subtitle', controls.itemAbstract.value);
    formData.append('terms', controls.terms.value);
    formData.append('description', controls.description.value);
    formData.append('category', controls.category.value);
    formData.append('access', controls.access.value);
    formData.append('quantitative', controls.quantitative.value);
    formData.append('minAllowed', controls.minAllowed.value);
    if (controls.quantitative.value) {
      formData.append('maxAllowed', controls.maxAllowed.value);
      formData.append('stepAmount', controls.step.value);
    } else {
      formData.append('maxAllowed', controls.minAllowed.value);
    }
    formData.append('maxAmount', controls.maxAmount.value);
    formData.append('redeemStarts', controls.redeemStarts.value.getTime().toString());
    formData.append('redeemEnds', controls.redeemEnds.value.getTime().toString());
    formData.append('startsAt', controls.initiation.value.getTime().toString());
    formData.append('expiresAt', controls.expiration.value.getTime().toString());

    this.createCampaign(formData, campaignStatus);
  }

  publishItemModal() {
    const controls1 = this.submitForm.controls;
    /** check form */
    if (this.submitForm.invalid) {
      Object.keys(controls1).forEach(controlName =>
        controls1[controlName].markAsTouched()
      );
      return;
    }
    if (!this.fileData) {
      console.log('no image');
      return;
    }
    this.modalService.open(this.publish_item).result.then((result) => {
      console.log('closed');
    }, (reason) => {
      console.log('dismissed');
    });
  }

  publishItem() {
    console.log('publishItem');
    this.onSubmit('publish');
  }

  endDateAfterOrEqualValidator(formGroup): any {
    var startDateTimestamp, endDateTimestamp, startRedeemDateTimestamp, endRedeemDateTimestamp;
    var opts = { onlySelf: true, emitEvent: false };
    for (var controlName in formGroup.controls) {
      if (controlName.indexOf("initiation") !== -1) {
        startDateTimestamp = Date.parse(formGroup.controls[controlName].value);
      }
      if (controlName.indexOf("expiration") !== -1) {
        endDateTimestamp = Date.parse(formGroup.controls[controlName].value);
      }
      if (controlName.indexOf("redeemStarts") !== -1) {
        startRedeemDateTimestamp = Date.parse(formGroup.controls[controlName].value);
      }
      if (controlName.indexOf("redeemEnds") !== -1) {
        endRedeemDateTimestamp = Date.parse(formGroup.controls[controlName].value);
      }
    }
    if (endDateTimestamp < startDateTimestamp) {
      //console.log("error init");
      formGroup.controls['expiration'].setErrors({ endDateLessThanStartDate: true });
    } else {
      //console.log("init null");
      formGroup.controls['expiration'].setErrors({ endDateLessThanStartDate: null });
      formGroup.controls['expiration'].updateValueAndValidity(opts);
    }
    if (endRedeemDateTimestamp < startRedeemDateTimestamp) {
      //console.log("error endRedeemDateTimestamp");
      formGroup.controls['redeemEnds'].setErrors({ endRedeemDateLessThanStartDate: true });
    } else {
      //console.log("redeemEnds null");
      formGroup.controls['redeemEnds'].setErrors({ endRedeemDateLessThanStartDate: null });
      formGroup.controls['redeemEnds'].updateValueAndValidity(opts);
    }
    if ((endDateTimestamp >= startDateTimestamp) && (endRedeemDateTimestamp >= startRedeemDateTimestamp)) {
      //console.log("null");
      return null;
    }
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
