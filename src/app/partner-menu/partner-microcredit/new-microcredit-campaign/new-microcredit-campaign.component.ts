import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { first, takeUntil, finalize, tap } from 'rxjs/operators';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

/**
 * Services
 */
import { StaticDataService } from 'src/app/core/helpers/static-data.service';
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
  selector: 'app-new-microcredit-campaign',
  templateUrl: './new-microcredit-campaign.component.html',
  styleUrls: ['./new-microcredit-campaign.component.scss']
})

export class NewMicrocreditCampaignComponent implements OnInit, OnDestroy {
  @ViewChild('publish_item') publish_item;

  /**
   * Configuration and Static Data
   */
  public accessList: GeneralList[];

  /**
   * File Variables
   */
  // fileData: File = null;
  // previewUrl: any = null;
  // showImageError: boolean = false;

  /**
   * Content Variables
   */
  public title: string = '';
  public minDate: Date;
  isQuantitative = false;

  /**
   * Form
   */
  submitForm: FormGroup;
  submitted: boolean = false;
  validator: any;

  loading: boolean = false;
  private unsubscribe: Subject<any>;

  /**
    * Component Constructor
    *
    * @param cdRef: ChangeDetectorRef
    * @param router: Router
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
    private fb: FormBuilder,
    private modalService: NgbModal,
    private translate: TranslateService,
    private staticDataService: StaticDataService,
    private authenticationService: AuthenticationService,
    private itemsService: ItemsService
  ) {
    this.accessList = this.staticDataService.getAccessList;
    this.validator = this.staticDataService.getValidators.microcredit;
    this.unsubscribe = new Subject();
  }

  /**
   * On Init
   */
  ngOnInit() {
    this.minDate = new Date();
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
      supportStarts: ['', Validators.compose([
        Validators.required,
      ])
      ],
      supportEnds: ['', Validators.compose([
        Validators.required,
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
      // profile_avatar: ['', Validators.compose([
      //   Validators.required
      // ])
      // ],
      image_url: ['', Validators.compose([
        Validators.required
      ])
      ],
    },
      {
        validator: DatesValidator.DatesValidator
      });
  }

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
  //   console.log('Image canceled');
  //   this.previewUrl = null;
  //   this.fileData = null;
  //   this.showImageError = true;
  //   this.cdRef.markForCheck();
  // }

  onIsQuantitativeCheckboxChange() {
    this.isQuantitative = !this.isQuantitative;
  }

  createCampaign(campaignStatus: string) {
    const controls = this.submitForm.controls;

    const formData = new FormData();
    formData.append('imageURL', controls.image_url.value);
    //    formData.append('imageURL', this.fileData);
    formData.append('title', controls.title.value);
    formData.append('subtitle', controls.subtitle.value);
    formData.append('terms', controls.terms.value);
    formData.append('description', controls.description.value);
    formData.append('category', controls.category.value);
    formData.append('access', controls.access.value);

    formData.append('quantitative', controls.quantitative.value);
    formData.append('minAllowed', controls.minAllowed.value);
    formData.append('maxAllowed', (controls.quantitative.value) ? controls.maxAllowed.value : controls.minAllowed.value);
    formData.append('stepAmount', (controls.quantitative.value) ? controls.step.value : '0');
    formData.append('maxAmount', controls.maxAmount.value);

    formData.append('startsAt', controls.supportStarts.value.getTime().toString());
    formData.append('expiresAt', controls.supportEnds.value.getTime().toString());
    formData.append('redeemStarts', controls.redeemStarts.value.getTime().toString());
    formData.append('redeemEnds', controls.redeemEnds.value.getTime().toString());

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
    if (this.submitForm.invalid) {// || !this.fileData) {
      // if (!this.fileData) this.showImageError = true;
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }
    this.loading = true;

    this.title = controls.title.value;

    if (campaignStatus === 'draft') this.createCampaign('draft');
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
    this.createCampaign('publish')
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
