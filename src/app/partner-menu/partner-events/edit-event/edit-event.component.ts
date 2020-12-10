import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { tap, takeUntil, finalize } from 'rxjs/operators';
import { NgbModal, NgbActiveModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

/**
 * Components
 */
import { ContentImagesComponent } from '../../../core/components/content-images/content-images.component';


/**
 * Services
 */
import { StaticDataService } from '../../../core/helpers/static-data.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { ItemsService } from '../../../core/services/items.service';

/**
 * Models & Interfaces
 */
import { GeneralList } from 'sng-core';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.scss']
})

export class EditEventComponent implements OnInit {
  @ViewChild('remove_item') remove_item: NgbModalRef;
  //  @ViewChild('fileInput') imageInput: ElementRef;
  /**
   * Imported Component
   */
  @ViewChild(ContentImagesComponent, { static: true })
  public editorTextarea: ContentImagesComponent;

  /**
   * Configuration and Static Data
   */
  public configDialog;
  public accessList: GeneralList[];

  timePickerTheme: any = {
    container: {
      bodyBackgroundColor: '#0c1a33',
      buttonColor: '#fff'
    },
    dial: {
      dialBackgroundColor: '#415daa',
    },
    clockFace: {
      clockFaceBackgroundColor: '#415daa',
      clockHandColor: '#e4509e',
      clockFaceTimeInactiveColor: '#fff'
    }
  };

  /**
   * Parameters
   */
  private event_id: string;

  /**
   * Content Variables
   */
  public title: string = '';
  public minDate: Date;

  /**
   * FIle Variables
   */
  // fileData: File = null;
  // previewUrl: any = null;
  // originalImage: boolean = true;
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
      this.event_id = params['_id'];
    });
    //  this.configDialog = this.staticDataService.getConfirmDialog;
    this.accessList = this.staticDataService.getAccessList;
    this.validator = this.staticDataService.getValidators.event;
    this.unsubscribe = new Subject();
  }

  /**
   * On Init
   */
  ngOnInit() {
    this.minDate = new Date();
    this.fetchEventData();
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
      content: ['', Validators.compose([
        Validators.required,
        //    Validators.minLength(this.validator.content.minLength),
        //    Validators.maxLength(this.validator.content.maxLength)
      ])
      ],
      access: ['', Validators.compose([
        Validators.required
      ])
      ],
      location: ['', Validators.compose([
        Validators.required,
        Validators.minLength(this.validator.location.minLength),
        Validators.maxLength(this.validator.location.maxLength)
      ])
      ],
      eventDate: [new Date(), Validators.compose([
        Validators.required
      ])
      ],
      eventTime: ['', Validators.compose([
        Validators.required
      ])
      ],
      image_url: ['', Validators.compose([
        Validators.required
      ])
      ],
      contentFiles: [null]
    });
  }

  /**
   * Fetch Event Data
   */
  fetchEventData() {
    this.itemsService.readEvent(this.authenticationService.currentUserValue.user["_id"], this.event_id)
      .pipe(
        tap(
          data => {
            this.title = data.title;
            this.initialImage = data.event_imageURL;
            //this.previewUrl = this.initialImage;

            const eventDate = ((this.minDate).getDate() > data.dateTime) ? this.minDate : (new Date(data.dateTime));
            const eventTime = eventDate.getHours().toString() + ':' + eventDate.getMinutes().toString();
            this.submitForm.patchValue({
              ...data,
              eventTime: eventTime,
              eventDate: new Date(eventDate.setHours(0, 0, 0, 0))
            })
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

  async onSubmit() {
    if (this.loading) return;

    const controls = this.submitForm.controls;
    /** check form */
    if (this.submitForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    await this.editorTextarea.uploadContentFiles();
  }

  onFinalStep(editorFiles: string[]) {
    this.loading = true;
    const controls = this.submitForm.controls;

    const timeArray = controls.eventTime.value.split(':');
    const timeInMiliseconds = ((timeArray[0]) * 60 * 60 + (+timeArray[1]) * 60) * 1000;
    const totalMiliseconds = controls.eventDate.value.getTime() + timeInMiliseconds;

    const formData = new FormData();
    formData.append('imageURL', controls.image_url.value);
    //    formData.append('imageURL', this.fileData);
    formData.append('title', controls.title.value);
    formData.append('subtitle', controls.subtitle.value);
    formData.append('content', controls.content.value);
    formData.append('contentFiles', editorFiles.join())
    formData.append('access', controls.access.value);
    formData.append('location', controls.location.value);
    formData.append('dateTime', totalMiliseconds.toString());

    this.itemsService.editEvent(this.authenticationService.currentUserValue.user["_id"], this.event_id, formData)
      .pipe(
        tap(
          data => {
            Swal.fire({
              title: this.translate.instant('MESSAGE.SUCCESS.TITLE'),
              text: this.translate.instant('MESSAGE.SUCCESS.EVENT_UPDATED'),
              icon: 'success',
              timer: 2500,
            }).then((result) => {
              this.router.navigate(['/m-events']);
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

  // private swalWithBootstrapButtons = Swal.mixin({
  //   customClass: {
  //     confirmButton: 'btn btn-success',
  //     cancelButton: 'btn btn-danger'
  //   },
  //   buttonsStyling: true
  // })

  // deleteItemModal() {
  //   this.swalWithBootstrapButtons.fire({
  //     title: this.translate.instant('EVENT.DELETE'),     // title: 'Are you sure?',
  //     text: this.translate.instant('EVENT.DELETE_CONFIRM') + '<<' + this.title + '>>',  // text: "You won't be able to revert this!",
  //     icon: 'warning',
  //     timer: 0,
  //     showCancelButton: true,
  //     confirmButtonText: 'Yes, delete it!',
  //     cancelButtonText: 'No, cancel!',
  //     reverseButtons: true
  //   }).then((result) => {
  //     if (result.value) {
  //       this.swalWithBootstrapButtons.fire({
  //         title: this.translate.instant('MESSAGE.SUCCESS.TITLE'),
  //         text: this.translate.instant('MESSAGE.SUCCESS.EVENT_DELETED'),
  //         icon: 'success',
  //         timer: 2500
  //       }).then((result) => {
  //         this.router.navigate(['/m-events']);
  //       });
  //     } else if (result.dismiss === Swal.DismissReason.cancel) {
  //       this.swalWithBootstrapButtons.fire({
  //         title: 'Cancelled',
  //         text: 'Your imaginary file is safe :)',
  //         icon: 'error',
  //         timer: 2500
  //       });
  //     }
  //   })
  // }

  deleteItemModal() {
    this.modalService.open(this.remove_item).result.then((result) => {
      console.log('closed');
    }, (reason) => {
      console.log('dismissed');
    });
  }

  deleteItem() {
    console.log('delete');
    this.itemsService.deleteEvent(this.authenticationService.currentUserValue.user["_id"], this.event_id)
      .pipe(
        tap(
          data => {
            Swal.fire({
              title: this.translate.instant('MESSAGE.SUCCESS.TITLE'),
              text: this.translate.instant('MESSAGE.SUCCESS.EVENT_DELETED'),
              icon: 'success',
              timer: 2500
            }).then((result) => {
              this.router.navigate(['/m-events']);
            });
          },
          error => {
            Swal.fire({
              title: this.translate.instant('MESSAGE.ERROR.TITLE'),
              text: this.translate.instant(error),
              icon: 'error'
            });
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
