import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, finalize, tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

/**
 * Components
 */
import { ContentImagesComponent } from '../../../core/components/content-images/content-images.component';


/**
 * Services
 */
import { StaticDataService } from 'src/app/core/helpers/static-data.service';
import { ItemsService } from '../../../core/services/items.service';

/**
 * Models & Interfaces
 */
import { GeneralList } from 'sng-core';

@Component({
  selector: 'app-new-event',
  templateUrl: './new-event.component.html',
  styleUrls: ['./new-event.component.scss']
})
export class NewEventComponent implements OnInit, OnDestroy {
  /**
   * Imported Component
   */
  @ViewChild(ContentImagesComponent, { static: true })
  public editorTextarea: ContentImagesComponent;

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
   * Configuration and Static Data
   */
  public accessList: GeneralList[];

  /**
   * Content Variables
   */
  public minDate: Date;

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
    * @param fb: FormBuilder
    * @param translate: TranslateService
    * @param staticDataService: StaticDataService
    * @param itemsService: ItemsService
    */
  constructor(
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private fb: FormBuilder,
    private translate: TranslateService,
    private staticDataService: StaticDataService,
    private itemsService: ItemsService
  ) {
    this.accessList = this.staticDataService.getAccessList;
    this.validator = this.staticDataService.getValidators.event;
    this.unsubscribe = new Subject();
  }
  /**
   * On Init
   */
  ngOnInit() {
    this.minDate = new Date();
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
      content: ['', Validators.compose([
        Validators.required,
        //     Validators.minLength(this.validator.content.minLength),
        //     Validators.maxLength(this.validator.content.maxLength)
      ])
      ],
      subtitle: [''],
      access: ['public', Validators.compose([
        Validators.required
      ])
      ],
      location: ['', Validators.compose([
        Validators.required,
        Validators.minLength(this.validator.location.minLength),
        Validators.maxLength(this.validator.location.maxLength)
      ])
      ],
      eventDate: ['', Validators.compose([
        Validators.required
      ])
      ],
      eventTime: ['', Validators.compose([
        Validators.required
      ])
      ],
      image_url: [null, Validators.compose([
        Validators.required
      ])
      ],
      contentFiles: [null]
    });
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
    var timeInMiliseconds = ((timeArray[0]) * 60 * 60 + (+timeArray[1]) * 60) * 1000;
    var totalMiliseconds = controls.eventDate.value.getTime() + timeInMiliseconds;

    const formData = new FormData();
    formData.append('title', controls.title.value);
    formData.append('imageURL', controls.image_url.value);
    formData.append('subtitle', controls.subtitle.value);
    formData.append('content', controls.content.value);
    formData.append('contentFiles', editorFiles.join())
    formData.append('access', controls.access.value);
    formData.append('location', controls.location.value);
    formData.append('dateTime', totalMiliseconds);

    this.itemsService.createEvent(formData)
      .pipe(
        tap(
          data => {
            Swal.fire({
              title: this.translate.instant('MESSAGE.SUCCESS.TITLE'),
              text: this.translate.instant('MESSAGE.SUCCESS.EVENT_CREATED'),
              icon: 'success',
              timer: 2500
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
