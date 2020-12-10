import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { first, takeUntil, finalize, tap } from 'rxjs/operators';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

/**
 * Services
 */
import { StaticDataService } from '../../../core/helpers/static-data.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { ItemsService } from '../../../core/services/items.service';

/**
 * Models & Interfaces
 */
import { GeneralList } from 'sng-core';

/**
 * Validators
 */
import { DatesValidator } from '../dates.validator';

@Component({
  selector: 'app-edit-microcredit-campaign',
  templateUrl: './edit-microcredit-campaign.component.html',
  styleUrls: ['./edit-microcredit-campaign.component.scss']
})

export class EditMicrocreditCampaignComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') imageInput: ElementRef;
  @ViewChild('publish_item') publish_item: any;
  @ViewChild('remove_item') remove_item: any;

  /**
   * Configuration and Static Data
   */
  public accessList: GeneralList[];

  /**
   * Parameters
   */
  private campaign_id: string;

  /**
   * Content Variables
   */
  public title: string = '';
  public minDate: Date;
  isQuantitative = false;

  /**
   * File Variables
   */
  // fileData: File = null;
  // previewUrl: any = null;
  // originalImage: boolean = true;
  public initialImage: string = '';

  /**
   * Form
   */
  submitForm: FormGroup;
  submitted: boolean = false;
  validator: any;

  //campaign: MicrocreditCampaign;
  // title: string;
  // subtitle: string;
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
    * Component Constructor
    *
    * @param cdRef: ChangeDetectorRef
    * @param router: Router
    * @param activatedRoute: ActivatedRoute
    * @param fb: FormBuilder
    * @param modalService: NgbModal
    * @param translate: TranslateService
    * @param staticDataService: StaticDataService
    * @param authenticationService: AuthenticationService
    * @param itemsService: ItemsService
    */
  constructor(
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private translate: TranslateService,
    private staticDataService: StaticDataService,
    private authenticationService: AuthenticationService,
    private itemsService: ItemsService
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.campaign_id = params['_id'];
    });
    this.accessList = this.staticDataService.getAccessList;
    this.validator = this.staticDataService.getValidators.microcredit;
    this.unsubscribe = new Subject();
  }

  /**
   * On Init
   */
  ngOnInit() {
    this.minDate = new Date();
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
      stepAmount: [''],
      minAllowed: ['', Validators.compose([
        Validators.required,
      ])
      ],
      maxAllowed: ['', Validators.compose([
        Validators.required,
      ])
      ],
      maxAmount: ['', Validators.compose([
        Validators.required,
        Validators.min(this.validator.maxAmount.minLength),
        Validators.max(this.validator.maxAmount.maxLength)
      ])
      ],

      supportStarts: [new Date(), Validators.compose([
        Validators.required,
      ])
      ],
      supportEnds: [new Date(), Validators.compose([
        Validators.required,
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
      image_url: [new Date(), Validators.compose([
        Validators.required,
      ])
      ],
    },
      {
        validator: DatesValidator.DatesValidator
      }
    );
  }

  /**
   * Image Upload
   */
  // fileProgress(fileInput: any) {
  //   if (fileInput) {
  //     this.fileData = <File>fileInput.target.files[0];
  //     this.originalImage = false;
  //     this.preview();
  //   }
  // }

  // preview() {
  //   if (this.fileData == null) {
  //     this.onImageCancel();
  //     return;
  //   }
  //   this.originalImage = false;
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
  //   this.previewUrl = this.initialImage;
  //   this.fileData = null;
  //   this.originalImage = true;
  //   this.imageInput.nativeElement.value = null;
  // }

  fetchCampaignData() {
    this.itemsService.readCampaign(this.authenticationService.currentUserValue.user["_id"], this.campaign_id)
      .pipe(
        tap(
          data => {
            this.title = data.title;
            this.initialImage = data.campaign_imageURL;
            // this.previewUrl = this.initialImage;

            this.isQuantitative = data.quantitative;
            this.submitForm.patchValue({
              ...data,
              supportStarts: ((this.minDate).getDate() > data.startsAt) ? this.minDate : (new Date(data.startsAt)),
              supportEnds: ((this.minDate).getDate() > data.expiresAt) ? this.minDate : (new Date(data.expiresAt)),
              redeemStarts: ((this.minDate).getDate() > data.redeemStarts) ? this.minDate : (new Date(data.redeemStarts)),
              redeemEnds: ((this.minDate).getDate() > data.redeemEnds) ? this.minDate : (new Date(data.redeemEnds)),
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

  editCampaign(campaignStatus: string) {
    const controls = this.submitForm.controls;

    const formData = new FormData();
    formData.append('imageURL', controls.image_url.value);
    // formData.append('imageURL', this.fileData);
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

    formData.append('startsAt', controls.supportStarts.value.getTime().toString());
    formData.append('expiresAt', controls.supportEnds.value.getTime().toString());
    formData.append('redeemStarts', controls.redeemStarts.value.getTime().toString());
    formData.append('redeemEnds', controls.redeemEnds.value.getTime().toString());

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
          this.loading = false;
          this.cdRef.markForCheck();
        })
      )
      .subscribe();
  }

  /**
  * On Submit Form
  */
  onSubmit(campaignStatus: string) {
    if (this.loading) return;

    const controls = this.submitForm.controls;
    /** check form */
    if (this.submitForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }
    this.loading = true;

    this.title = controls.title.value;

    if (campaignStatus === 'draft') this.editCampaign('draft');
    else if (campaignStatus === 'publish') this.publishItemModal;
  }

  publishItemModal() {
    this.modalService.open(this.publish_item).result.then((result) => {
      console.log('closed');
    }, (reason) => {
      console.log('dismissed');
    });
  }

  publishItem() {
    console.log('publishItem');
    this.editCampaign('publish')
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


