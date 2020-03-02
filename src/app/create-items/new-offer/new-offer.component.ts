import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';
import { first, takeUntil, finalize, tap } from 'rxjs/operators';

// Swal Alert
import Swal from 'sweetalert2';

// Translate
import { TranslateService } from '@ngx-translate/core';

// Services
import { ItemsService } from '../../core/services/items.service';
import { AuthenticationService } from '../../core/services/authentication.service';

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.component.html',
  styleUrls: ['./new-offer.component.sass']
})
export class NewOfferComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput', {static: true}) image: ElementRef;
  public validator: any = {
    title: {
      minLength: 3,
      maxLenth: 150
    },
    description: {
      minLength: 3,
      maxLenth: 150
    },
    cost: {
      minValue: 0,
      maxValue: 100000
    }
  };

  fileData: File = null;
  previewUrl: any = null;
  originalImage: boolean = true;
	fileDataEmptied: boolean;
  submitForm: FormGroup;
  submitted: boolean = false;

  loading: boolean = false;
  private unsubscribe: Subject<any>;

  /**
    * Component constructor
    *
    * @param cdRef: ChangeDetectorRef
    * @param itemsService: ItemsService
    * @param fb: FormBuilder
    * @param translate: TranslateService
    */
  constructor(
    private cdRef: ChangeDetectorRef,
    private itemsService: ItemsService,
    private fb: FormBuilder,
		private authenticationService: AuthenticationService,
		private router: Router,
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
      description: ['', Validators.compose([
        Validators.required,
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
      profile_avatar: ['', Validators.compose([
        Validators.required
      ])
      ],
    });
  }

  fileProgress(fileInput: any) {
	  /*console.log('fileInput');
	  console.log(fileInput);*/
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

  /**
	 * On Form Submit
	 */
  onSubmit() {	
    if (this.submitted) return;
		console.log('onSubmit');
    const controls = this.submitForm.controls;
    /** check form */
    if (this.submitForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
			console.log('form invalid');
      return;
    }
		if(!this.fileData) {
			console.log('no image');
			//controls['profile_avatar'].setErrors({'incorrect': true});
			return;
		}
    this.loading = true;
    this.submitted = true;

    const formData = new FormData();
    formData.append('imageURL', this.fileData);
		formData.append('title', controls.title.value);
    formData.append('cost', controls.cost.value);
    formData.append('description', controls.description.value);
    formData.append('expiresAt', controls.expiration.value.getTime().toString());
		/*for (var pair of formData.entries()) {
			console.log(pair[0]+ ', ' + pair[1]); 
		}*/
		//return;
    this.itemsService.createOffer(this.authenticationService.currentUserValue.user["_id"], formData)
      .pipe(
        tap(
          data => {
            Swal.fire(
              this.translate.instant('MESSAGE.SUCCESS.TITLE'),
              this.translate.instant('MESSAGE.SUCCESS.OFFER_CREATED'),
              'success'
            ).then((result) => {
							console.log('deleted');
							this.router.navigate(['/m-offers']);
						});
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
		/*if(controlName=='profile_avatar') {
			console.log('--control--');
			console.log(controlName);
			console.log(control);
			console.log(control.value);
			console.log(control.hasError(validationType));
			console.log(result);
		}*/
    return result;
  }
}
