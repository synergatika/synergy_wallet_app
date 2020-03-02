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

// Models
import { MicrocreditCampaign } from '../../core/models/microcredit-campaign.model';

@Component({
  selector: 'app-edit-microcredit-campaign-draft',
  templateUrl: './edit-microcredit-campaign-draft.component.html',
  styleUrls: ['./edit-microcredit-campaign-draft.component.sass']
})

export class EditMicrocreditCampaignComponentDraft implements OnInit, OnDestroy {
  @ViewChild('fileInput', {static: false}) imageInput: ElementRef;
	@ViewChild('publish_item', {static: false}) publish_item;
	@ViewChild('remove_item', {static: false}) remove_item;
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
  campaign_id: string;
  fileData: File = null;
  previewUrl: any = null;
  originalImage: boolean = false;
  isQuantitative = false;

  submitForm: FormGroup;
  submitted: boolean = false;
  campaign: any;
  title: string;
  terms: string;
  description: string;
  category: string;
  access: string;
  quantitative: boolean;
  minAllowed: number;
  maxAllowed: number;
  maxAmount: number;
  redeemStarts: Date;
  redeemEnds: Date;
  startsAt: Date;
  expiresAt: Date;

  loading: boolean = false;
  private unsubscribe: Subject<any>;

  constructor(
    private cdRef: ChangeDetectorRef,
		private activatedRoute: ActivatedRoute,
    private itemsService: ItemsService,
    private fb: FormBuilder,
		private authenticationService: AuthenticationService,
		private modalService: NgbModal,
		private router: Router,
    private translate: TranslateService
  ) {
	this.activatedRoute.params.subscribe(params => {
      this.campaign_id = params['_id'];
    });
    this.unsubscribe = new Subject();
  }

  /**
	 * On init
	 */
  ngOnInit() {
	this.fetchCampaignData();
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
      terms: [this.terms, Validators.compose([
        Validators.required,
        Validators.minLength(this.validator.terms.minLength),
        Validators.maxLength(this.validator.terms.maxLength)
      ])
      ],
      description: [this.description, Validators.compose([
        Validators.required,
        Validators.minLength(this.validator.description.minLength),
        Validators.maxLength(this.validator.description.maxLength)
      ])
      ],
      category: [this.category, Validators.compose([
        Validators.required,
      ])
      ],
      access: [this.access, Validators.compose([
        Validators.required,
      ])
      ],
      quantitative: [this.quantitative, Validators.compose([
        Validators.required,
      ])
      ],
      minAllowed: [this.minAllowed, Validators.compose([
        Validators.required,
      ])
      ],
      maxAllowed: [this.maxAllowed, Validators.compose([
        Validators.required,
      ])
      ],
      maxAmount: [this.maxAmount, Validators.compose([
        Validators.required,
        Validators.min(this.validator.maxAmount.minLength),
        Validators.max(this.validator.maxAmount.maxLength)
      ])
      ],
      redeemStarts: [this.redeemStarts, Validators.compose([
        Validators.required,
      ])
      ],
      redeemEnds: [this.redeemEnds, Validators.compose([
        Validators.required,
      ])
      ],
	  initiation: [this.startsAt, Validators.compose([
        Validators.required,
      ])
      ],
      expiration: [this.expiresAt, Validators.compose([
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
    this.previewUrl = this.campaign.campaign_imageURL;
    this.fileData = null;
    this.originalImage = true;
		this.imageInput.nativeElement.value = null;
  }

  fetchCampaignData() {
	this.itemsService.readCampaign(this.authenticationService.currentUserValue.user["_id"], this.campaign_id)
		  .pipe(
			tap(
			  data => {
				this.campaign = data;
				  this.title = this.campaign.title;
				  this.terms = this.campaign.terms;
				  this.description = this.campaign.description;
				  this.category = this.campaign.category;
				  this.access = this.campaign.access;
				  this.quantitative = this.campaign.quantitative;
				  if (this.quantitative) {
					this.isQuantitative = true;
				  }
				  this.minAllowed = this.campaign.minAllowed;
				  this.maxAllowed = this.campaign.maxAllowed;
				  this.maxAmount = this.campaign.maxAmount;
				  this.redeemStarts = new Date(this.campaign.redeemStarts);
				  this.redeemEnds = new Date(this.campaign.redeemEnds);
				  this.startsAt = new Date(this.campaign.startsAt);
				  this.expiresAt = new Date(this.campaign.expiresAt);
					this.previewUrl = this.campaign.campaign_imageURL;	
				  this.initForm();
				console.log('this.current');
				console.log(this.campaign);
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
	/*const currentCampaign = this.campaigns[this.campaigns.map(function (e) { return e.campaign_id; }).indexOf(this.campaign_id)];
    this.current = currentCampaign;	*/
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
    //formData.append('stepAmount', controls.expiration.value);
		formData.append('stepAmount', '20');
    formData.append('quantitative', controls.quantitative.value);
    formData.append('minAllowed', controls.minAllowed.value);
    formData.append('maxAllowed', controls.maxAllowed.value);
    formData.append('maxAmount', controls.maxAmount.value);
    formData.append('redeemStarts', controls.redeemStarts.value.getTime().toString());
    formData.append('redeemEnds', controls.redeemEnds.value.getTime().toString());
    formData.append('startsAt', controls.expiration.value.getTime().toString());
    formData.append('expiresAt', controls.expiration.value.getTime().toString());
		/*for (var pair of formData.entries()) {
			console.log(pair[0]+ ', ' + pair[1]); 
		}*/
	//return;
		if(campaignStatus == 'draft') {
			this.itemsService.editCampaign(this.authenticationService.currentUserValue.user["_id"], this.campaign_id, formData)
      .pipe(
        tap(
          data => {
            Swal.fire(
              this.translate.instant('MESSAGE.SUCCESS.TITLE'),
              this.translate.instant('MESSAGE.SUCCESS.CAMPAIGN_UPDATED'),
              'success'
            ).then((result) => {
							console.log('closed');
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
		if (campaignStatus == 'public') {
			this.itemsService.createMicrocreditCampaign(formData)
      .pipe(
        tap(
          data => {
            Swal.fire(
              this.translate.instant('MESSAGE.SUCCESS.TITLE'),
              this.translate.instant('MESSAGE.SUCCESS.CAMPAIGN_CREATED'),
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
  }
  
	publishItemModal() {
		const controls1 = this.submitForm.controls;

    if (this.submitForm.invalid) {
      Object.keys(controls1).forEach(controlName =>
        controls1[controlName].markAsTouched()
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
		this.onSubmit('public');
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
            Swal.fire(
              this.translate.instant('MESSAGE.SUCCESS.TITLE'),
              this.translate.instant('MESSAGE.SUCCESS.CAMPAIGN_DELETED'),
              'success'
            ).then((result) => {
							console.log('deleted');
							this.router.navigate(['/m-campaigns']);
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
