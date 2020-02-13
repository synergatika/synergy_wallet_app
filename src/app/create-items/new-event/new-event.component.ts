import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Subject } from 'rxjs';
import { first, takeUntil, finalize, tap } from 'rxjs/operators';

// Swal Alert
import Swal from 'sweetalert2';

// Translate
import { TranslateService } from '@ngx-translate/core';

// Services
import { ItemsService } from '../../core/services/items.service';

@Component({
  selector: 'app-new-event',
  templateUrl: './new-event.component.html',
  styleUrls: ['./new-event.component.sass']
})
export class NewEventComponent implements OnInit, OnDestroy {

  public validator: any = {
    content: {
      minLength: 3,
      maxLenth: 2500
    }
  };

  submitForm: FormGroup;
  submitted = false;

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
  ) { }

  initForm() {
    this.submitForm = this.fb.group({
      Content: ['', Validators.compose([
        Validators.required,
        Validators.minLength(this.validator.content.minLength),
        Validators.maxLength(this.validator.content.maxLength)
      ])
      ],
      Access: ['public', Validators.compose([
        Validators.required
      ])
      ],
      Type: ['post', Validators.compose([
        Validators.required
      ])
      ],
    });
  }

  ngOnInit() {
    this.initForm();
  }

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
    this.submitted = true;

    const eventData = {
      content: controls.Content.value,
      type: controls.Type.value,
      access: controls.Access.value,
    };

    this.itemsService.createEvent(eventData.content, eventData.type, eventData.access)
      .pipe(
        tap(
          data => {
            Swal.fire(
              this.translate.instant('MESSAGE.SUCCESS.TITLE'),
              this.translate.instant('MESSAGE.SUCCESS.POST_CREATED'),
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

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
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
