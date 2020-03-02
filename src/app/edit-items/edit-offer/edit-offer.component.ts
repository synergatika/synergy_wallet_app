import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Subject } from 'rxjs';
import { first, takeUntil, finalize, tap } from 'rxjs/operators';
import { ScannerService } from '../../scanner/_scanner.service';

//Modal
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

// Swal Alert
import Swal from 'sweetalert2';

// Translate
import { TranslateService } from '@ngx-translate/core';

// Services
import { ItemsService } from '../../core/services/items.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { Offer } from '../../scanner/_scanner.interface';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.component.html',
  styleUrls: ['./edit-offer.component.scss']
})
export class EditOfferComponent implements OnInit, OnDestroy {
	@ViewChild('fileInput', {static: false}) imageInput : ElementRef;
  @ViewChild('remove_item', {static: false}) remove_item;
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

  date: any;
  offer_id: string;
  fileData: File = null;
  previewUrl: any = null;
  originalImage: boolean = true;
  offerExpires: Date;
  title: string;
  description: string;
  cost: number;
  submitForm: FormGroup;
  submitted: boolean = false;
  offer: Offer;
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
		private modalService: NgbModal,
		private activatedRoute: ActivatedRoute,
		private authenticationService: AuthenticationService,
		private router: Router,
		private datePipe: DatePipe,
		private scannerService: ScannerService
  ) {
	this.activatedRoute.params.subscribe(params => {
      this.offer_id = params['_id'];
    });
    this.unsubscribe = new Subject();
	//this.scannerService.offers.subscribe(offers => this.offer = offers);
  }

	/**
	 * On init
	 */
  ngOnInit() {
	this.fetchOfferData();
    //this.initForm();
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
      title: [this.title, Validators.compose([
        Validators.required,
        Validators.minLength(this.validator.title.minLength),
        Validators.maxLength(this.validator.title.maxLength)
      ])
      ],
      description: [this.description, Validators.compose([
        Validators.required,
        Validators.minLength(this.validator.description.minLength),
        Validators.maxLength(this.validator.description.maxLength)
      ])
      ],
      cost: [this.cost, Validators.compose([
        Validators.required,
        Validators.min(this.validator.cost.minValue),
        Validators.max(this.validator.cost.maxValue)
      ])
      ],
      expiration: [this.offerExpires, Validators.compose([
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
	  if(this.fileData == null) {
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
		this.previewUrl = this.offer.offer_imageURL;
    this.fileData = null;
    this.originalImage = true;
		this.imageInput.nativeElement.value = null;
  }

  /**
	 * On Form Submit
	 */
  onSubmit() {
    if (this.submitted) return;

    const controls = this.submitForm.controls;
		console.log(controls);
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
    formData.append('cost', controls.cost.value);
    formData.append('description', controls.description.value);
		formData.append('expiresAt', controls.expiration.value.getTime().toString());
		console.log(controls.expiration.value.getTime());
		/*for (var pair of formData.entries()) {
			console.log(pair[0]+ ', ' + pair[1]);
		}*/
		//return;
    this.itemsService.editOffer(this.authenticationService.currentUserValue.user["_id"], this.offer_id, formData)
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
            console.log(this.offer);
						console.log(this.offer.expiresAt);
						this.title = this.offer.title;
						this.description = this.offer.description;
						this.cost = this.offer.cost;
						this.offerExpires = new Date(this.offer.expiresAt);
						console.log(this.offerExpires.getTime());
						this.previewUrl = this.offer.offer_imageURL;
						this.initForm();
						this.cdRef.markForCheck();
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
	
	deleteItemModal() {
		this.modalService.open(this.remove_item).result.then((result) => {
		//this.searchText = '';
		console.log('closed');
		//this.showList = false;
		}, (reason) => {
			console.log('dismissed');
			//this.showList = false;
		});
	}
	
	deleteItem() {
		console.log('delete');
		this.itemsService.deleteOffer(this.authenticationService.currentUserValue.user["_id"], this.offer_id)
      .pipe(
        tap(
          data => {
            Swal.fire(
              this.translate.instant('MESSAGE.SUCCESS.TITLE'),
              this.translate.instant('MESSAGE.SUCCESS.OFFER_DELETED'),
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
    return result;
  }
}
