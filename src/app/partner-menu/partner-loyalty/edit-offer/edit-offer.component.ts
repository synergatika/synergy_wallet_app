import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, finalize, tap } from 'rxjs/operators';
import { NgbModal, NgbActiveModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

/**
 * Services
 */
import { StaticDataService } from '../../../core/helpers/static-data.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { ItemsService } from '../../../core/services/items.service';

import { Offer } from 'sng-core';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.component.html',
  styleUrls: ['./edit-offer.component.scss']
})
export class EditOfferComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') imageInput: ElementRef;
  @ViewChild('remove_item') remove_item: NgbModalRef;

  /**
   * Parameters
   */
  private offer_id: string;

  /**
   * Content Variables
   */
  public offer: Offer;
  public title: string = '';
  public minDate: Date;

  /**
   * File Variables
   */
  fileData: File = null;
  previewUrl: any = null;
  originalImage: boolean = true;
  public initialImage: string = '';

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
      this.offer_id = params['_id'];
    });
    this.validator = this.staticDataService.getValidators.offer;
    this.unsubscribe = new Subject();
  }

  /**
   * On Init
   */
  ngOnInit() {
    this.minDate = new Date();
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

  /**
   * Image Upload
   */
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

  /**
   * Fetch Offer Data
   */
  fetchOfferData() {
    this.itemsService.readOffer(this.authenticationService.currentUserValue.user["_id"], this.offer_id)
      .pipe(
        tap(
          data => {
            this.offer = data;
            this.title = data.title;
            this.initialImage = data.offer_imageURL;
            this.previewUrl = this.initialImage;
            this.submitForm.patchValue(
              {
                ...data,
                expiration: ((this.minDate).getDate() > data.expiresAt) ? this.minDate : (new Date(data.expiresAt))
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

  /**
   * On Submit Form
   */
  onSubmit() {
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
