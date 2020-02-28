import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { first, takeUntil, finalize, tap } from 'rxjs/operators';

// Translate
import { TranslateService } from '@ngx-translate/core';

// Services
import { ItemsService } from '../../core/services/items.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-microcredit-campaign-draft',
  templateUrl: './edit-microcredit-campaign-draft.component.html',
  styleUrls: ['./edit-microcredit-campaign-draft.component.sass']
})

export class EditMicrocreditCampaignComponentDraft implements OnInit, OnDestroy {

  public validator: any = {
    title: {
      minLength: 3,
      maxLenth: 150
    },
    terms: {
      minLength: 3,
      maxLenth: 1000
    },
    description: {
      minLength: 3,
      maxLenth: 1000
    },
    maxAmount: {
      minValue: 0,
      maxValue: 100000
    }
  };

  fileData: File = null;
  previewUrl: any = null;
  originalImage: boolean = false;

  isQuantitative = false;

  submitForm: FormGroup;
  submitted: boolean = false;

  loading: boolean = false;
  private unsubscribe: Subject<any>;

  constructor(
    private cdRef: ChangeDetectorRef,
    private itemsService: ItemsService,
    private fb: FormBuilder,
    private translate: TranslateService
  ) {
    this.unsubscribe = new Subject();
  }

  /**
	 * On init
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
      maxAllowed: [0, Validators.compose([
        Validators.required,
      ])
      ],
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
    });
  }

  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    this.preview();
  }

  preview() {
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
    this.originalImage = true;
  }

  onIsQuantitativeCheckboxChange() {
    this.isQuantitative = !this.isQuantitative;
  }

  /**
 * On Form Submit
 */
  onSubmit() {
    if (this.submitted) return;

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
    formData.append('terms', controls.terms.value);
    formData.append('description', controls.description.value);
    formData.append('category', controls.category.value);
    formData.append('access', controls.access.value);
    formData.append('quantitative', controls.quantitative.value);
    formData.append('minAllowed', controls.minAllowed.value);
    formData.append('maxAllowed', controls.maxAllowed.value);
    formData.append('maxAmount', controls.maxAmount.value);
    formData.append('redeemStarts', controls.redeemStarts.value);
    formData.append('redeemEnds', controls.redeemEnds.value);
    formData.append('expiresAt', controls.expiration.value);

    this.itemsService.createMicrocreditCampaign(formData)
      .pipe(
        tap(
          data => {
            Swal.fire(
              this.translate.instant('MESSAGE.SUCCESS.TITLE'),
              this.translate.instant('MESSAGE.SUCCESS.OFFER_CREATED'),
              'success'
            );
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
  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.submitForm.controls[controlName];
    if (!control) {
      return false;
    }

    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }
}