import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Subject } from 'rxjs';
import { first, takeUntil, finalize, tap } from 'rxjs/operators';

//Modal
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

// Swal Alert
import Swal from 'sweetalert2';

// Translate
import { TranslateService } from '@ngx-translate/core';

// Services
import { ItemsService } from '../../core/services/items.service';
import { AuthenticationService } from '../../core/services/authentication.service';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.scss']
})

export class EditEventComponent implements OnInit {
	@ViewChild('remove_item', {static: false}) remove_item;
	@ViewChild('fileInput', {static: false}) imageInput : ElementRef;
  public validator: any = {
    title: {
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
  event_id: string;
  fileData: File = null;
  previewUrl: any = null;
  originalImage: boolean = true;
  event: any;
  title: string;
	itemAbstract: string;
  description: string;
  access: string;
  location: string;
  eventDate: Date;
	eventTime: string;
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
		private activatedRoute: ActivatedRoute,
		private authenticationService: AuthenticationService,
		private router: Router,
  ) {
		this.activatedRoute.params.subscribe(params => {
      this.event_id = params['_id'];
    });
    this.unsubscribe = new Subject();
  }

	/**
	 * On init
	 */
  ngOnInit() {
    this.fetchEventData();
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
			itemAbstract: [this.itemAbstract],
      description: [this.description, Validators.compose([
        Validators.required,
        Validators.minLength(this.validator.description.minLength),
        Validators.maxLength(this.validator.description.maxLength)
      ])
      ],
      access: [this.access, Validators.compose([
        Validators.required
      ])
      ],
      location: [this.location, Validators.compose([
        Validators.required,
        Validators.minLength(this.validator.location.minLength),
        Validators.maxLength(this.validator.location.maxLength)
      ])
      ],
      eventDate: [this.eventDate, Validators.compose([
        Validators.required
      ])
      ],
			eventTime: [this.eventTime, Validators.compose([
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
		console.log('Image canceled');
    this.previewUrl = this.event.event_imageURL;
    this.fileData = null;
    this.originalImage = true;
		this.imageInput.nativeElement.value = null;
  }

  fetchEventData() {
    this.itemsService.readEvent(this.authenticationService.currentUserValue.user["_id"],this.event_id)
      .pipe(
        tap(
          data => {
            this.event = data;
            console.log(this.event);
						this.title = this.event.title;
						this.itemAbstract = this.event.subtitle;
						this.description = this.event.description;
						this.access = this.event.access;
						this.location = this.event.location;
						
						const dateTime = this.event.dateTime;
						//this.eventDate = '';
						const eventDate = new Date(dateTime);
						/*console.log(eventDate);
						console.log(eventDate.getTime());
						console.log(eventDate.getHours());
						console.log(eventDate.getMinutes());*/
						this.eventTime = eventDate.getHours().toString() + ':' + eventDate.getMinutes().toString();
						this.eventDate = new Date(eventDate.setHours(0,0,0,0));
						//console.log(this.eventDate.getTime());
						this.previewUrl = this.event.event_imageURL;						
						this.initForm();
						this.cdRef.markForCheck();
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
		/*console.log(controls.eventDate.value);
		console.log(controls.eventDate.value.getTime());
		console.log(controls.eventDate.value);
		console.log(controls.eventTime.value);	*/
		const timeArray = controls.eventTime.value.split(':');
		var timeInMiliseconds = ((timeArray[0])* 60 * 60 + (+timeArray[1]) * 60 ) * 1000;
		//console.log(timeInMiliseconds);
		//console.log(controls.eventDate.value.getTime());
		var totalMiliseconds = controls.eventDate.value.getTime() + timeInMiliseconds;
		//console.log(new Date(totalMiliseconds));		
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
		formData.append('subtitle', controls.itemAbstract.value);
    formData.append('description', controls.description.value);
    formData.append('access', controls.access.value);
    formData.append('location', controls.location.value);
    formData.append('dateTime', totalMiliseconds.toString());
		/*for (var pair of formData.entries()) {
			console.log(pair[0]+ ', ' + pair[1]);
		}*/
		//return;
    this.itemsService.editEvent(this.authenticationService.currentUserValue.user["_id"], this.event_id, formData)
      .pipe(
        tap(
          data => {
            Swal.fire(
              this.translate.instant('MESSAGE.SUCCESS.TITLE'),
              this.translate.instant('MESSAGE.SUCCESS.EVENT_UPDATED'),
              'success'
            );
						setTimeout(()=> {
							Swal.close();
						},2000);
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
              this.translate.instant('MESSAGE.SUCCESS.OFFER_DELETED'),
              'success'
            ).then((result) => {
							console.log('deleted');
							this.router.navigate(['/m-events']);
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
