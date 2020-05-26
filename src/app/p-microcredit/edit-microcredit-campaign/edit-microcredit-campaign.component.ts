import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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

// Models./_support.service
import { StaticDataService } from '../../core/services/static-data.service';
import { GeneralList } from 'src/app/core/interfaces/general-list.interface';

@Component({
  selector: 'app-edit-microcredit-campaign',
  templateUrl: './edit-microcredit-campaign.component.html',
  styleUrls: ['./edit-microcredit-campaign.component.sass']
})

export class EditMicrocreditCampaignComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput', { static: false }) imageInput: ElementRef;
  @ViewChild('publish_item', { static: false }) publish_item: any;
  @ViewChild('remove_item', { static: false }) remove_item: any;

  private campaign_id: string;
  public initialImage: string = '';
  public title: string = '';

  accessList: GeneralList[];
  validator: any;

  fileData: File = null;
  previewUrl: any = null;
  originalImage: boolean = true;
  isQuantitative = false;

  submitForm: FormGroup;
  submitted: boolean = false;
  //campaign: MicrocreditCampaign;
  // title: string;
  // itemAbstract: string;
  // terms: string;
  // description: string;
  // category: string;
  // access: string;
  // quantitative: boolean;
  // minAllowed: number;
  // maxAllowed: number;
  // step: number;
  // maxAmount: number;
  // redeemStarts: Date;
  // redeemEnds: Date;
  // startsAt: Date;
  // expiresAt: Date;

  loading: boolean = false;
  private unsubscribe: Subject<any>;

  /**
    * Component constructor
    *
    * @param router: Router
    * @param fb: FormBuilder
    * @param cdRef: ChangeDetectorRef
    * @param modalService: NgbModal
    * @param activatedRoute: ActivatedRoute
    * @param translate: TranslateService
    * @param authenticationService: AuthenticationService
    * @param itemsService: ItemsService
    * @param staticDataService: StaticDataService
    */
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private authenticationService: AuthenticationService,
    private itemsService: ItemsService,
    private staticDataService: StaticDataService
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.campaign_id = params['_id'];
    });
    this.accessList = this.staticDataService.getAccessList;
    this.validator = this.staticDataService.getMicrocreditValidator;
    this.unsubscribe = new Subject();
  }

  /**
	 * On Init
	 */
  ngOnInit() {
    this.fetchCampaignData();
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
      subtitle: [''],
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
      access: ['', Validators.compose([
        Validators.required,
      ])
      ],
      quantitative: ['', Validators.compose([
        Validators.required,
      ])
      ],
      minAllowed: ['', Validators.compose([
        Validators.required,
      ])
      ],
      maxAllowed: ['', Validators.compose([
        Validators.required,
      ])
      ],
      stepAmount: [''],
      maxAmount: ['', Validators.compose([
        Validators.required,
        Validators.min(this.validator.maxAmount.minLength),
        Validators.max(this.validator.maxAmount.maxLength)
      ])
      ],
      redeemStarts: [new Date(), Validators.compose([
        Validators.required,
      ])
      ],
      redeemEnds: [new Date(), Validators.compose([
        Validators.required,
      ])
      ],
      initiation: [new Date(), Validators.compose([
        Validators.required,
      ])
      ],
      expiration: [new Date(), Validators.compose([
        Validators.required,
      ])
      ],
    },
      { validator: this.endDateAfterOrEqualValidator }
    );
  }

  fileProgress(fileInput: any) {
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
    this.originalImage = false;
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
    this.previewUrl = this.initialImage;
    this.fileData = null;
    this.originalImage = true;
    this.imageInput.nativeElement.value = null;
  }

  fetchCampaignData() {
    this.itemsService.readCampaign(this.authenticationService.currentUserValue.user["_id"], this.campaign_id)
      .pipe(
        tap(
          data => {
            this.title = data.title;
            this.initialImage = data.campaign_imageURL;
            this.previewUrl = this.initialImage;

            this.isQuantitative = data.quantitative;
            this.submitForm.patchValue({
              ...data,
              initiation: new Date(data.startsAt),
              expiration: new Date(data.expiresAt),
              redeemStarts: new Date(data.redeemStarts),
              redeemEnds: new Date(data.redeemEnds),
            });
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

  onIsQuantitativeCheckboxChange() {
    this.isQuantitative = !this.isQuantitative;
  }

  editCampaign(formData: FormData, campaignStatus: string) {
    this.itemsService.editCampaign(this.authenticationService.currentUserValue.user["_id"], this.campaign_id, formData)
      .pipe(
        tap(
          data => {
            if (campaignStatus == 'publish') {
              this.publishCampaign(formData)
            } else {
              Swal.fire({
                title: this.translate.instant('MESSAGE.SUCCESS.TITLE'),
                text: this.translate.instant('MESSAGE.SUCCESS.CAMPAIGN_PUBLISHED'),
                icon: 'success',
                timer: 2500
              }).then((result) => {
                this.router.navigate(['/m-campaigns']);
              });
            }
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

  publishCampaign(formDta: FormData) {
    this.itemsService.publishCampaign(this.authenticationService.currentUserValue.user["_id"], this.campaign_id, formDta)
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
    if (this.submitForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }
    this.loading = true;
    this.submitted = true;

    const formData = new FormData();
    formData.append('imageURL', this.fileData);
    formData.append('title', controls.title.value);
    formData.append('subtitle', controls.subtitle.value);
    formData.append('terms', controls.terms.value);
    formData.append('description', controls.description.value);
    formData.append('category', controls.category.value);
    formData.append('access', controls.access.value);
    formData.append('quantitative', controls.quantitative.value);
    formData.append('stepAmount', (controls.quantitative.value) ? controls.stepAmount.value : '0');
    formData.append('minAllowed', controls.minAllowed.value);
    formData.append('maxAllowed', (controls.quantitative.value) ? controls.maxAllowed.value : controls.minAllowed.value);
    formData.append('maxAmount', controls.maxAmount.value);
    formData.append('redeemStarts', controls.redeemStarts.value.getTime().toString());
    formData.append('redeemEnds', controls.redeemEnds.value.getTime().toString());
    formData.append('startsAt', controls.initiation.value.getTime().toString());
    formData.append('expiresAt', controls.expiration.value.getTime().toString());

    this.editCampaign(formData, campaignStatus);
  }

  publishItemModal() {
    const controls = this.submitForm.controls;
    /** check form */
    if (this.submitForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
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

  deleteItemModal() {
    this.modalService.open(this.remove_item).result.then((result) => {
      console.log('closed');
    }, (reason) => {
      console.log('dismissed');
    });
  }

  deleteItem() {
    console.log('delete');
    this.itemsService.deleteCampaign(this.authenticationService.currentUserValue.user["_id"], this.campaign_id)
      .pipe(
        tap(
          data => {
            Swal.fire({
              title: this.translate.instant('MESSAGE.SUCCESS.TITLE'),
              text: this.translate.instant('MESSAGE.SUCCESS.CAMPAIGN_DELETED'),
              icon: 'success',
              timer: 2500
            }).then((result) => {
              this.router.navigate(['/m-campaigns']);
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

  endDateAfterOrEqualValidator(formGroup: FormGroup): any {
    var startDateTimestamp: number, endDateTimestamp: number, startRedeemDateTimestamp: number, endRedeemDateTimestamp: number;
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


