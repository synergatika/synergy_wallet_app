import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';
import { first, takeUntil, finalize, tap } from 'rxjs/operators';

// Swal Alert
import Swal from 'sweetalert2';

// Translate
import { TranslateService } from '@ngx-translate/core';

// Services
import { ItemsService } from '../../core/services/items.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ScannerInterface } from '../../scanner/_scanner.interface';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.component.html',
  styleUrls: ['./edit-offer.component.scss']
})
export class EditOfferComponent implements OnInit, OnDestroy {

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
  
  offer_id: string;
  fileData: File = null;
  previewUrl: any = null;
  originalImage: boolean = false;

  submitForm: FormGroup;
  submitted: boolean = false;
  offer: ScannerInterface["Offer"];
  offerExpires: string;
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
    private translate: TranslateService,
	private activatedRoute: ActivatedRoute,
	private authenticationService: AuthenticationService,
	private datePipe: DatePipe
  ) {
	this.activatedRoute.params.subscribe(params => {
      this.offer_id = params['_id'];
    });
    this.unsubscribe = new Subject();
  }

	/**
	 * On init
	 */
  ngOnInit() {
	this.fetchOfferData();
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
      cost: [0, Validators.compose([
        Validators.required,
        Validators.min(this.validator.cost.minValue),
        Validators.max(this.validator.cost.maxValue)
      ])
      ],
      expiration: ['1', Validators.compose([
        Validators.required
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

    var _date = new Date();
    _date.setHours(23, 59, 59, 0);
    switch (controls.expiration.value) {
      case '1':
        var _newDate = _date.setDate(_date.getDate() + 7);
        break;
      case '2':
        var _newDate = _date.setMonth(_date.getMonth() + 1);
        break;
      case '3':
        var _newDate = _date.setMonth(_date.getMonth() + 3);
        break;
      case '4':
        var _newDate = _date.setMonth(_date.getMonth() + 6);
        break;
      default:
        var _newDate = _date.setDate(_date.getDate() + 7);
    }

    const formData = new FormData();
    formData.append('imageURL', this.fileData);
    formData.append('cost', controls.cost.value);
    formData.append('description', controls.description.value);
    formData.append('expiresAt', _newDate.toString());

    this.itemsService.createOffer(formData)
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
  
  fetchOfferData() {
    this.itemsService.readOffer(this.authenticationService.currentUserValue.user["_id"],this.offer_id)
      .pipe(
        tap(
          data => {
            this.offer = data;
			 this.offerExpires = this.datePipe.transform(this.offer.expiresAt,'yyyy-MM-dd');;
            console.log(this.offer);
            //this.scannerService.changeOffers(this.offer);
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
