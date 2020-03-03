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

@Component({
  selector: 'app-new-microcredit-campaign',
  templateUrl: './new-microcredit-campaign.component.html',
  styleUrls: ['./new-microcredit-campaign.component.scss']
})

export class NewMicrocreditCampaignComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput', {static: true}) image: ElementRef;
	@ViewChild('publish_item', {static: false}) publish_item;	
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
  originalImage: boolean = true;
	fileDataEmptied: boolean;
  isQuantitative = false;

  submitForm: FormGroup;
  submitted: boolean = false;

  loading: boolean = false;
  private unsubscribe: Subject<any>;

  constructor(
    private cdRef: ChangeDetectorRef,
    private itemsService: ItemsService,
    private fb: FormBuilder,
    private translate: TranslateService,
		private modalService: NgbModal,
		private router: Router,
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
		{validator: this.endDateAfterOrEqualValidator}
		);
  }

  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    this.preview();
  }

  preview() {
	  if(this.fileData == null) {
		  this.onImageCancel();
		  return;
	  }
	  this.originalImage = false;
		this.fileDataEmptied = false;
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
    this.originalImage = true;
		this.image.nativeElement.value = null;
		this.fileDataEmptied = true;
		this.cdRef.markForCheck();
  }

  onIsQuantitativeCheckboxChange() {
    this.isQuantitative = !this.isQuantitative;
  }

  /**
 * On Form Submit
 */
  onSubmit(campaignStatus) {
    if (this.submitted) return;

    const controls = this.submitForm.controls;
    /** check form */
    if (this.submitForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }
		if(!this.fileData) {
			console.log('no image');
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
		formData.append('status', campaignStatus);
    formData.append('quantitative', controls.quantitative.value);
		if (controls.quantitative.value) {
			formData.append('minAllowed', controls.minAllowed.value);
			formData.append('maxAllowed', controls.maxAllowed.value);
			formData.append('stepAmount', controls.step.value);
		}
    formData.append('maxAmount', controls.maxAmount.value);
    formData.append('redeemStarts', controls.redeemStarts.value.getTime().toString());
    formData.append('redeemEnds', controls.redeemEnds.value.getTime().toString());
    formData.append('startsAt', controls.initiation.value.getTime().toString());
    formData.append('expiresAt', controls.expiration.value.getTime().toString());
		/*for (var pair of formData.entries()) {
			console.log(pair[0]+ ', ' + pair[1]); 
		}*/
		//return;
    this.itemsService.createMicrocreditCampaign(formData)
      .pipe(
        tap(
          data => {
            Swal.fire(
              this.translate.instant('MESSAGE.SUCCESS.TITLE'),
              this.translate.instant('MESSAGE.SUCCESS.CAMPAIGN_CREATED'),
              'success'
            ).then((result) => {
							this.router.navigate(['/m-campaigns']);
						});
						setTimeout(()=> {
							Swal.close();
							this.router.navigate(['/m-campaigns']);
						},2000);
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
  
	publishItemModal() {
		const controls1 = this.submitForm.controls;
    /** check form */
    if (this.submitForm.invalid) {
      Object.keys(controls1).forEach(controlName =>
        controls1[controlName].markAsTouched()
      );
      return;
    }
		if(!this.fileData) {
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
		this.onSubmit('public');
	}
	
	endDateAfterOrEqualValidator(formGroup): any {
    var startDateTimestamp, endDateTimestamp, startRedeemDateTimestamp, endRedeemDateTimestamp;
    for(var controlName in formGroup.controls) {
      if(controlName.indexOf("initiation") !== -1) {
        startDateTimestamp = Date.parse(formGroup.controls[controlName].value);
      }
      if(controlName.indexOf("expiration") !== -1) {
        endDateTimestamp = Date.parse(formGroup.controls[controlName].value);
      }
			if(controlName.indexOf("redeemStarts") !== -1) {
        startRedeemDateTimestamp = Date.parse(formGroup.controls[controlName].value);
      }
      if(controlName.indexOf("redeemEnds") !== -1) {
        endRedeemDateTimestamp = Date.parse(formGroup.controls[controlName].value);
      }
    }
		if (endDateTimestamp < startDateTimestamp) {
			console.log("error init");
			formGroup.controls['expiration'].setErrors({ endDateLessThanStartDate: true });
		} 
		if (endRedeemDateTimestamp < startRedeemDateTimestamp) {
			console.log("error endRedeemDateTimestamp");
			formGroup.controls['redeemEnds'].setErrors({ endRedeemDateLessThanStartDate: true });
		} 
		if((endDateTimestamp >= startDateTimestamp) && (endRedeemDateTimestamp >= startRedeemDateTimestamp)) {
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
