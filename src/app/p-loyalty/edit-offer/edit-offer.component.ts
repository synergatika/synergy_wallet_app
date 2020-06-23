import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, finalize, tap } from 'rxjs/operators';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
// import { DatePipe } from '@angular/common';
// Swal Alert
import Swal from 'sweetalert2';
// Translate
import { TranslateService } from '@ngx-translate/core';
// Services
import { AuthenticationService } from '../../core/services/authentication.service';
import { ItemsService } from '../../core/services/items.service';
import { StaticDataService } from '../../core/services/static-data.service';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.component.html',
  styleUrls: ['./edit-offer.component.scss']
})
export class EditOfferComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput', { static: false }) imageInput: ElementRef;
  @ViewChild('remove_item', { static: false }) remove_item;

  private offer_id: string;
  public initialImage: string = '';
  public title: string = '';

  validator: any;

  date: any;

  fileData: File = null;
  previewUrl: any = null;
  originalImage: boolean = true;


  submitForm: FormGroup;
  submitted: boolean = false;

  loading: boolean = false;
  private unsubscribe: Subject<any>;

  /**
    * Component Constructor
    *
    * @param router: Router
    * @param fb: FormBuilder
    * @param cdRef: ChangeDetectorRef
    * @param modalService: NgbModal
    * @param activatedRoute: ActivatedRoute
    * @param datePipe: DatePipe
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
    // private datePipe: DatePipe,
    private translate: TranslateService,
    private authenticationService: AuthenticationService,
    private itemsService: ItemsService,
    private staticDataService: StaticDataService
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.offer_id = params['_id'];
    });
    this.validator = this.staticDataService.getOfferValidator;
    this.unsubscribe = new Subject();
  }

	/**
	 * On Init
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
      subtitle: [''],
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
    });
  }

  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    this.preview();
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

  fetchOfferData() {
    this.itemsService.readOffer(this.authenticationService.currentUserValue.user["_id"], this.offer_id)
      .pipe(
        tap(
          data => {
            this.title = data.title;
            this.initialImage = data.offer_imageURL;
            this.previewUrl = this.initialImage;
            this.submitForm.patchValue({ ...data, expiration: new Date(data.expiresAt) });
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
	 * On Form Submit
	 */
  onSubmit() {
    if (this.submitted || this.loading) return;

    const controls = this.submitForm.controls;
    /** check form */
    if (this.submitForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    this.submitted = true;
    this.loading = true;

    const formData = new FormData();
    formData.append('imageURL', this.fileData);
    formData.append('title', controls.title.value);
    formData.append('subtitle', controls.subtitle.value);
    formData.append('cost', controls.cost.value);
    formData.append('description', controls.description.value);
    formData.append('expiresAt', controls.expiration.value.getTime().toString());
    console.log(controls.expiration.value.getTime());

    this.itemsService.editOffer(this.authenticationService.currentUserValue.user["_id"], this.offer_id, formData)
      .pipe(
        tap(
          data => {
            Swal.fire({
              title: this.translate.instant('MESSAGE.SUCCESS.TITLE'),
              text: this.translate.instant('MESSAGE.SUCCESS.OFFER_UPDATED'),
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
          this.submitted = false;
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
            Swal.fire({
              title: this.translate.instant('MESSAGE.SUCCESS.TITLE'),
              text: this.translate.instant('MESSAGE.SUCCESS.OFFER_DELETED'),
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
