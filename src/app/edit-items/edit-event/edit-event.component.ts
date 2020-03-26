import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Subject } from 'rxjs';
import { tap, takeUntil, finalize } from 'rxjs/operators';

//Modal
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

// Swal Alert
import Swal from 'sweetalert2';

// Translate
import { TranslateService } from '@ngx-translate/core';

// Services
import { AuthenticationService } from '../../core/services/authentication.service';
import { ItemsService } from '../../core/services/items.service';

import { Event } from '../../core/models/event.model';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.scss']
})

export class EditEventComponent implements OnInit {
  @ViewChild('remove_item', { static: false }) remove_item;
  @ViewChild('fileInput', { static: false }) imageInput: ElementRef;

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

  public validator: any = {
    title: {
      minLength: 3,
      maxLenth: 250
    },
    subtitle: {
      minLength: 3,
      maxLenth: 250
    },
    description: {
      minLength: 3,
      maxLenth: 2500
    },
    location: {
      minLength: 3,
      maxLenth: 250
    }
  };

  private event_id: string;
  public event: Event = {
    merchant_id: '',
    merchant_name: '',
    merchant_slug: '',
    merchant_imageURL: '',

    event_id: '',
    title: '',
    event_slug: '',
    event_imageURL: '',
    subtitle: '',
    description: '',
    access: '',
    dateTime: '',
    location: '',

    createdAt: ''
  };

  // eventDate: Date;
  // eventTime: string;

  fileData: File = null;
  previewUrl: any = null;
  originalImage: boolean = true;
  //event: any;
  // description: string;
  //access: string;
  //location: string;

  submitForm: FormGroup;
  submitted: boolean = false;

  loading: boolean = false;
  private unsubscribe: Subject<any>;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private authenticationService: AuthenticationService,
    private itemsService: ItemsService,
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.event_id = params['_id'];
    });
    this.unsubscribe = new Subject();
  }

	/**
	 * On Init
	 */
  ngOnInit() {
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
      title: [this.event.title, Validators.compose([
        Validators.required,
        Validators.minLength(this.validator.title.minLength),
        Validators.maxLength(this.validator.title.maxLength)
      ])
      ],
      subtitle: [this.event.subtitle],
      description: [this.event.description, Validators.compose([
        Validators.required,
        Validators.minLength(this.validator.description.minLength),
        Validators.maxLength(this.validator.description.maxLength)
      ])
      ],
      access: [this.event.access, Validators.compose([
        Validators.required
      ])
      ],
      location: [this.event.location, Validators.compose([
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
    });
  }

  fileProgress(fileInput: any) {
    console.log(fileInput);
    if (fileInput) {
      this.fileData = <File>fileInput.target.files[0];
      this.originalImage = false;
      this.preview();
    }
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
    console.log('Image canceled');
    this.previewUrl = this.event.event_imageURL;
    this.fileData = null;
    this.originalImage = true;
    this.imageInput.nativeElement.value = null;
  }

  fetchEventData() {
    this.itemsService.readEvent(this.authenticationService.currentUserValue.user["_id"], this.event_id)
      .pipe(
        tap(
          data => {
            this.event = Object.assign({}, this.event, data);
            console.log(this.event);

            const eventDate = new Date(this.event.dateTime);
            const eventTime = eventDate.getHours().toString() + ':' + eventDate.getMinutes().toString();
            this.previewUrl = this.event.event_imageURL;
            this.submitForm.patchValue({ ...data, eventTime: eventTime, eventDate: new Date(eventDate.setHours(0, 0, 0, 0)) })
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
    if (this.submitted) return;
    const controls = this.submitForm.controls;
    /** check form */
    if (this.submitForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    const timeArray = controls.eventTime.value.split(':');
    const timeInMiliseconds = ((timeArray[0]) * 60 * 60 + (+timeArray[1]) * 60) * 1000;
    const totalMiliseconds = controls.eventDate.value.getTime() + timeInMiliseconds;

    this.submitted = true;
    this.loading = true;

    const formData = new FormData();
    formData.append('imageURL', this.fileData);
    formData.append('title', controls.title.value);
    formData.append('subtitle', controls.subtitle.value);
    formData.append('description', controls.description.value);
    formData.append('access', controls.access.value);
    formData.append('location', controls.location.value);
    formData.append('dateTime', totalMiliseconds.toString());

    this.itemsService.editEvent(this.authenticationService.currentUserValue.user["_id"], this.event_id, formData)
      .pipe(
        tap(
          data => {
            Swal.fire(
              this.translate.instant('MESSAGE.SUCCESS.TITLE'),
              this.translate.instant('MESSAGE.SUCCESS.EVENT_UPDATED'),
              'success'
            );
            setTimeout(() => {
              Swal.close();
            }, 2000);
            this.submitted = false;
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
            Swal.fire(
              this.translate.instant('MESSAGE.SUCCESS.TITLE'),
              this.translate.instant('MESSAGE.SUCCESS.EVENT_DELETED'),
              'success'
            ).then((result) => {
              console.log('deleted');
              this.router.navigate(['/m-events']);
            });
            setTimeout(() => {
              Swal.close();
              this.router.navigate(['/m-events']);
            }, 2000);
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

            // this.title = this.event.title;
            // this.itemAbstract = this.event.subtitle;
            // this.description = this.event.description;
            // this.access = this.event.access;
            // this.location = this.event.location;
            //const dateTime = this.event.dateTime;
            //this.eventDate = '';
/*console.log(eventDate);
console.log(eventDate.getTime());
console.log(eventDate.getHours());
console.log(eventDate.getMinutes());*/