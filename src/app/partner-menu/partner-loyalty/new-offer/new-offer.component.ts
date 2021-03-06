import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, finalize, tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

/**
 * Services
 */
import { StaticDataService } from 'src/app/core/helpers/static-data.service';
import { ItemsService } from '../../../core/services/items.service';

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.component.html',
  styleUrls: ['./new-offer.component.scss']
})
export class NewOfferComponent implements OnInit, OnDestroy {

  /**
   * Content Variables
   */
  public minDate: Date;

  /**
   * File Variables
   */
  // fileData: File = null;
  // previewUrl: any = null;
  // showImageError: boolean = false;

  /**
   * Forms
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
    * @param translate: TranslateService
    * @param staticDataService: StaticDataService
    * @param itemsService: ItemsService
    */
  constructor(
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private fb: FormBuilder,
    private translate: TranslateService,
    private staticDataService: StaticDataService,
    private itemsService: ItemsService
  ) {
    this.validator = this.staticDataService.getValidators.offer;
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
      description: ['', Validators.compose([
        Validators.required,
        Validators.minLength(this.validator.description.minLength),
        Validators.maxLength(this.validator.description.maxLength)
      ])
      ],
      instructions: ['', Validators.compose([
        Validators.minLength(this.validator.description.minLength),
        Validators.maxLength(this.validator.description.maxLength)
      ])
      ],
      cost: ['', Validators.compose([
        Validators.required,
        Validators.min(this.validator.cost.minValue),
        Validators.max(this.validator.cost.maxValue)
      ])
      ],
      expiration: ['', Validators.compose([
        Validators.required
      ])
      ],
      // profile_avatar: ['', Validators.compose([
      //   Validators.required
      // ])
      // ],
      image_url: [null, Validators.compose([
        Validators.required
      ])
      ],
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

  /**
   * On Submit Form
   */
  onSubmit() {
    if (this.loading) return;

    const controls = this.submitForm.controls;
    /** check form */
    if (this.submitForm.invalid) {// || !this.fileData) {
      // if (!this.fileData) this.showImageError = true;
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      console.log('form invalid');
      return;
    }

    this.loading = true;

    const formData = new FormData();
    formData.append('imageURL', controls.image_url.value);
    //formData.append('imageURL', this.fileData);
    formData.append('title', controls.title.value);
    formData.append('subtitle', controls.subtitle.value);
    formData.append('cost', controls.cost.value);
    formData.append('description', controls.description.value);
    formData.append('instructions', controls.instructions.value);
    formData.append('expiresAt', controls.expiration.value.getTime().toString());

    this.itemsService.createOffer(formData)
      .pipe(
        tap(
          data => {
            Swal.fire({
              title: this.translate.instant('MESSAGE.SUCCESS.TITLE'),
              text: this.translate.instant('MESSAGE.SUCCESS.OFFER_CREATED'),
              icon: 'success',
              timer: 2500
            }).then((result) => {
              this.router.navigate(['/m-offers']);
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
